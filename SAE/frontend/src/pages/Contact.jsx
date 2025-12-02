import React, { useState } from 'react'
import './Contact.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'

function Contact() {
  const [pseudo, setPseudo] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Appeler l'API pour envoyer le message de contact
      console.log('Message de contact:', { pseudo, email, message })
      
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Message envoyé avec succès !')
      
      // Réinitialiser le formulaire
      setPseudo('')
      setEmail('')
      setMessage('')
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="header-section">
          <h1>Contact</h1>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Pseudo prérempli"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="e-mail prérempli"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <textarea
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-textarea"
              rows="6"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer'}
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

export default Contact