<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiProperty;

/**
 * RecipeIngredient
 */
#[ORM\Entity]
#[ORM\Table(name: "seasonality_score")]
#[ORM\Index(name: "FK_recipe_seasonality_score", columns: ["recipe_id"])]
class SeasonalityScore
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\Column(name: "seasonality_score_id", type: "integer", nullable: false)]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ApiProperty(identifier: true)]
    private $seasonalityScoreId;

    /**
     * @var int|null
     */
    #[ORM\Column(name: "month", type: "integer", length: 2, nullable: true)]
    private $month;

    /**
     * @var string|null
     */
    #[ORM\Column(name: "separator_label", type: "decimal", precision: 5, scale: 2, nullable: true)]
    private $score;

    /**
     * @var \App\Entity\Recipe
     */
    #[ORM\ManyToOne(targetEntity: "Recipe", inversedBy: "seasonalityScores")]
    #[ORM\JoinColumn(name: "recipe_id", referencedColumnName: "recipe_id")]
    private $recipe;

    public function getSeasonalityScoreId(): ?int
    {
        return $this->seasonalityScoreId;
    }

    public function getMonth(): ?int
    {
        return $this->month;
    }

    public function setMonth(?int $month): self
    {
        $this->month = $month;

        return $this;
    }

    public function getScore(): ?string
    {
        return $this->score;
    }

    public function setScore(?string $score): self
    {
        $this->score = $score;

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
