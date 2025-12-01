<?php

namespace App\DataFixtures;

use App\Entity\Environment;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class EnvironmentFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $jsonPath = dirname(__DIR__, 2) . '/data/environment.json';
        
        if (!file_exists($jsonPath)) {
            throw new \Exception("Fichier environment.json introuvable");
        }
        
        $jsonData = file_get_contents($jsonPath);
        $environments = json_decode($jsonData, true);
        
        $imported = 0;
        
        foreach ($environments as $envData) {
            // Vérifier si existe déjà
            $existing = $manager->getRepository(Environment::class)
                ->findOneBy(['environmentId' => $envData['code']]);
            
            if ($existing) {
                continue;
            }
            
            $description = $envData['description']['en'];
            
            // Parser le nom
            if (str_contains($description, ' - ')) {
                [$type, $name] = explode(' - ', $description, 2);
            } else {
                $type = $description;
                $name = $description; // Si pas de tiret, le nom = la description complète
            }
            
            $environment = new Environment();
            $environment->setEnvironmentId($envData['code']);
            $environment->setEnvironmentName($name); // Juste ce qui est après le tiret
            $environment->setEnvironmentType($type); // Le type (Forest, Savanna, etc.)
            
            $manager->persist($environment);
            $imported++;
        }
        
        $manager->flush();
        
        echo "✅ " . $imported . " environnements importés\n";
    }
}