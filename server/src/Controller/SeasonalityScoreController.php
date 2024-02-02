<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Entity\Recipe;
use App\Entity\SeasonalityScore;
use App\Services\SeasonalityScoreService;

class SeasonalityScoreController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $em)
    {
        $this->entityManager = $em;
    }

    #[Route('/api/update_seasonality_scores', name: 'seasonality_scores_update', methods: ['GET'])]
    public function calculateSeasonalityScore(Request $request): Response
    {
        // TODO: only allow access for admins
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $recipeIds = $this->getRecipeIds($request);
        $recipes = [];
        if (count($recipeIds) > 0) {
            $recipes = $this->entityManager->getRepository(Recipe::class)->findBy(['recipeId' => $recipeIds]);
        } else {
            $recipes = $this->entityManager->getRepository(Recipe::class)->findAll();
        }

        $seasonailityScoreService = new SeasonalityScoreService($this->entityManager);
        foreach ($recipes as $recipe) {
            $seasonailityScoreService->setRecipeScores($recipe);
        }

        return new Response('', 200);
    }

    private function getRecipeIds(Request $request): array
    {
        $recipeIdsString = $request->query->get('recipe_ids', null);
        $recipeIds = [];
        foreach (explode(",", $recipeIdsString) as $recipeId) {
            if (is_numeric($recipeId)) {
                array_push($recipeIds, (int) $recipeId);
            }
        }

        // get all numeric recipeIds from request
        return array_filter($recipeIds, 'is_numeric');
    }
}
