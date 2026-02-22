import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../services/api' // Ajout de l'import API
import './animalDetail.css'

function AnimalDetailModal({ animal, onClose, favorites = new Set(), onToggleFavorite }) {
  const { t } = useTranslation()
  const [animalData, setAnimalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)
  const [isLocalFavorited, setIsLocalFavorited] = useState(false)
  const [habitatData, setHabitatData] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)

  const displayAnimal = animalData || animal
  const animalImages = displayAnimal ? (displayAnimal.images || displayAnimal.image || []) : []

  useEffect(() => {
    if (animal) {
      fetchAnimalData(animal.id || animal)
    }
  }, [animal])

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (animal && api.isLoggedIn()) {
        const animalId = animal.id || animal;
        try {
          const favoriteIds = await api.getFavorites();
          setIsLocalFavorited(favoriteIds.includes(Number(animalId)));
        } catch (e) {
          console.error("Erreur check favori", e);
          setIsLocalFavorited(false);
        }
      } else if (animal) {
        setIsLocalFavorited(favorites.has(animal.id));
      }
    };

    checkFavoriteStatus();
  }, [animal, favorites])

  const fetchAnimalData = async (animalId) => {
    setLoading(true);
    try {
      const cachedAnimals = localStorage.getItem('lastFetchedAnimals');
      if (cachedAnimals) {
        console.log('Cache trouvé, tentative de récupération des données depuis le cache');
        const lastFetchedAnimals = JSON.parse(cachedAnimals);
        const animalRelations = lastFetchedAnimals.filter(a => a.animal.id === Number(animalId));

        if (animalRelations.length > 0) {
          console.log('Animal trouvé dans le cache, construction des données...');
          setAnimalData(animalRelations[0].animal);

          const currentAnimalCountries = animalRelations.map(item => ({
            ...item.country,
            origin: item.origin,
            presenceType: item.presenceType
          }));

          const environmentsResponse = await api.get(`/animal_environments?animal=${animalId}`);
          const environmentsData = await environmentsResponse.json();
          const environments = environmentsData.map(item => item.environment);

          setHabitatData({
            countries: currentAnimalCountries,
            environments: environments
          });
          setLoading(false);
          return; // Data loaded from cache, exit function
        } else {
          console.log('Animal non trouvé dans le cache, récupération depuis l\'API');
        }
      } else {
        console.log('Pas de cache trouvé, récupération depuis l\'API');
      }

      // Fallback to API if no cache or animal not in cache
      const animalResponse = await api.get(`/animals/${animalId}`);
      const animalDataResult = await animalResponse.json();
      setAnimalData(animalDataResult);

      const countriesResponse = await api.get(`/animal_countries?animal=${animalId}`);
      const countriesData = await countriesResponse.json();
      const currentAnimalCountries = countriesData.map(item => ({
        ...item.country,
        origin: item.origin,
        presenceType: item.presenceType
      }));

      const environmentsResponse = await api.get(`/animal_environments?animal=${animalId}`);
      const environmentsData = await environmentsResponse.json();
      const environments = environmentsData.map(item => item.environment);

      setHabitatData({
        countries: currentAnimalCountries,
        environments: environments
      });

    } catch (error) {
      console.error('Erreur API:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleFavorite = async (e) => {
    e.stopPropagation()

    if (!api.isLoggedIn()) return;

    const animalId = displayAnimal.id

    try {
      // Optimistic update
      const previousState = isLocalFavorited;
      setIsLocalFavorited(!previousState);

      if (previousState) {
        // Remove favorite via le nouveau contrôleur simple
        await api.removeFavorite(animalId);
      } else {
        // Add favorite via le nouveau contrôleur simple
        await api.addFavorite(animalId);
      }

      // Appeler la fonction du parent quand elle sera prête
      if (onToggleFavorite) {
        onToggleFavorite(animalId)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert on error
      setIsLocalFavorited(isLocalFavorited);
    }
  }

  const handleImageError = () => {
    if (animalImages && imageIndex < animalImages.length - 1) {
      const nextIndex = imageIndex + 1
      console.log('➡️ Passage à l\'image suivante (index ' + nextIndex + '):', animalImages[nextIndex])
      setImageIndex(nextIndex)
    } else {
      console.log('Pas d\'image valide trouvée, affichage du placeholder')
    }
  }

  const handleImageClick = () => {
    setShowImageModal(true)
  }

  const handlePreviousImage = () => {
    setImageIndex((prev) => (prev === 0 ? (animalImages?.length || 1) - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setImageIndex((prev) => (prev === (animalImages?.length || 1) - 1 ? 0 : prev + 1))
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
  }

  if (!animal) return null

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER FIXE */}
        <div className="detail-modal-header">
          {api.isLoggedIn() && (
            <button
              className={`detail-modal-favorite-btn ${isLocalFavorited ? 'detail-modal-favorite-active' : ''}`}
              onClick={toggleFavorite}
              title={isLocalFavorited ? t('animalDetail.removeFavorite') : t('animalDetail.addFavorite')}
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
          )}
          <button className="detail-modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
            </svg>
          </button>
        </div>

        {/* CONTENU SCROLLABLE */}
        <div className="detail-modal-scroll-container">
          {loading ? (
            <p className="detail-loading">{t('animalDetail.loading')}</p>
          ) : (
            <>
              {/* Titre + Sous-titre */}
              <div className="detail-animal-title-header">
                <h2>{displayAnimal.commonName || t('animalDetail.noName')}</h2>
                <p className="detail-scientific-name">{displayAnimal.scientificName || t('animalDetail.notAvailable')}</p>
              </div>

              {/* Badges d'extinction - 5 colonnes avec niveau au centre */}
              <div className="detail-extinction-badges">
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
                        to={`/critere#${level}`}
                        onClick={onClose}
                        style={{ textDecoration: 'none' }}
                      >
                        <span
                          className={`detail-badge ${level === currentLevelFR ? 'detail-badge-active' : ''}`}
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
                        className="detail-badge"
                        style={{
                          backgroundColor: 'white'
                        }}
                      />
                    )
                  )
                })()}
              </div>

              <div className="detail-animal-content-grid">
                <div className="detail-animal-image-section">
                  <img
                    src={
                      animalImages && animalImages.length > 0
                        ? animalImages[imageIndex]
                        : '/placeholder-animal.png'
                    }
                    alt={displayAnimal.commonName}
                    className="detail-animal-image"
                    onError={handleImageError}
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <div className="detail-quick-info">
                  <p><strong>{t('animalDetail.family')}:</strong> {displayAnimal.family || t('animalDetail.notAvailable')}</p>
                  <p><strong>{t('animalDetail.type')}:</strong> {displayAnimal.type || t('animalDetail.notAvailable')}</p>
                  <p><strong>{t('animalDetail.population')}:</strong> {displayAnimal.population || t('animalDetail.notAvailable')}</p>
                </div>
              </div>

              {/* Section Habitat - Pays */}
              {habitatData?.countries && habitatData.countries.length > 0 ? (
                <div className="detail-habitat-section">
                  <h3>{t('animalDetail.habitat')}:</h3>
                  <div className="detail-countries-list">
                    {habitatData.countries.map((country, countryIndex) => (
                      <div key={countryIndex} className="detail-country-item">
                        <h4>{country.countryName || country.name || t('animalDetail.unknownCountry')}</h4>
                        <p><strong>{t('animalDetail.origin')}:</strong> {country.origin || t('animalDetail.notAvailable')}</p>
                        <p><strong>{t('animalDetail.presence')}:</strong> {country.presenceType || t('animalDetail.notAvailable')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="detail-habitat-section">
                  <h3>{t('animalDetail.habitat')}:</h3>
                  <p className="no-data">{t('animalDetail.missingData')}</p>
                </div>
              )}

              {/* Section Environnements */}
              {habitatData?.environments && habitatData.environments.length > 0 ? (
                <div className="detail-habitat-section">
                  <h3>{t('animalDetail.environments')}:</h3>
                  <div className="detail-environments-names">
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
                <div className="detail-habitat-section">
                  <h3>{t('animalDetail.environments')}:</h3>
                  <p className="no-data">{t('animalDetail.missingData')}</p>
                </div>
              )}
              {/* Section Evolution de la population */}
              <div className="detail-habitat-section">
                <h3>{t('animalDetail.populationEvolution')}:</h3>
                <div className="detail-habitat-section">
                  <p>{t('animalDetail.missingData')}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/*Carrousel Images */}
      {showImageModal && animalImages && animalImages.length > 0 && (
        <div className="detail-image-modal-overlay" onClick={handleCloseImageModal}>
          <div className="detail-image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="detail-image-modal-close" onClick={handleCloseImageModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16">
                <path fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
              </svg>
            </button>
            <img
              src={animalImages[imageIndex]}
              alt={`${displayAnimal.commonName} - Image ${imageIndex + 1}`}
              className="detail-image-modal-image"
            />

            {animalImages.length > 1 && (
              <>
                <button className="detail-image-nav-btn detail-image-nav-prev" onClick={handlePreviousImage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="white" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                <button className="detail-image-nav-btn detail-image-nav-next" onClick={handleNextImage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="white" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              </>
            )}
            <div className="detail-image-counter">
              {imageIndex + 1} / {animalImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnimalDetailModal
