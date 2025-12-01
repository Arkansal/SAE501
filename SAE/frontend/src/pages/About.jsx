import React from 'react'
import './About.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <div>
          <h1>Artémis</h1>
        </div>
        <div>
          <p>
            Nous sommes une association à but non lucratif 
            engagée pour la préservation des êtres vivants 
            sauvages et de leur habitat naturel.
          </p>

          <p>
            Notre mission est de sensibiliser, informer et 
            éduquer le public à travers un outil accessible par 
            notre application Artémis.
          </p>

          <p>
            Notre application est entièrement gratuite. Les 
            dons, contributions et partenariats avec des 
            associations servent exclusivement à maintenir 
            et développer l'application, à soutenir des projets 
            de conservation et à financer le travail des 
            associations partenaires œuvrant directement 
            sur le terrain pour la sauvegarde des espèces 
            menacées.
          </p>

          <p>
            Aucun tiers ne peut diffuser dans 
            l'application, afin de préserver une expérience 
            utilisateur optimale.
          </p>
        </div>
        <div class="logo">
            <img src={artemisLogo} alt="Artémis" />
        </div>
      </div>
    </div>
  )
}

export default About