import { useState, useEffect } from 'react'
import './AnimalDetail.css'

function AnimalDetailModal({ animal, onClose, favorites = new Set(), onToggleFavorite }) {
  const [animalData, setAnimalData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (animal) {
      fetchAnimalData(animal.id || animal)
    }
  }, [animal])

  const fetchAnimalData = async (animalId) => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/animals/${animalId}`
      )
      const data = await response.json()
      
      console.log('🐾 Objet complet:', data)
      console.log('🔍 Toutes les propriétés:')
      Object.keys(data).forEach(key => {
        console.log(`  ${key}: ${data[key]}`)
      })
      
      setAnimalData(data)
    } catch (error) {
      console.error('Erreur API:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (e, animalId) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite(animalId)
    }
  }

  if (!animal) return null

  const displayAnimal = animalData || animal
  const isFavorited = favorites.has(displayAnimal.id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* En-tête avec boutons */}
        <div className="modal-header">
          <div 
            className={`animal-favorite ${isFavorited ? 'animal-favorite-active' : ''}`}
            onClick={(e) => toggleFavorite(e, displayAnimal.id)}
          >
            {isFavorited ? (
              // Icône coeur plein (favori actif)
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.19 12.683c-2.5 5.41-8.62 8.2-8.88 8.32a.85.85 0 0 1-.62 0c-.25-.12-6.38-2.91-8.88-8.32c-1.55-3.37-.69-7 1-8.56a4.93 4.93 0 0 1 4.36-1.05a6.16 6.16 0 0 1 3.78 2.62a6.15 6.15 0 0 1 3.79-2.62a4.93 4.93 0 0 1 4.36 1.05c1.78 1.56 2.65 5.19 1.09 8.56" />
              </svg>
            ) : (
              // Icône coeur vide (favori inactif)
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.99.99 0 0 0 1.024 0C21.126 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3" />
              </svg>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <p className="loading">Chargement...</p>
        ) : (
          <>
            {/* Section Image + Titre + Statuts */}
            <div className="animal-header-section">
              <div className="animal-image-container">
                <img 
                  src={
                    displayAnimal.image_url && displayAnimal.image_url.length > 0
                      ? displayAnimal.image_url[0]
                      : '/placeholder-animal.png'
                  }
                  alt={displayAnimal.common_name}
                  className="animal-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-animal.png'
                  }}
                />
              </div>

              <div className="animal-title-section">
                <h2>{displayAnimal.commonName || 'Sans nom'}</h2>
                <p className="scientific-name">
                  {displayAnimal.scientificName || 'Non disponible'}
                </p>

                {/* Badges de statut d'extinction */}
                <div className="extinction-badges">
                  {displayAnimal.extinctLevel && (
                    <span className={`badge badge-${displayAnimal.extinctLevel.toLowerCase()}`}>
                      {displayAnimal.extinctLevel}
                    </span>
                  )}
                </div>

                {/* Infos rapides */}
                <div className="quick-info">
                  <p><strong>Famille:</strong> {displayAnimal.family || 'Non disponible'}</p>
                  <p><strong>Type:</strong> {displayAnimal.type || 'Non disponible'}</p>
                </div>

                {/* Description */}
                <p className="animal-description">
                  {displayAnimal.description || 'La description de cet animal sera affichée ici.'}
                </p>
              </div>
            </div>

            {/* Section Habitat - Scrollable */}
            <div className="habitat-section">
              <h3>Habitat:</h3>
              <div className="habitat-list">
                {displayAnimal.countries && displayAnimal.countries.length > 0 ? (
                  displayAnimal.countries.map((country, index) => (
                    <div key={index} className="habitat-item">
                      <h4>{country.name || country}</h4>
                      <p><strong>Origine:</strong> {country.origin || 'Non disponible'}</p>
                      <p><strong>Présence:</strong> {country.presence || 'Non disponible'}</p>
                      <p><strong>Saison:</strong> {country.season || 'Non disponible'}</p>
                    </div>
                  ))
                ) : (
                  <p>Habitat non disponible</p>
                )}
              </div>
            </div>

            {/* Section Evolution de la population - Tableau scrollable */}
            <div className="population-section">
              <h3>Évolution de la population:</h3>
              <div className="population-table-wrapper">
                <table className="population-table">
                  <thead>
                    <tr>
                      <th>manque de donée</th>
                      <th>2020</th>
                      <th>2021</th>
                      <th>2022</th>
                      <th>2023</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>20000</td>
                      <td>2250</td>
                      <td>3k</td>
                      <td>85</td>
                      <td>545</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bouton action en bas */}
            <div className="animal-actions">
              <button
                className={`action-btn ${isFavorited ? 'active' : ''}`}
                onClick={(e) => toggleFavorite(e, displayAnimal.id)}
              >
                ♥ {isFavorited ? 'Favori' : 'Ajouter aux favoris'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AnimalDetailModal