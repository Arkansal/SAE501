<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class DonationController extends AbstractController
{
    #[Route('/api/create-checkout-session', name: 'api_create_checkout_session', methods: ['POST'])]
    public function createCheckoutSession(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['amount']) || !isset($data['mail'])) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Données manquantes'
                ], 400);
            }

            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

            $amountInCents = (int)($data['amount'] * 100);

            $metadata = [
                'mail' => $data['mail'],
                'gender' => $data['gender'] ?? '',
                'name' => $data['name'] ?? '',
                'firstName' => $data['firstName'] ?? '',
                'country' => $data['country'] ?? '',
                'adress' => $data['adress'] ?? '',
            ];

            if (isset($data['ifCompany']) && $data['ifCompany']) {
                $metadata['raisonSociale'] = $data['raisonSociale'] ?? '';
                $metadata['siren'] = $data['siren'] ?? '';
                $metadata['formeJuridique'] = $data['formeJuridique'] ?? '';
            }

            $checkoutSession = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => 'Don pour Artémis',
                            'description' => 'Soutien à la protection des animaux',
                        ],
                        'unit_amount' => $amountInCents,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => 'http://localhost:5173/donation/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:5173/donation/cancel',
                'customer_email' => $data['mail'],
                'metadata' => $metadata,
            ]);

            return new JsonResponse([
                'success' => true,
                'sessionId' => $checkoutSession->id,
                'url' => $checkoutSession->url
            ], 200);
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Erreur lors de la création de la session : ' . $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/verify-payment', name: 'api_verify_payment', methods: ['POST'])]
    public function verifyPayment(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['sessionId'])) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Session ID manquant'
                ], 400);
            }

            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

            $session = Session::retrieve($data['sessionId']);

            return new JsonResponse([
                'success' => true,
                'status' => $session->payment_status,
                'amount' => $session->amount_total / 100,
                'customerEmail' => $session->customer_email,
                'metadata' => $session->metadata
            ], 200);
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Erreur lors de la vérification : ' . $e->getMessage()
            ], 500);
        }
    }
}
