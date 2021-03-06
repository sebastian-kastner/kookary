<?php

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use Doctrine\ORM\PersistentCollection;
use App\Entity\Recipe;
use App\Entity\RecipeIngredient;
use Doctrine\ORM\EntityManagerInterface;

final class RecipePersister implements ContextAwareDataPersisterInterface
{
    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function supports($data, array $context = []): bool
    {
        return $data instanceof Recipe;
    }

    public function persist($data, array $context = [])
    {
        // this is one of the worst hacks of century!
        if($data instanceof Recipe) {
            $ingredients = $data->getIngredients();
            // this seems to be true when updating a collection
            // in that case we clear all ingredients
            if($ingredients instanceof PersistentCollection) {
                $snapshots = $ingredients->getSnapshot();
                foreach ($snapshots as $snapshot) {
                    if($snapshot instanceof RecipeIngredient) {
                        $this->entityManager->remove($snapshot);
                    }
                }
            }
        }

        $this->entityManager->persist($data);
        $this->entityManager->flush();
    }

    public function remove($data, array $context = [])
    {
        $this->entityManager->remove($data);
    }
}

?>