<?php

namespace App\DataFixtures;

use App\Entity\Animal;
use App\Entity\Environment;
use App\Entity\AnimalEnvironment;
use App\DataFixtures\AnimalFixtures;
use Doctrine\Persistence\ObjectManager;
use App\DataFixtures\EnvironmentFixtures;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class AnimalEnvironmentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $jsonPath = dirname(__DIR__, 2) . '/data/relations/animal_environments_merged.json';

        if (!file_exists($jsonPath)) {
            throw new \Exception("Fichier profil_animal_habitats_corrected.json introuvable");
        }

        $jsonData = file_get_contents($jsonPath);
        $animalsEnvironments = json_decode($jsonData, true);

        $imported = 0;
        $skipped = 0;
        $processed = [];

        foreach ($animalsEnvironments as $animalEnvData) {
            $animalId = $animalEnvData['assessment_id'];
            $fullEnvName = $animalEnvData['environment_name'];

            // V&eacute;rifier les doublons dans le JSON
            $key = $animalId . '_' . $fullEnvName;
            if (isset($processed[$key])) {
                // echo "⚠️  Doublon d&eacute;tect&eacute; : Animal $animalId - Env $fullEnvName\n";
                $skipped++;
                continue;
            }
            $processed[$key] = true;

            // R&eacute;cup&eacute;rer l'animal
            $animal = $manager->getRepository(Animal::class)->find($animalId);

            if (!$animal) {
                // echo "⚠️  Animal ID $animalId introuvable\n";
                $skipped++;
                continue;
            }

            // Parsing du nom de l'environnement pour retrouver Type et Name
            if (str_contains($fullEnvName, ' - ')) {
                [$type, $name] = explode(' - ', $fullEnvName, 2);
            } else {
                $type = $fullEnvName;
                $name = $fullEnvName;
            }

            // R&eacute;cup&eacute;rer l'environnement
            $environment = $manager->getRepository(Environment::class)
                ->findOneBy([
                    'environmentType' => $type,
                    'environmentName' => $name
                ]);

            if (!$environment) {
                echo "⚠️  Environment '$fullEnvName' introuvable\n";
                $skipped++;
                continue;
            }

            // V&eacute;rifier si existe en BDD
            $existing = $manager->getRepository(AnimalEnvironment::class)
                ->findOneBy([
                    'animal' => $animal,
                    'environment' => $environment
                ]);

            if ($existing) {
                $skipped++;
                continue;
            }

            // Cr&eacute;er la relation
            $animalEnvironment = new AnimalEnvironment();
            $animalEnvironment->setAnimal($animal);
            $animalEnvironment->setEnvironment($environment);

            $manager->persist($animalEnvironment);
            $imported++;

            // Flush par batch
            if ($imported % 50 === 0) {
                $manager->flush();
                $manager->clear();
                echo "... $imported import&eacute;s\n";
            }
        }

        $manager->flush();
        $manager->clear();

        echo "✅ " . $imported . " relations animal-environnement import&eacute;es\n";
        echo "⚠️  " . $skipped . " relations ignor&eacute;es\n";
    }

    public function getDependencies(): array
    {
        return [
            AnimalFixtures::class,
            EnvironmentFixtures::class,
        ];
    }
}