<?php

namespace App\Entity;

use App\Repository\AnimalEnvironmentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnimalEnvironmentRepository::class)]
class AnimalEnvironment
{

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'animal_id', referencedColumnName: 'id', nullable: false)]
    private ?Animal $animal = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'environment_id', referencedColumnName: 'environment_id', nullable: false)]
    private ?Environment $environment = null;

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
