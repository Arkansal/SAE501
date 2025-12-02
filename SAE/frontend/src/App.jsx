import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import Connection from './pages/Connection'
import Register from './pages/Register'

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
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connection" element={<Connection />} />
         <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}
export default App