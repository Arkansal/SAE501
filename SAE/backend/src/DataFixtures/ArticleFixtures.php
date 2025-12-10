<?php
// src/DataFixtures/ArticleFixtures.php
namespace App\DataFixtures;

use App\Entity\Article;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ArticleFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $articlesData = [
            [
                'title' => "Ils refusent d'abandonner : des bénévoles font de la ventes de chocolat pour...",
                'image' => "http://inaturalist-open-data.s3.amazonaws.com/photos/219428475/medium.jpg",
                'date' => new \DateTimeImmutable('2025-12-09'),
                'author' => "Marie Dubois",
                'content' => "<p>Dans un petit village de Normandie...</p>",
            ],
            [
                'title' => "La biodiversité marine en danger : nouvelles mesures de protection",
                'image' => "http://inaturalist-open-data.s3.amazonaws.com/photos/111432589/medium.jpeg",
                'date' => new \DateTimeImmutable('2025-12-08'),
                'author' => "Pierre Martin",
                'content' => "<p>Face à la détérioration rapide des écosystèmes marins...</p>",
            ],
            [
                'title' => "Des espèces rares découvertes dans la forêt amazonienne",
                'image' => "http://inaturalist-open-data.s3.amazonaws.com/photos/160126381/medium.jpeg",
                'date' => new \DateTimeImmutable('2025-12-07'),
                'author' => "Lucas Bernard",
                'content' => "<p>Une expédition scientifique menée dans une zone reculée de l'Amazonie...</p>",
            ],
        ];

        foreach ($articlesData as $data) {
            $article = new Article();
            $article->setTitle($data['title']);
            $article->setImage($data['image']);
            $article->setDate(($data['date']));
            $article->setAuthor($data['author']);
            $article->setContent($data['content']);

            $manager->persist($article);
        }

        $manager->flush();
    }
}
