<?php

namespace App\Entity;

use App\Repository\FavoriteArticleRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FavoriteArticleRepository::class)]
class FavoriteArticle
{
    #[ORM\ManyToOne(inversedBy: 'user_id')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Article $article_id = null;

    #[ORM\ManyToOne(inversedBy: 'favoriteArticles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user_id = null;

    public function getArticleId(): ?Article
    {
        return $this->article_id;
    }

    public function setArticleId(?Article $article_id): static
    {
        $this->article_id = $article_id;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }
}
