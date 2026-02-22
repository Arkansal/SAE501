<?php

namespace App\Entity;

use App\Repository\FavoriteArticleRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FavoriteArticleRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(normalizationContext: ['groups' => ['favorite_article:read']]),
        new Get(
            normalizationContext: ['groups' => ['favorite_article:read']],
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            denormalizationContext: ['groups' => ['favorite_article:write']],
            security: "is_granted('ROLE_USER')"
        ),
        new Delete(
            security: "is_granted('ROLE_USER')"
        )
    ],
    paginationEnabled: false
)]
class FavoriteArticle
{
    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'favoriteArticles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['favorite_article:read', 'favorite_article:write'])]
    #[ApiProperty(identifier: true)]
    private ?Article $article = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'favoriteArticles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['favorite_article:read', 'favorite_article:write'])]
    #[ApiProperty(identifier: true)]
    private ?User $user = null;

    public function getId(): ?string
    {
        if ($this->article === null || $this->user === null) {
            return null;
        }
        return sprintf('%s-%s', $this->article->getId(), $this->user->getId());
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): static
    {
        $this->article = $article;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}