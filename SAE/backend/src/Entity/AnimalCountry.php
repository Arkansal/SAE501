<?php

namespace App\Entity;

use App\Repository\AnimalCountryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AnimalCountryRepository::class)]
class AnimalCountry
{
    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'animal_id', referencedColumnName: 'id', nullable: false)]
    #[Assert\NotNull(message: 'Animal cannot be null')]
    #[Assert\Type(
        type: 'App\Entity\Animal',
        message: 'Animal must be of type Animal entity'
    )]
    private ?Animal $animal = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'code_iso', referencedColumnName: 'code_iso', nullable: false)]
    #[Assert\NotNull(message: 'Country cannot be null')]
    #[Assert\Type(
        type: 'App\Entity\Country',
        message: 'Country must be of type Country entity'
    )]
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
    private ?string $presenceType = null;

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
