import React from 'react'
import { useTranslation } from 'react-i18next'
import './About.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'

function About() {
  const { t } = useTranslation()
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="text-section">
          <h1>{t('about.title')}</h1>
        </div>
        <div className="text-section">
          <p>
            {t('about.section1')}
          </p>

          <p>
            {t('about.section2')}
          </p>

          <p>
            {t('about.section3')}
          </p>

          <p>
            {t('about.section4')}
          </p>
        </div>
        <div className="logo-section">
            <div className="logo">
                <img src={artemisLogo} alt="Artémis" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default About