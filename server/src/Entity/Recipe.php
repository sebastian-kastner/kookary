<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;

use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

use App\Filter\RecipeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;

/**
 * Recipe
 *
  * @ApiResource(
 *     collectionOperations={
 *         "get",
 *         "post"={"access_control"="is_granted('ROLE_USER')"}
 *     },
 *     itemOperations={
 *         "get",
 *         "put"={"access_control"="is_granted('ROLE_ADMIN') or previous_object.author == user"},
 *         "patch"={"access_control"="is_granted('ROLE_ADMIN') or previous_object.author == user"},
 *         "delete"={"access_control"="is_granted('ROLE_ADMIN') or previous_object.author == user"},
 *     }
 * )
 * 
 * @ORM\Table(name="recipe", uniqueConstraints={@ORM\UniqueConstraint(name="name", columns={"name"})})
 * @ORM\Entity
 * 
 * @ApiFilter(RecipeFilter::class, properties={"ingredients":"ingredients"})
 * @ApiFilter(SearchFilter::class, properties={"name": "partial"})
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
     * @var bool|null
     *
     * @ORM\Column(name="marked", type="boolean", nullable=true)
     */
    private $marked = false;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="date_added", type="datetime", nullable=true)
     */
    private $dateAdded;

    /**
     * @var \Doctrine\Common\Collections\Collection|Tag[]
     *
     * @ORM\ManyToMany(targetEntity="Tag")
     * @ORM\JoinTable(
     *  name="tag_to_recipe",
     *  joinColumns={
     *      @ORM\JoinColumn(name="recipe_id", referencedColumnName="recipe_id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="tag_id", referencedColumnName="tag_id")
     *  }
     * )
     */
    private $tags;

    /**
     * @var \Doctrine\Common\Collections\Collection|\App\Entity\RecipeIngredient[]
     *
     * @ORM\OneToMany(targetEntity="RecipeIngredient", mappedBy="recipe", cascade={"all"})
     */
    private $ingredients;

    /**
     * @var \Doctrine\Common\Collections\Collection|MediaObject[]
     *
     * @ORM\ManyToMany(targetEntity="MediaObject")
     * @ORM\JoinTable(
     *  name="image_to_recipe",
     *  joinColumns={
     *      @ORM\JoinColumn(name="recipe_id", referencedColumnName="recipe_id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="media_object_id", referencedColumnName="media_object_id")
     *  }
     * )
     */
    public $images;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id", nullable=false)
     */
    public $author;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
        $this->ingredients = new ArrayCollection();
        $this->images = new ArrayCollection();
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

    public function isMarked(): ?bool
    {
        return $this->marked;
    }

    public function setMarked(?bool $marked): self
    {
        $this->marked = $marked;

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
     * @return Collection<int, Tag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): self
    {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
        }

        return $this;
    }

    public function removeTag(Tag $tag): self
    {
        $this->tags->removeElement($tag);

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

    /**
     * @return Collection<int, MediaObject>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(MediaObject $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images[] = $image;
        }

        return $this;
    }

    public function removeImage(MediaObject $image): self
    {
        $this->images->removeElement($image);

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

}
