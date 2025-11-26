const fs = require('fs').promises;

function sqlEscape(value) {
    if (value === null || value === undefined) {
        return 'NULL';
    }

    if (typeof value === 'number') {
        return value;
    }

    // Échapper les apostrophes et caractères spéciaux
    const escaped = String(value)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "''")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');

    return `'${escaped}'`;
}

function generateInsert(tableName, data) {
    if (data.length === 0) return '';

    const columns = Object.keys(data[0]);
    const columnsList = columns.join(', ');

    let sql = `-- Table ${tableName}\n`;
    sql += `INSERT INTO ${tableName} (${columnsList}) VALUES\n`;

    const values = data.map((row, index) => {
        const rowValues = columns.map(col => sqlEscape(row[col])).join(', ');
        const comma = index < data.length - 1 ? ',' : ';';
        return `  (${rowValues})${comma}`;
    }).join('\n');

    sql += values + '\n\n';

    return sql;
}

async function generateSQL() {
    console.log('🔧 Génération du fichier SQL...\n');

    let sqlContent = '';

    // Header du fichier SQL
    sqlContent += `-- ========================================\n`;
    sqlContent += `-- Base de données Animaux\n`;
    sqlContent += `-- Générée automatiquement le ${new Date().toLocaleString('fr-FR')}\n`;
    sqlContent += `-- ========================================\n\n`;

    sqlContent += `SET NAMES utf8mb4;\n`;
    sqlContent += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    try {
        // ========================================
        // 1. TABLE ANIMAL
        // ========================================
        console.log('📊 Traitement des animaux...');
        sqlContent += `-- ========================================\n`;
        sqlContent += `-- Structure de la table Animal\n`;
        sqlContent += `-- ========================================\n`;
        sqlContent += `DROP TABLE IF EXISTS Animal;\n`;
        sqlContent += `CREATE TABLE Animal (\n`;
        sqlContent += `  animal_id INT PRIMARY KEY NOT NULL,\n`;
        sqlContent += '  common_name VARCHAR(100), \n';
        sqlContent += '  scientific_name VARCHAR(200) NOT NULL,\n';
        sqlContent += '  count INT,\n';
        sqlContent += '  family VARCHAR(100),\n';
        sqlContent += '  type VARCHAR(100),\n';
        sqlContent += '  image TEXT NOT NULL, \n';
        sqlContent += '  description TEXT, \n';
        sqlContent += '  extinct_level VARCHAR(50) NOT NULL \n';
        sqlContent += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        const animalsData = await fs.readFile('./animals.json', 'utf8');
        const animals = JSON.parse(animalsData);

        const animalsForSQL = animals.map((animal) => ({
            animal_id: animal.assessment_id,
            common_name: animal.common_name || null,
            scientific_name: animal.scientific_name,
            family: animal.family || null,
            type: animal.type || null,
            class: animal.class || null,
            extinct_level: animal.extinct_level || null,
            image: animal.image_url || null
        }));

        sqlContent += generateInsert('Animal', animalsForSQL);
        console.log(`  ✅ ${animals.length} animaux`);

        console.log('📊 Traitement des pays...');

        sqlContent += `-- ========================================\n`;
        sqlContent += `-- Structure de la table Country\n`;
        sqlContent += `-- ========================================\n`;
        sqlContent += `DROP TABLE IF EXISTS Country;\n`;
        sqlContent += `CREATE TABLE Country (\n`;
        sqlContent += '  code_iso VARCHAR(2) PRIMARY KEY, \n';
        sqlContent += '  country_name VARCHAR(50) NOT NULL \n';
        sqlContent += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        const countriesData = await fs.readFile('countries.json', 'utf8');
        const Countries = JSON.parse(countriesData);

        const CountriesForSQL = Countries.map((data) => ({
            code_iso: data.code,
            country_name: data.description.en
        }));

        sqlContent += generateInsert('Country', CountriesForSQL);
        console.log(`  ✅ ${Countries.length} datas`);

        console.log('📊 Traitement des pays des animaux...');

        sqlContent += `-- ========================================\n`;
        sqlContent += `-- Structure de la table Animal_Country\n`;
        sqlContent += `-- ========================================\n`;
        sqlContent += `DROP TABLE IF EXISTS Animal_Country;\n`;
        sqlContent += `CREATE TABLE Animal_Country (\n`;
        sqlContent += '  PRIMARY KEY (animal_id, code_iso), \n';
        sqlContent += '  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id), \n';
        sqlContent += '  FOREIGN KEY (code_iso) REFERENCES Country(code_iso) PRIMARY KEY, \n';
        sqlContent += '  origin VARCHAR(50), \n';
        sqlContent += '  presence_type VARCHAR(50) \n';
        sqlContent += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        const animalCountriesData = await fs.readFile('animal_countries.json', 'utf8');
        const animalCountries = JSON.parse(animalCountriesData);

        const animalCountriesForSQL = animalCountries.map((data) => ({
            animal_id: data.assessment_id,
            code_iso: data.code_iso,
            origin: data.origin || null,
            presence_type: data.presence_type || null

        }));

        sqlContent += generateInsert('Animal_Country', animalCountriesForSQL);
        console.log(`  ✅ ${animalCountries.length} datas`);

        console.log('📊 Traitement des environements...');

        sqlContent += `-- ========================================\n`;
        sqlContent += `-- Structure de la table Environment\n`;
        sqlContent += `-- ========================================\n`;
        sqlContent += `DROP TABLE IF EXISTS Environment;\n`;
        sqlContent += `CREATE TABLE Environment (\n`;
        sqlContent += '  environment_id INT PRIMARY KEY, \n';
        sqlContent += '  environment_name VARCHAR(50) NOT NULL, \n';
        sqlContent += '  environment_type VARCHAR(255) \n';
        sqlContent += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        const EnvironmentData = await fs.readFile('environment.json', 'utf8');
        const Environment = JSON.parse(EnvironmentData);

        const environmentForSQL = Environment.map((data) => ({
            environment_id: data.code,
            environment_name: data.description.en.includes('-') ? data.description.en.split('-')[0] : data.description.en,
            environment_type: data.description.en.includes('-') ? data.description.en.split('-')[1] : null,
        }));

        sqlContent += generateInsert('Environment', environmentForSQL);
        console.log(`  ✅ ${Environment.length} datas`);

        console.log('📊 Traitement des environements des animaux...');

        sqlContent += `-- ========================================\n`;
        sqlContent += `-- Structure de la table Animal_Environment\n`;
        sqlContent += `-- ========================================\n`;
        sqlContent += `DROP TABLE IF EXISTS Animal_Environment;\n`;
        sqlContent += `CREATE TABLE Animal_Environment (\n`;
        sqlContent += '  PRIMARY KEY (animal_id, environment_id), \n';
        sqlContent += '  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id), \n';
        sqlContent += '  FOREIGN KEY (environment_id) REFERENCES Environment(environment_id) \n';
        sqlContent += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        const animalEnvironmentData = await fs.readFile('./animal_environment.json', 'utf8');
        const animalEnvironment = JSON.parse(animalEnvironmentData);

        const animalEnvironmentForSQL = animalEnvironment.map((data) => ({
            animal_id: data.animal_id,
            environment_id: data.environment_id
        }));

        sqlContent += generateInsert('Animal_Environment', animalEnvironmentForSQL);
        console.log(`  ✅ ${animalEnvironment.length} datas`);

        console.log('📊 Traitement des users..');

        sqlContent += `-- ========================================\n`;
        sqlContent += `-- Structure de la table User\n`;
        sqlContent += `-- ========================================\n`;
        sqlContent += `DROP TABLE IF EXISTS User;\n`;
        sqlContent += `CREATE TABLE User (\n`;
        sqlContent += '  user_id INT AUTO_INCREMENT PRIMARY KEY, \n';
        sqlContent += '  email VARCHAR(255) NOT NULL, \n';
        sqlContent += '  password VARCHAR(255) NOT NULL, \n';
        sqlContent += '  pseudo VARCHAR(50), \n';
        sqlContent += '  role VARCHAR(50) NOT NULL \n';
        sqlContent += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        console.log('📊 Traitement des favoris..');

        sqlContent += `-- ========================================\n`;
        sqlContent += `-- Structure de la table Favorite\n`;
        sqlContent += `-- ========================================\n`;
        sqlContent += `DROP TABLE IF EXISTS Favorite;\n`;
        sqlContent += `CREATE TABLE Favorite (\n`;
        sqlContent += '  PRIMARY KEY (animal_id, user_id), \n';
        sqlContent += '  FOREIGN KEY(animal_id) REFERENCES Animal(animal_id), \n';
        sqlContent += '  FOREIGN KEY(user_id) REFERENCES User(user_id) \n';
        sqlContent += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        await fs.writeFile('database.sql', sqlContent, 'utf8');

        console.log('\n✅ Fichier SQL généré : database.sql');

    }

    catch (e) {
        console.log("Error : " + e);
    }
}
generateSQL();