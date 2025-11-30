<?php

namespace App\Entity;

use App\Repository\EnvironmentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EnvironmentRepository::class)]
class Environment
{
    #[ORM\Id]
    #[ORM\Column(type: 'string', length: 10)]
    private ?string $environmentId = null;

    #[ORM\Column(length: 50)]
    private ?string $environmentName = null;

    #[ORM\Column(length: 255, nullable: true)]
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
