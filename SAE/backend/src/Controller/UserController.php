<?php

namespace App\Controller;

use App\Entity\User;
use OpenApi\Attributes as OA;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class UserController extends AbstractController
{
    /**
     * Get all users
     */
    #[Route('/api/users', name: 'api_users_list', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the list of all users',
    )]
    #[OA\Get(tags: ['Users'])]
    public function list(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = array_map(function ($user) {
            return [
                'id' => $user->getId(),
                'username' => $user->getPseudo(),
                'email' => $user->getEmail(),
            ];
        }, $users);
        return $this->json($data);
    }

    /**
     * Get user details by ID
     */
    #[Route('/api/users/{id}', name: 'api_user_detail', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the details of a user by ID',
    )]
    #[OA\Get(tags: ['Users'])]
    public function detail(int $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->find($id);
        if (!$user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        $data = [
            'id' => $user->getId(),
            'username' => $user->getPseudo(),
            'email' => $user->getEmail(),
        ];
        return $this->json($data);
    }

    /**
     * Add a user
     */
    #[Route('/api/users', name: 'api_user_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Creates a new user',
    )]
    #[OA\Post(tags: ['Users'])]
    public function add(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();
        $user->setPseudo($data['username'] ?? null);
        $user->setEmail($data['email'] ?? null);
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
        }
        $em->persist($user);
        $em->flush();
        return $this->json([
            'message' => 'User created successfully',
            'id' => $user->getId()
        ], Response::HTTP_CREATED);
    }
}
