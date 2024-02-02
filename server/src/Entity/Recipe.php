<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;

use App\Filter\RecipeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Ignore;

/**
 * Recipe
 */
#[ORM\Entity]
#[ORM\Table(name: "recipe")]
#[ApiResource(
    attributes: [
        "pagination_enabled" => true,
        "pagination_items_per_page" => 18,
    ],
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
#[ApiFilter(RecipeFilter::class, properties: ['ingredients' => 'ingredients'])]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial' ])]
class Recipe
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\Column(name: "recipe_id", type: "integer", nullable: false)]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ApiProperty(identifier: true)]
    private $recipeId;

    /**
     * @var string
     */
    #[ORM\Column(name: "name", type: "string", length: 100, nullable: false)]
    private $name;

    /**
     * @var string|null
     */
    #[ORM\Column(name: "description", type: "text", length: 65535, nullable: true)]
    private $description;

    /**
     * @var int|null
     */
    #[ORM\Column(name: "servings", type: "integer", nullable: true)]
    private $servings = -1;

    /**
     * @var string|null
     */
    #[ORM\Column(name: "source", type: "string", length: 250, nullable: true)]
    private $source;

    /**
     * @var \DateTime|null
     */
    #[ORM\Column(name: "date_added", type: "datetime", nullable: true)]
    private $dateAdded;

    /**
     * @var \Doctrine\Common\Collections\Collection|Tag[]
     */
    #[ORM\ManyToMany(targetEntity: "Tag")]
    #[ORM\JoinTable(name: "tag_to_recipe")]
    #[ORM\JoinColumn(name: "recipe_id", referencedColumnName: "recipe_id")]
    #[ORM\InverseJoinColumn(name: "tag_id", referencedColumnName: "tag_id")]
    private $tags;

    /**
     * @var \Doctrine\Common\Collections\Collection|\App\Entity\RecipeIngredient[]
     */
    #[ORM\OneToMany(targetEntity: "RecipeIngredient", mappedBy: "recipe", cascade: ["all"])]
    private $ingredients;

     /**
     * @var \Doctrine\Common\Collections\Collection|\App\Entity\SeasonalityScore[]
     */
    #[ORM\OneToMany(targetEntity: "SeasonalityScore", mappedBy: "recipe", cascade: ["all"])]
    public $seasonalityScores;

    /**
     * @var \Doctrine\Common\Collections\Collection|MediaObject[]
     */
    #[ORM\ManyToMany(targetEntity: "MediaObject")] // cascade is handled in RecipePersister.php (and its terrible!)
    #[ORM\JoinTable(name: "image_to_recipe")]
    #[ORM\JoinColumn(name: "recipe_id", referencedColumnName: "recipe_id")]
    #[ORM\InverseJoinColumn(name: "media_object_id", referencedColumnName: "media_object_id")]
    public $images;

    /**
     * @var User
     */
    #[ORM\ManyToOne(targetEntity: "User")]
    #[ORM\JoinColumn(name: "author_id", referencedColumnName: "id", nullable: false)]
    public $author;

    /**
     * @var
     */
    #[ORM\OneToMany(targetEntity: "UserRecipeFavourites", mappedBy: "recipe", cascade: ["all"])]
    #[Ignore] // field is only added for cascades, dont include anywhere else
    public $markedBy;

    /**
     * @var UserRecipeFavourites
     */
    #[ORM\OneToMany(targetEntity: "Cookup", mappedBy: "recipe", cascade: ["all"])]
    #[Ignore] // field is only added for cascades, dont include anywhere else
    public $cookups;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
        $this->ingredients = new ArrayCollection();
        $this->images = new ArrayCollection();
        $this->dateAdded = new DateTime();
        $this->markedBy = new ArrayCollection();
        $this->cookups = new ArrayCollection();
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
