const fs = require('fs');
const path = require('path');

const animals = JSON.parse(fs.readFileSync('data/animaux/profil_animals.json', 'utf8'));
const habitats = JSON.parse(fs.readFileSync('data/relations/profil_animal_habitats_corrected.json', 'utf8'));

const animalIds = new Set(animals.map(a => a.assessment_id));
console.log(`Loaded ${animalIds.size} animal IDs from profil_animals.json`);

const matchingHabitats = habitats.filter(h => animalIds.has(h.assessment_id));
console.log(`Found ${matchingHabitats.length} matching habitats in profil_animal_habitats_corrected.json`);


