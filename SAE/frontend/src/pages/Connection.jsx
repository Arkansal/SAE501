import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Connection.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'
import { api } from '../services/api';

function Connection() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login_check', { username: email, password: password });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      localStorage.setItem('mail', email)
      localStorage.setItem('jwt_token', data.token);

      if (data.user && data.user.pseudo) {
        localStorage.setItem('pseudo', data.user.pseudo);
      }

      data.user.language ? localStorage.setItem('language', data.user.language) : localStorage.setItem('language', 'fr');

      navigate('/');
    } catch (err) {
      setError(t('login.errorMessage'))
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="connection-container">
      <div className="connection-content">
        <div className="connection-header-section">
          <h1>{t('login.title')}</h1>
        </div>
        <form onSubmit={handleSubmit} className="connection-form">
          <h2>{t('login.heading')}</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="connection-input-group">
            <input
              type="text"
              placeholder={t('login.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="connection-form-input"
              required
            />
          </div>
          <div className="connection-input-group">
            <input
              type="password"
              placeholder={t('login.password')}
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
            <label htmlFor="remember">{t('login.rememberMe')}</label>
          </div>
          <button
            type="submit"
            className="connection-submit-button"
            disabled={loading}
          >
            {loading ? t('login.submitting') : t('login.submit')}
          </button>
          <div className="connection-form-links">
            <a href="#" className="connection-forgot-password">{t('login.forgotPassword')}</a>
            <a href="/register" className="connection-create-account">{t('login.createAccount')}</a>
          </div>
        </form>
        <div className="connection-logo-section">
          <div className="connection-logo">
            <img src={artemisLogo} alt="Artemis" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Connection