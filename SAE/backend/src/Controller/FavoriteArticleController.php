<?php

namespace App\Controller;

use App\Repository\FavoriteArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;


final class FavoriteArticleController extends AbstractController
{
    /**
     * Get all articles
     */
    #[Route('/api/favoriteArticles', name: 'api_favoriteArticles', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of all articles',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                type: 'object',
                properties: [
                    new OA\Property(property: 'articleId', type: 'integer'),
                    new OA\Property(property: 'userId', type: 'integer'),
                ]
            )
        )
    )]
    #[OA\Get(tags: ['FavoriteArticles'])]
    public function getAllFavoriteArticles(FavoriteArticleRepository $favoriteArticleRepository): JsonResponse
    {
        $favoriteArticles = $favoriteArticleRepository->findAll();

        $data = array_map(function ($favoriteArticle) {
            return [
                'articleId' => $favoriteArticle->getArticleId(),
                'userId' => $favoriteArticle->getUserId(),
            ];
        }, $favoriteArticles);

        return $this->json($data);
    }

    /**
     * Add a new article
     */
    #[Route('/api/favoriteArticles', name: 'api_favoriteArticle_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Article added successfully',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(property: 'message', type: 'Article added successfully'),
            ]
        )
    )]
    #[OA\Post(tags: ['FavoriteArticles'])]
    public function addFavoriteArticle(FavoriteArticleRepository $favoriteArticleRepository, EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['articleId'])) {
            return $this->json(['message' => 'Invalid data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if ($favoriteArticleRepository->findOneBy(['articleId' => $data['articleId']])) {
            return $this->json(['message' => 'Article already exists'], JsonResponse::HTTP_CONFLICT);
        }
        $favoriteArticle = new \App\Entity\FavoriteArticle();
        $favoriteArticle->setArticleId($data['ArticleId']);
        $favoriteArticle->setUserId($data['userId']);

        $em->persist($favoriteArticle);
        $em->flush();

        return $this->json(['message' => 'Article added successfully'], JsonResponse::HTTP_CREATED);
    }
    // PUT
    /**
     * Update an article
     */
    #[Route('/api/favoriteArticles', name: 'favoriteArticle_update', methods: ['PUT'])]
    #[OA\Put(
        responses: [
            new OA\Response(
                response: 200,
                description: 'Article updated successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                        new OA\Property(
                            property: 'favoriteArticle',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'articleId', type: 'integer'),
                            ]
                        ),
                    ]
                )
            )
        ],
        description: 'Update an existing article',
        tags: ['FavoriteArticles'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'articleId', type: 'integer'),
                ]
            )
        )
    )]
    public function update(
        int $articleId,
        FavoriteArticleRepository $favoriteArticleRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $favoriteArticle = $favoriteArticleRepository->find($articleId);

        if (!isset($articleId) || !isset($userId)) {
            return new JsonResponse(['message' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Article updated successfully',
            'favoriteArticle' => [
                'articleId' => $favoriteArticle->getArticleId(),
            ],
        ]);
    }
    //DELETE
    /**
     * Delete an article
     */
    #[Route('/api/favoriteArticles', name: 'favoriteArticle_delete', methods: ['DELETE'])]
    #[OA\Delete(
        responses: [
            new OA\Response(
                response: 200,
                description: 'article deleted successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                    ]
                )
            )
        ],
        description: 'Delete an existing article',
        tags: ['FavoriteArticles'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'articleId', type: 'integer'),
                ]
            )
        )
    )]
    public function delete(
        int $articleId,
        FavoriteArticleRepository $favoriteArticleRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $favoriteArticle = $favoriteArticleRepository->find($articleId);

        if (!$favoriteArticle) {
            return $this->json(['error' => 'Article not found'], 404);
        }

        $entityManager->remove($favoriteArticle);
        $entityManager->flush();

        return $this->json(['message' => 'Article deleted successfully']);
    }
}
