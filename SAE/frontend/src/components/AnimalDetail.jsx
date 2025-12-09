import { useState } from 'react'
import './AnimalDetail.css'

function AnimalDetailModal({ animal, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false)

  if (!animal) return null

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // TODO: Appel API pour sauvegarder les favoris
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="animal-detail">
          <h2>{animal.common_name}</h2>
          <p className="scientific-name">{animal.scientific_name}</p>

          <div className="info-grid">
            <div className="info-item">
              <label>Famille</label>
              <p>{animal.family || 'Non disponible'}</p>
            </div>
            <div className="info-item">
              <label>Type</label>
              <p>{animal.type || 'Non disponible'}</p>
            </div>
            <div className="info-item">
              <label>Statut</label>
              <p className={`status ${animal.extinct_level}`}>
                {animal.extinct_level}
              </p>
            </div>
          </div>

          <div className="animal-actions">
            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              ♥ {isFavorite ? 'Favori' : 'Ajouter aux favoris'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimalDetailModal