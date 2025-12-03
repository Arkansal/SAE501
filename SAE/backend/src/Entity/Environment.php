<?php

namespace App\Entity;

use App\Repository\EnvironmentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EnvironmentRepository::class)]
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
    private ?string $environmentId = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Environment name cannot be blank')]
    #[Assert\Length(
        max: 100,
        maxMessage: 'Environment name cannot be longer than {{ limit }} characters'
    )]
    private ?string $environmentName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(
        max: 255,
        maxMessage: 'Environment type cannot be longer than {{ limit }} characters'
    )]
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
