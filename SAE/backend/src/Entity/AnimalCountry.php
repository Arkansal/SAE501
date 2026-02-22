<?php

namespace App\Entity;

use App\Repository\AnimalCountryRepository;
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

#[ORM\Entity(repositoryClass: AnimalCountryRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['animal_country:read']]),
        // GetCollection retiré car géré par AnimalRelationController
        new Post(
            denormalizationContext: ['groups' => ['animal_country:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    paginationEnabled: true,
    paginationClientEnabled: true
)]
#[ApiFilter(SearchFilter::class, properties: ['animal' => 'exact'])]
class AnimalCountry
{
    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'animal_id', referencedColumnName: 'id', nullable: false)]
    #[Assert\NotNull(message: 'Animal cannot be null')]
    #[Groups(['animal_country:read', 'animal_country:write'])]
    #[ApiProperty(identifier: true)]
    private ?Animal $animal = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'code_iso', referencedColumnName: 'code_iso', nullable: false)]
    #[Assert\NotNull(message: 'Country cannot be null')]
    #[Groups(['animal_country:read', 'animal_country:write'])]
    #[ApiProperty(identifier: true)]
    private ?Country $country = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Assert\Length(
        max: 50,
        maxMessage: 'Origin cannot be longer than {{ limit }} characters'
    )]
    #[Assert\Regex(
        pattern: '/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']*$/',
        message: 'Origin can only contain letters, spaces, hyphens, and apostrophes'
    )]
    #[Groups(['animal_country:read', 'animal_country:write'])]
    private ?string $origin = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Assert\Length(
        max: 50,
        maxMessage: 'Presence Type cannot be longer than {{ limit }} characters'
    )]
    #[Assert\Regex(
        pattern: '/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']*$/',
        message: 'Presence Type can only contain letters, spaces, hyphens, and apostrophes'
    )]
    #[Groups(['animal_country:read', 'animal_country:write'])]
    private ?string $presenceType = null;

    /**
     * Identifiant composite technique pour API Platform
     */
    public function getId(): ?string
    {
        if ($this->animal === null || $this->country === null) {
            return null;
        }
        return sprintf('%s-%s', $this->animal->getId(), $this->country->getCodeIso());
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

    public function getCountry(): ?Country
    {
        return $this->country;
    }

    public function setCountry(?Country $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getOrigin(): ?string
    {
        return $this->origin;
    }

    public function setOrigin(?string $origin): static
    {
        $this->origin = $origin;

        return $this;
    }

    public function getPresenceType(): ?string
    {
        return $this->presenceType;
    }

    public function setPresenceType(?string $presenceType): static
    {
        $this->presenceType = $presenceType;

        return $this;
    }
}
