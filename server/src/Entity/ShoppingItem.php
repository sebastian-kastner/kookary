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
#[ORM\Table(name: "shopping_item")]
#[ORM\Index(name: "FK_shopping_item_user", columns: ["user_id"])]
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
#[ApiFilter(SearchFilter::class, properties: ['user' => 'exact'])]
class ShoppingItem
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\Column(name: "shopping_item_id", type: "integer", nullable: false)]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ApiProperty(identifier: true)]
    private $shoppingItemId;

    /**
     * @var \App\Entity\User
     */
    #[ORM\ManyToOne(targetEntity: "User")]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id", nullable: false)]
    private $user;

    /**
     * @var \App\Entity\Ingredient
     */
    #[ORM\ManyToOne(targetEntity: "Ingredient")]
    #[ORM\JoinColumn(name: "ingredient_id", referencedColumnName: "ingredient_id", nullable: true)]
    private $ingredient;

    /**
     * @var string|null
     */
    #[ORM\Column(name: "unit", type: "string", length: 10, nullable: true)]
    private $unit;

    /**
     * @var string|null
     */
    #[ORM\Column(name: "quantity", type: "string", length: 10, nullable: true)]
    private $quantity;

    /**
     * @var boolean
     */
    #[ORM\Column(name: "done", type: "boolean", nullable: false)]
    private $done;


    public function getShoppingItemId(): ?int
    {
        return $this->shoppingItemId;
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

    public function isDone(): ?bool
    {
        return $this->done;
    }

    public function setDone(bool $done): self
    {
        $this->done = $done;

        return $this;
    }

    public function getIngredient(): ?Ingredient
    {
        return $this->ingredient;
    }

    public function setIngredient(?Ingredient $ingredient): self
    {
        $this->ingredient = $ingredient;

        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(?string $unit): self
    {
        $this->unit = $unit;

        return $this;
    }

    public function getQuantity(): ?string
    {
        return $this->quantity;
    }

    public function setQuantity(?string $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

}