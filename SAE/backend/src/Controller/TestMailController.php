<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use App\Service\SpamChecker;

class TestMailController extends AbstractController
{
    #[Route('/api/test-contact', name: 'api_test_contact', methods: ['POST'])]
    public function sendContact(Request $request, MailerInterface $mailer, SpamChecker $spamChecker): JsonResponse
    {
        try {
            // Récupérer les données JSON
            $data = json_decode($request->getContent(), true);

            // Validation des données
            if (!isset($data['pseudo']) || !isset($data['email']) || !isset($data['message'])) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Données manquantes'
                ], 400);
            }

            $pseudo = $data['pseudo'];
            $userEmail = $data['email'];
            $userMessage = $data['message'];

            // Validation de l'email
            if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Email invalide'
                ], 400);
            }

            // Détection de spam avec l'IA
            $isSpam = $spamChecker->checkSpam($userMessage);
            error_log('Spam check result: ' . ($isSpam ? '1' : '0'));

            if ($isSpam) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Votre message a été détecté comme spam et n\'a pas été envoyé.'
                ], 400);
            }

            // Créer l'email
            $email = (new Email())
                ->from('jojorauline@gmail.com')
                ->to('jolann.lemouton@etu.unicaen.fr')
                ->replyTo($userEmail)
                ->subject('Contact Artémis - ' . $pseudo)
                ->html("
                    <h2>Nouveau message de contact Artémis</h2>
                    <p><strong>Pseudo :</strong> {$pseudo}</p>
                    <p><strong>Email :</strong> {$userEmail}</p>
                    <hr>
                    <p><strong>Message :</strong></p>
                    <p>" . nl2br(htmlspecialchars($userMessage)) . "</p>
                ");

            // Envoyer l'email
            $mailer->send($email);

            return new JsonResponse([
                'success' => true,
                'message' => 'Email envoyé avec succès'
            ], 200);
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Erreur lors de l\'envoi : ' . $e->getMessage()
            ], 500);
        }
    }
}
