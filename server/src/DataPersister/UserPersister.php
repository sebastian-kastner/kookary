<?php

namespace App\DataPersister;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserPersister implements DataPersisterInterface
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;    
    }

    /**
     * Is the data supported by the persister?
     */
    public function supports($data): bool
    {
        return $data instanceof User;
    }

    /**
     * @param User $data
     * @return object|void Void will not be supported in API Platform 3, an object should always be returned
     */
    public function persist($data)
    {
        if ($data->getPassword()) {
            $data->setPassword(
                $this->passwordHasher->hashPassword($data, $data->getPassword())
            );
        }
        $this->entityManager->persist($data);
        $this->entityManager->flush();
    }

    /**
     * Removes the data.
     */
    public function remove($data)
    {
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}