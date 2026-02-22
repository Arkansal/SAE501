import React, { useState, useEffect } from 'react';
import './WarningPopup.css';
import './animalDetail.css';

function WarningPopup() {
  const [isVisible, setIsVisible] = useState(false);

  // Fonctions utilitaires pour les cookies
  const setCookie = (name, value, hours) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (hours * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
    const hasSeenWarning = getCookie('hasSeenScientificWarning');
    if (!hasSeenWarning) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setCookie('hasSeenScientificWarning', 'true', 12); // Expire après 12 heures
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="detail-modal-overlay" onClick={handleClose}>
      <div className="detail-modal-content warning-popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal-header">
          <div className="warning-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fdb216" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h2 className="warning-title">Attention</h2>
          <button className="detail-modal-close" onClick={handleClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
            </svg>
          </button>
        </div>
        
        <div className="detail-modal-scroll-container warning-body">
          <p>
            Certaines images présentes sur ce site ont été prises dans un <strong>contexte scientifique</strong>.
          </p>
          <p>
            Elles peuvent présenter des spécimens dans des situations réelles de recherche qui pourraient <strong>heurter la sensibilité</strong> de certains utilisateurs.
          </p>
          <div className="warning-action">
            <button className="warning-confirm-btn" onClick={handleClose}>
              J'ai compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarningPopup;
