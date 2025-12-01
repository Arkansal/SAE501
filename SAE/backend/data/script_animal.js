import fs from 'fs/promises';

async function removeDuplicates() {
    try {
        // 1. Charger le fichier
        const content = await fs.readFile('./animal_countries.json', 'utf8');
        const data = JSON.parse(content);
        
        console.log(`📊 Total avant: ${data.length} entrées`);
        
        // 2. Supprimer les doublons
        const seen = new Set();
        const unique = [];
        let duplicatesCount = 0;
        
        for (const item of data) {
            // Créer une clé unique combinant assessment_id et code_iso
            const key = `${item.assessment_id}-${item.code_iso}`;
            
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            } else {
                duplicatesCount++;
                console.log(`⚠️ Doublon supprimé: assessment_id=${item.assessment_id}, code_iso=${item.code_iso}`);
            }
        }
        
        console.log(`\n📊 Résultats:`);
        console.log(`   Avant: ${data.length}`);
        console.log(`   Après: ${unique.length}`);
        console.log(`   Doublons supprimés: ${duplicatesCount}`);
        
        // 3. Sauvegarder (créer une copie d'abord)
        await fs.writeFile(
            './animal_countries_backup.json',
            JSON.stringify(data, null, 2),
            'utf8'
        );
        console.log('\n💾 Sauvegarde créée: animal_countries_backup.json');
        
        // 4. Écraser l'original avec les données nettoyées
        await fs.writeFile(
            './animal_countries.json',
            JSON.stringify(unique, null, 2),
            'utf8'
        );
        console.log('✅ Fichier nettoyé: animal_countries.json');
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

removeDuplicates();