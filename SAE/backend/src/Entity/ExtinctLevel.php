<?php

namespace App\Entity;

use App\Repository\ExtinctLevelRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ExtinctLevelRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['extinct_level:read']]),
        new GetCollection(normalizationContext: ['groups' => ['extinct_level:read']]),
        new Post(
            denormalizationContext: ['groups' => ['extinct_level:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Put(
            denormalizationContext: ['groups' => ['extinct_level:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    paginationEnabled: false
)]
class ExtinctLevel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['extinct_level:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 2)]
    #[Groups(['extinct_level:read', 'extinct_level:write'])]
    private ?string $extinctLevel = null;

    #[ORM\Column(length: 255)]
    #[Groups(['extinct_level:read', 'extinct_level:write'])]
    private ?string $levelName = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['extinct_level:read', 'extinct_level:write'])]
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getExtinctLevel(): ?string
    {
        return $this->extinctLevel;
    }

    public function setExtinctLevel(string $extinctLevel): static
    {
        $this->extinctLevel = $extinctLevel;

        return $this;
    }

    public function getLevelName(): ?string
    {
        return $this->levelName;
    }

    public function setLevelName(string $levelName): static
    {
        $this->levelName = $levelName;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }
}
