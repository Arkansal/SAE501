import React from 'react'
import { useTranslation } from 'react-i18next'
import './Partner.css'

function Partner() {
  const { t } = useTranslation()
  const logos = [
    { href: "https://www.lpo.fr/", src: "https://boutique.lpo.fr/media/uploads/images/labels/RVB_LPO_LOGOTYPE_MEDIUM.jpg", alt: "logo de la LPO" },
    { href: "https://www.zoobeauval.com/", src: "https://avatars.githubusercontent.com/u/89587186?s=200&v=4", alt: "logo du ZooParc de Beauval" },
    { href: "https://www.wwf.fr/", src: "https://wwfasia.awsassets.panda.org/img/wwf_logo_large_rgb_72dpi_1_1_1_1_783732.webp", alt: "logo de la WWF" },
  ];

  const repeated = Array.from({ length: 12 }, () => logos).flat();

  return (
    <div className="Partenaire-container">
      <div className="Partenaire-content">
        <div className="Partenaire-header-section">
          <h1>{t('partner.title')}</h1>
        </div>
        <div className="Partenaire-text-section">
            <p>
            {t('partner.introLine1')}
            </p>
            <p>
              {t('partner.introLine2')}
            </p>
            <p>
                {t('partner.introLine3')}
            </p>
        </div>
        <div className="Partenaire-logo-section">
          <div className="Partenaire-logo-track">
            {repeated.map((l, i) => (
              <div className="Partenaire-logo-item" key={i}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  <img src={l.src} alt={l.alt} />
                </a>
              </div>
            ))}
            {repeated.map((l, i) => (
              <div className="Partenaire-logo-item" key={`dup-${i}`} aria-hidden="true">
                <a href={l.href}>
                  <img src={l.src} alt="" />
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="Partenaire-text-logo">
            <div>
                <img src="https://boutique.lpo.fr/media/uploads/images/labels/RVB_LPO_LOGOTYPE_MEDIUM.jpg" alt="Logo de la LPO" />
                <h2>{t('partner.lpoTitle')}</h2>
                <p>{t('partner.lpoDesc1')}
                </p>
                <p>
                {t('partner.lpoDesc2')}
                </p>
            </div>
            <hr />
             <div>
                <img src="https://avatars.githubusercontent.com/u/89587186?s=200&v=4" alt="logo du ZooParc de Beauval" />
                <h2>{t('partner.zooTitle')}</h2>
                <p>{t('partner.zooDesc1')}
                </p>
                <p>
                {t('partner.zooDesc2')}
                </p>
            </div>
            <hr />
             <div>
                <img src="https://wwfasia.awsassets.panda.org/img/wwf_logo_large_rgb_72dpi_1_1_1_1_783732.webp" alt="Logo de la WWF" />
                <h2>{t('partner.wwfTitle')}</h2>
                <p>{t('partner.wwfDesc1')}
                </p>
                <p>
                {t('partner.wwfDesc2')}
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
export default Partner
