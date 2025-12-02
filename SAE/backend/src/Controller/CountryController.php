<?php 

namespace App\Controller;

use App\Repository\CountryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
class CountryController extends AbstractController
{
    #[Route('/countries', name: 'countries_list', methods: ['GET'])]
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
}