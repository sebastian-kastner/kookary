<?php

namespace App\Entity;

use App\Controller\CreateUserAction;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     normalizationContext={"groups"={"read"}},
 *     denormalizationContext={"groups"={"write"}},
 *     collectionOperations={
 *         "get"
 *     },
 *     itemOperations={
 *         "get",
 *         "put"={"access_control"="is_granted('ROLE_ADMIN')"},
 *         "patch"={"access_control"="is_granted('ROLE_ADMIN)"},
 *         "delete"={"access_control"="is_granted('ROLE_ADMIN')"},
 *     }
 * )
 * 
 * @ORM\Entity()
 */
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    const ROLE_ADMIN = "ROLE_ADMIN";
    const ROLE_USER = "ROLE_USER";

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @Groups({"read", "write"})
     * @ORM\Column(type="integer", nullable=false)
     */
    private $id;

    /**
     * @Groups({"read", "write"})
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @Groups({"read", "write"})
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $displayname;

    /**
     * @Groups({"read", "write"})
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Groups({"write"})
     */
    private $password;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getDisplayName(): ?string
    {
        return $this->displayname;
    }
    public function setDisplayName(string $displayname): self
    {
        $this->displayname = $displayname;
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
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    public function getUsername(): string
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
        $roles[] = self::ROLE_USER;

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function hasRole($role): bool {
        return in_array($role, $this->roles);
    }

    /**
     * This method can be removed in Symfony 6.0 - is not needed for apps that do not check user passwords.
     *
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }
    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    /**
     * This method can be removed in Symfony 6.0 - is not needed for apps that do not check user passwords.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
}
