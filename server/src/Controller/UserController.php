<?php

// src/Controller/UserController.php
namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserController extends AbstractController
{
    public function registration(UserPasswordHasherInterface $passwordHasher)
    {
        // ... e.g. get the user data from a registration form
        // $user = new User(...);
        // $plaintextPassword = ...;

        // // hash the password (based on the security.yaml config for the $user class)
        // $hashedPassword = $passwordHasher->hashPassword(
        //     $user,
        //     $plaintextPassword
        // );
        // $user->setPassword($hashedPassword);
        // ...
        new User();
    }

    public function delete(UserPasswordHasherInterface $passwordHasher, UserInterface $user)
    {
        // // ... e.g. get the password from a "confirm deletion" dialog
        // $plaintextPassword = ...;

        // if (!$passwordHasher->isPasswordValid($user, $plaintextPassword)) {
        //     throw new AccessDeniedHttpException();
        // }
    }
}

?>