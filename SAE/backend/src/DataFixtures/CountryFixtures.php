<?php

namespace App\DataFixtures;

use App\Entity\Country;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CountryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Chemin vers ton fichier JSON
        $jsonPath = dirname(__DIR__, 2) . '/data/countries.json';
        
        if (!file_exists($jsonPath)) {
            throw new \Exception("Fichier countries.json introuvable à : " . $jsonPath);
        }
        
        $jsonData = file_get_contents($jsonPath);
        $countries = json_decode($jsonData, true);
        
        foreach ($countries as $countryData) {
            $country = new Country();
            $country->setCodeIso($countryData['code']);
            $country->setCountryName($countryData['description']['en']);
            
            $manager->persist($country);
        }
        
        $manager->flush();
        
        echo "✅ " . count($countries) . " pays importés\n";
    }
}