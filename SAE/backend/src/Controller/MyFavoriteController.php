<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Repository\AnimalRepository;
use App\Repository\FavoriteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

use App\Entity\FavoriteArticle;
use App\Repository\ArticleRepository;
use App\Repository\FavoriteArticleRepository;

#[Route('/api/me/favorites', name: 'api_me_favorites_')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
class MyFavoriteController extends AbstractController
{
    // --- ANIMALS ---
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(FavoriteRepository $favoriteRepository): JsonResponse
    {
        $user = $this->getUser();
        $favorites = $favoriteRepository->findBy(['user' => $user]);
        
        $animalIds = array_map(function (Favorite $favorite) {
            return $favorite->getAnimal()->getId();
        }, $favorites);

        return $this->json($animalIds);
    }

    #[Route('/full', name: 'list_full', methods: ['GET'])]
    public function listFull(FavoriteRepository $favoriteRepository): JsonResponse
    {
        $user = $this->getUser();
        $favorites = $favoriteRepository->findBy(['user' => $user]);
        
        $animals = array_map(function (Favorite $favorite) {
            return $favorite->getAnimal();
        }, $favorites);

        // On utilise les groupes de sérialisation d'API Platform si possible, ou ceux par défaut
        return $this->json($animals, 200, [], ['groups' => ['animal:read']]);
    }

    #[Route('/animal/{id}', name: 'add', methods: ['POST'])]
    public function add(int $id, AnimalRepository $animalRepository, FavoriteRepository $favoriteRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        $animal = $animalRepository->find($id);

        if (!$animal) {
            return $this->json(['message' => 'Animal not found'], 404);
        }

        $existing = $favoriteRepository->findOneBy(['user' => $user, 'animal' => $animal]);
        if ($existing) {
            return $this->json(['message' => 'Already in favorites'], 200);
        }

        $favorite = new Favorite();
        $favorite->setUser($user);
        $favorite->setAnimal($animal);

        $em->persist($favorite);
        $em->flush();

        return $this->json(['message' => 'Added to favorites'], 201);
    }

    #[Route('/animal/{id}', name: 'remove', methods: ['DELETE'])]
    public function remove(int $id, AnimalRepository $animalRepository, FavoriteRepository $favoriteRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        $animal = $animalRepository->find($id);

        if (!$animal) {
            return $this->json(['message' => 'Animal not found'], 404);
        }

        $favorite = $favoriteRepository->findOneBy(['user' => $user, 'animal' => $animal]);
        
        if ($favorite) {
            $em->remove($favorite);
            $em->flush();
        }

        return $this->json(['message' => 'Removed from favorites'], 200);
    }

    // --- ARTICLES ---

    #[Route('/articles', name: 'list_articles', methods: ['GET'])]
    public function listArticles(FavoriteArticleRepository $favoriteArticleRepository): JsonResponse
    {
        $user = $this->getUser();
        $favorites = $favoriteArticleRepository->findBy(['user' => $user]);
        
        $articleIds = array_map(function (FavoriteArticle $favorite) {
            return $favorite->getArticle()->getId();
        }, $favorites);

        return $this->json($articleIds);
    }

    #[Route('/articles/full', name: 'list_articles_full', methods: ['GET'])]
    public function listArticlesFull(FavoriteArticleRepository $favoriteArticleRepository): JsonResponse
    {
        $user = $this->getUser();
        $favorites = $favoriteArticleRepository->findBy(['user' => $user]);
        
        $articles = array_map(function (FavoriteArticle $favorite) {
            return $favorite->getArticle();
        }, $favorites);

        return $this->json($articles, 200, [], ['groups' => ['article:read']]);
    }

    #[Route('/article/{id}', name: 'add_article', methods: ['POST'])]
    public function addArticle(int $id, ArticleRepository $articleRepository, FavoriteArticleRepository $favoriteArticleRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        $article = $articleRepository->find($id);

        if (!$article) {
            return $this->json(['message' => 'Article not found'], 404);
        }

        $existing = $favoriteArticleRepository->findOneBy(['user' => $user, 'article' => $article]);
        if ($existing) {
            return $this->json(['message' => 'Already in favorites'], 200);
        }

        $favorite = new FavoriteArticle();
        $favorite->setUser($user);
        $favorite->setArticle($article);

        $em->persist($favorite);
        $em->flush();

        return $this->json(['message' => 'Added to favorites'], 201);
    }

    #[Route('/article/{id}', name: 'remove_article', methods: ['DELETE'])]
    public function removeArticle(int $id, ArticleRepository $articleRepository, FavoriteArticleRepository $favoriteArticleRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        $article = $articleRepository->find($id);

        if (!$article) {
            return $this->json(['message' => 'Article not found'], 404);
        }

        $favorite = $favoriteArticleRepository->findOneBy(['user' => $user, 'article' => $article]);
        
        if ($favorite) {
            $em->remove($favorite);
            $em->flush();
        }

        return $this->json(['message' => 'Removed from favorites'], 200);
    }
}
