import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Contact.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'
import { api } from '../services/api'

function Contact() {
  const { t } = useTranslation()
  const [pseudo, setPseudo] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    const storedPseudo = localStorage.getItem('pseudo')
    const storedEmail = localStorage.getItem('mail')

    if (!token) {
      alert(t('contact.notConnectedMessage'))
      navigate('/connection')
      return
    }

    setIsConnected(true)

    if (storedPseudo) {
      setPseudo(storedPseudo)
    }
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [navigate, t])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/test-contact', {
        pseudo,
        email,
        message
      })

      const data = await response.json()
      console.log(data)

      if (data.success) {
        alert(t('contact.successMessage'))
        setMessage('')
      } else {
        alert(t('contact.errorMessage') + (data.error || ''))
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi ' + error)
      alert(t('contact.sendErrorMessage'))
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-header-section">
          <h1>{t('contact.title')}</h1>
        </div>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-input-group">
            <input
              type="text"
              placeholder={t('contact.pseudoPlaceholder')}
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="contact-form-input"
              required
              readOnly // Empêche la modification du pseudo
            />
          </div>
          <div className="contact-input-group">
            <input
              type="email"
              placeholder={t('contact.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="contact-form-input"
              required
              readOnly // Empêche la modification de l'email
            />
          </div>
          <div className="contact-input-group">
            <textarea
              placeholder={t('contact.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="contact-form-textarea"
              rows="6"
              required
            />
          </div>
          <button
            type="submit"
            className="contact-submit-button"
            disabled={loading}
          >
            {loading ? t('contact.sendingButton') : t('contact.sendButton')}
          </button>
        </form>
        <div className="contact-logo-section">
          <div className="contact-logo">
            <img src={artemisLogo} alt="Artémis" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact