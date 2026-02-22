<?php

namespace App\Entity;

use App\Repository\CountryRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CountryRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['country:read']]),
        new GetCollection(normalizationContext: ['groups' => ['country:read']]),
        new Post(
            denormalizationContext: ['groups' => ['country:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Put(
            denormalizationContext: ['groups' => ['country:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    paginationEnabled: false
)]
class Country
{
    #[ORM\Id]
    #[ORM\Column(length: 2)]
    #[Assert\NotBlank(message: 'ISO code cannot be blank')]
    #[Assert\Length(
        exactMessage: 'ISO code must be exactly {{ limit }} characters long',
        min: 2,
        max: 2
    )]
    #[Assert\Regex(
        pattern: '/^[A-Z]{2}$/',
        message: 'ISO code must consist of exactly two uppercase letters'
    )]
    #[Groups(['country:read', 'country:write'])]
    private ?string $codeIso = null;

    #[ORM\Column(length: 50)]
    #[Assert\Length(
        max: 50,
        maxMessage: 'Country name cannot be longer than {{ limit }} characters'
    )]
    #[Assert\Regex(
        pattern: '/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']+$/',
        message: 'Country name can only contain letters, spaces, hyphens, and apostrophes'
    )]
    #[Groups(['country:read', 'country:write'])]
    private ?string $countryName = null;
    
    public function getCodeIso(): ?string
    {
        return $this->codeIso;
    }

    public function setCodeIso(string $codeIso): static
    {
        $this->codeIso = $codeIso;

        return $this;
    }

    public function getCountryName(): ?string
    {
        return $this->countryName;
    }

    public function setCountryName(string $countryName): static
    {
        $this->countryName = $countryName;

        return $this;
    }
}
