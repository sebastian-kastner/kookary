<?php
namespace App\Filter;

use Exception;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;

use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Query\Expr\Join;

use Symfony\Component\PropertyInfo\Type;

use App\Entity\RecipeIngredient;
use Doctrine\DBAL\Query;
use App\Entity\Tag;

final class RecipeFilter extends AbstractContextAwareFilter
{
    const INGREDIENTS_FILTER_PROPERTY = "ingredients";
    const TAGS_FILTER_PROPERTY = "tags";
    const SEASONAL_FILTER_PROPERTY = "seasonal";

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        if ($value == "") {
            return;
        }

        if ($property == self::INGREDIENTS_FILTER_PROPERTY) {
            $this->addIngredientFilter($value, $queryBuilder);
        }
        else if ($property == self::TAGS_FILTER_PROPERTY) {
            $this->addTagFilter($value, $queryBuilder);
        }
        else if ($property == self::SEASONAL_FILTER_PROPERTY) {
            $this->addSeasonalFilter($value, $queryBuilder);
        }
    }

    private function addIngredientFilter(string $value, QueryBuilder $queryBuilder)
    {
        $recipeAlias = $this->getRecipeAlias($queryBuilder);
        $queryBuilder
            ->innerJoin(
                RecipeIngredient::class,
                "ri",
                Join::WITH,
                sprintf("%s.recipeId = ri.recipe", $recipeAlias)
            )
            ->andWhere(sprintf("ri.ingredient = %d", $value));
    }

    private function addTagFilter(string $value, QueryBuilder $queryBuilder)
    {
        $recipeAlias = $this->getRecipeAlias($queryBuilder);
        $queryBuilder
            ->addSelect("t")
            ->leftJoin(sprintf("%s.tag", $recipeAlias), "t")
            ->andWhere(sprintf("t = %s", $value));

        $query = $queryBuilder->getQuery();
        $query = null;
    }

    private function addSeasonalFilter(string $value, QueryBuilder $queryBuilder)
    {
    // TBD
    }

    private function getRecipeAlias(QueryBuilder $queryBuilder): string
    {
        $aliases = $queryBuilder->getRootAliases();
        if (count($aliases) != 1) {
            throw new Exception("Expected exactly one root alias for recipe, cannot handle anything else!");
        }
        return $aliases[0];
    }

    // This function is only used to hook in documentation generators (supported by Swagger and Hydra)
    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description[self::INGREDIENTS_FILTER_PROPERTY] = $this->createDescription(
                self::INGREDIENTS_FILTER_PROPERTY,
                'Filter for recipes with the specified tags.',
                Type::BUILTIN_TYPE_ITERABLE,
                $property,
            );
            $description[self::TAGS_FILTER_PROPERTY] = $this->createDescription(
                self::TAGS_FILTER_PROPERTY,
                'Filter for recipes with the specified tags.',
                Type::BUILTIN_TYPE_ITERABLE,
                $property,
            );
            $description[self::SEASONAL_FILTER_PROPERTY] = $this->createDescription(
                self::SEASONAL_FILTER_PROPERTY,
                'Filter for recipes containing seasonal ingredients',
                Type::BUILTIN_TYPE_BOOL,
                $property,
            );
        }

        return $description;
    }

    private function createDescription(string $name, string $description, string $type, $property): array
    {
        return [
            'property' => $property,
            'type' => $type,
            'required' => false,
            'swagger' => [
                'description' => $description,
                'name' => $name . " filter",
            ],
        ];
    }
}