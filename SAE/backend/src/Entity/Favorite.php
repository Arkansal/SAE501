<?php

namespace App\Entity;

use App\Repository\FavoriteRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FavoriteRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(normalizationContext: ['groups' => ['favorite:read']]),
        new Get(
            normalizationContext: ['groups' => ['favorite:read']],
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            denormalizationContext: ['groups' => ['favorite:write']],
            security: "is_granted('ROLE_USER')"
        ),
        new Delete(
            security: "is_granted('ROLE_USER')"
        )
    ],
    paginationEnabled: false
)]
#[ApiFilter(SearchFilter::class, properties: ['animal' => 'exact', 'user' => 'exact'])]
class Favorite
{
    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'animal_id', referencedColumnName: 'id', nullable: false)]
    #[Assert\NotNull(message: 'Animal cannot be null')]
    #[Groups(['favorite:read', 'favorite:write'])]
    #[ApiProperty(identifier: true)]
    private ?Animal $animal = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false)]
    #[Assert\NotNull(message: 'User cannot be null')]
    #[Groups(['favorite:read', 'favorite:write'])]
    #[ApiProperty(identifier: true)]
    private ?User $user = null;

    public function getId(): ?string
    {
        if ($this->animal === null || $this->user === null) {
            return null;
        }
        return sprintf('%s-%s', $this->animal->getId(), $this->user->getId());
    }

    public function getAnimal(): ?Animal
    {
        return $this->animal;
    }

    public function setAnimal(?Animal $animal): static
    {
        $this->animal = $animal;

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
