<?php

namespace App\Controller;

use OpenApi\Attributes as OA;
use App\Repository\AnimalRepository;
use App\Repository\CountryRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\AnimalCountryRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api', name: 'api_')]
final class AnimalCountryController extends AbstractController
{
    /**
     * Get all countries by an animal Id
     */
    #[Route('/countries/{animalId}', name: 'country_detail', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of countries for the specified animal',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                type: 'object',
                properties: [
                    new OA\Property(property: 'countryName', type: 'string'),
                    new OA\Property(property: 'origin', type: 'string'),
                    new OA\Property(property: 'presenceType', type: 'string'),
                ]
            )
        )
        )]
    #[OA\Get(tags: ['Countries'])]
    public function getCountriesByAnimal(int $animalId, AnimalCountryRepository $animalCountryRepository): JsonResponse
    {
        $countries = $animalCountryRepository->findBy(['animal' => $animalId]);
        $data = array_map(function($animalCountry) {
            return [
                'countryName' => $animalCountry->getCountry()->getCountryName(),
                'origin' => $animalCountry->getOrigin(),
                'presenceType' => $animalCountry->getPresenceType(),
            ];
        }, $countries);

        
        return $this->json($data);
    }

    /**
     * Add a country for an animal
     */
    #[Route('/countries', name: 'country_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Country added to animal successfully',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Country added to animal successfully')
            ]
        )
    )]
    #[OA\Parameter(
        name: 'animalId',
        in: 'query',
        description: 'ID of the animal',
        required: true,
        schema: new OA\Schema(type: 'integer', example: 1)
    )]
    #[OA\Parameter(
        name: 'countryCode',
        in: 'query',
        description: 'ISO code of the country',
        required: true,
        schema: new OA\Schema(type: 'string', example: "US")
    )]
    #[OA\Post(tags: ['Countries'])]
    public function addCountryForAnimal(Request $request, EntityManagerInterface $em, AnimalRepository $animalRepository, CountryRepository $countryRepository): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if(!$data) {
            return $this->json(['error' => 'Invalid JSON'], 400);
        }

        if(!isset($data['animalId'], $data['countryCode'])) {
            return $this->json(['error' => 'Missing required fields (animalId/countryCode)'], 400);
        }
        $animal = $animalRepository->find($data['animalId']);
        $animal = $animalRepository->findOneBy(['id' => $data['animalId']]);
        $country = $countryRepository->findOneBy(['codeIso' => $data['countryCode']]);
        if(!$animal || !$country) {
            return $this->json(['error' => 'Animal or Country not found'], 404);
        }
        $animalCountry = new \App\Entity\AnimalCountry();
        $animalCountry->setAnimal($animal);
        $animalCountry->setCountry($country);
        $animalCountry->setOrigin($data['origin'] ?? null);
        $animalCountry->setPresenceType($data['presenceType'] ?? null);
        $em->persist($animalCountry);
        $em->flush();
        return $this->json(['message' => 'Country added to animal successfully'], 201);
    }
}
