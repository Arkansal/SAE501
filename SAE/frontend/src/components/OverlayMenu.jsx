// SAE/frontend/src/components/OverlayMenu.jsx
import React from 'react'
import { Link } from 'react-router-dom'
// import ArticleSection from './ArticleSection'
// import GameSection from './GameSection'
import './Navigation.css'

function OverlayMenu({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="nav-menu-overlay">
      <div className="nav-menu-backdrop" onClick={onClose}></div>
      
      <div className="nav-menu-content">
        <div className="nav-menu-header">
          <h2>Menu</h2>
          <button className="nav-close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 16 16">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
            </svg>
          </button>
        </div>

        <div className="nav-menu-scroll-container">
          {/* Navigation principale - Liste verticale */}
          <div className="nav-menu-section">
            <div className="nav-menu-list">
              <Link to="/" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M16.219 1.943c.653.512 1.103 1.339 1.287 2.205l.065.026l2.045.946a.66.66 0 0 1 .384.597v12.367a.665.665 0 0 1-.85.634l-5.669-1.6l-6.74 1.858a.67.67 0 0 1-.371-.004L.474 17.217a.66.66 0 0 1-.474-.63V3.998c0-.44.428-.756.855-.632l5.702 1.661l2.898-.887q.06-.018.122-.025c.112-.656.425-1.286.95-1.9c.623-.73 1.716-1.158 2.781-1.209c1.105-.053 1.949.183 2.91.936M1.333 4.881v11.215l4.87 1.449V6.298zm8.209.614l-2.006.613v11.279l5.065-1.394v-3.295c0-.364.299-.659.667-.659s.666.295.666.66v3.177l4.733 1.335V6.136l-1.12-.52q-.028.165-.073.323A6.1 6.1 0 0 1 16.4 8.05l-2.477 3.093a.67.67 0 0 1-1.073-.037l-2.315-3.353q-.574-.799-.801-1.436a3.7 3.7 0 0 1-.192-.822m3.83-3.171c-.726.035-1.472.327-1.827.742c-.427.5-.637.968-.679 1.442c-.05.571-.016.974.126 1.373c.105.295.314.669.637 1.12l1.811 2.622l1.91-2.385a4.8 4.8 0 0 0 .841-1.657c.24-.84-.122-2.074-.8-2.604c-.695-.545-1.22-.692-2.018-.653m.138.697c1.104 0 2 .885 2 1.977a1.99 1.99 0 0 1-2 1.977c-1.104 0-2-.885-2-1.977s.896-1.977 2-1.977m0 1.318a.663.663 0 0 0-.667.659c0 .364.299.659.667.659a.663.663 0 0 0 .666-.66a.663.663 0 0 0-.666-.658" />
                  </svg>
                </span>
                <span className="nav-menu-list-text">Carte</span>
              </Link>
              
              <Link to="/scan" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9.5 6.5v3h-3v-3zM11 5H5v6h6zm-1.5 9.5v3h-3v-3zM11 13H5v6h6zm6.5-6.5v3h-3v-3zM19 5h-6v6h6zm-6 8h1.5v1.5H13zm1.5 1.5H16V16h-1.5zM16 13h1.5v1.5H16zm-3 3h1.5v1.5H13zm1.5 1.5H16V19h-1.5zM16 16h1.5v1.5H16zm1.5-3H19v1.5h-1.5zm0 3H19V19h-1.5zM22 7h-2V4a2 2 0 0 0-2-2h-3v2h3v3h2zm0 10v3a2 2 0 0 1-2 2h-3v-2h3v-3zM2 7h2V4h3V2H4a2 2 0 0 0-2 2zm0 10v-3h2v3h3v2H4a2 2 0 0 1-2-2"/>
                  </svg>
                </span>
                <span className="nav-menu-list-text">Scan moi</span>
              </Link>
              
              <Link to="/partners" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2s-.89 2-2 2s-2-.89-2-2M4 1v2h2l3.6 7.59l-1.35 2.44C8.04 13.38 8.2 13.76 8.46 14H19v2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L18.7 9H7l-.64-1.37L6.16 7l-.95-2H3V3h2.25l.95 2zm0 18c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m11 0c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1"/>
                  </svg>
                </span>
                <span className="nav-menu-list-text">Partenaire</span>
              </Link>
              
              <Link to="/donation" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/>
                  </svg>
                </span>
                <span className="nav-menu-list-text">Donation</span>
              </Link>
              
              <Link to="/about" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/>
                  </svg>
                </span>
                <span className="nav-menu-list-text">Artémis</span>
              </Link>
              
              <Link to="/contact" className="nav-menu-list-item" onClick={onClose}>
                <span className="nav-menu-list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z"/>
                  </svg>
                </span>
                <span className="nav-menu-list-text">Contact</span>
              </Link>
            </div>
          </div>

          {/* Section Articles avec scroll horizontal */}
            {/* <ArticleSection onItemClick={onClose} /> */}

            {/* Section Jeux avec scroll horizontal */}
            {/* <GameSection onItemClick={onClose} /> */}

          {/* Section utilisateur */}
          <div className="nav-menu-section nav-user-section">
            <div className="nav-user-header">
              <span className="nav-user-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"/>
                </svg>
              </span>
              <span className="nav-user-title">Nom d'utilisateur</span>
            </div>
            
            <div className="nav-user-actions">
              <Link to="/favorites" className="nav-user-action" onClick={onClose}>
                <span className="nav-action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/>
                  </svg>
                </span>
                <span className="nav-action-text">Favoris</span>
              </Link>
              
              <Link to="/logout" className="nav-user-action" onClick={onClose}>
                <span className="nav-action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"/>
                  </svg>
                </span>
                <span className="nav-action-text">Déconnection</span>
              </Link>
              
              <Link to="/terms" className="nav-user-action" onClick={onClose}>
                <span className="nav-action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z"/>
                  </svg>
                </span>
                <span className="nav-action-text">Condition d'utilisation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverlayMenu