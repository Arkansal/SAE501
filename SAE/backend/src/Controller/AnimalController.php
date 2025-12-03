<?php

namespace App\Controller;

use App\Repository\AnimalRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api', name: 'api_')]
class AnimalController extends AbstractController
{
    // GET
    #[Route('/animals', name: 'animals_list', methods: ['GET'])]
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

    #[Route('/animals/{id}', name: 'animal_detail', methods: ['GET'])]
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