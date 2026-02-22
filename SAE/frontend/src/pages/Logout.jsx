import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Logout() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [message, setMessage] = useState(t('logout.disconnecting'))

  useEffect(() => {
    // Supprime le token
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('mail')

    setMessage(t('logout.disconnected'))

    // Redirige après 1 seconde
    const timer = setTimeout(() => {
      navigate('/')
    }, 1000)

    return () => clearTimeout(timer)
  }, [navigate, t])

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
      <p>{t('logout.redirecting')}</p>
    </div>
  )
}

export default Logout