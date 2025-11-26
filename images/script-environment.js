const fs = require('fs').promises;

let environments = [];

async function replace() {
    try {
        const content = await fs.readFile('./environment.json', 'utf8');
        const environment = JSON.parse(content);

        for (const e of environment) {
            const test = {};
            test["code"] = e.code;
            test["nom"] = e.description.en;
            environments.push(test);
        }

        const content2 = await fs.readFile('./animal_environment.json', 'utf8');
        const animalEnvironment = JSON.parse(content2);

        const animalEnvironmentJson = animalEnvironment.map((data) => ({
            animal_id: data.assessment_id,
            environment_id: environments.find(e => e.nom == data.environment_name).code
        }));
        let stringified = JSON.stringify(animalEnvironmentJson);
        fs.writeFile("animal_environment.json", stringified, 'utf-8');
    } catch (e) {
        console.log('ERROR : ' + e);
    }
}

replace();