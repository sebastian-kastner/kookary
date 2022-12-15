<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * RecipeIngredient
 *
 * @ORM\Table(name="recipe_ingredient", indexes={@ORM\Index(name="FK_ingredient_recipe_ingredient", columns={"ingredient_id"}), @ORM\Index(name="FK_recipe_recipe_ingredient", columns={"recipe_id"})})
 * @ORM\Entity
 */
class RecipeIngredient
{
    /**
     * @var int
     *
     * @ORM\Column(name="recipe_ingredient_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $recipeIngredientId;

    /**
     * @var int|null
     *
     * @ORM\Column(name="position", type="integer", nullable=true)
     */
    private $position;

    /**
     * @var string|null
     *
     * @ORM\Column(name="quantity", type="string", length=10, nullable=true)
     */
    private $quantity;

    /**
     * @var string|null
     *
     * @ORM\Column(name="unit", type="string", length=10, nullable=true)
     */
    private $unit;

    /**
     * @var \App\Entity\Ingredient
     *
     * @ORM\ManyToOne(targetEntity="Ingredient")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="ingredient_id", referencedColumnName="ingredient_id")
     * })
     */
    private $ingredient;

    /**
     * @var \App\Entity\Recipe
     *
     * @ORM\ManyToOne(targetEntity="Recipe", inversedBy="ingredients"))
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="recipe_id", referencedColumnName="recipe_id")
     * })
     */
    private $recipe;

    public function getRecipeIngredientId(): ?int
    {
        return $this->recipeIngredientId;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(?int $position): self
    {
        $this->position = $position;

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

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(?string $unit): self
    {
        $this->unit = $unit;

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
