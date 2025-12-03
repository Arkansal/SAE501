<?php

namespace App\Controller;

use OpenApi\Attributes as OA;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\EnvironmentRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class EnvironmentController extends AbstractController
{
    /**
     * Get all environments
     */
    #[Route('/api/environments', name: 'api_environments', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of all environments',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                type: 'object',
                properties: [
                    new OA\Property(property: 'id', type: 'integer'),
                    new OA\Property(property: 'environmentName', type: 'string'),
                    new OA\Property(property: 'environmentType', type: 'string'),
                ]
            )
        )
    )]
    public function getAllEnvironments(EnvironmentRepository $environmentRepository): JsonResponse
    {
        $environments = $environmentRepository->findAll();

        $data = array_map(function($environment) {
            return [
                'id' => $environment->getEnvironmentId(),
                'environmentName' => $environment->getEnvironmentName(),
                'environmentType' => $environment->getEnvironmentType(),
            ];
        }, $environments);

        return $this->json($data);
    }

    /**
     * Add a new environment
     */
    #[Route('/api/environments', name: 'api_environment_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Environment added successfully',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(property: 'message', type: 'Environment added successfully'),
            ]
        )
    )]
    public function addEnvironment(EnvironmentRepository $environmentRepository, EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if(!isset($data['environmentName']) || !isset($data['environmentType'])) {
            return $this->json(['message' => 'Invalid data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if($environmentRepository->findOneBy(['environmentName' => $data['environmentName']])) {
            return $this->json(['message' => 'Environment already exists'], JsonResponse::HTTP_CONFLICT);
        }
        $environment = new \App\Entity\Environment();
        $environment->setEnvironmentName($data['environmentName']);
        $environment->setEnvironmentType($data['environmentType']);

        $em->persist($environment);
        $em->flush();

        return $this->json(['message' => 'Environment added successfully'], JsonResponse::HTTP_CREATED);
    }
}
