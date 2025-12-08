<?php

namespace App\Entity;

use App\Repository\AnimalEnvironmentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AnimalEnvironmentRepository::class)]
class AnimalEnvironment
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
    #[ORM\JoinColumn(name: 'environment_id', referencedColumnName: 'environment_id', nullable: false)]
    #[Assert\NotNull(message: 'Environment cannot be null')]
    #[Assert\Type(
        type: 'App\Entity\Environment',
        message: 'Environment must be of type Environment entity'
    )]
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
