<?php

// data/scripts/correct_environment_referentiel.php

echo "Starting environment referential correction...\n";

$referentielFile = __DIR__ . '/../referentiels/environment.json';

if (!file_exists($referentielFile)) {
    die("ERROR: Referentiel file not found.\n");
}

$environments = json_decode(file_get_contents($referentielFile), true);

$correctedEnvironments = [];
$parentCodes = [];
$maxChildCode = [];
$correctedCount = 0;

// Manual mapping for parents that are hard to find automatically
$manualParentMap = [
    'Mountain' => 'Rocky areas (eg. inland cliffs, mountain peaks)',
    'Cliffs' => 'Rocky areas (eg. inland cliffs, mountain peaks)',
    'Rivers and Streams' => 'Wetlands (inland)',
    'Marine Coastal' => 'Marine Coastal/Supratidal',
    'Tundra' => 'Grassland',
    'Temperate Forest' => 'Forest',
    'Boreal Forest' => 'Forest',
    'Tropical Forest' => 'Forest',
    'Various habitats' => 'Other',
    'Alpine' => 'Wetlands (inland)', // Alpine Wetlands (includes temporary waters from snowmelt)
];

// First pass: separate correct and incorrect formats, and catalog parent codes
$incorrectEnvironments = [];
foreach ($environments as $env) {
    // Check if the code is in the "parent_child" or "parent" format
    if (preg_match('/^\d+(\_\d+)?$/', $env['code'])) {
        $correctedEnvironments[] = $env;
        $parts = explode('_', $env['code']);
        $parentCode = $parts[0];
        if (!isset($parentCodes[$env['description']['en']])) {
            $parentCodes[$env['description']['en']] = $parentCode;
        }
        if (count($parts) == 1) { // It's a parent itself
             $parentCodes[$env['description']['en']] = $parentCode;
        }
    } else {
        $incorrectEnvironments[] = $env;
    }
}

// Second pass: correct the incorrect entries
foreach ($incorrectEnvironments as $env) {
    $description = $env['description']['en'];
    $parts = explode(' - ', $description, 2);

    if (count($parts) === 2) {
        // Swap the parts, e.g., "Grassland - Savanna" -> "Savanna - Grassland"
        $swappedDesc = $parts[1] . ' - ' . $parts[0];
        $parentDescAttempt = $parts[1];

        // Use the manual map if available
        if (isset($manualParentMap[$parentDescAttempt])) {
            $parentDesc = $manualParentMap[$parentDescAttempt];
        } else {
            $parentDesc = $parentDescAttempt;
        }
        

        // Find the parent code
        if (isset($parentCodes[$parentDesc])) {
            $parentCode = $parentCodes[$parentDesc];
            
            // Find the next available child index for this parent
            if (!isset($maxChildCode[$parentCode])) {
                 $maxChildCode[$parentCode] = 0;
                 foreach($correctedEnvironments as $e) {
                    $c_parts = explode('_', $e['code']);
                    if ($c_parts[0] == $parentCode && isset($c_parts[1])) {
                        if ($c_parts[1] > $maxChildCode[$parentCode]) {
                            $maxChildCode[$parentCode] = intval($c_parts[1]);
                        }
                    }
                 }
            }
            $maxChildCode[$parentCode]++;
            $newCode = $parentCode . '_' . $maxChildCode[$parentCode];

            // Add the corrected environment
            $correctedEnvironments[] = [
                'description' => ['en' => $swappedDesc],
                'code' => $newCode
            ];
            $correctedCount++;
            echo "Corrected '{$description}' to '{$swappedDesc}' with new code {$newCode}\n";
        } else {
             echo "WARN: Could not find parent ('{$parentDesc}') for '{$description}'. Skipping.\n";
             // Add back to the list without correction to not lose data
             $correctedEnvironments[] = $env;
        }
    } else {
        echo "WARN: Description '{$description}' not in 'Type - Name' format. Skipping.\n";
        $correctedEnvironments[] = $env;
    }
}

// Write the fully corrected data back to the file
file_put_contents($referentielFile, json_encode($correctedEnvironments, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo "\n--- Correction Complete ---\n";
echo "Total environments processed: " . count($correctedEnvironments) . "\n";
echo "Environments with corrected code: " . $correctedCount . "\n";
echo "File updated: $referentielFile\n";


