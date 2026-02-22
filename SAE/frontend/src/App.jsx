import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './App.css'
import { api } from './services/api'
import About from './pages/About'
import Connection from './pages/Connection'
import Register from './pages/Register'
import Contact from './pages/Contact'
import BottomNavigation from './components/BottomNavigation'
import Account from './pages/Account'
import Map from './pages/Map'
import Logout from './pages/Logout'
import Terms from './pages/Terms'
import ArticleDetail from './articles/ArticleDetail'
import Donation from './pages/Donation'
import Scan from './pages/Scan'
import Critere from './pages/Critere'
import DonationSuccess from './pages/DonationSuccess'
import DonationCancel from './pages/DonationCancel'
import Articles from './pages/Articles'
import Partner from './pages/Partner'
import Favorites from './pages/Favorites'
import GameTotem from './Games/Quiz-totem/Quiz-totem'
import CodeDuVivant from './Games/Code-du-vivant/Code-du-vivant'
import ExtinctionGame from './Games/Quiz-totem/ExtinctionGame'


function Home() {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/test')
      .then(response => response.json())
      .then(data => {
        setApiData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <div className="App">
      <h1>React + Symfony API</h1>
      <div>
        <h2>Réponse de l'API :</h2>
        <pre>{JSON.stringify(apiData, null, 2)}</pre>
      </div>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const pagesWithoutMenu = ['/register', '/connection']
  const shouldShowMenu = !pagesWithoutMenu.includes(location.pathname)

  useEffect(() => {
    const initializeUserLanguage = async () => {
      try {
        const savedLang = localStorage.getItem('i18nextLng')
        if (savedLang) {
          await i18n.changeLanguage(savedLang)
          return
        }

        if (api.isLoggedIn()) {
          const user = await api.getCurrentUser()
          if (user && user.language) {
            await i18n.changeLanguage(user.language)
            return
          }
        }

        const browserLang = navigator.language || navigator.userLanguage
        await i18n.changeLanguage(browserLang)
      } catch (err) { }
    }

    initializeUserLanguage()
  }, [i18n])

  const isGamePage = location.pathname.includes('/game-totem')
  const isCodeDuVivantPage = location.pathname.includes('/game-code-du-vivant')

  if (isGamePage) {
    document.getElementById('root').classList.add('game-page')
    document.getElementById('root').classList.remove('code-du-vivant-page')
  } else if (isCodeDuVivantPage) {
    document.getElementById('root').classList.add('code-du-vivant-page')
    document.getElementById('root').classList.remove('game-page')
  } else {
    document.getElementById('root').classList.remove('game-page', 'code-du-vivant-page')
  }

  return (
    <div className={`app ${shouldShowMenu ? 'with-navigation' : ''}`} id="pages">
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/logout' element={<Logout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/critere" element={<Critere />} />
        <Route path="/donation/success" element={<DonationSuccess />} />
        <Route path="/donation/cancel" element={<DonationCancel />} />
        <Route path="/partners" element={<Partner />} />
        <Route path="/game-totem" element={<GameTotem />} />
        <Route path="/game-code-du-vivant" element={<CodeDuVivant />} />
        <Route path="/extinction-game" element={<ExtinctionGame />} />
      </Routes>
      {shouldShowMenu && <BottomNavigation />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App