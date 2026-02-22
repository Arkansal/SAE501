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
        $jsonPath = dirname(__DIR__, 2) . '/data/archives/new/animal_countries.json';

        if (!file_exists($jsonPath)) {
            throw new \Exception("Fichier profil_animal_countries_corrected.json introuvable");
        }

        $jsonData = file_get_contents($jsonPath);
        $animalsCountries = json_decode($jsonData, true);

        $imported = 0;
        $skipped = 0;
        // On change la clé de processed pour inclure le code mappé, sinon on risque des doublons après mapping
        // ex: TEX-OO -> US et CAL-OO -> US pour le même animal = doublon BDD
        $processedInDb = []; 

        foreach ($animalsCountries as $animalCountryData) {
            if (!isset($animalCountryData['code_iso'])) {
                $skipped++;
                continue;
            }

            $animalId = $animalCountryData['assessment_id'];
            $rawCode = $animalCountryData['code_iso'];
            
            // 1. Mapper le code région vers un code pays ISO standard
            $countryCode = $this->mapRegionToCountry($rawCode);

            // Récupérer l'animal
            $animal = $manager->getRepository(Animal::class)->find($animalId);

            if (!$animal) {
                // echo "⚠️  Animal ID $animalId introuvable\n";
                $skipped++;
                continue;
            }

            // Récupérer le pays
            $country = $manager->getRepository(Country::class)
                ->findOneBy(['codeIso' => $countryCode]);

            if (!$country) {
                // On affiche seulement si ce n'est pas un code qu'on a déjà essayé de mapper sans succès
                // echo "⚠️  Pays $countryCode (Source: $rawCode) introuvable\n";
                $skipped++;
                continue;
            }

            // 2. Vérifier si la relation existe déjà (important car TEX-OO et CAL-OO vont tous les deux donner US)
            // On vérifie d'abord dans notre cache local pour la perf
            $key = $animalId . '_' . $country->getCodeIso();
            if (isset($processedInDb[$key])) {
                $skipped++;
                continue;
            }

            // Puis en BDD si pas dans le cache local (au cas où relancé sans purge, mais ici on purge)
            $existing = $manager->getRepository(AnimalCountry::class)
                ->findOneBy([
                    'animal' => $animal,
                    'country' => $country
                ]);

            if ($existing) {
                $processedInDb[$key] = true;
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
            $processedInDb[$key] = true;
            $imported++;

            // Flush et clear régulièrement
            if ($imported % 100 === 0) {
                $manager->flush();
                $manager->clear(); 
                echo "... $imported importés\n";
            }
        }

        $manager->flush();
        $manager->clear();

        echo "✅ " . $imported . " relations animal-pays importées\n";
        echo "⚠️  " . $skipped . " relations ignorées (pays introuvables ou doublons après mapping)\n";
    }

    private function mapRegionToCountry(string $code): string
    {
        // Mapping direct des codes spécifiques/régionaux vers ISO Alpha-2
        $map = [
            'FRA-FR' => 'FR', 'ITA-IT' => 'IT', 'SPA-SP' => 'ES', 'GRC-OO' => 'GR',
            'PRT-OO' => 'PT', 'POR-OO' => 'PT', 'GER-OO' => 'DE', 'SWI-OO' => 'CH',
            'AUT-OO' => 'AT', 'BEL-OO' => 'BE', 'NLA-OO' => 'NL', 'GBR-OO' => 'GB',
            'UK' => 'GB', 'RUS-OO' => 'RU', 'RU-EU' => 'RU', 'RU-CA' => 'RU',
            'RU-AS' => 'RU', 'JAP-OO' => 'JP', 'JAP-HN' => 'JP', 'JAP-KY' => 'JP',
            'JAP-SH' => 'JP', 'JAP-HK' => 'JP', 'TUR-OO' => 'TR', 'TUE-OO' => 'TR',
            
            // Amériques
            'USA' => 'US', 'CAN' => 'CA', 'MEX' => 'MX', 'BRA' => 'BR',
            'ARG-OO' => 'AR', 'CLM-OO' => 'CO', 'PER-OO' => 'PE', 'VEN-OO' => 'VE',
            'ECU-OO' => 'EC', 'BOL-OO' => 'BO', 'CHL-OO' => 'CL', 'PRY-OO' => 'PY',
            'URY-OO' => 'UY', 'GUY-OO' => 'GY', 'SUR-OO' => 'SR', 'HAI-NI' => 'HT',
            'DOM-OO' => 'DO', 'CUB-OO' => 'CU', 'JAM-OO' => 'JM',
            
            // États US (IUCN codes fréquents)
            'ALA-OO' => 'US', 'ALK-OO' => 'US', 'ARI-OO' => 'US', 'ARK-OO' => 'US',
            'CAL-OO' => 'US', 'COL-OO' => 'US', 'CNT-OO' => 'US', 'DEL-OO' => 'US',
            'FLA-OO' => 'US', 'GEO-OO' => 'US', 'HAW-HI' => 'US', 'HAW-JI' => 'US', 
            'HAW-MI' => 'US', 'IDA-OO' => 'US', 'ILL-OO' => 'US', 'INI-OO' => 'US', 
            'IOW-OO' => 'US', 'KAN-OO' => 'US', 'KTY-OO' => 'US', 'LOU-OO' => 'US', 
            'MAI-OO' => 'US', 'MRY-OO' => 'US', 'MAS-OO' => 'US', 'MIC-OO' => 'US', 
            'MIN-OO' => 'US', 'MSI-OO' => 'US', 'MSO-OO' => 'US', 'MNT-OO' => 'US', 
            'NEB-OO' => 'US', 'NEV-OO' => 'US', 'NWH-OO' => 'US', 'NWJ-OO' => 'US', 
            'NWM-OO' => 'US', 'NWY-OO' => 'US', 'NCA-OO' => 'US', 'NDA-OO' => 'US', 
            'OHI-OO' => 'US', 'OKL-OO' => 'US', 'ORE-OO' => 'US', 'PEN-OO' => 'US', 
            'RHO-OO' => 'US', 'SCA-OO' => 'US', 'SDA-OO' => 'US', 'TEN-OO' => 'US', 
            'TEX-OO' => 'US', 'UTA-OO' => 'US', 'VER-OO' => 'US', 'VRG-OO' => 'US', 
            'WAS-OO' => 'US', 'WVA-OO' => 'US', 'WIS-OO' => 'US', 'WYO-OO' => 'US',

            // Australie
            'NSW-NS' => 'AU', 'QLD-QU' => 'AU', 'QLD-CS' => 'AU', 'SAU-SO' => 'AU', 
            'TAS-OO' => 'AU', 'VIC-OO' => 'AU', 'WAU-WA' => 'AU', 'NTA-OO' => 'AU', 
            'ACT-OO' => 'AU', 'NFK-LH' => 'AU', // Norfolk ? Souvent mappé AU ou NF

            // Autres régions
            'SIC-SI' => 'IT', 'SAR-OO' => 'IT', 'COR-OO' => 'FR', // Corse
            'AZO-OO' => 'PT', 'MDR-OO' => 'PT', // Azores, Madeira
            'CNY-OO' => 'ES', // Canary Islands
            'GAL-OO' => 'EC', // Galapagos -> Ecuador
        ];

        if (isset($map[$code])) {
            return $map[$code];
        }

        // Règles par préfixe pour grouper les grandes régions (Chine, Inde, Brésil, Mexique)
        if (str_starts_with($code, 'CHN-') || str_starts_with($code, 'CHS-') || str_starts_with($code, 'CHC-') || str_starts_with($code, 'CHM-') || str_starts_with($code, 'CHI-') || str_starts_with($code, 'CHQ-') || str_starts_with($code, 'CHT-') || str_starts_with($code, 'CHX-') || str_starts_with($code, 'AMU-')) return 'CN';
        if (str_starts_with($code, 'IND-') || str_starts_with($code, 'ASS-') || str_starts_with($code, 'WHM-')) return 'IN';
        if (str_starts_with($code, 'BZL-') || str_starts_with($code, 'BZN-') || str_starts_with($code, 'BZS-') || str_starts_with($code, 'BZE-') || str_starts_with($code, 'BZC-')) return 'BR';
        if (str_starts_with($code, 'MX')) return 'MX';
        
        // Si rien trouvé, on retourne le code d'origine
        return $code;
    }

    public function getDependencies(): array
    {
        return [
            AnimalFixtures::class,
            CountryFixtures::class,
        ];
    }
}
