<?php
namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Ingredient;
use App\Entity\Recipe;
use App\Entity\RecipeIngredient;
use App\Entity\User;
use App\Entity\UserRecipeFavourites;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PropertyInfo\Type;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\RequestStack;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\Security as CoreSecurity;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;


final class RecipeFilter extends AbstractContextAwareFilter
{
    const INGREDIENTS_FILTER_PROPERTY = "ingredients";
    const TAGS_FILTER_PROPERTY = "tags";
    const SEASONAL_FILTER_PROPERTY = "seasonal";

    const MARKED_FILTER_PROPERTY = "marked";

    const ORDER_BY_PROPERTY = "order_by";

    const ORDER_BY_DIRECTION_PROPERTY = "order_by_direction";

    const ORDER_BY_VALUES = ['date', 'rand', 'name'];

    const ORDER_BY_DIRECTION_VALUES = ['desc', 'asc'];

    const AUTHOR_FILTER_PROPERTY = "author";

    // for some reason doctrine autogenerates the "_a2" suffix that we need to add here to make things work
    const RECIPE_INGREDIENT_ALIAS = "ri_a2";
    const INGREDIENT_ALIAS = "i";
    const TAG_ALIAS = "t";
    const FAVOURITE_RECIPE_ALIAS = "f";

    private $security;

    private $orderBy = self::ORDER_BY_VALUES[0];
    private $orderByDirection = self::ORDER_BY_DIRECTION_PROPERTY[0];

    public function __construct(CoreSecurity $security, ManagerRegistry $managerRegistry, ?RequestStack $requestStack = null, LoggerInterface $logger = null, array $properties = null, NameConverterInterface $nameConverter = null)
    {
        parent::__construct($managerRegistry, $requestStack, $logger, $properties, $nameConverter);
        $this->security = $security;
    }

    public function apply(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null, array $context = [])
    {
        $this->orderBy = self::ORDER_BY_VALUES[0];
        $this->orderByDirection = self::ORDER_BY_DIRECTION_VALUES[0];

        parent::apply($queryBuilder, $queryNameGenerator, $resourceClass, $operationName, $context);

        $this->addOrderByClause($queryBuilder);
    }

    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ) {
        if ($value == "") {
            return;
        }

        if ($property == self::INGREDIENTS_FILTER_PROPERTY) {
            $this->addIngredientFilter($value, $queryBuilder);
        } else if ($property == self::TAGS_FILTER_PROPERTY) {
            $this->addTagFilter($value, $queryBuilder);
        } else if ($property == self::SEASONAL_FILTER_PROPERTY) {
            $this->addSeasonalFilter($value, $queryBuilder);
        } else if ($property == self::MARKED_FILTER_PROPERTY) {
            $this->addMarkedFilter($value, $queryBuilder);
        } else if ($property == self::ORDER_BY_PROPERTY) {
            $this->orderBy = $value;
        } else if ($property == self::ORDER_BY_DIRECTION_PROPERTY) {
            $this->orderByDirection = $value;
        } else if ($property == self::AUTHOR_FILTER_PROPERTY) {
            $this->addAuthorFilter($value, $queryBuilder);
        }
    }

    private function addIngredientFilter(string $value, QueryBuilder $queryBuilder)
    {
        $this->joinRecipeIngredients($queryBuilder);
        $ingredientIds = $this->getIdListFromString($value);
        // FIXME: allow to filter for multiple ingredients; the following filters for OR instead of AND
        $queryBuilder->andWhere(
            $queryBuilder->expr()->andX(
                $queryBuilder->expr()->in(sprintf('%s.ingredient', self::RECIPE_INGREDIENT_ALIAS), $ingredientIds),
            )
        );

        if (count($ingredientIds) > 1) {
            $queryBuilder->having(
                $queryBuilder->expr()->eq(
                    sprintf('COUNT(DISTINCT %s.ingredient)', self::RECIPE_INGREDIENT_ALIAS),
                    count($ingredientIds)
                )
            );
        }
    }

    private function joinRecipeIngredients(QueryBuilder $queryBuilder)
    {
        $aliases = $queryBuilder->getAllAliases();
        if (!in_array(self::RECIPE_INGREDIENT_ALIAS, $aliases)) {
            $recipeAlias = $this->getRecipeAlias($queryBuilder);
            $queryBuilder
                ->leftJoin(
                    RecipeIngredient::class,
                    self::RECIPE_INGREDIENT_ALIAS,
                    Join::WITH,
                    sprintf("%s.recipeId = %s.recipe", $recipeAlias, self::RECIPE_INGREDIENT_ALIAS)
                );
            $queryBuilder->groupBy(sprintf("%s.recipeId", $recipeAlias));
        }
    }

    private function addTagFilter(string $value, QueryBuilder $queryBuilder)
    {
        $recipeAlias = $this->getRecipeAlias($queryBuilder);
        $tagIds = $this->getIdListFromString($value);
        $queryBuilder
            ->leftJoin(sprintf("%s.tags", $recipeAlias), self::TAG_ALIAS)
            ->andWhere(
                $queryBuilder->expr()->andX(
                    $queryBuilder->expr()->in(self::TAG_ALIAS, $tagIds),
                )
            );
        if (count($tagIds) > 1) {
            // to make this group by statement work, the ONLY_FULL_GROUP_BY needs to be disabled
            // for doctrine it is disabled in the doctrine.yaml configuration file
            $queryBuilder->groupBy(sprintf("%s.recipeId", $recipeAlias));
            $queryBuilder->having(
                $queryBuilder->expr()->eq(
                    sprintf('COUNT(DISTINCT %s.tagId)', self::TAG_ALIAS),
                    count($tagIds)
                )
            );
        }
    }

    private function addMarkedFilter(string $value, QueryBuilder $queryBuilder)
    {
        if ($value != "true") {
            return;
        }

        $user = $this->security->getUser();
        // nothing to do if user is not logged in
        if ($user == null || !($user instanceof User)) {
            return;
        }

        $recipeAlias = $this->getRecipeAlias($queryBuilder);
        $userId = $user->getId();

        $condition = sprintf("%s.recipeId = %s.recipe AND %s.user = %s", $recipeAlias, self::FAVOURITE_RECIPE_ALIAS, self::FAVOURITE_RECIPE_ALIAS, $userId);
        $queryBuilder->innerJoin(
            UserRecipeFavourites::class,
            self::FAVOURITE_RECIPE_ALIAS,
            JOIN::WITH,
            $condition
        );
    }

    private function addSeasonalFilter(string $value, QueryBuilder $queryBuilder)
    {
        if ($value == "true") {
            $aliases = $queryBuilder->getAllAliases();

            if (!in_array(self::INGREDIENT_ALIAS, $aliases)) {
                $condition = str_replace(
                    "[alias]",
                    self::INGREDIENT_ALIAS,
                    "([alias].seasonStart < [alias].seasonEnd AND :currentMonth >= [alias].seasonStart AND :currentMonth <= [alias].seasonEnd) OR ([alias].seasonStart > [alias].seasonEnd AND (:currentMonth >= [alias].seasonStart OR :currentMonth <= [alias].seasonEnd))"
                );
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

    private function addOrderByClause(QueryBuilder $queryBuilder)
    {
        // create direction value
        $trimmedOrderByDirection = strtolower(trim($this->orderByDirection));
        $dir = "";
        if (in_array($trimmedOrderByDirection, self::ORDER_BY_DIRECTION_VALUES)) {
            $dir = $trimmedOrderByDirection;
        } else {
            $err = sprintf("Invalid value for %s. Allowed values are: %s", self::ORDER_BY_DIRECTION_PROPERTY, implode(", ", self::ORDER_BY_DIRECTION_VALUES));
            throw new \InvalidArgumentException($err);
        }

        // create property value
        $trimmedOrderBy = strtolower(trim($this->orderBy));
        $prop = "";
        $recipeAlias = $this->getRecipeAlias($queryBuilder);
        if (in_array($trimmedOrderBy, self::ORDER_BY_VALUES)) {
            if ($trimmedOrderBy == 'date') {
                $prop = sprintf("%s.dateAdded", $recipeAlias);
            } else if ($trimmedOrderBy == 'name') {
                $prop = sprintf("%s.name", $recipeAlias);
            } else if ($trimmedOrderBy == 'rand') {
                $prop = "RAND()";
                $dir = "";
            }
        } else {
            $err = sprintf("Invalid value for %s. Allowed values are: %s", self::ORDER_BY_PROPERTY, implode(", ", self::ORDER_BY_VALUES));
            throw new \InvalidArgumentException($err);
        }

        if ($dir == "") {
            $queryBuilder->orderBy($prop);
        } else {
            $queryBuilder->orderBy($prop, $dir);
        }
    }

    private function addAuthorFilter(string $value, QueryBuilder $queryBuilder)
    {
        $authorIds = $this->getIdListFromString($value);

        $recipeAlias = $this->getRecipeAlias($queryBuilder);
        $condition = sprintf("%s.author IN (%s)", $recipeAlias, implode(", ", $authorIds));
        $queryBuilder->andWhere($condition);
    }

    private function getIdListFromString(string $value): array
    {
        $valueArray = explode(",", $value);
        $ids = [];
        foreach ($valueArray as $item) {
            $trimmedItem = trim($item);
            if (is_numeric($trimmedItem)) {
                array_push($ids, $trimmedItem);
            } else {
                throw new \InvalidArgumentException("Invalid number given: " + $trimmedItem);
            }
        }
        return $ids;
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
                'Provide a comma separated list of ingredient ids to only return recipes containing all the given ingredients',
                Type::BUILTIN_TYPE_ITERABLE,
                $property,
            );
            $description[self::TAGS_FILTER_PROPERTY] = $this->createDescription(
                'Provide a comma separated list of tag ids to only return recipes tagged with all the given tags',
                Type::BUILTIN_TYPE_ITERABLE,
                $property,
            );
            $description[self::SEASONAL_FILTER_PROPERTY] = $this->createDescription(
                'Set to true to only return recipes with at least one seasonal ingredient',
                Type::BUILTIN_TYPE_BOOL,
                $property,
            );
            $description[self::MARKED_FILTER_PROPERTY] = $this->createDescription(
                'Set to true to only return recipes marked by the logged in user',
                Type::BUILTIN_TYPE_BOOL,
                $property,
            );
            $description[self::ORDER_BY_PROPERTY] = [
                'property' => $property,
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => "If set, results will be sorted by the given property (Default: date)",
                'schema' => [
                    'type' => Type::BUILTIN_TYPE_STRING,
                    'enum' => self::ORDER_BY_VALUES,
                ],
            ];
            $description[self::ORDER_BY_DIRECTION_PROPERTY] = [
                'property' => $property,
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => "If set, results will be sorted in the given direction (Default: desc)",
                'schema' => [
                    'type' => Type::BUILTIN_TYPE_STRING,
                    'enum' => self::ORDER_BY_DIRECTION_VALUES,
                ],
            ];
            $description[self::AUTHOR_FILTER_PROPERTY] = $this->createDescription(
                'Provide a comma separated list of author ids to only return recipes created by the given authors',
                Type::BUILTIN_TYPE_ITERABLE,
                $property,
            );
        }

        return $description;
    }

    private function createDescription(string $description, string $type, $property): array
    {
        return [
            'property' => $property,
            'type' => $type,
            'required' => false,
            'description' => $description,
        ];
    }
}