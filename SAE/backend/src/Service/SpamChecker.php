<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

class SpamChecker
{
    private string $projectDir;
    public function __construct(
        #[Autowire('%kernel.project_dir%')] string $projectDir
    ) {
        $this->projectDir = $projectDir;
    }

    public function checkSpam(string $text): bool
    {
        // Dans Docker, le dossier ai est monté à la racine /ai
        // En local (hors docker), on garde l'ancien chemin
        $pythonScript = '/ai/predict.py';

        if (!file_exists($pythonScript)) {
            $pythonScript = realpath($this->projectDir . '/../ai/predict.py');
        }

        if (!$pythonScript || !file_exists($pythonScript)) {
            error_log("SpamChecker Error: Script predict.py non trouvé.");
            return false;
        }

        // On essaie 'python3' d'abord (standard sous Linux/Docker), puis 'python'
        $pythonCmd = 'python3';
        $pythonCheck = shell_exec("python3 --version 2>&1");
        if (!$pythonCheck) {
            $pythonCmd = 'python';
            $pythonCheck = shell_exec("python --version 2>&1");
            if (!$pythonCheck) {
                error_log("SpamChecker Error: Ni 'python3' ni 'python' ne sont accessibles.");
                return false;
            }
        }

        $command = "$pythonCmd " . escapeshellarg($pythonScript) . " " . escapeshellarg($text) . " 2>&1";
        error_log("SpamChecker command: " . $command);
        $output = shell_exec($command);
        error_log("SpamChecker raw output: '" . $output . "'");

        if ($output === null) {
            error_log("SpamChecker Error: Erreur lors de l'exécution du shell_exec.");
            return false;
        }

        $result = trim($output);

        if ($result !== "0" && $result !== "1") {
            error_log("SpamChecker Python Error Output: " . $result);
            return false;
        }

        return $result === "1";
    }
}
