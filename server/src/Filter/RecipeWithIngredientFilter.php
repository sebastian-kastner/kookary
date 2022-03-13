<?php
namespace App\Filter;

use Exception;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;

use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Query\Expr\Join;

use Symfony\Component\PropertyInfo\Type;

use App\Entity\RecipeIngredient;

final class RecipeWithIngredientFilter extends AbstractContextAwareFilter
{
    const WITH_INGREDIENTS_PROPERTY = "with_ingredients";

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        if($property != self::WITH_INGREDIENTS_PROPERTY || $value == "") {
            return;
        }

        // get alias for recipe table
        $aliases = $queryBuilder->getRootAliases();
        if(count($aliases) != 1) {
            throw new Exception("Expected exactly one root alias for recipe, cannot handle anything else!");
        }
        $recipeAlias = $aliases[0];

        $queryBuilder
            ->innerJoin(
                RecipeIngredient::class,
                "ri",
                Join::WITH,
                sprintf("%s.recipeId = ri.recipe", $recipeAlias)
            )
            ->where(sprintf("ri.ingredient = %d", $value));
    }

    // This function is only used to hook in documentation generators (supported by Swagger and Hydra)
    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description[self::WITH_INGREDIENTS_PROPERTY] = [
                'property' => $property,
                'type' => Type::BUILTIN_TYPE_INT,
                'required' => false,
                'swagger' => [
                    'description' => 'Filter for recipes with specific ingredients.',
                    'name' => 'with_ingredients filter',
                ],
            ];
        }

        return $description;
    }
}