<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * Cookup
 */
#[ORM\Entity]
#[ORM\Table(name: "cookup")]
#[ORM\Index(name: "FK_cookup_user", columns: ["user_id"])]
#[ORM\Index(name: "FK_cookup_recipe", columns: ["recipe_id"])]
#[ApiResource(
    attributes: [ "pagination_enabled" => false ],
    collectionOperations: [
        "get",
        "post" => ["security" => "is_granted('ROLE_USER')"],
    ],
    itemOperations: [
        "get",
        "put" => ["security" => "is_granted('ROLE_ADMIN') or object.author == user"],
        "patch" => ["security" => "is_granted('ROLE_ADMIN') or object.author == user"],
        "delete" => ["security" => "is_granted('ROLE_ADMIN') or object.author == user"],
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['user' => 'exact', 'recipe' => 'exact'])]
class Cookup
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\Column(name: "cookup_id", type: "integer", nullable: false)]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ApiProperty(identifier: true)]
    private $cookupId;

    /**
     * @var \App\Entity\User
     */
    #[ORM\ManyToOne(targetEntity: "User")]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id", nullable: false)]
    public $user;

    /**
     * @var \App\Entity\Recipe
     */
    #[ORM\ManyToOne(targetEntity: "Recipe", inversedBy: "cookups")]
    #[ORM\JoinColumn(name: "recipe_id", referencedColumnName: "recipe_id", nullable: false)]
    public $recipe;

    /**
     * @var \DateTime
     */
    #[ORM\Column(name: "date_added", type: "datetime", nullable: false)]
    public $date;

    public function getCookupId(): ?int
    {
        return $this->cookupId;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getRecipe(): ?Recipe
    {
        return $this->recipe;
    }

    public function setRecipe(?Recipe $recipe): self
    {
        $this->recipe = $recipe;

        return $this;
    }

}