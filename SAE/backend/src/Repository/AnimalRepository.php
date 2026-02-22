<?php

namespace App\Repository;

use App\Entity\Animal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Animal>
 */
class AnimalRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Animal::class);
    }

    /**
     * Find a random animal with valid image and extinction level
     */
    public function findRandomAnimalForGame(?string $preferredLevel = null): ?Animal
    {
        $conn = $this->getEntityManager()->getConnection();

        // 1. Si un niveau est demandé, on essaie de trouver un animal de ce niveau
        if ($preferredLevel) {
            $sql = "
                SELECT a.id
                FROM animal a
                INNER JOIN extinct_level el ON a.extinct_level = el.extinct_level
                WHERE a.image IS NOT NULL
                AND a.image != '[]'
                AND a.extinct_level = :level
                ORDER BY RAND()
                LIMIT 1
            ";

            $stmt = $conn->executeQuery($sql, ['level' => $preferredLevel]);
            $result = $stmt->fetchAssociative();

            if ($result) {
                return $this->find($result['id']);
            }
        }

        // 2. Fallback : Si pas de niveau demandé ou aucun animal trouvé pour ce niveau, on prend au hasard global
        $sql = "
            SELECT a.id
            FROM animal a
            INNER JOIN extinct_level el ON a.extinct_level = el.extinct_level
            WHERE a.image IS NOT NULL
            AND a.image != '[]'
            ORDER BY RAND()
            LIMIT 1
        ";

        $stmt = $conn->executeQuery($sql);
        $result = $stmt->fetchAssociative();

        if (!$result) {
            return null;
        }

        return $this->find($result['id']);
    }

    //    /**
    //     * @return Animal[] Returns an array of Animal objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Animal
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
