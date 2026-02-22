import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../services/api'
import './GameAnimalFiche.css'

function GameAnimalFiche({ animal, onClose }) {
  const { t } = useTranslation()
  const [animalData, setAnimalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)
  const [habitatData, setHabitatData] = useState(null)

  // Définition de displayAnimal et animalImages au début
  const displayAnimal = animalData || animal
  const animalImages = displayAnimal ? (displayAnimal.images || displayAnimal.image || []) : []

  // Récupérer les données de l'animal une seule fois
  useEffect(() => {
    if (animal) {
      fetchAnimalData(animal.id || animal)
    }
  }, [animal])

  const fetchAnimalData = async (animalId) => {
    setLoading(true)
    try {
      // Récupérer les données de l'animal
      const animalResponse = await api.get(`/animals/${animalId}`)
      const animalDataResult = await animalResponse.json()
      setAnimalData(animalDataResult)

      // Récupérer les pays de l'animal
      const countriesResponse = await api.get(
        `/animal_countries?animal=${animalId}`
      )
      const countriesData = await countriesResponse.json()
      const currentAnimalCountries = countriesData.map(item => ({
        ...item.country,
        origin: item.origin,
        presenceType: item.presenceType
      }))

      // Récupérer les environnements de l'animal
      const environmentsResponse = await api.get(
        `/animal_environments?animal=${animalId}`
      )
      const environmentsData = await environmentsResponse.json()
      const environments = environmentsData.map(item => item.environment)

      // Combiner les données
      setHabitatData({
        countries: currentAnimalCountries,
        environments: environments
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => {
    if (animalImages && imageIndex < animalImages.length - 1) {
      const nextIndex = imageIndex + 1
      setImageIndex(nextIndex)
    }
  }

  const handlePreviousImage = () => {
    setImageIndex((prev) => (prev === 0 ? (animalImages?.length || 1) - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setImageIndex((prev) => (prev === (animalImages?.length || 1) - 1 ? 0 : prev + 1))
  }

  if (!animal) return null

  return (
    <div className="game-fiche-overlay" onClick={onClose}>
      <div className="game-fiche-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER FIXE */}
        <div className="game-fiche-header">
          <button className="game-fiche-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
            </svg>
          </button>
        </div>

        {/* CONTENU SCROLLABLE */}
        <div className="game-fiche-scroll-container">
          {loading ? (
            <p className="game-fiche-loading">{t('games.codeDuVivant.gameAnimalFiche.loading')}</p>
          ) : (
            <>
              {/* Titre + Sous-titre */}
              <div className="game-fiche-title-header">
                <h2>{displayAnimal.commonName || t('games.codeDuVivant.gameAnimalFiche.noName')}</h2>
                <p className="game-fiche-scientific-name">{displayAnimal.scientificName || t('games.codeDuVivant.gameAnimalFiche.notAvailable')}</p>
              </div>

              {/* Badges d'extinction */}
              <div className="game-fiche-extinction-badges">
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
                      <span
                        key={index}
                        className={`game-fiche-badge ${level === currentLevelFR ? 'game-fiche-badge-active' : ''}`}
                        style={{
                          backgroundColor: extinctionColors[level]
                        }}
                      >
                        {level}
                      </span>
                    ) : (
                      <span
                        key={index}
                        className="game-fiche-badge"
                        style={{
                          backgroundColor: 'white'
                        }}
                      />
                    )
                  )
                })()}
              </div>

              {/* Contenu en grille */}
              <div className="game-fiche-content-grid">
                <div className="game-fiche-image-section">
                  <img
                    src={
                      animalImages && animalImages.length > 0
                        ? animalImages[imageIndex]
                        : '/placeholder-animal.png'
                    }
                    alt={displayAnimal.commonName}
                    className="game-fiche-image"
                    onError={handleImageError}
                  />
                  {animalImages.length > 1 && (
                    <div className="game-fiche-image-controls">
                      <button className="game-fiche-image-btn" onClick={handlePreviousImage}>
                        ❮
                      </button>
                      <span className="game-fiche-image-counter">
                        {imageIndex + 1}/{animalImages.length}
                      </span>
                      <button className="game-fiche-image-btn" onClick={handleNextImage}>
                        ❯
                      </button>
                    </div>
                  )}
                </div>

                <div className="game-fiche-quick-info">
                  <p><strong>{t('games.codeDuVivant.gameAnimalFiche.family')}</strong> {displayAnimal.family || t('games.codeDuVivant.gameAnimalFiche.notAvailable')}</p>
                  <p><strong>{t('games.codeDuVivant.gameAnimalFiche.type')}</strong> {displayAnimal.type || t('games.codeDuVivant.gameAnimalFiche.notAvailable')}</p>
                  <p><strong>{t('games.codeDuVivant.gameAnimalFiche.population')}</strong> {displayAnimal.population || t('games.codeDuVivant.gameAnimalFiche.notAvailable')}</p>
                </div>
              </div>

              {/* Section Habitat - Pays */}
              {habitatData?.countries && habitatData.countries.length > 0 ? (
                <div className="game-fiche-habitat-section">
                  <h3>{t('games.codeDuVivant.gameAnimalFiche.habitat')}</h3>
                  <div className="game-fiche-countries-list">
                    {habitatData.countries.map((country, countryIndex) => (
                      <div key={countryIndex} className="game-fiche-country-item">
                        <h4>{country.countryName || country.name || t('games.codeDuVivant.gameAnimalFiche.unknownCountry')}</h4>
                        <p><strong>{t('games.codeDuVivant.gameAnimalFiche.origin')}</strong> {country.origin || t('games.codeDuVivant.gameAnimalFiche.notAvailable')}</p>
                        <p><strong>{t('games.codeDuVivant.gameAnimalFiche.presence')}</strong> {country.presenceType || t('games.codeDuVivant.gameAnimalFiche.notAvailable')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="game-fiche-habitat-section">
                  <h3>{t('games.codeDuVivant.gameAnimalFiche.habitat')}</h3>
                  <p className="no-data">{t('games.codeDuVivant.gameAnimalFiche.lackOfData')}</p>
                </div>
              )}

              {/* Section Environnements */}
              {habitatData?.environments && habitatData.environments.length > 0 ? (
                <div className="game-fiche-habitat-section">
                  <h3>{t('games.codeDuVivant.gameAnimalFiche.environments')}</h3>
                  <div className="game-fiche-environments-names">
                    <ul>
                      {habitatData.environments.map((env, envIndex) => (
                        <li key={envIndex}>
                          <strong>{env.environmentName}</strong>
                          {env.type && <span> — {env.type}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="game-fiche-habitat-section">
                  <h3>{t('games.codeDuVivant.gameAnimalFiche.environments')}</h3>
                  <p className="no-data">{t('games.codeDuVivant.gameAnimalFiche.lackOfData')}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameAnimalFiche
