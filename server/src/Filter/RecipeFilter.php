<?php
namespace App\Filter;

use Exception;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;

use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Query\Expr\Join;

use Symfony\Component\PropertyInfo\Type;

use App\Entity\RecipeIngredient;
use App\Entity\Ingredient;
use App\Entity\Recipe;

final class RecipeFilter extends AbstractContextAwareFilter
{
    const INGREDIENTS_FILTER_PROPERTY = "ingredients";
    const TAGS_FILTER_PROPERTY = "tags";
    const SEASONAL_FILTER_PROPERTY = "seasonal";

    // for some reason doctrine autogenerates the "_a2" suffix that we need to add here to make things work
    const RECIPE_INGREDIENT_ALIAS = "ri_a2";
    const INGREDIENT_ALIAS = "i";
    const TAG_ALIAS = "t";

    protected function filterProperty(
        string $property, 
        $value, 
        QueryBuilder $queryBuilder, 
        QueryNameGeneratorInterface $queryNameGenerator, 
        string $resourceClass, 
        string $operationName = null)
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
        $this->joinRecipeIngredients($queryBuilder);
        $queryBuilder->andWhere(sprintf("%s.ingredient = %d", self::RECIPE_INGREDIENT_ALIAS, $value));
    }

    private function joinRecipeIngredients(QueryBuilder $queryBuilder)
    {
        $aliases = $queryBuilder->getAllAliases();
        if(!in_array(self::RECIPE_INGREDIENT_ALIAS, $aliases))
        {
            $recipeAlias = $this->getRecipeAlias($queryBuilder);
            $queryBuilder
                ->leftJoin(
                    RecipeIngredient::class,
                    self::RECIPE_INGREDIENT_ALIAS,
                    Join::WITH,
                    sprintf("%s.recipeId = %s.recipe", $recipeAlias, self::RECIPE_INGREDIENT_ALIAS)
                );
        }
    }

    private function addTagFilter(string $value, QueryBuilder $queryBuilder)
    {
        $recipeAlias = $this->getRecipeAlias($queryBuilder);
        $queryBuilder
            ->addSelect("t")
            ->leftJoin(sprintf("%s.tag", $recipeAlias), "t")
            ->andWhere(sprintf("t = %s", $value));
    }

    private function addSeasonalFilter(string $value, QueryBuilder $queryBuilder)
    {
        if($value == "true") {
            $aliases = $queryBuilder->getAllAliases();

            if(!in_array(self::INGREDIENT_ALIAS, $aliases))
            {
                $condition = str_replace("[alias]", self::INGREDIENT_ALIAS,
                    "([alias].seasonStart < [alias].seasonEnd AND :currentMonth >= [alias].seasonStart AND :currentMonth <= [alias].seasonEnd) OR ([alias].seasonStart > [alias].seasonEnd AND (:currentMonth >= [alias].seasonStart OR :currentMonth <= [alias].seasonEnd))");
                $this->joinRecipeIngredients($queryBuilder);
                
                // FIXME: this is the worst query in the world. The where is specified twice and I have no idea why this is necessary
                // using a plain query builder without the filter mechanism this works with a single where, omitting the join condition
                $queryBuilder
                    ->leftJoin(
                        Ingredient::class,
                        self::INGREDIENT_ALIAS,
                        Join::WITH,
                        sprintf("%s.ingredient = %s AND (%s)", self::RECIPE_INGREDIENT_ALIAS, self::INGREDIENT_ALIAS, $condition)
                    );
                    
                $currentMonth = (int) date('n');
                $queryBuilder->setParameter("currentMonth", $currentMonth);
                $queryBuilder->andWhere($condition);
            }
        }
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