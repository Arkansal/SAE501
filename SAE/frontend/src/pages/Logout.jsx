import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Déconnexion en cours...')

  useEffect(() => {
    // Supprime le token
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('mail')
    
    setMessage('Vous êtes déconnecté ✓')
    
    // Redirige après 1 seconde
    const timer = setTimeout(() => {
      navigate('/connection')
    }, 1000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2>{message}</h2>
      <p>Redirection vers la page de connexion...</p>
    </div>
  )
}

export default Logout