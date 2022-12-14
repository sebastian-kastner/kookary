<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MeController extends AbstractController
{
    /**
     * @Route("/api/me", name="app_me", methods={"GET"})
     */
    public function index(): Response
    {
        // return error if user is not authenticated
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $user = $this->getUser();
        if ($user != null && $user instanceof User) {
            $username = $user->getId();
            $email = $user->getEmail();
            return $this->json([
                'userid' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getName(),
                'roles' => $user->getRoles(),
            ]);
        }
        return new Response();
    }
}
