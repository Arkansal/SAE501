<?php

namespace App\DataFixtures;

use App\Entity\ExtinctLevel;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ExtinctLevelFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $extinctLevelData = [
            [
                'extinctLevel' => 'NE',
                'levelName' => "Non évalué",
                'description' => "Cette espèce n'a pas encore été étudiée selon les critères officiels. Le manque de données ne signifie pas qu'elle n'est pas menacée : simplement, personne n'a encore réalisé l'analyse complète de son état ou de sa population. Souvent, les espèces nouvellement découvertes ou peu observées se trouvent dans cette catégorie.\n🛈 Signes possibles :\n- Données biologiques insuffisantes\n- Aire de répartition inconnue ou mal définie\n- Aucune estimation de population disponible"
            ],
            [
                'extinctLevel' => 'DI',
                'levelName' => "Données insuffisantes",
                'description' => "L'espèce a été observée, mais les informations manquent pour déterminer son niveau réel de menace. Elle pourrait être abondante… ou déjà au bord de l'extinction. Cette catégorie appelle à davantage de recherches urgentes.\n🛈 Signes possibles :\n- Observations trop rares pour établir des tendances\n- Connaissance limitée du cycle de vie\n- Habitat difficile d'accès empêchant les études"
            ],
            [
                'extinctLevel' => 'PM',
                'levelName' => "Préoccupation mineure",
                'description' => "L'espèce ne montre actuellement aucun signe de déclin alarmant. Elle possède une population stable et une aire de répartition étendue. Cela ne signifie pas qu'elle est invulnérable : les pressions environnementales pourraient changer rapidement.\n🛈 Points caractéristiques :\n- Population élevée\n- Reproduction régulière\n- Habitat encore relativement préservé"
            ],
            [
                'extinctLevel' => 'QM',
                'levelName' => "Quasi menacée",
                'description' => "L'espèce n'est pas encore en danger mais pourrait le devenir sous peu si les conditions se dégradent. Un léger recul de population ou quelques perturbations de l'habitat pourraient suffire à la faire basculer dans une catégorie de menace.\n🛈 Signes d'alerte :\n- Déclin lent mais constant\n- Fragmentation de l'habitat\n- Sensibilité accrue aux changements climatiques"
            ],
            [
                'extinctLevel' => 'VU',
                'levelName' => "Vulnérable",
                'description' => "L'espèce montre un risque concret de déclin important dans les prochaines décennies. Ses effectifs diminuent clairement, et plusieurs facteurs de pression commencent à s'accumuler. Si aucune mesure n'est prise, elle pourrait atteindre une catégorie plus critique.\n🛈 Signes préoccupants :\n- Perte d'habitat significative\n- Pression humaine croissante (braconnage, agriculture…)\n- Moins de 10 000 individus matures"
            ],
            [
                'extinctLevel' => 'ED',
                'levelName' => "En danger",
                'description' => "L'espèce est confrontée à un risque élevé d'extinction à moyen terme. Le déclin est rapide et visible, souvent lié à la dégradation sévère de l'environnement ou à la diminution des capacités reproductives. Des actions de conservation deviennent urgentes.\n🛈 Signes préoccupants :\n- Aire de répartition très réduite\n- Moins de 2 500 individus adultes\n- Reproduction insuffisante pour compenser les pertes"
            ],
            [
                'extinctLevel' => 'DC',
                'levelName' => "En danger critique",
                'description' => "C'est l'étape juste avant l'extinction sauvage. Une espèce en danger critique peut basculer au moindre choc écologique : incendie, sécheresse, maladie, pollution locale, etc. La survie dépend souvent de programmes de conservation intensifs.\n🛈 Signes alarmants :\n- Moins de 250 individus adultes\n- Reproduction extrêmement faible\n- Forte consanguinité\n- Surveillance humaine indispensable"
            ],
            [
                'extinctLevel' => 'ES',
                'levelName' => "Éteinte dans la nature",
                'description' => "L'espèce n'existe plus dans son habitat naturel. Les seuls individus restants vivent en captivité ou dans des environnements contrôlés. La réintroduction est parfois possible, mais difficile et risquée.\n🛈 Contexte typique :\n- Destruction totale de l'écosystème d'origine\n- Survie dépendante de zoos ou centres spécialisés\n- Programmes de reproduction assistée en cours"
            ],
            [
                'extinctLevel' => 'ET',
                'levelName' => "Éteinte",
                'description' => "Plus aucun individu n'existe, ni dans la nature ni en captivité. L'espèce a disparu définitivement, souvent en raison de combinaisons de pressions humaines et environnementales. Chaque extinction représente une perte irréversible pour la biodiversité mondiale.\n🛈 Causes fréquentes :\n- Surexploitation\n- Perte totale de l'habitat\n- Changements climatiques rapides ou maladies"
            ],
        ];


        foreach ($extinctLevelData as $data) {
            $extinctLevel = new ExtinctLevel();
            $extinctLevel->setExtinctLevel($data['extinctLevel']);
            $extinctLevel->setLevelName($data['levelName']);
            $extinctLevel->setDescription(($data['description']));

            $manager->persist($extinctLevel);
        }

        $manager->flush();
    }
}
