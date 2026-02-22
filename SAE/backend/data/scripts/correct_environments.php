<?php

// data/scripts/correct_environments.php

echo "Starting environment relation correction and merge...\n";

// 1. Load all necessary files
$referentielFile = __DIR__ . '/../referentiels/environment.json';
$mainRelationsFile = __DIR__ . '/../archives/new/animal_habitats.json';
$profileRelationsFile = __DIR__ . '/../relations/profil_animal_habitats_corrected.json';
$outputFile = __DIR__ . '/../relations/animal_environments_merged.json';

if (!file_exists($referentielFile)) die("ERROR: Referentiel file not found.\n");
if (!file_exists($mainRelationsFile)) die("ERROR: Main relations file not found.\n");
if (!file_exists($profileRelationsFile)) die("ERROR: Profile relations file not found.\n");

$referentielData = json_decode(file_get_contents($referentielFile), true);
$mainRelations = json_decode(file_get_contents($mainRelationsFile), true);
$profileRelations = json_decode(file_get_contents($profileRelationsFile), true);

// 2. Create a lookup map of valid environment descriptions
$validDescriptions = [];
foreach ($referentielData as $env) {
    if (isset($env['description']['en'])) {
        $validDescriptions[$env['description']['en']] = true;
    }
}
echo "Loaded " . count($validDescriptions) . " valid environment descriptions.\n";

$mergedRelations = [];
$processedKeys = []; // To handle duplicates (animal_id + env_name)
$correctedCount = 0;
$skippedCount = 0;

// Function to process a single relation record
function processRelation($relation, &$validDescriptions, &$mergedRelations, &$processedKeys, &$correctedCount, &$skippedCount) {
    if (!isset($relation['assessment_id']) || !isset($relation['environment_name'])) {
        $skippedCount++;
        return;
    }

    $animalId = $relation['assessment_id'];
    $envName = $relation['environment_name'];

    // Check for duplicates before any processing
    $key = $animalId . '_' . $envName;
    if (isset($processedKeys[$key])) {
        return; // Silently skip duplicates within the same source file
    }

    $corrected = false;
    // 3. Check if the environment name is valid
    if (!isset($validDescriptions[$envName])) {
        // If not valid, try to fix it by swapping parts
        $parts = explode(' - ', $envName, 2);
        if (count($parts) === 2) {
            $swappedName = $parts[1] . ' - ' . $parts[0];
            if (isset($validDescriptions[$swappedName])) {
                $envName = $swappedName; // Use the corrected name
                $correctedCount++;
                $corrected = true;
            } else {
                // echo "WARN: Cannot fix environment name: '{$relation['environment_name']}'\n";
                $skippedCount++;
                return;
            }
        } else {
            // Cannot be swapped, so it's unfixable
            // echo "WARN: Unfixable environment name: '$envName'\n";
            $skippedCount++;
            return;
        }
    }
    
    // Check for duplicates again with the potentially corrected name
    $finalKey = $animalId . '_' . $envName;
    if (isset($processedKeys[$finalKey])) {
        $skippedCount++; // This is now a true duplicate
        return;
    }

    // Add to merged list
    $mergedRelations[] = [
        'assessment_id' => $animalId,
        'environment_name' => $envName
    ];
    $processedKeys[$finalKey] = true;
}

// 4. Process both relation files
echo "Processing main relations file...\n";
foreach ($mainRelations as $relation) {
    processRelation($relation, $validDescriptions, $mergedRelations, $processedKeys, $correctedCount, $skippedCount);
}

echo "Processing profile relations file...\n";
foreach ($profileRelations as $relation) {
    processRelation($relation, $validDescriptions, $mergedRelations, $processedKeys, $correctedCount, $skippedCount);
}

// 5. Write the merged and corrected data to the output file
file_put_contents($outputFile, json_encode($mergedRelations, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo "\n--- Correction and Merge Complete ---\n";
echo "Total unique relations created: " . count($mergedRelations) . "\n";
echo "Relations with corrected names: " . $correctedCount . "\n";
echo "Skipped/duplicate relations: " . $skippedCount . "\n";
echo "Output written to: $outputFile\n";


