<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ContactTestController extends AbstractController
{
    #[Route('/api/contact-test', name: 'contact_test', methods: ['GET'])]
    public function test(): JsonResponse
    {
        return $this->json(['status' => 'ok']);
    }
}
