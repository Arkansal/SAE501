const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

async function testAPI() {
  console.log('🔍 Test de l\'API Google Custom Search...\n');

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: 'Panthera leo',
        searchType: 'image',
        num: 1
      }
    });

    console.log('✅ API fonctionne !');
    console.log('📷 Image trouvée:', response.data.items[0].link);
    console.log('\n🎉 Tu es prêt à utiliser le script complet !');

  } catch (error) {
    console.error('❌ Erreur:', error.response ? error.response.data : error.message);
    
    if (error.response && error.response.status === 403) {
      console.log('\n💡 Vérifie que tu as bien activé Custom Search API dans Google Cloud Console');
    }
  }
}

testAPI();