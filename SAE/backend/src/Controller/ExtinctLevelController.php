<?php

namespace App\Controller;

use App\Repository\ExtinctLevelRepository;
use App\Repository\AnimalRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

final class ExtinctLevelController extends AbstractController
{
    /**
     * Get all extinct levels
     */
    #[Route('/api/extinctLevel', name: 'api_extinctLevel', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of all extinct levels',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                type: 'object',
                properties: [
                    new OA\Property(property: 'extinctLevelId', type: 'integer'),
                    new OA\Property(property: 'extinctLevel', type: 'string'),
                    new OA\Property(property: 'levelName', type: 'string'),
                    new OA\Property(property: 'description', type: 'text'),
                ]
            )
        )
    )]
    #[OA\Get(tags: ['ExtinctLevels'])]
    public function getAllExtinctLevels(ExtinctLevelRepository $extinctLevelRepository): JsonResponse
    {
        $extinctLevels = $extinctLevelRepository->findAll();

        $data = array_map(function ($extinctLevel) {
            return [
                'id' => $extinctLevel->getId(),
                'extinctLevel' => $extinctLevel->getExtinctLevel(),
                'levelName' => $extinctLevel->getLevelName(),
                'description' => $extinctLevel->getDescription(),
            ];
        }, $extinctLevels);

        return $this->json($data);
    }

    /**
     * Get random animal with extinction level
     */
    #[Route('/api/randomAnimalWithExtinctionLevel', name: 'api_randomAnimalWithExtinctionLevel', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a random animal with its extinction level details',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(property: 'id', type: 'integer'),
                new OA\Property(property: 'commonName', type: 'string'),
                new OA\Property(property: 'scientificName', type: 'string'),
                new OA\Property(property: 'family', type: 'string'),
                new OA\Property(property: 'type', type: 'string'),
                new OA\Property(property: 'images', type: 'array', items: new OA\Items(type: 'string')),
                new OA\Property(
                    property: 'extinctLevel',
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'integer'),
                        new OA\Property(property: 'extinctLevel', type: 'string'),
                        new OA\Property(property: 'levelName', type: 'string'),
                        new OA\Property(property: 'description', type: 'string'),
                    ]
                ),
            ]
        )
    )]
    #[OA\Get(tags: ['ExtinctLevels'])]
    public function getRandomAnimalWithExtinctionLevel(
        AnimalRepository $animalRepository,
        ExtinctLevelRepository $extinctLevelRepository
    ): JsonResponse {
        // Liste des codes qu'on souhaite voir apparaître équitablement dans le jeu
        $targetLevels = ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD', 'NE'];

        // On choisit un niveau au hasard pour forcer la diversité
        $randomTarget = $targetLevels[array_rand($targetLevels)];

        // Utilise la méthode optimisée du repository avec le niveau cible
        $animal = $animalRepository->findRandomAnimalForGame($randomTarget);

        if (!$animal) {
            return $this->json(['error' => 'No suitable animal found with extinction level and image'], 404);
        }

        // Récupère le niveau d'extinction correspondant
        $extinctLevel = $extinctLevelRepository->findOneBy(['extinctLevel' => $animal->getExtinctLevel()]);

        // Si jamais le code d'extinction de l'animal ne correspond à rien dans la table de référence (incohérence BDD)
        if (!$extinctLevel) {
            // On pourrait réessayer, mais pour l'instant on renvoie une erreur pour signaler le problème de données
            return $this->json(['error' => 'Extinction level data missing for animal ' . $animal->getId()], 500);
        }

        $data = [
            'id' => $animal->getId(),
            'commonName' => $animal->getCommonName(),
            'scientificName' => $animal->getScientificName(),
            'family' => $animal->getFamily(),
            'type' => $animal->getType(),
            'images' => $animal->getImage(),
            'extinctLevel' => [
                'id' => $extinctLevel->getId(),
                'extinctLevel' => $extinctLevel->getExtinctLevel(),
                'levelName' => $extinctLevel->getLevelName(),
                'description' => $extinctLevel->getDescription(),
            ],
        ];

        return $this->json($data);
    }
}
