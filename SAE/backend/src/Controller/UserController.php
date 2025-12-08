<?php

namespace App\Controller;

use App\Entity\User;
use OpenApi\Attributes as OA;
use App\Repository\UserRepository;
use OpenApi\Attributes\Items as Items;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api', name: 'api_')]
final class UserController extends AbstractController
{
    /**
     * Get all users
     */
    #[Route('/users', name: 'api_users_list', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the list of all users',
    )]
    #[OA\Get(tags: ['Users'])]
    #[IsGranted('ROLE_ADMIN')]
    public function list(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = array_map(function ($user) {
            return [
                'userId' => $user->getId(),
                'username' => $user->getPseudo(),
                'email' => $user->getEmail(),
                'role' => $user->getRoles(),
            ];
        }, $users);
        return $this->json($data);
    }

    /**
     * Get user details by ID
     */
    #[Route('/users/{id}', name: 'api_user_detail', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns the details of a user by ID',
    )]
    #[OA\Get(tags: ['Users'])]
    #[IsGranted('ROLE_ADMIN')]
    public function detail(int $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->find($id);
        if (!$user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        $data = [
            'userId' => $user->getUserId(),
            'username' => $user->getPseudo(),
            'email' => $user->getEmail(),
            'role' => $user->getRoles(),
        ];
        return $this->json($data);
    }

    /**
     * Add a user
     */
    #[Route('/users/{id}', name: 'api_user_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Creates a new user',
    )]
    #[OA\Post(tags: ['Users'])]
    #[IsGranted('ROLE_ADMIN')]
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
    // PUT
    #[Route('/users/{id}', name: 'user_update', methods: ['PUT'])]
    #[
        OA\Put(
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'User updated successfully',
                    content: new OA\JsonContent(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'message', type: 'string'),
                            new OA\Property(
                                property: 'user',
                                type: 'object',
                                properties: [
                                    new OA\Property(property: 'userId', type: 'integer'),
                                    new OA\Property(property: 'email', type: 'string'),
                                    new OA\Property(property: 'username', type: 'string'),
                                    new OA\Property(property: 'role', type: 'array', items: new Items(type: 'string')),
                                ]
                            ),
                        ]
                    )
                )
            ],
            description: 'Update an existing user',
            tags: ['Users'],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'email', type: 'string', example: 'example@mail.com'),
                        new OA\Property(property: 'password', type: 'string', example: 'newpassword123'),
                        new OA\Property(property: 'username', type: 'string', example: 'newusername'),
                        new OA\Property(property: 'role', type: 'array', items: new Items(type: 'string'), example: ['ROLE_USER']),
                    ]
                )
            )
        )
    ]
    #[IsGranted('ROLE_ADMIN')]
    public function update(
        int $userId,
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $user = $userRepository->find($userId);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['password'])) {
            $hashed = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashed);
        }
        if (isset($data['username'])) {
            $user->setPseudo($data['username']);
        }
        if (isset($data['role'])) {
            $user->setRoles($data['role']);
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'User updated successfully',
            'user' => [
                'userId' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getPseudo(),
                'role' => $user->getRoles(),
            ],
        ]);
    }
    //DELETE
    #[Route('/users/{id}', name: 'user_delete', methods: ['DELETE'])]
    #[OA\Delete(
        responses: [
            new OA\Response(
                response: 200,
                description: 'User deleted successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                    ]
                )
            )
        ],
        description: 'Delete an existing user',
        tags: ['Users'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(
                        property: 'userId',
                        type: 'integer',
                        description: 'ID of the user to delete'
                    ),
                ],
                example: [
                    'userId' => 1,
                ]
            )
        )
    )]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(
        int $userId,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $userRepository->find($userId);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(['message' => 'User deleted successfully']);
    }
}
