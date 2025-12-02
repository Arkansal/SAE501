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
