<?php

namespace App\Controller;

use App\Repository\AnimalCountryRepository;
use App\Repository\AnimalEnvironmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Dom\Entity;

#[Route('/api', name: 'api_custom_')]
class AnimalRelationController extends AbstractController
{
    #[Route('/animal_countries', name: 'animal_countries_list', methods: ['GET'])]
    public function listCountries(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $countryCode = $request->query->get('country');
        $animalId = $request->query->get('animal');
        $conn = $em->getConnection();

        if ($animalId) {
            $sql = "
                SELECT DISTINCT
                    ac.origin, ac.presence_type, 
                    a.id as animal_id, a.common_name, a.scientific_name, a.extinct_level, a.family, a.image,
                    c.code_iso, c.country_name
                FROM animal_country ac
                JOIN animal a ON ac.animal_id = a.id
                JOIN country c ON ac.code_iso = c.code_iso
                WHERE a.id = ?
            ";
            $params = [$animalId];
        } elseif ($countryCode) {
            $sql = "
                SELECT 
                    ac.origin, ac.presence_type, 
                    a.id as animal_id, a.common_name, a.scientific_name, a.extinct_level, a.family, a.image,
                    c.code_iso, c.country_name, e.environment_id, e.environment_name, e.environment_type
                FROM animal_country ac
                JOIN animal a ON ac.animal_id = a.id
                JOIN animal_environment ae ON a.id = ae.animal_id
                JOIN environment e ON ae.environment_id = e.environment_id
                JOIN country c ON ac.code_iso = c.code_iso
                WHERE ac.code_iso = ?
                LIMIT 30
            ";
            $params = [$countryCode];
        } else {
            $sql = "
                SELECT 
                    ac.origin, ac.presence_type, 
                    a.id as animal_id, a.common_name, a.scientific_name, a.extinct_level, a.family, a.image,
                    c.code_iso, c.country_name, e.environment_id, e.environment_name, e.environment_type
                FROM animal_country ac
                JOIN animal a ON ac.animal_id = a.id
                JOIN animal_environment ae ON a.id = ae.animal_id
                JOIN environment e ON ae.environment_id = e.environment_id
                JOIN country c ON ac.code_iso = c.code_iso
                ORDER BY RAND()
                LIMIT 150
            ";
            $params = [];
        }

        try {
            // Utilisation directe de executeQuery sur la connexion
            $resultSet = $conn->executeQuery($sql, $params);
            $rows = $resultSet->fetchAllAssociative();

            $data = array_map(function ($row) {
                $images = [];
                if (isset($row['image']) && $row['image']) {
                    $decoded = json_decode($row['image'], true);
                    $images = (json_last_error() === JSON_ERROR_NONE) ? $decoded : [$row['image']];
                }

                $item = [
                    'animal' => [
                        'id' => $row['animal_id'],
                        'commonName' => $this->cleanUtf8($row['common_name']),
                        'scientificName' => $this->cleanUtf8($row['scientific_name']),
                        'extinctLevel' => $row['extinct_level'],
                        'images' => $images,
                        'family' => $this->cleanUtf8($row['family']),
                    ],
                    'country' => [
                        'codeIso' => $row['code_iso'],
                        'countryName' => $this->cleanUtf8($row['country_name']),
                    ],
                    'origin' => $this->cleanUtf8($row['origin']),
                    'presenceType' => $this->cleanUtf8($row['presence_type']),
                ];

                if (isset($row['environment_id'])) {
                    $item['environment'] = [
                        'environmentId' => $row['environment_id'],
                        'environmentName' => $this->cleanUtf8($row['environment_name']),
                        'environmentType' => $this->cleanUtf8($row['environment_type']),
                    ];
                }

                return $item;
            }, $rows);

            return new JsonResponse($data);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    private function cleanUtf8(?string $str): ?string
    {
        if ($str === null) return null;
        return mb_convert_encoding($str, 'UTF-8', 'UTF-8');
    }

    #[Route('/animal_environments', name: 'animal_environments_list', methods: ['GET'])]
    public function listEnvironments(Request $request, AnimalEnvironmentRepository $repo): JsonResponse
    {
        $animalId = $request->query->get('animal');
        $list = $animalId ? $repo->findBy(['animal' => $animalId]) : $repo->findAll();

        $data = [];
        foreach ($list as $item) {
            if (!$item->getAnimal() || !$item->getEnvironment()) continue;
            $data[] = [
                'animal' => ['id' => $item->getAnimal()->getId()],
                'environment' => [
                    'environmentId' => $item->getEnvironment()->getEnvironmentId(),
                    'environmentName' => $item->getEnvironment()->getEnvironmentName(),
                    'environmentType' => $item->getEnvironment()->getEnvironmentType(),
                ],
            ];
        }
        return $this->json($data);
    }

    #[Route('/animalCountries/{keyword}', name: 'animal_countries_search', methods: ['GET'])]
    public function getCountriesByAnimal(string $keyword, AnimalCountryRepository $animalCountryRepository): JsonResponse
    {
        $countries = $animalCountryRepository->createQueryBuilder('ac')
            ->join('ac.animal', 'a')
            ->join('ac.country', 'c')
            ->andWhere('a.id LIKE :keyword')
            ->setParameter('keyword', $keyword . '%')
            ->select('c.codeIso AS codeIso, c.countryName AS countryName, ac.origin AS origin, ac.presenceType AS presenceType')
            ->getQuery()
            ->getArrayResult();
        try {
            return new JsonResponse($countries);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/animalEnvironments/{keyword}', name: 'animal_environments_search', methods: ['GET'])]
    public function getEnvironmentsByAnimal(string $keyword, AnimalEnvironmentRepository $animalEnvironmentRepository): JsonResponse
    {
        $environments = $animalEnvironmentRepository->createQueryBuilder('ae')
            ->join('ae.animal', 'a')
            ->join('ae.environment', 'e')
            ->andWhere('a.id LIKE :keyword')
            ->setParameter('keyword', $keyword . '%')
            ->select('e.environmentId AS environmentId, e.environmentName AS environmentName, e.environmentType AS environmentType')
            ->getQuery()
            ->getArrayResult();
        try {
            return new JsonResponse($environments);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
