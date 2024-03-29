<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * Ingredient
 */
#[ORM\Entity]
#[ORM\Table(name: "ingredient")]
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
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial'])]
class Ingredient
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\Column(name: "ingredient_id", type: "integer", nullable: false)]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ApiProperty(identifier: true)]
    private $ingredientId;

    /**
     * @var string
     */
    #[ORM\Column(name: "name", type: "string", length: 50, nullable: false, unique: true)]
    private $name;

    /**
     * @var int|null
     */
    #[ORM\Column(name: "season_start", type: "integer", nullable: true)]
    private $seasonStart;

    /**
     * @var int|null
     */
    #[ORM\Column(name: "season_end", type: "integer", nullable: true)]
    private $seasonEnd;

    /**
     * @var User
     */
    #[ORM\ManyToOne(targetEntity: "User")]
    #[ORM\JoinColumn(name: "author_id", referencedColumnName: "id", nullable: false)]
    public $author;

    /**
     * @var IngredientCategory
     */
    #[ORM\JoinColumn(name: "ingredient_category_id", referencedColumnName: "ingredient_category_id", nullable: true)]
    #[ORM\ManyToOne(targetEntity: "IngredientCategory")]
    public $category;

    public function getIngredientId(): ?int
    {
        return $this->ingredientId;
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

    public function getSeasonStart(): ?int
    {
        return $this->seasonStart;
    }

    public function setSeasonStart(?int $seasonStart): self
    {
        $this->seasonStart = $seasonStart;

        return $this;
    }

    public function getSeasonEnd(): ?int
    {
        return $this->seasonEnd;
    }

    public function setSeasonEnd(?int $seasonEnd): self
    {
        $this->seasonEnd = $seasonEnd;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getCategory(): ?IngredientCategory
    {
        return $this->category;
    }

    public function setCategory(?IngredientCategory $category): self
    {
        $this->category = $category;

        return $this;
    }

}