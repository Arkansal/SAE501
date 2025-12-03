import React, { useState } from 'react'
import './Connection.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'


function Connection() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    //a voir
    console.log('Connexion:', { email, password, rememberMe })
  }

  return (
    <div className="connection-container">
      <div className="connection-content">
        <div className="connection-header-section">
          <h1>Bienvenue sur Artémis</h1>
        </div>

        <form onSubmit={handleSubmit} className="connection-form">
          <h2>Connexion</h2>
          
          <div className="connection-input-group">
            <input
              type="text"
              placeholder="Pseudo ou Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="connection-form-input"
            />
          </div>

          <div className="connection-input-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="connection-form-input"
              required
            />
          </div>

          <div className="connection-checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              required
            />
            <label htmlFor="remember">Se souvenir de moi</label>
          </div>

          <button type="submit" className="connection-submit-button">
            Se connecter
          </button>

          <div className="connection-form-links">
            <a href="#" className="connection-forgot-password">Mot de passe oublié ?</a>
            <a href="/register" className="connection-create-account">Créer un compte</a>
          </div>
        </form>
        
        <div className="connection-logo-section">
          <div className="connection-logo">
            <img src={artemisLogo} alt="Artémis" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Connection