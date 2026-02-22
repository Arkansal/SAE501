import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../services/api'
import ArticleSection from './ArticleSection'
import GameSection from './GameSection'
import './Navigation.css'

// Composants SVG pour les drapeaux
const FrenchFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36">
    <path fill="#ed2939" d="M36 27a4 4 0 0 1-4 4h-8V5h8a4 4 0 0 1 4 4z"></path>
    <path fill="#002495" d="M4 5a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h8V5z"></path>
    <path fill="#eee" d="M12 5h12v26H12z"></path>
  </svg>
)

const EnglishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36">
    <path fill="#00247d" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"></path>
    <path fill="#cf1b2b" d="m25.14 23l9.712 6.801a4 4 0 0 0 .99-1.749L28.627 23zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943zm10-10h2.141l9.711-6.8a4 4 0 0 0-1.937-1.085L23 12.057zm-12.141 0L1.148 6.2a4 4 0 0 0-.991 1.749L7.372 13z"></path>
    <path fill="#eee" d="M36 21H21v10h2v-5.836L31.335 31H32a4 4 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21zM36 9a3.98 3.98 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4 4 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059zM13 5v5.837L4.664 5H4a4 4 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A4 4 0 0 0 0 9v.059L5.628 13H0v2h15V5z"></path>
    <path fill="#cf1b2b" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path>
  </svg>
)

const SpanishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36">
    <path fill="#c60a1d" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"></path>
    <path fill="#ffc400" d="M0 12h36v12H0z"></path>
    <path fill="#ea596e" d="M9 17v3a3 3 0 1 0 6 0v-3z"></path>
    <path fill="#f4a2b2" d="M12 16h3v3h-3z"></path>
    <path fill="#dd2e44" d="M9 16h3v3H9z"></path>
    <ellipse cx={12} cy={14.5} fill="#ea596e" rx={3} ry={1.5}></ellipse>
    <ellipse cx={12} cy={13.75} fill="#ffac33" rx={3} ry={0.75}></ellipse>
    <path fill="#99aab5" d="M7 16h1v7H7zm9 0h1v7h-1z"></path>
    <path fill="#66757f" d="M6 22h3v1H6zm9 0h3v1h-3zm-8-7h1v1H7zm9 0h1v1h-1z"></path>
  </svg>
)

function LanguageSelector({ t }) {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = [
    { code: 'fr', name: 'Français', flag: <FrenchFlag /> },
    { code: 'en', name: 'English', flag: <EnglishFlag /> },
    { code: 'es', name: 'Español', flag: <SpanishFlag /> }
  ]

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language)

  return (
    <div className="nav-custom-language-select">
      <div 
        className={`nav-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >     
        <span>{t('common.language')} :</span>
        <div className="nav-flag-container">
          {currentLanguage?.flag}
          <span className="nav-language-name">{currentLanguage?.name}</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="nav-select-options show">
          {languages.map(lang => (
            <div
              key={lang.code}
              className={`nav-select-option ${i18n.language === lang.code ? 'selected' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="nav-flag">{lang.flag}</span>
              <span>{lang.name}</span>
              <div className="nav-radio"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OverlayMenu({ isOpen, onClose }) {
  const { t } = useTranslation()
  const isLoggedIn = api.isLoggedIn()

  if (!isOpen) return null

  return (
    <div className="nav-menu-overlay">
      <div className="nav-menu-backdrop" onClick={onClose}></div>
      
      <div className="nav-menu-content">
        <div className="nav-menu-header">
          <h2>{t('navigation.menu') || 'Menu'}</h2>
          <button className="nav-close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 16 16">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
            </svg>
          </button>
        </div>

        <div className="nav-menu-scroll-container">
          

          <div className="nav-menu-section">
            <div className="nav-menu-list-grid">
              <Link to="/" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M16.219 1.943c.653.512 1.103 1.339 1.287 2.205l.065.026l2.045.946a.66.66 0 0 1 .384.597v12.367a.665.665 0 0 1-.85.634l-5.669-1.6l-6.74 1.858a.67.67 0 0 1-.371-.004L.474 17.217a.66.66 0 0 1-.474-.63V3.998c0-.44.428-.756.855-.632l5.702 1.661l2.898-.887q.06-.018.122-.025c.112-.656.425-1.286.95-1.9c.623-.73 1.716-1.158 2.781-1.209c1.105-.053 1.949.183 2.91.936M1.333 4.881v11.215l4.87 1.449V6.298zm8.209.614l-2.006.613v11.279l5.065-1.394v-3.295c0-.364.299-.659.667-.659s.666.295.666.66v3.177l4.733 1.335V6.136l-1.12-.52q-.028.165-.073.323A6.1 6.1 0 0 1 16.4 8.05l-2.477 3.093a.67.67 0 0 1-1.073-.037l-2.315-3.353q-.574-.799-.801-1.436a3.7 3.7 0 0 1-.192-.822m3.83-3.171c-.726.035-1.472.327-1.827.742c-.427.5-.637.968-.679 1.442c-.05.571-.016.974.126 1.373c.105.295.314.669.637 1.12l1.811 2.622l1.91-2.385a4.8 4.8 0 0 0 .841-1.657c.24-.84-.122-2.074-.8-2.604c-.695-.545-1.22-.692-2.018-.653m.138.697c1.104 0 2 .885 2 1.977a1.99 1.99 0 0 1-2 1.977c-1.104 0-2-.885-2-1.977s.896-1.977 2-1.977m0 1.318a.663.663 0 0 0-.667.659c0 .364.299.659.667.659a.663.663 0 0 0 .666-.66a.663.663 0 0 0-.666-.658" />
                  </svg>
                </span>
                <span className="nav-menu-list-text">{t('map.title')}</span>
              </Link>
              
              <Link to="/scan" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 0 0 0-2m14-6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 0 0 2h4a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1M20 1h-4a1 1 0 0 0 0 2h4a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3M2 9a1 1 0 0 0 1-1V4a1 1 0 1 1 1-1h4a1 1 0 0 0 0-2H4a3 3 0 0 0-3 3v4a1 1 0 0 0 1 1m8-4H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1M9 9H7V7h2Zm5 2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m1-4h2v2h-2Zm-5 6H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-1 4H7v-2h2Zm5-1a1 1 0 0 0 1-1a1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1m4-3a1 1 0 0 0-1 1v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-4 4a1 1 0 1 0 1 1a1 1 0 0 0-1-1" />
                  </svg>
                </span>
                <span className="nav-menu-list-text">{t('scan.scanMe')}</span>
              </Link>
              
              <Link to="/partners" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21.71 8.71c1.25-1.25.68-2.71 0-3.42l-3-3c-1.26-1.25-2.71-.68-3.42 0L13.59 4H11C9.1 4 8 5 7.44 6.15L3 10.59v4l-.71.7c-1.25 1.26-.68 2.71 0 3.42l3 3c.54.54 1.12.74 1.67.74c.71 0 1.36-.35 1.75-.74l2.7-2.71H15c1.7 0 2.56-1.06 2.87-2.1c1.13-.3 1.75-1.16 2-2C21.42 14.5 22 13.03 22 12V9h-.59zM20 12c0 .45-.19 1-1 1h-1v1c0 .45-.19 1-1 1h-1v1c0 .45-.19 1-1 1h-4.41l-3.28 3.28c-.31.29-.49.12-.6.01l-2.99-2.98c-.29-.31-.12-.49-.01-.6L5 15.41v-4l2-2V11c0 1.21.8 3 3 3s3-1.79 3-3h7zm.29-4.71L18.59 9H11v2c0 .45-.19 1-1 1s-1-.55-1-1V8c0-.46.17-2 2-2h3.41l2.28-2.28c.31-.29.49-.12.6-.01l2.99 2.98c.29.31.12.49.01.6" />
                  </svg>
                </span>
                <span className="nav-menu-list-text">{t('partner.title')}</span>
              </Link>
              
              <Link to="/donation" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M16 2c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3m3 6h-2c0-1.2-.75-2.28-1.87-2.7L8.97 11H1v11h6v-1.44l7 1.94l8-2.5v-1c0-1.66-1.34-3-3-3M5 20H3v-7h2zm8.97.41L7 18.5V13h1.61l5.82 2.17c.34.13.57.46.57.83c0 0-2-.05-2.3-.15l-2.38-.79l-.63 1.9l2.38.79c.51.17 1.04.25 1.58.25H19c.39 0 .74.24.9.57z" />
                  </svg>
                </span>
                <span className="nav-menu-list-text">{t('donation.title')}</span>
              </Link>
              
              <Link to="/about" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 21.9q-.175 0-.325-.025t-.3-.075Q8 20.675 6 17.638T4 11.1V6.375q0-.625.363-1.125t.937-.725l6-2.25q.35-.125.7-.125t.7.125l6 2.25q.575.225.938.725T20 6.375V11.1q0 3.5-2 6.538T12.625 21.8q-.15.05-.3.075T12 21.9m0-2q2.6-.825 4.3-3.3t1.7-5.5V6.375l-6-2.25l-6 2.25V11.1q0 3.025 1.7 5.5t4.3 3.3m0-7.9" />
                  </svg>
                </span>
                <span className="nav-menu-list-text">{t('about.title')}</span>
              </Link>
              
              <Link to="/contact" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z" />
                  </svg>
                </span>
                <span className="nav-menu-list-text">{t('contact.title')}</span>
              </Link>
            </div>
          </div>

           <ArticleSection onItemClick={onClose} />
           <GameSection onItemClick={onClose} /> 

           <div className="nav-menu-section nav-user-section">
            <div className="nav-user-header">
              <span className="nav-user-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
                    <path d="M19.727 20.447c-.455-1.276-1.46-2.403-2.857-3.207S13.761 16 12 16s-3.473.436-4.87 1.24s-2.402 1.931-2.857 3.207" />
                    <circle cx="12" cy="8" r="4" />
                  </g>
                </svg>
              </span>
              {isLoggedIn ? (
                <Link to="/account" onClick={onClose}>
                   <span className="nav-user-title">{t('navigation.account')}</span>
                </Link>
              ) : (
                <div className="nav-user-row">
                    <span className="nav-action-text" style={{opacity: 0.5}}>{t('navigation.account')}</span>
                  <div className="nav-language-in-grid">
                    <LanguageSelector t={t} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="nav-user-actions">
              <div className="nav-user-row">
                {isLoggedIn ? (
                  <>
                    <Link to="/favorites" className="nav-user-action" onClick={onClose}>
                      <span className="nav-action-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.99.99 0 0 0 1.024 0C21.126 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3" />
                        </svg>
                      </span>
                      <span className="nav-action-text">{t('favorites.title')}</span>
                    </Link>
                    
                    <Link to="/logout" className="nav-user-action" onClick={onClose}>
                      <span className="nav-action-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z" />
                        </svg>
                      </span>
                      <span className="nav-action-text">{t('common.logout')}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/connection" className="nav-user-action nav-user-single" onClick={onClose}>
                      <span className="nav-action-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.45-1.45L10.1 13H3v-2h7.1L8.55 9.45L10 8l5 5z" />
                        </svg>
                      </span>
                      <span className="nav-action-text">{t('common.login')}</span>
                    </Link>
                   
                  </>
                )}
              </div>
              
              <Link to="/terms" className="nav-user-action nav-user-single" onClick={onClose}>
                <span className="nav-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                      <path fill="currentColor" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10S4.477 0 10 0m0 1.395a8.605 8.605 0 1 0 0 17.21a8.605 8.605 0 0 0 0-17.21M9.855 7.21c.385 0 .697.313.697.698v7.558a.698.698 0 0 1-1.395 0V7.907c0-.385.312-.698.698-.698m.028-2.79a.93.93 0 1 1 0 1.86a.93.93 0 0 1 0-1.86" />
                    </svg>
                </span>
                <span className="nav-action-text">{t('terms.title')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverlayMenu