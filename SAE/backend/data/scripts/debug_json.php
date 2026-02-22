<?php
$json = json_decode(file_get_contents('backend/data/new/animal_countries.json'), true);
foreach ($json as $index => $item) {
    if (!isset($item['code_iso'])) {
        echo "Index $index: Clé 'code_iso' manquante. Contenu: " . json_encode($item) . "\n";
    }
}

