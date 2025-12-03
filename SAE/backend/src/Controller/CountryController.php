<?php 

namespace App\Controller;

use App\Entity\Country;
use OpenApi\Attributes as OA;
use App\Repository\CountryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api', name: 'api_')]
class CountryController extends AbstractController
{
    /**
     * Get all countries
     */
    #[Route('/countries', name: 'countries_list', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of all countries',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                type: 'object',
                properties: [
                    new OA\Property(property: 'id', type: 'FR'),
                    new OA\Property(property: 'name', type: 'France'),
                ]
            )
        )
    )]
    public function list(CountryRepository $countryRepository): JsonResponse
    {
        $countries = $countryRepository->findAll();
        
        $data = array_map(function($country) {
            return [
                'id' => $country->getCodeIso(),
                'name' => $country->getCountryName(),
            ];
        }, $countries);
        
        return $this->json($data);
    }

    /**
     * Add a new country
     */
    #[Route('/countries', name: 'country_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Country added successfully',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(property: 'message', type: 'Country added successfully'),
            ]
        )
    )]
    #[OA\Parameter(
        name: 'codeIso',
        in: 'query',
        description: 'ISO 3166-1 alpha-2 country code (2 uppercase letters)',
        required: true,
        schema: new OA\Schema(type: 'string', example: "US")
    )]
    #[OA\Parameter(
        name: 'countryName',
        in: 'query',
        description: 'Name of the country',
        required: true,
        schema: new OA\Schema(type: 'string', example: "United States")
    )]
    public function addCountry(Request $request, EntityManagerInterface $em, CountryRepository $countryRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if(!isset($data)) {
            return $this->json(['message' => 'Invalid JSON'], 400);
        }
        
        $codeIso = $data['codeIso'] ?? null;
        $countryName = $data['countryName'] ?? null;

        if (!$codeIso || !$countryName) {
            return $this->json(['message' => 'Invalid data'], 400);
        }

        $existingCountry = $countryRepository->findOneBy(['codeIso' => $codeIso, 'countryName' => $countryName]);
        if ($existingCountry) {
            return $this->json(['message' => 'Country already exists'], 409);
        }

        $country = new Country();
        $country->setCodeIso($codeIso);
        $country->setCountryName($countryName);

        $em->persist($country);
        $em->flush();

        return $this->json(['message' => 'Country added successfully'], 201);
    }
}