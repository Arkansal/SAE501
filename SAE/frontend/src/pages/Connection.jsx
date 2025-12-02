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
        <div className="header-section">
          <h1>Bienvenue sur Artémis</h1>
        </div>

        <form onSubmit={handleSubmit} className="connection-form">
          <h2>Connexion</h2>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Pseudo ou Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Se souvenir de moi</label>
          </div>

          <button type="submit" className="submit-button">
            Se connecter
          </button>

          <div className="form-links">
            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
            <a href="#" className="create-account">Créer un compte</a>
          </div>
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

export default Connection