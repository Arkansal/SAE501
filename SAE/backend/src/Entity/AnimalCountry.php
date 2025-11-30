<?php

namespace App\Entity;

use App\Repository\AnimalCountryRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnimalCountryRepository::class)]
class AnimalCountry
{
    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'animal_id', referencedColumnName: 'id', nullable: false)]
    private ?Animal $animal = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'code_iso', referencedColumnName: 'code_iso', nullable: false)]
    private ?Country $country = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $origin = null;

    #[ORM\Column(length: 50, nullable: true)]
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
