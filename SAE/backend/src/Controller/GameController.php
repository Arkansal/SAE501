<?php

namespace App\Controller;

use App\Repository\AnimalRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/game', name: 'api_game_')]
class GameController extends AbstractController
{
    #[Route('/code-du-vivant/animals/{count}', name: 'code_du_vivant_animals', methods: ['GET', 'OPTIONS'])]
    public function getCodeDuVivantAnimals(
        int $count,
        AnimalRepository $animalRepository
    ): JsonResponse {
        try {
            // Limiter le count
            $count = max(1, min($count, 50));

            // Récupérer tous les animaux
            $allAnimals = $animalRepository->findAll();
            
            if (empty($allAnimals)) {
                return $this->json([], 404);
            }

            // Filtrer les animaux qui ont une image
            $animalsWithImages = array_filter($allAnimals, function($animal) {
                $images = $animal->getImage();
                return $images !== null && $images !== '';
            });

            if (empty($animalsWithImages)) {
                return $this->json(['error' => 'No animals with images found'], 404);
            }

            // Mélanger et sélectionner les animaux avec images
            $animalsWithImages = array_values($animalsWithImages);
            shuffle($animalsWithImages);
            $selectedAnimals = array_slice($animalsWithImages, 0, $count);

            $gameAnimals = [];

            foreach ($selectedAnimals as $animal) {
                try {
                    $correctName = (string)$animal->getScientificName();
                    
                    // Récupérer les pièges
                    $randomOthers = $this->getRandomAnimals($allAnimals, $animal->getId(), 3);
                    
                    $propositions = [$correctName];
                    foreach ($randomOthers as $other) {
                        $propositions[] = (string)$other->getScientificName();
                    }

                    // Mélanger les propositions
                    shuffle($propositions);
                    $correctIndex = array_search($correctName, $propositions, true);

                    // Sécuriser les images
                    $images = [];
                    $imageData = $animal->getImage();
                    if (is_array($imageData)) {
                        $images = $imageData;
                    } elseif (is_string($imageData) && !empty($imageData)) {
                        $decoded = json_decode($imageData, true);
                        if (is_array($decoded)) {
                            $images = $decoded;
                        }
                    }

                    $gameAnimals[] = [
                        'id' => (int)$animal->getId(),
                        'commonName' => (string)$animal->getCommonName(),
                        'scientificName' => $correctName,
                        'family' => (string)($animal->getFamily() ?? 'Unknown'),
                        'type' => (string)($animal->getType() ?? 'Unknown'),
                        'images' => $images,
                        'propositions' => array_values($propositions),
                        'correctIndex' => (int)$correctIndex,
                        'explanation' => $this->generateExplanation($animal),
                    ];
                } catch (\Exception $e) {
                    error_log('Error processing animal: ' . $e->getMessage());
                    continue;
                }
            }

            return $this->json($gameAnimals, 200);

        } catch (\Exception $e) {
            error_log('GameController Error: ' . $e->getMessage());
            return $this->json([
                'error' => 'Server error'
            ], 500);
        }
    }

    private function getRandomAnimals(array $allAnimals, int $excludeId, int $limit): array
    {
        $others = array_filter($allAnimals, function($animal) use ($excludeId) {
            return $animal->getId() !== $excludeId;
        });
        
        shuffle($others);
        return array_slice($others, 0, $limit);
    }

    private function generateExplanation($animal): string
    {
        $scientificName = $animal->getScientificName();
        $parts = explode(' ', trim($scientificName));
        
        if (count($parts) >= 2) {
            return sprintf(
                "Le nom scientifique %s se compose du genre %s et de l'espèce %s.",
                $scientificName,
                $parts[0],
                $parts[1]
            );
        }
        
        return sprintf(
            "Le nom scientifique de cet animal est %s.",
            $scientificName
        );
    }
}