import React, { useState } from 'react'
import './Register.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'
import { useNavigate } from 'react-router-dom'

// Composants SVG pour les drapeaux
const FrenchFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 36 36">
    <path fill="#ed2939" d="M36 27a4 4 0 0 1-4 4h-8V5h8a4 4 0 0 1 4 4z"></path>
    <path fill="#002495" d="M4 5a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h8V5z"></path>
    <path fill="#eee" d="M12 5h12v26H12z"></path>
  </svg>
)

const EnglishFlag = () => (
<svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 36 36">
    <path fill="#00247d" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"></path>
    <path fill="#cf1b2b" d="m25.14 23l9.712 6.801a4 4 0 0 0 .99-1.749L28.627 23zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943zm10-10h2.141l9.711-6.8a4 4 0 0 0-1.937-1.085L23 12.057zm-12.141 0L1.148 6.2a4 4 0 0 0-.991 1.749L7.372 13z"></path>
    <path fill="#eee" d="M36 21H21v10h2v-5.836L31.335 31H32a4 4 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21zM36 9a3.98 3.98 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4 4 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059zM13 5v5.837L4.664 5H4a4 4 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A4 4 0 0 0 0 9v.059L5.628 13H0v2h15V5z"></path>
    <path fill="#cf1b2b" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path>
</svg>
)

const SpanishFlag = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 36 36">
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

// Composant personnalisé pour le sélecteur de langue
function CustomLanguageSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = [
    { code: 'fr', name: 'Français', flag: <FrenchFlag /> },
    { code: 'en', name: 'English', flag: <EnglishFlag /> },
    { code: 'es', name: 'Español', flag: <SpanishFlag /> }
  ]

  const selectedLanguage = languages.find(lang => lang.code === value)

  const handleSelect = (langCode) => {
    onChange(langCode)
    setIsOpen(false)
  }

  return (
    <div className="register-custom-language-select">
      <div 
        className={`register-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >     
        <span>Langue :</span>
        <div className="register-flag-container">
          {selectedLanguage?.flag}
          <span className="register-language-name">{selectedLanguage?.name}</span>
        </div>
      </div>
      
      <div className={`register-select-options ${isOpen ? 'show' : ''}`}>
        {languages.map(lang => (
          <div
            key={lang.code}
            className={`register-select-option ${value === lang.code ? 'selected' : ''}`}
            onClick={() => handleSelect(lang.code)}
          >
            <span className="register-flag">{lang.flag}</span>
            <span>{lang.name}</span>
            <div className="register-radio"></div>
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation côté client
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: pseudo,
          email: email,
          password: password,
          roles: ['ROLE_USER']
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Compte créé avec succès ! ID: ${data.id}`)
        // Réinitialiser le formulaire
        setPseudo('')
        setPassword('')
        setConfirmPassword('')
        setEmail('')
        setAcceptTerms(false)
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          navigate('/');
        }, 2000)
      } else {
        // Gérer les erreurs de validation
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join(', ')
          setError(errorMessages)
        } else {
          setError(data.error || 'Une erreur est survenue lors de la création du compte')
        }
      }
    } catch (err) {
      setError('Erreur de connexion au serveur. Veuillez réessayer.')
      console.error('Erreur:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-header-section">
          <h1>Créer un compte</h1>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#efe',
            color: '#3a3',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #cfc'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-input-group">
            <input
              type="text"
              placeholder="Pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="register-form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="register-input-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-form-input"
              required
              minLength="6"
              disabled={isLoading}
            />
          </div>

          <div className="register-input-group">
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="register-form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="register-input-group">
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="register-language-group">
            <CustomLanguageSelect 
              value={language} 
              onChange={setLanguage} 
            />
          </div>

          <div className="register-checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              disabled={isLoading}
            />
            <label htmlFor="terms">
              J'accepte les <span className="register-terms-link">Conditions d'utilisation</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="register-submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Création en cours...' : 'Créer'}
          </button>
        </form>

        <div className="register-logo-section">
            <div className="register-logo">
                <img src={artemisLogo} alt="Artémis" />
            </div>
        </div> 
      </div>
    </div>
  )
}

export default Register