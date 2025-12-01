// fetchAnimalImages.js
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'ta-clé';
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || 'ton-cx';

// ========================================
// FONCTION : Télécharger l'image
// ========================================
async function downloadImage(url, filename) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const imagesDir = path.join(__dirname, 'images');
    await fs.mkdir(imagesDir, { recursive: true });

    const filepath = path.join(imagesDir, filename);
    await fs.writeFile(filepath, response.data);

    console.log(`  💾 ✅ Image sauvegardée`);
    return filepath;

  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(`  ⚠️ 403 - Site bloque le téléchargement (URL gardée)`);
    } else {
      console.log(`  ❌ Erreur:`, error.message);
    }
    return null;
  }
}

// ========================================
// FONCTION : Rechercher image Google
// ========================================
async function getGoogleImage(scientificName) {
  console.log(`🔍 Recherche: ${scientificName}`);
  
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: scientificName,
        searchType: 'image',
        num: 1,
        imgSize: 'large',
        safe: 'active'
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      console.log(`  ✅ URL trouvée`);
      
      return {
        scientific_name: scientificName,
        image_url: item.link,
        thumbnail_url: item.image.thumbnailLink,
        width: item.image.width,
        height: item.image.height
      };
    } else {
      console.log(`  ⚠️ Aucune image trouvée`);
      return null;
    }
    
  } catch (error) {
    console.error(`  ❌ Erreur API:`, error.message);
    return null;
  }
}

// ========================================
// MAIN
// ========================================
async function main() {
  try {
    const animalsData = await fs.readFile('./db/animals.json', 'utf8');
    const animals = JSON.parse(animalsData);

    console.log(`📊 ${animals.length} animaux à traiter\n`);

    const results = [];
    let downloadedCount = 0;
    let blockedCount = 0;

    for (let i = 0; i < animals.length; i++) {
      const animal = animals[i];
      
      console.log(`\n[${i + 1}/${animals.length}] ${animal.scientific_name}`);

      // 1. Rechercher l'image
      const imageData = await getGoogleImage(animal.scientific_name);

      if (imageData) {
        // 2. Essayer de télécharger
        const filename = `${animal.scientific_name.replace(/ /g, '_').toLowerCase()}.jpg`;
        const localPath = await downloadImage(imageData.image_url, filename);

        if (localPath) {
          downloadedCount++;
        } else {
          blockedCount++;
        }

        // 3. Sauvegarder avec URL ET chemin local (si disponible)
        results.push({
          ...animal,
          image_url: imageData.image_url,
          thumbnail_url: imageData.thumbnail_url,
          local_image: localPath ? `images/${filename}` : null
        });
      } else {
        results.push({
          ...animal,
          image_url: null,
          thumbnail_url: null,
          local_image: null
        });
      }

      // Pause entre requêtes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 4. Sauvegarder les résultats
    await fs.writeFile(
      './db/animals_with_images.json',
      JSON.stringify(results, null, 2)
    );

    // 5. Statistiques
    console.log(`\n📊 RÉSULTATS:`);
    console.log(`   Total animaux: ${animals.length}`);
    console.log(`   URLs trouvées: ${results.filter(r => r.image_url).length}`);
    console.log(`   ✅ Téléchargées: ${downloadedCount}`);
    console.log(`   ⚠️ Bloquées (403): ${blockedCount}`);
    console.log(`   ❌ Aucune image: ${results.filter(r => !r.image_url).length}`);
    
    console.log(`\n✅ Terminé! Données sauvegardées dans animals_with_images.json`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

main();