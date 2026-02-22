<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

final class AuthenticationSuccessListener
{
    /**
     * Cette fonction se déclenche automatiquement quand un login réussit
     */
    #[AsEventListener(event: 'lexik_jwt_authentication.on_authentication_success')]
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        // 1. On récupère la réponse par défaut (qui contient juste le token)
        $data = $event->getData();

        // 2. On récupère l'utilisateur qui vient de se connecter
        $user = $event->getUser();

        // Sécurité : on vérifie que c'est bien notre entité User
        if (!$user instanceof User) {
            return;
        }

        // 3. On ajoute les infos de l'utilisateur dans la réponse
        // Vous pouvez ajouter ici tous les champs que vous voulez renvoyer au React
        $data['user'] = [
            'id' => $user->getId(),
            'pseudo' => $user->getPseudo(), // Assurez-vous que getPseudo() existe dans votre Entity/User.php
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ];

        // 4. On renvoie la nouvelle réponse modifiée
        $event->setData($data);
    }
}
