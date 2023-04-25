<?php

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use Doctrine\ORM\PersistentCollection;
use App\Entity\Recipe;
use App\Entity\RecipeIngredient;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
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

    public function persist($data, array $context = [])
    {
        // this is one of the worst hacks of century!
        if ($data instanceof Recipe) {
            $ingredients = $data->getIngredients();
            // this seems to be true when updating a collection
            // in that case we clear all ingredients
            if ($ingredients instanceof PersistentCollection) {
                $snapshots = $ingredients->getSnapshot();
                foreach ($snapshots as $snapshot) {
                    if ($snapshot instanceof RecipeIngredient) {
                        $this->entityManager->remove($snapshot);
                    }
                }
            }
        }

        $this->entityManager->persist($data);
        $this->entityManager->flush();
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

?>