import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import Connection from './pages/Connection'
import Register from './pages/Register'
import Contact from './pages/Contact'
import BottomNavigation from './components/BottomNavigation'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'


function Home() {
  return (
    <div style={{ height: '100vh', width: '100vw'}} className="map-page">
      <MapContainer 
        center={[48.8566, 2.3522]} 
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  // Pages sans menu
  const pagesWithoutMenu = ['/register', '/connection']
  const shouldShowMenu = !pagesWithoutMenu.includes(location.pathname)

  return (
    <div className={`app ${shouldShowMenu ? 'with-navigation' : ''}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
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