<?php

namespace App\Entity;

use App\Repository\AnimalRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AnimalRepository::class)]
class Animal
{
    #[ORM\Id]
    #[ORM\Column]
    #[Assert\NotBlank(message: 'ID cannot be blank')]
    #[Assert\Positive(message: 'ID must be a positive integer')]
    #[Assert\Type(
        type: 'integer',
        message: 'ID must be of type integer'
    )]
    private ?int $id = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Common name must be at least {{ limit }} characters long',
        maxMessage: 'Common name cannot be longer than {{ limit }} characters'
    )]
    #[Assert\Regex(
        pattern: '/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']+$/',
        message: 'Common name can only contain letters, spaces, hyphens, and apostrophes'
    )]
    private ?string $commonName = null;

    #[ORM\Column(length: 200)]
    #[Assert\NotBlank(message: 'Scientific name cannot be blank')]
    #[Assert\Length(
        min: 2,
        max: 200,
        minMessage: 'Scientific name must be at least {{ limit }} characters long',
        maxMessage: 'Scientific name cannot be longer than {{ limit }} characters'
    )]
    #[Assert\Regex(
        pattern: "/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']+$/",
        message: "Le nom scientifique contient des caractères invalides"
    )]
    private ?string $scientificName = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Assert\Length(max: 100)]
    #[Assert\Regex(
        pattern: "/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']+$/",
        message: "La famille contient des caractères invalides"
    )]
    private ?string $family = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Assert\Length(max: 100)]
    private ?string $type = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Assert\Type(type: 'array', message: "Les images doivent être un tableau")]
    private ?array $image = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: "Le niveau d'extinction est obligatoire")]
    #[Assert\Choice(
        choices: ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD'],
        message: "Le niveau d'extinction doit être l'un des suivants : {{ choices }}"
    )]
    private ?string $extinctLevel = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getCommonName(): ?string
    {
        return $this->commonName;
    }

    public function setCommonName(?string $commonName): static
    {
        $this->commonName = $commonName;

        return $this;
    }

    public function getScientificName(): ?string
    {
        return $this->scientificName;
    }

    public function setScientificName(string $scientificName): static
    {
        $this->scientificName = $scientificName;

        return $this;
    }

    public function getFamily(): ?string
    {
        return $this->family;
    }

    public function setFamily(?string $family): static
    {
        $this->family = $family;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;

        return $this;
    }


    public function getImage(): ?array
    {
        return $this->image;
    }

    public function setImage(?array $image): static
    {
        $this->image = $image;
        return $this;
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
}
