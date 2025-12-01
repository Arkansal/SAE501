<?php

namespace App\DataFixtures;

use App\Entity\Animal;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AnimalFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $jsonPath = dirname(__DIR__, 2) . '/data/animals_updated.json';
        
        if (!file_exists($jsonPath)) {
            throw new \Exception("Fichier animals_updated.json introuvable");
        }
        
        $jsonData = file_get_contents($jsonPath);
        $animals = json_decode($jsonData, true);
        
        $imported = 0;
        
        foreach ($animals as $animalData) {
            // Vérifier si existe déjà
            $existing = $manager->getRepository(Animal::class)
                ->findOneBy(['id' => $animalData['assessment_id']]);
            
            if ($existing) {
                continue;
            }
            
            $animal = new Animal();
            $animal->setId($animalData['assessment_id']);
            $animal->setCommonName($animalData['common_name']);
            $animal->setScientificName($animalData['scientific_name']);
            $animal->setFamily($animalData['family']);
            $animal->setType($animalData['type']);
            $animal->setImage($animalData['photo_url']);
            $animal->setExtinctLevel($animalData['extinct_level']);
            
            $manager->persist($animal);
            $imported++;
        }
        
        $manager->flush();
        
        echo "✅ " . $imported . " animaux importés\n";
    }
}