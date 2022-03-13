<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Filter\RecipeWithIngredientFilter;

/**
 * Recipe
 *
 * @ORM\Table(name="recipe")
 * @ORM\Entity
 * @ApiResource()
 * @ApiFilter(SearchFilter::class, properties={"name": "partial"})
 * @ApiFilter(RecipeWithIngredientFilter::class, properties={"with_ingredient": "with_ingredient"})
 */
class Recipe
{
    /**
     * @var int
     *
     * @ORM\Column(name="recipe_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $recipeId;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=100, nullable=false)
     */
    private $name;

    /**
     * @var string|null
     *
     * @ORM\Column(name="description", type="text", length=65535, nullable=true)
     */
    private $description;

    /**
     * @var int|null
     *
     * @ORM\Column(name="servings", type="integer", nullable=true)
     */
    private $servings;

    /**
     * @var string|null
     *
     * @ORM\Column(name="source", type="string", length=250, nullable=true)
     */
    private $source;

    /**
     * @var int|null
     *
     * @ORM\Column(name="rating", type="integer", nullable=true)
     */
    private $rating;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="date_added", type="datetime", nullable=true)
     */
    private $dateAdded;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Image", mappedBy="recipe")
     */
    private $image;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Tag", mappedBy="recipe")
     */
    private $tag;

    /**
      * @var \App\Entity\RecipeIngredient
      *
      * @ORM\OneToMany(targetEntity="RecipeIngredient", mappedBy="recipe", cascade={"persist"})
      */
      private $ingredients;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->image = new ArrayCollection();
        $this->tag = new ArrayCollection();
        $this->ingredients = new ArrayCollection();
        $this->dateAdded = new DateTime();
    }

    public function getRecipeId(): ?int
    {
        return $this->recipeId;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getServings(): ?int
    {
        return $this->servings;
    }

    public function setServings(?int $servings): self
    {
        $this->servings = $servings;

        return $this;
    }

    public function getSource(): ?string
    {
        return $this->source;
    }

    public function setSource(?string $source): self
    {
        $this->source = $source;

        return $this;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(?int $rating): self
    {
        $this->rating = $rating;

        return $this;
    }

    public function getDateAdded(): ?\DateTimeInterface
    {
        return $this->dateAdded;
    }

    public function setDateAdded(?\DateTimeInterface $dateAdded): self
    {
        $this->dateAdded = $dateAdded;

        return $this;
    }

    /**
     * @return Collection<int, Image>
     */
    public function getImage(): Collection
    {
        return $this->image;
    }

    public function addImage(Image $image): self
    {
        if (!$this->image->contains($image)) {
            $this->image[] = $image;
            $image->addRecipe($this);
        }

        return $this;
    }

    public function removeImage(Image $image): self
    {
        if ($this->image->removeElement($image)) {
            $image->removeRecipe($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Tag>
     */
    public function getTag(): Collection
    {
        return $this->tag;
    }

    public function addTag(Tag $tag): self
    {
        if (!$this->tag->contains($tag)) {
            $this->tag[] = $tag;
            $tag->addRecipe($this);
        }

        return $this;
    }

    public function removeTag(Tag $tag): self
    {
        if ($this->tag->removeElement($tag)) {
            $tag->removeRecipe($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, RecipeIngredient>
     */
    public function getIngredients(): Collection
    {
        return $this->ingredients;
    }

    public function addIngredient(RecipeIngredient $ingredient): self
    {
        if (!$this->ingredients->contains($ingredient)) {
            $this->ingredients[] = $ingredient;
            $ingredient->setRecipe($this);
        }

        return $this;
    }

    public function removeIngredient(RecipeIngredient $ingredient): self
    {
        if ($this->ingredients->removeElement($ingredient)) {
            // set the owning side to null (unless already changed)
            if ($ingredient->getRecipe() === $this) {
                $ingredient->setRecipe(null);
            }
        }

        return $this;
    }

}
