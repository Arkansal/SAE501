import React from 'react'
import './Terms.css'

function Terms() {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <button className="terms-back-button" onClick={() => window.history.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292"/></svg>
        </button>
        <div className="terms-header-title">
          <h1>Condition d'utilisation</h1>
          <h2>Politique de confidentialité</h2>
        </div>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h3 className="terms-section-title">1. Présentation de l'application</h3>
          <p className="terms-paragraph">
            Artémis est une application gratuite développée par une association à but non lucratif dédiée à la sensibilisation et à la protection des espèces animales et végétales menacées.
          </p>
          <p className="terms-paragraph">
            L'application permet d'accéder à des informations éducatives, des fiches d'espèces, des cartes interactives, des articles et des outils pédagogiques. En utilisant Artémis, vous acceptez les présentes conditions d'utilisation et notre politique de confidentialité.
          </p>
        </section>

        <section className="terms-section">
          <h3 className="terms-section-title">2. Utilisation de l'application</h3>
          <p className="terms-paragraph">L'utilisateur s'engage à :</p>
          <ul className="terms-list">
            <li>utiliser l'application dans le respect des lois en vigueur</li>
            <li>ne pas perturber le bon fonctionnement des services</li>
            <li>ne pas tenter d'accéder de manière frauduleuse aux données, serveurs ou fonctionnalités protégées</li>
            <li>respecter la propriété intellectuelle des contenus proposés.</li>
          </ul>
          <p className="terms-paragraph">
            Artémis se réserve le droit de suspendre l'accès en cas d'utilisation abusive ou malveillante.
          </p>
        </section>

        <section className="terms-section">
          <h3 className="terms-section-title">3. Contenus et propriété intellectuelle</h3>
          <p className="terms-paragraph">
            Tous les contenus disponibles dans Artémis (textes, données, images, illustrations, icônes, maquettes, logos) sont protégés par les lois sur la propriété intellectuelle.
          </p>
        </section>
      </div>
    </div>
  )
}

export default Terms