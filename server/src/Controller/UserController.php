<?php

namespace App\Controller;

use App\DataPersister\UserPersister;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class UserController extends AbstractController
{
    private $passwordHasher;
    private $entityManager;

    public function __construct(ManagerRegistry $managerRegistry, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $managerRegistry->getManager();
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * @Route("/api/me", name="app_me", methods={"GET"})
     */
    public function me(): Response
    {
        // return error if user is not authenticated
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $user = $this->getUser();
        if ($user != null && $user instanceof User) {
            return $this->json($user);
        }
        return new Response();
    }

    /**
     * @Route("/api/change_password", name="app_change_password", methods={"POST"})
     */
    public function changePassword(Request $request): Response
    {
        $loggedInUser = $this->getUser();
        if ($loggedInUser == null || !($loggedInUser instanceof User)) {
            throw new AccessDeniedException();
        }

        $data = json_decode($request->getContent());
        $userId = -1;
        if ($data->userId == null) {
            throw new BadRequestException("UserId muss gesetzt sein!");
        } else {
            $userId = (int) $data->userId;
        }
        if ($data->oldPassword == null) {
            throw new BadRequestException("oldPassword muss gesetzt sein!");
        }
        if ($data->newPassword == null) {
            throw new BadRequestException("newPassword muss gesetzt sein!");
        }

        // check if logged in user is allowed to change the password
        if ($loggedInUser->getId() == $data->userId) {
            // make sure that given old password is valid
            $isValid = $this->passwordHasher->isPasswordValid($loggedInUser, $data->oldPassword);

            if (!$isValid) {
                throw new BadRequestException("Das angegebene aktuelle Passwort ist ungültig!");
            }
        } else {
            if($loggedInUser->hasRole((User::ROLE_ADMIN))) {
                throw new AccessDeniedException("Fremde Passwörter können nicht geändert werden");
            }
        }

        // change the password if the checks were successful
        return $this->saveUserPassword($userId, $data->newPassword);
    }

    private function saveUserPassword(int $userId, string $newPassword): Response {
        // $userToChange = $this->entityManager->find(User::class, $userId);
        $user = $this->entityManager->find(User::class, $userId);
        if ($user == null || !$user instanceof User) {
            throw new BadRequestException("Benutzer mit angegebener ID wurde nicht gefunden");
        }

        // set password (hashing will be done in the persister)
        $user->setPassword($newPassword);
        // persist user using the persister
        $persister = new UserPersister($this->entityManager, $this->passwordHasher);
        $persister->persist($user);
        
        return $this->json("");
    }
}
