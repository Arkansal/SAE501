<?php

namespace App\Entity;

use App\Repository\AnimalEnvironmentRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AnimalEnvironmentRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['animal_environment:read']]),
        // GetCollection retiré car géré par AnimalRelationController
        new Post(
            denormalizationContext: ['groups' => ['animal_environment:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    paginationEnabled: false
)]
#[ApiFilter(SearchFilter::class, properties: ['animal' => 'exact'])]
class AnimalEnvironment
{

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'animal_id', referencedColumnName: 'id', nullable: false)]
    #[Assert\NotNull(message: 'Animal cannot be null')]
    #[Groups(['animal_environment:read', 'animal_environment:write'])]
    #[ApiProperty(identifier: true)]
    private ?Animal $animal = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'environment_id', referencedColumnName: 'environment_id', nullable: false)]
    #[Assert\NotNull(message: 'Environment cannot be null')]
    #[Groups(['animal_environment:read', 'animal_environment:write'])]
    #[ApiProperty(identifier: true)]
    private ?Environment $environment = null;

    public function getId(): ?string
    {
        if ($this->animal === null || $this->environment === null) {
            return null;
        }
        return sprintf('%s-%s', $this->animal->getId(), $this->environment->getEnvironmentId());
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

    public function getEnvironment(): ?Environment
    {
        return $this->environment;
    }

    public function setEnvironment(?Environment $environment): static
    {
        $this->environment = $environment;

        return $this;
    }
}
