<?php

namespace App\DataFixtures;

use App\Entity\Country;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CountryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $jsonPath = dirname(__DIR__, 2) . '/data/countries.json';
        
        if (!file_exists($jsonPath)) {
            throw new \Exception("Fichier countries.json introuvable");
        }
        
        $jsonData = file_get_contents($jsonPath);
        $countries = json_decode($jsonData, true);
        
        $imported = 0;
        
        foreach ($countries as $countryData) {
            // Vérifier si le pays existe déjà
            $existing = $manager->getRepository(Country::class)
                ->findOneBy(['codeIso' => $countryData['code']]);
            
            if ($existing) {
                continue; // Passe au suivant si existe déjà
            }
            
            $country = new Country();
            $country->setCodeIso($countryData['code']);
            $country->setCountryName($countryData['description']['en']);
            
            $manager->persist($country);
            $imported++;
        }
        
        $manager->flush();
        
        echo "✅ " . $imported . " pays importés (sur " . count($countries) . " total)\n";
    }
}