<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

final class ArticleController extends AbstractController
{
    /**
     * Get all articles
     */
    #[Route('/api/articles', name: 'api_articles', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of all articles',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                type: 'object',
                properties: [
                    new OA\Property(property: 'articleId', type: 'integer'),
                    new OA\Property(property: 'title', type: 'string'),
                    new OA\Property(property: 'image', type: 'text'),
                    new OA\Property(property: 'date', type: 'date_immutable'),
                    new OA\Property(property: 'author', type: 'string'),
                    new OA\Property(property: 'content', type: 'text'),
                ]
            )
        )
    )]
    #[OA\Get(tags: ['Articles'])]
    public function getAllArticles(ArticleRepository $articleRepository): JsonResponse
    {
        $articles = $articleRepository->findAll();

        $data = array_map(function ($article) {
            return [
                'articleId' => $article->getId(),
                'title' => $article->getTitle(),
                'image' => $article->getImage(),
                'date' => $article->getDate(),
                'author' => $article->getAuthor(),
                'content' => $article->getContent(),
            ];
        }, $articles);

        return $this->json($data);
    }

    /**
     * Add a new article
     */
    #[Route('/api/articles', name: 'api_article_add', methods: ['POST'])]
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
    #[OA\Post(tags: ['Articles'])]
    public function addArticle(ArticleRepository $articleRepository, EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['articleId'])) {
            return $this->json(['message' => 'Invalid data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if ($articleRepository->findOneBy(['articleId' => $data['articleId']])) {
            return $this->json(['message' => 'Article already exists'], JsonResponse::HTTP_CONFLICT);
        }
        $article = new \App\Entity\article();
        $article->setTitle($data['title']);
        $article->setImage($data['image']);
        $article->setDate(new \DateTimeImmutable($data['date']));
        $article->setAuthor($data['author']);
        $article->setContent($data['content']);

        $em->persist($article);
        $em->flush();

        return $this->json(['message' => 'Article added successfully'], JsonResponse::HTTP_CREATED);
    }
    // PUT
    /**
     * Update an article
     */
    #[Route('/api/articles', name: 'article_update', methods: ['PUT'])]
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
                            property: 'article',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'articleId', type: 'integer'),
                                new OA\Property(property: 'title', type: 'string'),
                                new OA\Property(property: 'image', type: 'text'),
                                new OA\Property(property: 'date', type: 'date_immutable'),
                                new OA\Property(property: 'author', type: 'string'),
                                new OA\Property(property: 'content', type: 'text'),
                            ]
                        ),
                    ]
                )
            )
        ],
        description: 'Update an existing article',
        tags: ['Articles'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'articleId', type: 'integer'),
                    new OA\Property(property: 'title', type: 'string'),
                    new OA\Property(property: 'image', type: 'text'),
                    new OA\Property(property: 'date', type: 'date_immutable'),
                    new OA\Property(property: 'author', type: 'string'),
                    new OA\Property(property: 'content', type: 'text'),
                ]
            )
        )
    )]
    public function update(
        int $articleId,
        Request $request,
        ArticleRepository $articleRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $article = $articleRepository->find($articleId);

        if (!$article) {
            return $this->json(['error' => 'article not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $article->setTitle($data['title']);
        }
        if (isset($data['image'])) {
            $article->setImage($data['image']);
        }
        if (isset($data['date'])) {
            $article->setDate(new \DateTimeImmutable($data['date']));
        }
        if (isset($data['author'])) {
            $article->setAuthor($data['author']);
        }
        if (isset($data['content'])) {
            $article->setContent($data['content']);
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Article updated successfully',
            'article' => [
                'articleId' => $article->getId(),
                'title' => $article->getTitle(),
                'image' => $article->getImage(),
                'date' => $article->getDate(),
                'author' => $article->getAuthor(),
                'content' => $article->getContent(),

            ],
        ]);
    }
    //DELETE
    /**
     * Delete an article
     */
    #[Route('/api/articles', name: 'article_delete', methods: ['DELETE'])]
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
        tags: ['Articles'],
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
        ArticleRepository $articleRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $article = $articleRepository->find($articleId);

        if (!$article) {
            return $this->json(['error' => 'Article not found'], 404);
        }

        $entityManager->remove($article);
        $entityManager->flush();

        return $this->json(['message' => 'article deleted successfully']);
    }
}
