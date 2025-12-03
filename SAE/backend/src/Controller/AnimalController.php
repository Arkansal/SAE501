<?php

namespace App\Controller;

use App\Entity\Animal;
use App\Repository\AnimalRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use OpenApi\Attributes as OA;
use OpenApi\Attributes\Items;

#[Route('/api', name: 'api_')]
class AnimalController extends AbstractController
{
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

        $data = array_map(function($animal) {
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

        $data = array_map(function($animal) {
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
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        if (!isset($_REQUEST['id'])) {
            return new JsonResponse(['error' => 'ID is required'], 400);
        } else {
            if (!isset($_REQUEST['scientificName'])) {
                return new JsonResponse(['message' => 'Scientific Name is required'], 400);
            } else {
                if (!isset($_REQUEST['extinctLevel'])) {
                    return new JsonResponse(['message' => 'Extinct Level is required'], 400);
                } else {
                    return new JsonResponse(['message' => $request], 201);
                }
            }
        }
    }
    // PUT
    #[Route('/animals/{id}', name: 'animal_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        AnimalRepository $animalRepository,
        EntityManagerInterface $entityManager,        
    ): JsonResponse
    
    {
        $animal = $animalRepository->find($id);
        
        if (!$animal) {
            return $this->json(['error' => 'Animal not found'], 404);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['commonName'])) {
            $animal->setCommonName($data['commonName']);
        }
        if (isset($data['scientificName'])) {
            $animal->setScientificName($data['scientificName']);
        }
        if (isset($data['family'])) {
            $animal->setFamily($data['family']);
        }
        if (isset($data['type'])) {
            $animal->setType($data['type']);
        }
        if (isset($data['extinctLevel'])) {
            $animal->setExtinctLevel($data['extinctLevel']);
        }
        if (isset($data['images'])) {
            $animal->setImage($data['images']);
        }
        
        $entityManager->flush();
        
        return $this->json([
            'message' => 'Animal updated successfully',
            'animal' => [
                'id' => $animal->getId(),
                'commonName' => $animal->getCommonName(),
                'scientificName' => $animal->getScientificName(),
                'family' => $animal->getFamily(),
                'type' => $animal->getType(),
                'extinctLevel' => $animal->getExtinctLevel(),
                'images' => $animal->getImage(),
            ],
        ]);
    }
    //DELETE
    #[Route('/animals/{id}', name: 'animal_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        AnimalRepository $animalRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $animal = $animalRepository->find($id);
        
        if (!$animal) {
            return $this->json(['error' => 'Animal not found'], 404);
        }
        
        $entityManager->remove($animal);
        $entityManager->flush();
        
        return $this->json(['message' => 'Animal deleted successfully']);
    }
}
