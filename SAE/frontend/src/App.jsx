import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import Connection from './pages/Connection'
import Register from './pages/Register'
import Contact from './pages/Contact'
import BottomNavigation from './components/BottomNavigation'
import Account from './pages/Account'
import Terms from './pages/Terms'
import ArticleDetail from './articles/ArticleDetail'
import ArticleSection from './components/ArticleSection'


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
  // Pages sans menu
  const pagesWithoutMenu = ['/register', '/connection']
  const shouldShowMenu = !pagesWithoutMenu.includes(location.pathname)
  
  const isMapPage = location.pathname === '/map'

  return (
    <div className={`app ${shouldShowMenu ? 'with-navigation' : ''}`} id="pages" data-page={isMapPage ? 'map' : 'default'}>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/logout' element={<Logout />}/>
        <Route path="/account" element={<Account />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/articles" element={<ArticleSection />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
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