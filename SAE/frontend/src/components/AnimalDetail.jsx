import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AnimalDetail.css'

function AnimalDetailModal({ animal, onClose, favorites = new Set(), onToggleFavorite }) {
  const [animalData, setAnimalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)
  const [isLocalFavorited, setIsLocalFavorited] = useState(false)

  useEffect(() => {
    if (animal) {
      fetchAnimalData(animal.id || animal)
      // Initialiser avec l'état actuel des favoris
      setIsLocalFavorited(favorites.has(animal.id))
    }
  }, [animal, favorites])

  const fetchAnimalData = async (animalId) => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/animals/${animalId}`
      )
      const data = await response.json()
      setAnimalData(data)
    } catch (error) {
      console.error('Erreur API:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (e) => {
    e.stopPropagation()
    
    // Changer le visuel immédiatement
    setIsLocalFavorited(!isLocalFavorited)
    
    // Appeler la fonction du parent quand elle sera prête
    if (onToggleFavorite) {
      onToggleFavorite(displayAnimal.id)
    }
  }

  const handleImageError = () => {
    if (displayAnimal.images && imageIndex < displayAnimal.images.length - 1) {
      const nextIndex = imageIndex + 1
      console.log('➡️ Passage à l\'image suivante (index ' + nextIndex + '):', displayAnimal.images[nextIndex])
      setImageIndex(nextIndex)
    } else {
      console.log('⚠️ Pas d\'image valide trouvée, affichage du placeholder')
    }
  }

  if (!animal) return null

  const displayAnimal = animalData || animal

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER FIXE */}
        <div className="modal-header">
          <button 
            className={`modal-favorite-btn ${isLocalFavorited ? 'modal-favorite-active' : ''}`}
            onClick={toggleFavorite}
            title={isLocalFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {isLocalFavorited ? (
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
          </button>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
            </svg>
          </button>
        </div>

        {/* CONTENU SCROLLABLE */}
        <div className="modal-scroll-container">
          {loading ? (
            <p className="loading">Chargement...</p>
          ) : (
            <>
              {/* Titre + Sous-titre */}
              <div className="animal-title-header">
                <h2>{displayAnimal.commonName || 'Sans nom'}</h2>
                <p className="scientific-name">{displayAnimal.scientificName || 'Non disponible'}</p>
              </div>

              {/* Badges d'extinction - 5 colonnes avec niveau au centre */}
              <div className="extinction-badges">
                {(() => {
                  const extinctionLevels = ['NE', 'DI', 'PM', 'QM', 'VU', 'ED', 'DC', 'ES', 'ET']
                  const extinctionColors = {
                    'NE': '#C7C7C7',
                    'DI': '#C7C7C7',
                    'PM': '#047060',
                    'QM': '#D4D125',
                    'VU': '#FDB216',
                    'ED': '#FA6B13',
                    'DC': '#F00707',
                    'ES': '#C41111',
                    'ET': '#000000'
                  }
                  
                  const currentLevel = displayAnimal.extinctLevel || 'LC'
                  const extinctionMapping = {
                    'NE': 'NE',
                    'DD': 'DI',
                    'LC': 'PM',
                    'NT': 'QM',
                    'VU': 'VU',
                    'EN': 'ED',
                    'CR': 'DC',
                    'EW': 'ES',
                    'EX': 'ET'
                  }
                  const currentLevelFR = extinctionMapping[currentLevel] || 'PM'
                  const currentIndex = extinctionLevels.indexOf(currentLevelFR)
                  
                  const badges = []
                  
                  for (let i = currentIndex - 2; i < currentIndex; i++) {
                    if (i >= 0) {
                      badges.push(extinctionLevels[i])
                    } else {
                      badges.push(null)
                    }
                  }
                  
                  badges.push(currentLevelFR)
                  
                  for (let i = currentIndex + 1; i <= currentIndex + 2; i++) {
                    if (i < extinctionLevels.length) {
                      badges.push(extinctionLevels[i])
                    } else {
                      badges.push(null)
                    }
                  }
                  
                  return badges.map((level, index) => 
                    level ? (
                      <Link 
                        key={index}
                        to={`/criteria/${level}`}
                        onClick={onClose}
                        style={{ textDecoration: 'none' }}
                      >
                        <span 
                          className={`badge ${level === currentLevelFR ? 'badge-active' : ''}`}
                          style={{ 
                            backgroundColor: extinctionColors[level]
                          }}
                        >
                          {level}
                        </span>
                      </Link>
                    ) : (
                      <span 
                        key={index}
                        className="badge"
                        style={{ 
                          backgroundColor: 'white'
                        }}
                      />
                    )
                  )
                })()}
              </div>

              {/* Image + Infos rapides en 2 colonnes */}
              <div className="animal-content-grid">
                {/* Colonne 1: Image */}
                <div className="animal-image-section">
                  <img 
                    src={
                      displayAnimal.images && displayAnimal.images.length > 0
                        ? displayAnimal.images[imageIndex]
                        : '/placeholder-animal.png'
                    }
                    alt={displayAnimal.commonName}
                    className="animal-image"
                    onError={handleImageError}
                  />
                </div>

                {/* Colonne 2: Infos rapides */}
                <div className="quick-info">
                  <p><strong>Famille:</strong> {displayAnimal.family || 'Non disponible'}</p>
                  <p><strong>Type:</strong> {displayAnimal.type || 'Non disponible'}</p>
                  <p><strong>Nombre:</strong> {displayAnimal.population || 'Non disponible'}</p>
                </div>
              </div>

              {/* Section Habitat */}
              {displayAnimal.countries && displayAnimal.countries.length > 0 ? (
                <div className="habitat-section">
                  <h3>Habitat:</h3>
                  <div className="habitat-list">
                    {displayAnimal.countries.map((country, index) => (
                      <div key={index} className="habitat-item">
                        <h4>{country.name || country}</h4>
                        <p><strong>Origine:</strong> {country.origin || 'Non disponible'}</p>
                        <p><strong>Présence:</strong> {country.presence || 'Non disponible'}</p>
                        <p><strong>Saison:</strong> {country.season || 'Non disponible'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="habitat-section">
                  <h3>Habitat:</h3>
                  <p className="no-data">Manque de données</p>
                </div>
              )}

              {/* Section Evolution de la population */}
              <div className="habitat-section">
                <h3>Évolution de la population:</h3>
                <div className="habitat-section">
                  <p>Manque de données</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnimalDetailModal