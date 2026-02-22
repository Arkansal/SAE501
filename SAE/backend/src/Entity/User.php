<?php

namespace App\Entity;

use App\Repository\UserRepository;
use App\State\UserPasswordHasherProcessor;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['user:read']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Post(
            denormalizationContext: ['groups' => ['user:create']],
            processor: UserPasswordHasherProcessor::class,
            validationContext: ['groups' => ['Default', 'user:create']],
            security: "is_granted('PUBLIC_ACCESS')"
        ),
        new Get(
            normalizationContext: ['groups' => ['user:read']],
            security: "is_granted('ROLE_ADMIN') or object == user"
        ),
        new Patch(
            normalizationContext: ['groups' => ['user:read']],
            denormalizationContext: ['groups' => ['user:update']],
            processor: UserPasswordHasherProcessor::class,
            security: "is_granted('ROLE_ADMIN') or object == user"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    paginationEnabled: true
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank(message: 'Email cannot be blank')]
    #[Assert\Email(message: 'The email {{ value }} is not a valid email.')]
    #[Assert\Length(
        max: 180,
        maxMessage: 'Email cannot be longer than {{ limit }} characters'
    )]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Assert\NotNull(message: 'Roles cannot be null')]
    #[Groups(['user:read'])]  // ⬅️ Read only ! Sinon privilege escalation
    private array $roles = ['ROLE_USER'];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;  // ⬅️ Plus de Groups ni de validations ici

    /**
     * Champ virtuel pour l'API - n'existe pas en base de données
     */
    #[Assert\NotBlank(groups: ['user:create'])]  // Obligatoire seulement à la création
    #[Assert\Length(
        min: 8,
        max: 255,
        minMessage: 'Password must be at least {{ limit }} characters long',
        maxMessage: 'Password cannot be longer than {{ limit }} characters',
        groups: ['user:create', 'user:update']
    )]
    #[Groups(['user:create', 'user:update'])]
    private ?string $plainPassword = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Assert\Length(
        max: 50,
        maxMessage: 'Pseudo cannot be longer than {{ limit }} characters'
    )]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    private ?string $pseudo = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    private ?string $language = 'fr';

    /**
     * @var Collection<int, FavoriteArticle>
     */
    #[ORM\OneToMany(targetEntity: FavoriteArticle::class, mappedBy: 'user')]
    private Collection $favoriteArticles;

    public function __construct()
    {
        $this->favoriteArticles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): static
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0" . self::class . "\0password"] = hash('crc32c', $this->password);

        return $data;
    }

    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(?string $pseudo): static
    {
        $this->pseudo = $pseudo;

        return $this;
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(?string $language): static
    {
        $this->language = $language;

        return $this;
    }

    /**
     * @return Collection<int, FavoriteArticle>
     */
    public function getFavoriteArticles(): Collection
    {
        return $this->favoriteArticles;
    }

    public function addFavoriteArticle(FavoriteArticle $favoriteArticle): static
    {
        if (!$this->favoriteArticles->contains($favoriteArticle)) {
            $this->favoriteArticles->add($favoriteArticle);
            $favoriteArticle->setUser($this);
        }

        return $this;
    }

    public function removeFavoriteArticle(FavoriteArticle $favoriteArticle): static
    {
        if ($this->favoriteArticles->removeElement($favoriteArticle)) {
            // set the owning side to null (unless already changed)
            if ($favoriteArticle->getUser() === $this) {
                $favoriteArticle->setUser(null);
            }
        }

        return $this;
    }
}
