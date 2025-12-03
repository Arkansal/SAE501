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
use Symfony\Component\Validator\Validator\ValidatorInterface;
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
    #[OA\Get(tags: ['Animals'])]
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
     * Get animal details by ID
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
    #[OA\Get(tags: ['Animals'])]
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


    #[Route('/animals', name: 'animals_create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/animals',
        summary: 'Créer un nouvel animal',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['id', 'scientificName', 'extinctLevel'],
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 123456),
                    new OA\Property(property: 'scientificName', type: 'string', example: 'Panthera leo'),
                    new OA\Property(property: 'commonName', type: 'string', example: 'Lion'),
                    new OA\Property(property: 'family', type: 'string', example: 'Felidae'),
                    new OA\Property(property: 'type', type: 'string', example: 'MAMMALIA'),
                    new OA\Property(property: 'extinctLevel', type: 'string', example: 'VU'),
                    new OA\Property(property: 'images', type: 'array', items: new OA\Items(type: 'string'))
                ]
            )
        ),
        tags: ['Animals'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Animal créé avec succès',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                        new OA\Property(property: 'id', type: 'integer')
                    ]
                )
            ),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 409, description: 'Animal existe déjà')
        ]
    )]
    public function create(Request $request, ValidatorInterface $validator, EntityManagerInterface $em, AnimalRepository $animalRepository): JsonResponse
    {

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }


        if (isset($data['id']) && $animalRepository->find($data['id'])) {
            return $this->json(['error' => 'Animal with this ID already exists'], Response::HTTP_CONFLICT);
        }


        $animal = new Animal();
        $animal->setId($data['id'] ?? null);
        $animal->setScientificName($data['scientificName'] ?? null);
        $animal->setCommonName($data['commonName'] ?? null);
        $animal->setFamily($data['family'] ?? null);
        $animal->setType($data['type'] ?? null);
        $animal->setExtinctLevel($data['extinctLevel'] ?? null);
        $animal->setImage($data['images'] ?? []);


        $errors = $validator->validate($animal);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }


        $em->persist($animal);
        $em->flush();

        return $this->json([
            'message' => 'Animal créé avec succès',
            'id' => $animal->getId()
        ], Response::HTTP_CREATED);
    }
}
