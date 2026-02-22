import React from 'react'
import { useTranslation } from 'react-i18next'
import './Terms.css'

function Terms() {
  const { t } = useTranslation()
  return (
    <div className="terms-container">
      <div className="terms-header">
        <button className="terms-back-button" onClick={() => window.history.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292"/></svg>
        </button>
        <div className="terms-header-title">
          <h1>{t('terms.title')}</h1>
          <h2>{t('terms.subtitle')}</h2>
        </div>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h3 className="terms-section-title">{t('terms.section1Title')}</h3>
          <p className="terms-paragraph">
            {t('terms.section1Para1')}
          </p>
          <p className="terms-paragraph">
            {t('terms.section1Para2')}
          </p>
        </section>

        <section className="terms-section">
          <h3 className="terms-section-title">{t('terms.section2Title')}</h3>
          <p className="terms-paragraph">{t('terms.section2Para1')}</p>
          <ul className="terms-list">
            <li>{t('terms.section2List1')}</li>
            <li>{t('terms.section2List2')}</li>
            <li>{t('terms.section2List3')}</li>
            <li>{t('terms.section2List4')}</li>
          </ul>
          <p className="terms-paragraph">
            {t('terms.section2Para2')}
          </p>
        </section>

        <section className="terms-section">
          <h3 className="terms-section-title">{t('terms.section3Title')}</h3>
          <p className="terms-paragraph">
            {t('terms.section3Para')}
          </p>
        </section>
      </div>
    </div>
  )
}

export default Terms