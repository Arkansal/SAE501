const fs = require('fs');
const path = require('path');

// File paths
const animalsPath = path.join(__dirname, '../animaux/animals_updated.json');
const environmentPath = path.join(__dirname, '../referentiels/environment.json');
const animalCountriesPath = path.join(__dirname, '../relations/animal_countries.json');
const countriesPath = path.join(__dirname, '../referentiels/countries.json');
const animalHabitatsPath = path.join(__dirname, '../relations/profil_animal_habitats.json');
const animalEnvironmentRefPath = path.join(__dirname, '../relations/animal_environment.json');

const animalsOutput = path.join(__dirname, '../animaux/animals_updated_corrected.json');
const animalCountriesOutput = path.join(__dirname, '../relations/animal_countries_corrected.json');
const animalHabitatsOutput = path.join(__dirname, '../relations/profil_animal_habitats_corrected.json');
const animalEnvironmentRefOutput = path.join(__dirname, '../relations/animal_environment_corrected.json');

// Load data
const animals = JSON.parse(fs.readFileSync(animalsPath, 'utf8'));
const environments = JSON.parse(fs.readFileSync(environmentPath, 'utf8'));
const animalCountries = JSON.parse(fs.readFileSync(animalCountriesPath, 'utf8'));
const countries = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));
const animalHabitats = JSON.parse(fs.readFileSync(animalHabitatsPath, 'utf8'));
const animalEnvironmentRef = JSON.parse(fs.readFileSync(animalEnvironmentRefPath, 'utf8'));

// --- Process Environments (animals_updated.json) ---
console.log('--- Processing Environments (animals_updated.json) ---');

const validEnvNames = new Set(environments.map(e => e.description.en));
const validEnvCodes = new Set(environments.map(e => e.code));

const normalizedEnvMap = new Map();
environments.forEach(e => {
    if (e.description && e.description.en) {
        normalizedEnvMap.set(e.description.en.trim().toLowerCase(), e.description.en);
    }
});

let envUpdatedCount = 0;
let envNotFoundCount = 0;

// Custom mapping for environment names
const envFixMap = {
    'Mountain': 'Rocky areas (eg. inland cliffs, mountain peaks)',
    'Rocky areas': 'Rocky areas (eg. inland cliffs, mountain peaks)',
    'Rivers and Streams': 'Wetlands (inland) - Permanent Rivers/Streams/Creeks (includes waterfalls)',
    'Marine Coastal': 'Marine Coastal/Supratidal',
    'Tundra': 'Grassland - Tundra',
    'Urban areas': 'Artificial/Terrestrial - Urban Areas',
    'Forest - Tropical': 'Forest - Subtropical/Tropical Moist Lowland',
    'Forest - Subtropical': 'Forest - Subtropical/Tropical Moist Lowland',
    'Grassland - Alpine': 'Grassland - Subtropical/Tropical High Altitude'
};

animals.forEach(animal => {
    if (!animal.environment_name) return;

    const originalEnv = animal.environment_name;
    
    // Check exact match
    if (validEnvNames.has(originalEnv)) return;

    // Check fix map
    if (envFixMap[originalEnv]) {
        animal.environment_name = envFixMap[originalEnv];
        envUpdatedCount++;
        return;
    }

    // Check normalized match
    const normalized = originalEnv.trim().toLowerCase();
    if (normalizedEnvMap.has(normalized)) {
        const correctName = normalizedEnvMap.get(normalized);
        animal.environment_name = correctName;
        envUpdatedCount++;
    } else {
        console.warn(`Environment not found: "${originalEnv}" for animal ID ${animal.assessment_id}`);
        envNotFoundCount++;
    }
});

console.log(`Environments updated: ${envUpdatedCount}`);
console.log(`Environments not found: ${envNotFoundCount}`);
fs.writeFileSync(animalsOutput, JSON.stringify(animals, null, 2));
console.log(`Saved corrected animals to ${animalsOutput}`);


// --- Process Habitats (profil_animal_habitats.json) ---
console.log('\n--- Processing Habitats (profil_animal_habitats.json) ---');

let habitatUpdatedCount = 0;
let habitatNotFoundCount = 0;

animalHabitats.forEach(habitat => {
    if (!habitat.environment_name) return;

    const originalEnv = habitat.environment_name;
    
    // Check exact match
    if (validEnvNames.has(originalEnv)) return;

    // Check fix map
    if (envFixMap[originalEnv]) {
        habitat.environment_name = envFixMap[originalEnv];
        habitatUpdatedCount++;
        return;
    }

    // Check normalized match
    const normalized = originalEnv.trim().toLowerCase();
    if (normalizedEnvMap.has(normalized)) {
        const correctName = normalizedEnvMap.get(normalized);
        habitat.environment_name = correctName;
        habitatUpdatedCount++;
    } else {
        console.warn(`Habitat environment not found: "${originalEnv}" for assessment_id ${habitat.assessment_id}`);
        habitatNotFoundCount++;
    }
});

console.log(`Habitats updated: ${habitatUpdatedCount}`);
console.log(`Habitats not found: ${habitatNotFoundCount}`);
fs.writeFileSync(animalHabitatsOutput, JSON.stringify(animalHabitats, null, 2));
console.log(`Saved corrected habitats to ${animalHabitatsOutput}`);

// --- Process Animal Environment Refs (animal_environment.json) ---
console.log('\n--- Processing Animal Environment Refs (animal_environment.json) ---');
// This file uses IDs (codes), so we check against validEnvCodes

let envRefUnknownCount = 0;

const newAnimalEnvironmentRef = animalEnvironmentRef.filter(entry => {
    if (validEnvCodes.has(entry.environment_id)) {
        return true;
    }
    console.warn(`Unknown environment_id: "${entry.environment_id}" for animal_id ${entry.animal_id}`);
    envRefUnknownCount++;
    return false; // Remove invalid entries? Or keep? Let's filter them out for the "corrected" file to ensure integrity.
});

console.log(`Animal Environment Refs checked.`);
console.log(`Unknown environment IDs found (and removed from corrected file): ${envRefUnknownCount}`);
fs.writeFileSync(animalEnvironmentRefOutput, JSON.stringify(newAnimalEnvironmentRef, null, 2));
console.log(`Saved corrected animal environment refs to ${animalEnvironmentRefOutput}`);


// --- Process Countries ---
console.log('\n--- Processing Countries ---');
// ... (rest of the country processing logic)


const validCountryCodes = new Set(countries.map(c => c.code));

// Custom mapping for regional/non-standard codes
const countryFixMap = {
    'SAR-OO': 'IT', // Sardinia -> Italy
    'CNY-OO': 'ES', // Canary Islands -> Spain
    'ITA-IT': 'IT',
    'YUG-KO': 'RS', // Kosovo -> Serbia (best fit if XK not in list)
    'NZS-OO': 'NZ', // NZ Subantarctic -> NZ
    'MAQ-OO': 'AU', // Macquarie Island -> Australia
    'MDR-OO': 'PT', // Madeira -> Portugal
    'FRA-FR': 'FR',
    'POR-OO': 'PT',
    'SPA-SP': 'ES',
    'KRI-OO': 'KI', // Kiribati
    'SIC-SI': 'IT', // Sicily
    'BOR-SR': 'MY', // Borneo (Sarawak) -> Malaysia
    'BOR-KA': 'ID', // Borneo (Kalimantan) -> Indonesia
    'MLY-PM': 'MY', // Peninsular Malaysia
    'SUM-OO': 'ID', // Sumatra -> Indonesia
    'BOR-SB': 'MY', // Borneo (Sabah) -> Malaysia
    'RU-EU': 'RU', // Russia (European)
    'MXT-CI': 'MX', // Mexico (assuming)
    'AZO-OO': 'PT', // Azores -> Portugal
    'COR-OO': 'FR', // Corsica -> France
};

let countryUpdatedCount = 0;
let countryUnknownCount = 0;

const newAnimalCountries = animalCountries.map(entry => {
    const code = entry.code_iso;
    
    if (validCountryCodes.has(code)) {
        return entry;
    }

    if (countryFixMap[code]) {
        // console.log(`Fixed country code: "${code}" -> "${countryFixMap[code]}"`);
        countryUpdatedCount++;
        return { ...entry, code_iso: countryFixMap[code] };
    }

    console.warn(`Unknown country code: "${code}" for assessment_id ${entry.assessment_id}`);
    countryUnknownCount++;
    return entry; // Keep as is if we don't know how to fix it, or should we remove? Prompt says "corrige les codes", implies we should fix. 
                  // If we can't fix, we keep it but warn.
});

console.log(`Countries updated: ${countryUpdatedCount}`);
console.log(`Unknown country codes: ${countryUnknownCount}`);

fs.writeFileSync(animalCountriesOutput, JSON.stringify(newAnimalCountries, null, 2));
console.log(`Saved corrected animal countries to ${animalCountriesOutput}`);
