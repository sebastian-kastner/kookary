<?php

// src/Controller/RegistrationController.php
namespace App\Controller;

use App\Entity\User;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\Request;

class CreateUserAction
{
    public function __invoke(Request $request): User
    {
        $plainPassword = $request->content["password"];
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $plaintextPassword
        );
        $user->setPassword($hashedPassword);

        $email = $request->content["email"];
        $name = $request->content["name"];

        return new User();

        // $mediaObject = new MediaObject();
        // $fileName = $request->get('fileName');
        // if($fileName != null) {
        //     $mediaObject->fileName = $fileName;
        // }
        // $mediaObject->file = $uploadedFile;

        // return $mediaObject;
    }
}

// class UserController extends AbstractController
// {
//     public function registration(UserPasswordHasherInterface $passwordHasher)
//     {
//         // ... e.g. get the user data from a registration form
//         // $user = new User(...);
//         // $plaintextPassword = ...;

//         // hash the password (based on the security.yaml config for the $user class)
//         $hashedPassword = $passwordHasher->hashPassword(
//             $user,
//             $plaintextPassword
//         );
//         $user->setPassword($hashedPassword);

//         // ...
//     }

//     public function delete(UserPasswordHasherInterface $passwordHasher, UserInterface $user)
//     {
//         // ... e.g. get the password from a "confirm deletion" dialog
//         $plaintextPassword = ...;

//         if (!$passwordHasher->isPasswordValid($user, $plaintextPassword)) {
//             throw new AccessDeniedHttpException();
//         }
//     }
// }

?>