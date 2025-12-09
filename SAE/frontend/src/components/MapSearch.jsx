import { useState } from 'react'
import './MapSearch.css'

function MapSearch({ value, onChange, onLocationFound }) {
  const [isFocused, setIsFocused] = useState(false)

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('Position:', { latitude, longitude })
          // Envoyer les coordonnées au parent
          if (onLocationFound) {
            onLocationFound([latitude, longitude])
          }
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error)
        }
      )
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (value.trim()) {
      console.log('Recherche pour:', value)
    }
  }

  return (
    <div className="map-search">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-wrapper">
          <button
            type="button"
            className="location-btn"
            onClick={handleLocationClick}
            title="Ma localisation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.103 0 2 .897 2 2s-.897 2-2 2s-2-.897-2-2s.897-2 2-2" />
                <path fill="currentColor" d="M11.42 21.814a1 1 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819M12 4c3.309 0 6 2.691 6 6.005c.021 4.438-4.388 8.423-6 9.73c-1.611-1.308-6.021-5.294-6-9.735c0-3.309 2.691-6 6-6" />
            </svg>
          </button>

          <input
            type="text"
            placeholder="Chercher un animal..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`search-input ${isFocused ? 'focused' : ''}`}
          />

          <button
            type="submit"
            className="search-btn"
            title="Rechercher"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39M11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default MapSearch