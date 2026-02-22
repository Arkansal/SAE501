<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['article:read']]),
        new GetCollection(normalizationContext: ['groups' => ['article:read']]),
        new Post(
            denormalizationContext: ['groups' => ['article:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Put(
            denormalizationContext: ['groups' => ['article:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    order: ['date' => 'DESC']
)]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $image = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(['article:read', 'article:write'])]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $author = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $content = null;

    /**
     * @var Collection<int, FavoriteArticle>
     */
    #[ORM\OneToMany(targetEntity: FavoriteArticle::class, mappedBy: 'article')]
    private Collection $favoriteArticles;

    public function __construct()
    {
        $this->favoriteArticles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): static
    {
        $this->image = $image;
        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): static
    {
        $this->author = $author;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;
        return $this;
    }

    /**
     * @return Collection<int, FavoriteArticle>
     */
    public function getFavoriteArticles(): Collection
    {
        return $this->favoriteArticles;
    }

    public function addFavoriteArticle(FavoriteArticle $favoriteArticle): static
    {
        if (!$this->favoriteArticles->contains($favoriteArticle)) {
            $this->favoriteArticles->add($favoriteArticle);
            $favoriteArticle->setArticle($this);
        }

        return $this;
    }

    public function removeFavoriteArticle(FavoriteArticle $favoriteArticle): static
    {
        if ($this->favoriteArticles->removeElement($favoriteArticle)) {
            if ($favoriteArticle->getArticle() === $this) {
                $favoriteArticle->setArticle(null);
            }
        }

        return $this;
    }
}