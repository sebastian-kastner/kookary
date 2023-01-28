<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * UserRecipeFavourites
 */
#[ORM\Entity]
#[ORM\Table(name: "user_recipe_favourites")]
#[ORM\Index(name: "user_recipe_favourites_FK_1", columns: ["recipe_id"])]
#[ORM\Index(name: "user_recipe_favourites_FK", columns: ["user_id"])]

#[ApiResource(
    attributes: [ "pagination_enabled" => false ],
    collectionOperations: [
        "get" => ["security" => "is_granted('ROLE_USER')"],
        "post" => ["security" => "is_granted('ROLE_USER')"],
    ],
    itemOperations: [
        "get" => ["security" => "is_granted('ROLE_USER')"],
        "delete" => ["security" => "is_granted('ROLE_ADMIN') or object.user == user"],
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['user' => 'exact', 'recipe' => 'exact'])]
class UserRecipeFavourites
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\Column(name: "user_recipe_favourite_id", type: "integer", nullable: false)]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ApiProperty(identifier: true)]
    private $userRecipeFavouriteId;

    /**
     * @var User
     */
    #[ORM\ManyToOne(targetEntity: "User")]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id")]
    public $user;

    #[ORM\ManyToOne(targetEntity: "Recipe")]
    #[ORM\JoinColumn(name: "recipe_id", referencedColumnName: "recipe_id")]
    private $recipe;

    public function getUserRecipeFavouriteId(): ?int
    {
        return $this->userRecipeFavouriteId;
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