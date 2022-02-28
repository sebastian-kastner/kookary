<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RecipeIngredient
 *
 * @ORM\Table(name="recipe_ingredient", indexes={@ORM\Index(name="recipe_ingredient_FK", columns={"recipe_id"}), @ORM\Index(name="recipe_ingredient_FK_1", columns={"ingredient_id"})})
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
     * @var \App\Entity\Recipe
     *
     * @ORM\ManyToOne(targetEntity="Recipe")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="recipe_id", referencedColumnName="recipe_id")
     * })
     */
    private $recipe;

    /**
     * @var \App\Entity\Ingredient
     *
     * @ORM\ManyToOne(targetEntity="Ingredient")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="ingredient_id", referencedColumnName="ingredient_id")
     * })
     */
    private $ingredient;

    public function getRecipeIngredientId(): ?int
    {
        return $this->recipeIngredientId;
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

    public function getRecipe(): ?Recipe
    {
        return $this->recipe;
    }

    public function setRecipe(?Recipe $recipe): self
    {
        $this->recipe = $recipe;

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


}
