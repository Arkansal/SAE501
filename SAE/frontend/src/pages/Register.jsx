import React, { useState } from 'react'
import './Register.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'

// Composant personnalisé pour le sélecteur de langue
function CustomLanguageSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ]

  const selectedLanguage = languages.find(lang => lang.code === value)

  const handleSelect = (langCode) => {
    onChange(langCode)
    setIsOpen(false)
  }

  return (
    <div className="custom-language-select">
      <div 
        className={`select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedLanguage?.flag} {selectedLanguage?.name}
        </span>
      </div>
      
      <div className={`select-options ${isOpen ? 'show' : ''}`}>
        {languages.map(lang => (
          <div
            key={lang.code}
            className={`select-option ${value === lang.code ? 'selected' : ''}`}
            onClick={() => handleSelect(lang.code)}
          >
            <span className="flag">{lang.flag}</span>
            <span>{lang.name}</span>
            <div className="radio"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Register() {
  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('fr')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Inscription:', { 
      pseudo, 
      password, 
      confirmPassword, 
      email, 
      language, 
      acceptTerms 
    })
  }

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="header-section">
          <h1>Créer un compte</h1>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="language-group">
            <label htmlFor="language">Langue</label>
            <CustomLanguageSelect 
              value={language} 
              onChange={setLanguage} 
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              J'accepte les <span className="terms-link">Conditions d'utilisation</span>
            </label>
          </div>

          <button type="submit" className="submit-button">
            Créer
          </button>
        </form>

        <div className="logo-section">
            <div className="logo">
                <img src={artemisLogo} alt="Artémis" />
            </div>
        </div> 
      </div>
    </div>
  )
}

export default Register