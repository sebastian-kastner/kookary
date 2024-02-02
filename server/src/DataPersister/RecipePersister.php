<?php

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use Doctrine\ORM\PersistentCollection;
use App\Entity\Recipe;
use App\Entity\RecipeIngredient;
use App\Services\SeasonalityScoreService;
use Doctrine\ORM\EntityManagerInterface;
use Vich\UploaderBundle\Handler\UploadHandler;

final class RecipePersister implements ContextAwareDataPersisterInterface
{
    private $entityManager;

    private $uploadHandler;

    public function __construct(EntityManagerInterface $entityManager, UploadHandler $uploadHandler)
    {
        $this->entityManager = $entityManager;
        $this->uploadHandler = $uploadHandler;
    }

    public function supports($data, array $context = []): bool
    {
        return $data instanceof Recipe;
    }

    public function persist($recipe, array $context = [])
    {
        // this is one of the worst hacks of century!
        if ($recipe instanceof Recipe) {
            $isNewRecipe = $recipe->getRecipeId() === null;

            $ingredients = $recipe->getIngredients();
            // this seems to be true when updating a collection
            // in that case we clear all ingredients and update the seasonality scores
            if ($ingredients instanceof PersistentCollection) {
                $snapshots = $ingredients->getSnapshot();
                foreach ($snapshots as $snapshot) {
                    if ($snapshot instanceof RecipeIngredient) {
                        $this->entityManager->remove($snapshot);
                    }
                }
                $this->updateSeasonalityScores($recipe);
            }

            $this->entityManager->persist($recipe);
            $this->entityManager->flush();

            // for new recipes: update seasonality scores after recipe has been persisted
            if ($isNewRecipe) {
                $this->updateSeasonalityScores($recipe);
                $this->entityManager->flush();
            }
        }
    }

    private function updateSeasonalityScores($recipe)
    {
        $seasonalityScoreService = new SeasonalityScoreService($this->entityManager);
        $seasonalityScoreService->setRecipeScores($recipe);
    }

    public function remove($recipe, array $context = [])
    {
        if ($recipe instanceof Recipe) {
            // delete images on disk before cleaning up the database
            $images = $recipe->getImages();
            foreach ($images as $image) {
                $this->uploadHandler->remove($image, "file");
            }

            $recipe->images = [];
            $this->entityManager->beginTransaction();
            // saving the recipe without images seems like a terrible workaround..
            $this->entityManager->persist($recipe);
            $this->entityManager->remove($recipe);
            $this->entityManager->flush();
            $this->entityManager->commit();
        }
    }
}
