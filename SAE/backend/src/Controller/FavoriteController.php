<?php

namespace App\Controller;

use OpenApi\Attributes as OA;
use App\Repository\FavoriteRepository;
use Symfony\Component\BrowserKit\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api', name: 'api_')]
final class FavoriteController extends AbstractController
{
    #[Route('/favorite', name: 'favorite_list', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the list of all favorites',
    )]
    #[OA\Get(tags: ['Favorites'])]
    #[IsGranted('ROLE_ADMIN')]
    public function list(FavoriteRepository $favoriteRepository): JsonResponse
    {
        $favorites = $favoriteRepository->findAll();
        $data = array_map(function ($favorite) {
            return [
                'userId' => $favorite->getUser()->getId(),
                'animalId' => $favorite->getAnimal()->getId(),
            ];
        }, $favorites);
        return $this->json($data);
    }

    #[Route('/favorite', name: 'favorite_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Favorite added successfully',
    )]
    #[OA\Post(tags: ['Favorites'])]
    #[IsGranted('ROLE_ADMIN')]
    public function add(Request $request, FavoriteRepository $favoriteRepository, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'];
        $animalId = $data['animalId'];
        $favorite = $favoriteRepository->createFavorite($userId, $animalId);
        $errors = $validator->validate($favorite);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return new JsonResponse($errorsString, Response::HTTP_BAD_REQUEST);
        }
        $favoriteRepository->save($favorite, true);
        return new JsonResponse(['message' => 'Favorite added successfully'], Response::HTTP_CREATED);
    }

    #[Route('/favorite', name: 'favorite_put', methods: ['PUT'])]
    #[OA\Response(
        response: 200,
        description: 'Favorite updated successfully',
    )]
    #[OA\Put(tags: ['Favorites'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, FavoriteRepository $favoriteRepository, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'];
        $animalId = $data['animalId'];
        $favorite = $favoriteRepository->findOneBy(['user' => $userId, 'animal' => $animalId]);
        if (!$favorite) {
            return new JsonResponse(['message' => 'Favorite not found'], Response::HTTP_NOT_FOUND);
        }

        if (!isset($userId) || !isset($animalId)) {
            return new JsonResponse(['message' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $errors = $validator->validate($favorite);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return new JsonResponse($errorsString, Response::HTTP_BAD_REQUEST);
        }

        $favoriteRepository->save($favorite, true);
        return new JsonResponse(['message' => 'Favorite updated successfully'], Response::HTTP_OK);
    }

    #[Route('/favorite', name: 'favorite_delete', methods: ['DELETE'])]
    #[OA\Response(
        response: 200,
        description: 'Favorite deleted successfully',
    )]
    #[OA\Delete(tags: ['Favorites'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(Request $request, FavoriteRepository $favoriteRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'];
        $animalId = $data['animalId'];
        $favorite = $favoriteRepository->findOneBy(['user' => $userId, 'animal' => $animalId]);
        if (!$favorite) {
            return new JsonResponse(['message' => 'Favorite not found'], Response::HTTP_NOT_FOUND);
        }
        $favoriteRepository->remove($favorite, true);
        return new JsonResponse(['message' => 'Favorite deleted successfully'], Response::HTTP_OK);
    }
}
