<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * Ingredients
 *
 * @ORM\Table(name="ingredients")
 * @ORM\Entity
 * @ApiResource()
 */
class Ingredients
{
    /**
     * @var int
     *
     * @ORM\Column(name="ingredient_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $ingredientId;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=50, nullable=false)
     */
    private $name;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Recipes", inversedBy="ingredient")
     * @ORM\JoinTable(name="ingredients_to_recipes",
     *   joinColumns={
     *     @ORM\JoinColumn(name="ingredient_id", referencedColumnName="ingredient_id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="recipe_id", referencedColumnName="recipe_id")
     *   }
     * )
     */
    private $recipe;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->recipe = new \Doctrine\Common\Collections\ArrayCollection();
    }

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

    /**
     * @return Collection<int, Recipes>
     */
    public function getRecipe(): Collection
    {
        return $this->recipe;
    }

    public function addRecipe(Recipes $recipe): self
    {
        if (!$this->recipe->contains($recipe)) {
            $this->recipe[] = $recipe;
        }

        return $this;
    }

    public function removeRecipe(Recipes $recipe): self
    {
        $this->recipe->removeElement($recipe);

        return $this;
    }

}
