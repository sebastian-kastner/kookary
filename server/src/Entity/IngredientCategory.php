<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;

/**
 * IngredientCategory
 */
#[ORM\Entity]
#[ORM\Table(name: "ingredient_category")]
#[UniqueConstraint(name: "name", columns: ["name"])]
#[ApiResource(
    attributes: [ "pagination_enabled" => false ],
    collectionOperations: [
        "get",
        "post" => ["security" => "is_granted('ROLE_ADMIN')"],
    ],
    itemOperations: [
        "get",
        "put" => ["security" => "is_granted('ROLE_ADMIN')"],
        "patch" => ["security" => "is_granted('ROLE_ADMIN')"],
        "delete" => ["security" => "is_granted('ROLE_ADMIN')"],
    ]
)]
class IngredientCategory
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\Column(name: "ingredient_category_id", type: "integer", nullable: false)]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ApiProperty(identifier: true)]
    private $categoryId;

    /**
     * @var string
     */
    #[ORM\Column(name: "name", type: "string", length: 100, nullable: false)]
    private $name;

    /**
     * @var int
     */
    #[ORM\Column(name: "order", type: "integer", length: 2, nullable: false)]
    private $order;

    /**
     * @var boolean
     */
    #[ORM\Column(name: "is_default_category", type: "boolean", nullable: true)]
    private $isDefaultCategory;

    public function __construct()
    {
    }

    public function getCategoryId(): ?int
    {
        return $this->categoryId;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getOrder(): ?int
    {
        return $this->order;
    }

    public function setOrder(int $order): self
    {
        $this->order = $order;

        return $this;
    }

    public function isIsDefaultCategory(): ?bool
    {
        return $this->isDefaultCategory;
    }

    public function setIsDefaultCategory(?bool $isDefaultCategory): self
    {
        $this->isDefaultCategory = $isDefaultCategory;

        return $this;
    }
}