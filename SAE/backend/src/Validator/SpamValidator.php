<?php

namespace App\Validator;

use App\Service\SpamChecker;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class SpamValidator extends ConstraintValidator
{
    private SpamChecker $spamChecker;

    public function __construct(SpamChecker $spamChecker)
    {
        $this->spamChecker = $spamChecker;
    }

    /**
     * @param mixed $value
     * @param Constraint $constraint
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof Spam) {
            throw new UnexpectedTypeException($constraint, Spam::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!is_string($value)) {
            throw new UnexpectedTypeException($value, 'string');
        }

        if ($this->spamChecker->checkSpam($value)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ value }}', $value)
                ->addViolation();
        }
    }
}