<?php

$baseFile = __DIR__ . '/../../data/archives/new/animals_updated2.json';
$profileFile = __DIR__ . '/../animaux/profil_animals.json';
$outputFile = __DIR__ . '/../animaux/animals_merged.json';

if (!file_exists($baseFile)) {
    throw new \Exception("Fichier $baseFile introuvable");
}
if (!file_exists($profileFile)) {
    throw new \Exception("Fichier $profileFile introuvable");
}

$baseData = json_decode(file_get_contents($baseFile), true);
$profileData = json_decode(file_get_contents($profileFile), true);

$mergedData = $baseData;
$animalIds = array_column($baseData, 'assessment_id');

$addedCount = 0;
foreach ($profileData as $animal) {
    if (!in_array($animal['assessment_id'], $animalIds)) {
        $mergedData[] = $animal;
        $animalIds[] = $animal['assessment_id'];
        $addedCount++;
    }
}

file_put_contents($outputFile, json_encode($mergedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo "Merge complete.\n";
echo count($baseData) . " animals from base file.\n";
echo count($profileData) . " animals from profile file.\n";
echo $addedCount . " new animals added.\n";
echo count($mergedData) . " total animals in new file.\n";

