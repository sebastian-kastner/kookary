<?php
namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Recipe;
use App\Entity\SeasonalityScore;

class SeasonalityScoreService
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function setRecipeScores(Recipe $recipe): void
    {
        $seasonalIngredients = $this->getSeasonalIngredients($recipe);

        $persistedScores = $this->getSeasonalScores($recipe);
        // calculate and set score for each month
        for ($i = 1; $i <= 12; $i++) {
            $monthlyScore = $this->calculateSeasonalScoreForMonth($i, $seasonalIngredients);

            $persistedScore = $persistedScores[$i];
            // update existing scores, create new ones if necessary
            if (isset($persistedScores) && $persistedScores[$i] instanceof SeasonalityScore) {
                if($persistedScore->getScore() != $monthlyScore) {
                    $persistedScore->setScore($monthlyScore);
                    $this->entityManager->persist($persistedScore);
                }
            } else {
                $seasonalScore = new SeasonalityScore();
                $seasonalScore->setRecipe($recipe);
                $seasonalScore->setMonth($i);
                $seasonalScore->setScore($monthlyScore);
                $this->entityManager->persist($seasonalScore);
            }
        }
        $this->entityManager->flush();
    }

    private function getSeasonalScores(Recipe $recipe): array
    {
        $seasonalScores = [];
        for ($i = 1; $i <= 12; $i++) {
            $seasonalScores[$i] = null;
        }
        $storedScores = $this->entityManager->getRepository(SeasonalityScore::class)->findBy(['recipe' => $recipe->getRecipeId()]);
        foreach ($storedScores as $score) {
            $seasonalScores[$score->getMonth()] = $score;
        }

        return $seasonalScores;
    }

    private function getSeasonalIngredients(Recipe $recipe): array
    {
        $seasonalIngredients = [];
        foreach ($recipe->getIngredients() as $ingredient) {
            $ingredient = $ingredient->getIngredient();
            if (isset($ingredient) && $ingredient->getSeasonStart() && $ingredient->getSeasonEnd()) {
                array_push($seasonalIngredients, $ingredient);
            }
        }
        return $seasonalIngredients;
    }

    private function calculateSeasonalScoreForMonth(int $month, array $seasonalIngredients): float
    {
        if(count($seasonalIngredients) == 0) {
            return 0;
        }

        $absScore = 0;
        foreach ($seasonalIngredients as $ingredient) {
            if ($this->isInSeason($month, $ingredient->getSeasonStart(), $ingredient->getSeasonEnd())) {
                $monthsInSeason = $this->countMonthsInSeason($ingredient->getSeasonStart(), $ingredient->getSeasonEnd());
                $ingredientScore = 1 - ($monthsInSeason / 12);
                $absScore += $ingredientScore;
            }
        }
        $monthlyScore = round($absScore / count($seasonalIngredients), 2);
        return $monthlyScore;
    }

    private function isInSeason(int $month, int $start, int $end): bool
    {
        if ($start < $end) {
            return $month >= $start && $month <= $end;
        } else {
            return $month >= $start || $month <= $end;
        }
    }

    private function countMonthsInSeason(int $start, int $end): int
    {
        if ($start < $end) {
            return $end - $start + 1;
        } else {
            return 12 - $start + $end + 1;
        }
    }
}