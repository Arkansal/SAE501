import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Connection.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'
import { api } from '../services/api';

function Connection() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8000';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('${API_URL}/api/login_check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token } = await response.json();
      localStorage.setItem('jwt_token', token);

      navigate('/');

    } catch (err) {
      setError('Email ou mot de passe incorrect');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="connection-container">
      <div className="connection-content">
        <div className="connection-header-section">
          <h1>Bienvenue sur Artémis</h1>
        </div>
        <form onSubmit={handleSubmit} className="connection-form">
          <h2>Connexion</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="connection-input-group">
            <input
              type="text"
              placeholder="Pseudo ou Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="connection-form-input"
              required
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
            />
            <label htmlFor="remember">Se souvenir de moi</label>
          </div>
          <button
            type="submit"
            className="connection-submit-button"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
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