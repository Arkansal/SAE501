<?php

namespace App\Controller;

use App\Repository\AnimalCountryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
final class AnimalCountryController extends AbstractController
{
    #[Route('/countries/{animalId}', name: 'country_detail', methods: ['GET'])]
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
}
