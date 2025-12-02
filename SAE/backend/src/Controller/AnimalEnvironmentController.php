<?php

namespace App\Controller;

use App\Repository\AnimalEnvironmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
final class AnimalEnvironmentController extends AbstractController
{
    #[Route('/environments/{animalId}', name: 'environment_detail', methods: ['GET'])]
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
}
