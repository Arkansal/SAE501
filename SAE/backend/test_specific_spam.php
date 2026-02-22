<?php
require_once __DIR__ . '/vendor/autoload.php';
use App\Service\SpamChecker;

$projectDir = __DIR__;
$checker = new SpamChecker($projectDir);

$msg = "Ceci n'est pas un spam,non tu ne reve pas gagne ce téléphone gratuitement en cliquant sur ce lien";
echo "Test message: '$msg'
";
$isSpam = $checker->checkSpam($msg);
echo "Is Spam ? " . ($isSpam ? "YES (1)" : "NO (0)") . "
";
