<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * Ingredient
 *
 * @ORM\Table(name="ingredient")
 * @ORM\Entity
 * @ApiFilter(SearchFilter::class, properties={"name": "partial"})
 * @ApiResource(attributes={"pagination_enabled"=false})
 */
class Ingredient
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
     * @var int|null
     *
     * @ORM\Column(name="season_start", type="integer", nullable=true)
     */
    private $seasonStart;

    /**
     * @var int|null
     *
     * @ORM\Column(name="season_end", type="integer", nullable=true)
     */
    private $seasonEnd;

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


}
