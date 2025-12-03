<?php

namespace App\Controller;

use App\Entity\Animal;
use OpenApi\Attributes as OA;
use OpenApi\Attributes\Items;
use App\Repository\AnimalRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api', name: 'api_')]
class AnimalController extends AbstractController
{

    /**
     * List all animals
     */
    #[Route('/animals', name: 'animals_list', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the list of all animals',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
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
        )
    )]
    public function list(AnimalRepository $animalRepository): JsonResponse
    {
        $animals = $animalRepository->findAll();

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

    /**
     * Give an animal with his ID
     */
    #[Route('/animals/{id}', name: 'animal_detail', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the details of an animal by ID',
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
    public function detail(int $id, AnimalRepository $animalRepository): JsonResponse
    {
        $animal = $animalRepository->find($id);

        if (!$animal) {
            return $this->json(['error' => 'Animal not found'], 404);
        }

        $data = [
            'id' => $animal->getId(),
            'commonName' => $animal->getCommonName(),
            'scientificName' => $animal->getScientificName(),
            'family' => $animal->getFamily(),
            'type' => $animal->getType(),
            'extinctLevel' => $animal->getExtinctLevel(),
            'images' => $animal->getImage(),
        ];

        return $this->json($data);
    }

       /**
     * Search animals by keyword
     */
    #[Route('/animals/{id}', name: 'animal_detail', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the details of an animal by ID',
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
    #[Route('/animalSearch/{keyword}', name: 'animal_search', methods: ['GET'])]
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

    /**
     * Create a new animal
     */
    #[Route('/animals', name: 'animals_create', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Creates a new animal',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Animal enregistré'),
                new OA\Property(property: 'id', type: 'integer', example: 1),
            ]
        )
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'query',
        description: 'Unique identifier for the animal (positive integer)',
        required: true,
        schema: new OA\Schema(type: 'integer', example: 1)
    )]
    #[OA\Parameter(
        name: 'scientificName',
        in: 'query',
        description: 'Scientific name of the animal (2-200 characters)',
        required: true,
        schema: new OA\Schema(type: 'string', example: "Loxodonta africana")
    )]
    #[OA\Parameter(
        name: 'extinctLevel',
        in: 'query',
        description: 'Extinct level of the animal (2 uppercase letters, e.g., VU, LC, EN)',
        required: true,
        schema: new OA\Schema(type: 'string', example: "VU")
    )]
    public function create(Request $request, EntityManagerInterface $em, AnimalRepository $animalRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['id']) || !preg_match('/^[1-9][0-9]*$/', (string)$data['id'])) {
            return $this->json(['error' => 'ID must be a positive integer'], Response::HTTP_BAD_REQUEST);
        }

        if ($animalRepository->find($data['id'])) {
            return $this->json(['error' => 'Animal with this ID already exists'], Response::HTTP_CONFLICT);
        }

        if (!isset($data['scientificName']) || !preg_match('/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']{2,200}$/', $data['scientificName'])) {
            return $this->json(['error' => 'Scientific name must be 2-200 characters (letters, spaces, hyphens, apostrophes)'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['extinctLevel']) || !preg_match('/^[A-Z]{2}$/', $data['extinctLevel'])) {
            return $this->json(['error' => 'Extinct level must be 2 uppercase letters (ex: VU, LC, EN)'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['commonName']) && !preg_match('/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']{2,100}$/', $data['commonName'])) {
            return $this->json(['error' => 'Common name must be 2-100 characters'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['family']) && !preg_match('/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']{2,100}$/', $data['family'])) {
            return $this->json(['error' => 'Family must be 2-100 characters'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['type']) && !preg_match('/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']{2,100}$/', $data['type'])) {
            return $this->json(['error' => 'Type must be 2-100 characters'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['images']) && !is_array($data['images'])) {
            return $this->json(['error' => 'Images must be an array'], Response::HTTP_BAD_REQUEST);
        }

        $animal = new Animal();
        $animal->setId((int)$data['id']); // ← ICI : utilise la vraie valeur
        $animal->setScientificName($data['scientificName']);
        $animal->setExtinctLevel($data['extinctLevel']);
        $animal->setCommonName($data['commonName'] ?? null);
        $animal->setFamily($data['family'] ?? null);
        $animal->setType($data['type'] ?? null);
        $animal->setImage($data['images'] ?? []);

        $em->persist($animal);
        $em->flush();

        return $this->json([
            'message' => 'Animal enregistré',
            'id' => $animal->getId()
        ], Response::HTTP_CREATED);
    }
}
