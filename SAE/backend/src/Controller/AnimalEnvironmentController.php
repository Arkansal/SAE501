<?php

namespace App\Controller;

use OpenApi\Attributes as OA;
use App\Repository\AnimalRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\EnvironmentRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\AnimalEnvironmentRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api', name: 'api_')]
final class AnimalEnvironmentController extends AbstractController
{
    /**
     * Get all environments for an animal with his Id
     */
    #[Route('/environments/{animalId}', name: 'environment_detail', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of environments for the specified animal',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                type: 'object',
                properties: [
                    new OA\Property(property: 'environmentName', type: 'string'),
                    new OA\Property(property: 'type', type: 'string'),
                ]
            )
        )
        )]
    public function getEnvironmentsByAnimal(int $animalId, AnimalEnvironmentRepository $animalEnvironmentRepository): JsonResponse
    {
        $environments = $animalEnvironmentRepository->findBy(['animal' => $animalId]);
        $data = array_map(function($animalEnvironment) {
            return [
                'environmentName' => $animalEnvironment->getEnvironment()->getEnvironmentName(),
                'type' => $animalEnvironment->getEnvironment()->getEnvironmentType()
            ];
        }, $environments);
        return $this->json($data);
    }

    /**
     * Add an environment for an animal
     */
    #[Route('/environments', name: 'environment_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Environment added to animal successfully',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(property: 'message', type: 'string'),
            ]
        )
    )]
    #[OA\Parameter(
        name: 'animalId',
        in: 'query',
        description: 'ID of the animal',
        required: true,
        schema: new OA\Schema(type: 'string', example: "1")
    )]
    #[OA\Parameter(
        name: 'environmentId',
        in: 'query',
        description: 'ID of the environment',
        required: true,
        schema: new OA\Schema(type: 'string', example: "1")
    )]
    public function addEnvironmentForAnimal(Request $request, EntityManagerInterface $em, AnimalRepository $animalRepository, EnvironmentRepository $environmentRepository): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if(!isset($data)) {
            return $this->json(['error' => 'Invalid JSON data'], 400);
        }

        if(!isset($data['animalId']) || !isset($data['environmentId'])) {
            return $this->json(['error' => 'Missing required fields'], 400);
        }

        $animal = $animalRepository->findOneBy(['id' => $data['animalId']]);
        $environment = $environmentRepository->findOneBy(['id' => $data['environmentId']]);
        if(!$animal || !$environment) {
            return $this->json(['error' => 'Animal or Environment not found'], 404);
        }
        $animalEnvironment = new \App\Entity\AnimalEnvironment();
        $animalEnvironment->setAnimal($animal);
        $animalEnvironment->setEnvironment($environment);
        $em->persist($animalEnvironment);
        $em->flush();
        return $this->json(['message' => 'Environment added to animal successfully'], 201);
    }
    // PUT
    #[Route('/environments/{animalId}', name: 'animal_environment_update', methods: ['PUT'])]
    public function update(
        int $animalId,
        Request $request,
        AnimalEnvironmentRepository $animalEnvironmentRepository,
        EntityManagerInterface $entityManager,        
    ): JsonResponse
    
    {
        $animalEnvironment = $animalEnvironmentRepository->find($animalId);
        
        if (!$animalEnvironment) {
            return $this->json(['error' => 'Environment not found for this animal'], 404);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['environmentId'])) {
            $animalEnvironment->setEnvironment($data['environmentId']);
        }
        
        $entityManager->flush();
        
        return $this->json([
            'message' => 'Environment to animal updated successfully',
            'animal' => [
                'animalId' => $animalEnvironment->getId(),
                'environmentId' => $animalEnvironment->getEnvironment(),
            ],
        ]);
    }
    //DELETE
    #[Route('/environments/{animalId}', name: 'animal_environment_delete', methods: ['DELETE'])]
    public function delete(
        int $animalId,
        animalEnvironmentRepository $animalEnvironmentRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $animalEnvironment = $animalEnvironmentRepository->find($animalId);
        
        if (!$animalEnvironment) {
            return $this->json(['error' => 'Environment not found for this animal'], 404);
        }
        
        $entityManager->remove($animalEnvironment);
        $entityManager->flush();
        
        return $this->json(['message' => 'Environment deleted to an animal successfully']);
    }
}
