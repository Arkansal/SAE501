<?php
require_once __DIR__ . '/vendor/autoload.php';

use App\Service\SpamChecker;

// On simule l'environnement Symfony pour le constructeur
$projectDir = __DIR__;
$checker = new SpamChecker($projectDir);

$testMessages = [
    "Salut, comment ça va ?",
    "GAGNEZ UN IPHONE GRATUIT CLIQUEZ ICI !!!"
];

foreach ($testMessages as $msg) {
    echo "Test message: '$msg'
";
    $isSpam = $checker->checkSpam($msg);
    echo "Is Spam ? " . ($isSpam ? "YES (1)" : "NO (0)") . "
";
    echo "-------------------
";
}
