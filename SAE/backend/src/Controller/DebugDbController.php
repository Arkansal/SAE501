<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;

class DebugDbController extends AbstractController
{
    #[Route('/api/debug/db_structure', name: 'debug_db_structure', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $conn = $em->getConnection();
        $sm = $conn->createSchemaManager();
        $tables = $sm->listTableNames();
        
        $structure = [];
        foreach ($tables as $table) {
            $columns = $sm->listTableColumns($table);
            $cols = [];
            foreach ($columns as $column) {
                // Compatible DBAL < 4 et > 2
                $cols[] = $column->getName();
            }
            $structure[$table] = $cols;
        }

        return $this->json($structure);
    }
}
