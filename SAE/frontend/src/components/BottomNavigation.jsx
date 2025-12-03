// SAE/frontend/src/components/BottomNavigation.jsx
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OverlayMenu from './OverlayMenu'
import './Navigation.css'

function BottomNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    if (path) {
      navigate(path)
    }
  }

  const handleMenuClick = () => {
    setIsMenuOpen(true)
  }

  // Déterminer quel bouton est actif
  const isCarteActive = location.pathname === '/'
  const isArticlesActive = location.pathname.startsWith('/articles')

  return (
    <>
      <nav className="nav-bottom-navigation">
        <div className="nav-container">
          <button
            className={`nav-button ${isCarteActive ? 'nav-active' : ''}`}
            onClick={() => handleNavigation('/')}
          >
            <span className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path fill="currentColor" d="M16.219 1.943c.653.512 1.103 1.339 1.287 2.205l.065.026l2.045.946a.66.66 0 0 1 .384.597v12.367a.665.665 0 0 1-.85.634l-5.669-1.6l-6.74 1.858a.67.67 0 0 1-.371-.004L.474 17.217a.66.66 0 0 1-.474-.63V3.998c0-.44.428-.756.855-.632l5.702 1.661l2.898-.887q.06-.018.122-.025c.112-.656.425-1.286.95-1.9c.623-.73 1.716-1.158 2.781-1.209c1.105-.053 1.949.183 2.91.936M1.333 4.881v11.215l4.87 1.449V6.298zm8.209.614l-2.006.613v11.279l5.065-1.394v-3.295c0-.364.299-.659.667-.659s.666.295.666.66v3.177l4.733 1.335V6.136l-1.12-.52q-.028.165-.073.323A6.1 6.1 0 0 1 16.4 8.05l-2.477 3.093a.67.67 0 0 1-1.073-.037l-2.315-3.353q-.574-.799-.801-1.436a3.7 3.7 0 0 1-.192-.822m3.83-3.171c-.726.035-1.472.327-1.827.742c-.427.5-.637.968-.679 1.442c-.05.571-.016.974.126 1.373c.105.295.314.669.637 1.12l1.811 2.622l1.91-2.385a4.8 4.8 0 0 0 .841-1.657c.24-.84-.122-2.074-.8-2.604c-.695-.545-1.22-.692-2.018-.653m.138.697c1.104 0 2 .885 2 1.977a1.99 1.99 0 0 1-2 1.977c-1.104 0-2-.885-2-1.977s.896-1.977 2-1.977m0 1.318a.663.663 0 0 0-.667.659c0 .364.299.659.667.659a.663.663 0 0 0 .666-.66a.663.663 0 0 0-.666-.658" />
              </svg>
            </span>
            <span className="nav-label">Carte</span>
          </button>

          <button
            className={`nav-button ${isArticlesActive ? 'nav-active' : ''}`}
            onClick={() => handleNavigation('/articles')}
          >
            <span className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8h2m-2 4h2m0 4H7m0-8v4h4V8zM5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"></path>
              </svg>
            </span>
            <span className="nav-label">Articles</span>
          </button>

          <button
            className="nav-button"
            onClick={handleMenuClick}
          >
            <span className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"></path>
              </svg>
            </span>
            <span className="nav-label">Menu</span>
          </button>
        </div>
      </nav>

      {/* Menu Overlay */}
      <OverlayMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  )
}

export default BottomNavigation