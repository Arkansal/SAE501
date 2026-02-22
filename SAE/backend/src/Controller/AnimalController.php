<?php

namespace App\Controller;

use App\Repository\AnimalRepository;
use OpenApi\Attributes as OA;
use OpenApi\Attributes\Items;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
class AnimalController extends AbstractController
{
    /**
     * Search animals by keyword
     * Note: Basic CRUD operations are now handled by API Platform (see App\Entity\Animal).
     */
    #[Route('/animalSearch/{keyword}', name: 'animal_search', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the details of an animal by keyword',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 1),
                new OA\Property(property: 'commonName', type: 'string', example: 'African Elephant'),
                new OA\Property(property: 'scientificName', type: 'string', example: 'Loxodonta africana'),
                new OA\Property(property: 'family', type: 'string', example: 'Elephantidae'),
                new OA\Property(property: 'type', type: 'string', example: 'Mammal'),
                new OA\Property(property: 'extinctLevel', type: 'string', example: 'VU'),
                new OA\Property(property: 'images', type: 'array', items: new Items(type: 'string', example: 'https://example.com/image.jpg')),
            ]
        )
    )]
    #[OA\Get(
        tags: ['Animals']
    )]
    public function search(string $keyword, AnimalRepository $animalRepository): JsonResponse
    {
        $animals = $animalRepository->createQueryBuilder('a')
            ->andWhere('(a.commonName LIKE :keyword OR a.scientificName LIKE :keyword)')
            ->setParameter('keyword', $keyword . '%')
            ->getQuery()
            ->getResult();

        $data = array_map(function ($animal) {
            return [
                'id' => $animal->getId(),
                'commonName' => $animal->getCommonName(),
                'scientificName' => $animal->getScientificName(),
                'family' => $animal->getFamily(),
                'type' => $animal->getType(),
                'extinctLevel' => $animal->getExtinctLevel(),
                'images' => $animal->getImage(),
            ];
        }, $animals);

        return $this->json($data);
    }
}