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
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class UserController extends AbstractController
{
    private $passwordHasher;
    private $entityManager;

    private $jwtManager;

    public function __construct(ManagerRegistry $managerRegistry, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager)
    {
        $this->entityManager = $managerRegistry->getManager();
        $this->passwordHasher = $passwordHasher;
        $this->jwtManager = $jwtManager;
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
     * @Route("/api/refresh_token", name="refresh_token", methods={"GET"})
     */
    public function refreshToken(): Response
    {
        // return error if user is not authenticated
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $token = $this->jwtManager->create($this->getUser());

        return new JsonResponse(['token' => $this->jwtManager->create($this->getUser())]);
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
        if ($data->newPassword == null) {
            throw new BadRequestException("newPassword muss gesetzt sein!");
        }

        // logged in user is admin and tries to change the password for another user: old password is not required
        if ($loggedInUser->hasRole(User::ROLE_ADMIN) && $loggedInUser->getId() != $data->userId) {
            return $this->saveUserPassword($userId, $data->newPassword);
        } 
        // logged in user tries to change its own password: old password is required
        else if ($loggedInUser->getId() == $data->userId) {
            if ($data->oldPassword == null) {
                throw new BadRequestException("oldPassword muss gesetzt sein!");
            }

            // validate the sent password is correct
            $isValid = $this->passwordHasher->isPasswordValid($loggedInUser, $data->oldPassword);
            if (!$isValid) {
                throw new BadRequestException("Das angegebene aktuelle Passwort ist ungültig!");
            }

            return $this->saveUserPassword($userId, $data->newPassword);
        }
        // non-admin tries to change another users password: error!
        else {
            throw new AccessDeniedException("Fremde Passwörter können nicht geändert werden");
        }
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
