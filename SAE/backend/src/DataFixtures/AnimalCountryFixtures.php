<?php

namespace App\DataFixtures;

use App\Entity\Animal;
use App\Entity\Country;
use App\Entity\AnimalCountry;
use App\DataFixtures\AnimalFixtures;
use App\DataFixtures\CountryFixtures;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class AnimalCountryFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $jsonPath = dirname(__DIR__, 2) . '/data/animal_countries_backup.json';

        if (!file_exists($jsonPath)) {
            throw new \Exception("Fichier animal_countries_backup.json introuvable");
        }

        $jsonData = file_get_contents($jsonPath);
        $animalsCountries = json_decode($jsonData, true);

        $imported = 0;
        $skipped = 0;
        $processed = [];

        foreach ($animalsCountries as $animalCountryData) {
            $animalId = $animalCountryData['assessment_id'];
            $countryCode = $animalCountryData['code_iso'];

            // Vérifier les doublons dans le JSON lui-même
            $key = $animalId . '_' . $countryCode;
            if (isset($processed[$key])) {
                echo "⚠️  Doublon détecté dans le JSON : Animal $animalId - Pays $countryCode\n";
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

            // Récupérer le pays
            $country = $manager->getRepository(Country::class)
                ->findOneBy(['codeIso' => $countryCode]);

            if (!$country) {
                echo "⚠️  Pays $countryCode introuvable\n";
                $skipped++;
                continue;
            }

            // Vérifier si existe en BDD
            $existing = $manager->getRepository(AnimalCountry::class)
                ->findOneBy([
                    'animal' => $animal,
                    'country' => $country
                ]);

            if ($existing) {
                $skipped++;
                continue;
            }

            // Créer la relation
            $animalCountry = new AnimalCountry();
            $animalCountry->setAnimal($animal);
            $animalCountry->setCountry($country);
            $animalCountry->setOrigin($animalCountryData['origin'] ?? null);
            $animalCountry->setPresenceType($animalCountryData['presence_type'] ?? null);

            $manager->persist($animalCountry);
            $imported++;

            // Flush et clear régulièrement pour éviter les problèmes mémoire
            if ($imported % 50 === 0) {
                $manager->flush();
                $manager->clear(); // IMPORTANT : vide l'EntityManager
                echo "... $imported importés\n";
            }
        }

        $manager->flush();
        $manager->clear();

        echo "✅ " . $imported . " relations animal-pays importées\n";
        echo "⚠️  " . $skipped . " relations ignorées\n";
    }

    public function getDependencies(): array
    {
        return [
            AnimalFixtures::class,
            CountryFixtures::class,
        ];
    }
}
