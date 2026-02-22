<?php

namespace App\Entity;

use App\Repository\EnvironmentRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EnvironmentRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['environment:read']]),
        new GetCollection(normalizationContext: ['groups' => ['environment:read']]),
        new Post(
            denormalizationContext: ['groups' => ['environment:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Put(
            denormalizationContext: ['groups' => ['environment:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    paginationEnabled: false
)]
class Environment
{
    #[ORM\Id]
    #[ORM\Column(type: 'string', length: 10)]
    #[Assert\NotBlank(message: 'Environment ID cannot be blank')]
    #[Assert\Length(
        max: 10,
        maxMessage: 'Environment ID cannot be longer than {{ limit }} characters'
    )]
    #[Assert\Regex(
        pattern: '/^[0-9\-_]+$/',
        message: 'Environment ID can only contain numbers, hyphens, and underscores'
    )]
    #[Groups(['environment:read', 'environment:write'])]
    private ?string $environmentId = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Environment name cannot be blank')]
    #[Assert\Length(
        max: 100,
        maxMessage: 'Environment name cannot be longer than {{ limit }} characters'
    )]
    #[Groups(['environment:read', 'environment:write'])]
    private ?string $environmentName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(
        max: 255,
        maxMessage: 'Environment type cannot be longer than {{ limit }} characters'
    )]
    #[Groups(['environment:read', 'environment:write'])]
    private ?string $environmentType = null;

    public function getEnvironmentId(): ?string
    {
        return $this->environmentId;
    }

    public function setEnvironmentId(string $environmentId): static
    {
        $this->environmentId = $environmentId;
        return $this;
    }

    public function getEnvironmentName(): ?string
    {
        return $this->environmentName;
    }

    public function setEnvironmentName(string $environmentName): static
    {
        $this->environmentName = $environmentName;

        return $this;
    }

    public function getEnvironmentType(): ?string
    {
        return $this->environmentType;
    }

    public function setEnvironmentType(?string $environmentType): static
    {
        $this->environmentType = $environmentType;

        return $this;
    }
}
