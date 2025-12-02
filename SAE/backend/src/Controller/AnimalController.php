<?php

namespace App\Controller;

use App\Entity\Animal;
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
    #[Route('/animals', name: 'animals_list', methods: ['GET'])]
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
}
