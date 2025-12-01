<?php

namespace App\DataFixtures;

use App\Entity\Animal;
use App\Entity\AnimalEnvironment;
use App\Entity\Environment;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AnimalEnvironmentFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $jsonPath = dirname(__DIR__, 2) . '/data/animal_environment.json';
        
        if (!file_exists($jsonPath)) {
            throw new \Exception("Fichier animal_environment.json introuvable");
        }
        
        $jsonData = file_get_contents($jsonPath);
        $animalsEnvironments = json_decode($jsonData, true);
        
        $imported = 0;
        $skipped = 0;
        $processed = [];
        
        foreach ($animalsEnvironments as $animalEnvData) {
            $animalId = $animalEnvData['animal_id'];
            $envId = $animalEnvData['environment_id'];
            
            // Vérifier les doublons dans le JSON
            $key = $animalId . '_' . $envId;
            if (isset($processed[$key])) {
                echo "⚠️  Doublon détecté : Animal $animalId - Env $envId\n";
                $skipped++;
                continue;
            }
            $processed[$key] = true;
            
            // Récupérer l'animal
            $animal = $manager->getRepository(Animal::class)->find($animalId);
            
            if (!$animal) {
                echo "⚠️  Animal ID $animalId introuvable\n";
                $skipped++;
                continue;
            }
            
            // Récupérer l'environnement
            $environment = $manager->getRepository(Environment::class)
                ->findOneBy(['environmentId' => $envId]);
            
            if (!$environment) {
                echo "⚠️  Environment ID $envId introuvable\n";
                $skipped++;
                continue;
            }
            
            // Vérifier si existe en BDD
            $existing = $manager->getRepository(AnimalEnvironment::class)
                ->findOneBy([
                    'animal' => $animal,
                    'environment' => $environment
                ]);
            
            if ($existing) {
                $skipped++;
                continue;
            }
            
            // Créer la relation
            $animalEnvironment = new AnimalEnvironment();
            $animalEnvironment->setAnimal($animal);
            $animalEnvironment->setEnvironment($environment);
            
            $manager->persist($animalEnvironment);
            $imported++;
            
            // Flush par batch
            if ($imported % 50 === 0) {
                $manager->flush();
                $manager->clear();
                echo "... $imported importés\n";
            }
        }
        
        $manager->flush();
        $manager->clear();
        
        echo "✅ " . $imported . " relations animal-environnement importées\n";
        echo "⚠️  " . $skipped . " relations ignorées\n";
    }
}