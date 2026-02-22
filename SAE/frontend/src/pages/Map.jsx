import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import * as L from 'leaflet'
import AnimalDetailModal from '../components/AnimalDetail'
import MapSearch from '../components/MapSearch'
import MapFilter from '../components/MapFilter'
import AnimalMarker from '../components/MapMarker'
import WarningPopup from '../components/WarningPopup'
import { findRandomNonOverlappingPosition } from './useRandomPlacement'
import countriesData from '../data/countries.json'
import { api } from '../services/api'
import './Map.css'

function Map() {
  const { t } = useTranslation()
  const [animals, setAnimals] = useState([])
  const [animalMarkers, setAnimalMarkers] = useState([])
  const [filteredMarkers, setFilteredMarkers] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [activeCountryId, setActiveCountryId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState([46.603354, 1.888334])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    family: [],
    type: [],
    extinctLevel: [],
    country: [],
    origin: [],
    presence: [],
    environmentName: [],
    environmentType: []
  })
  const mapRef = useRef(null)

  useEffect(() => {
    fetchAnimals()
  }, [])

  // Appliquer les filtres chaque fois qu'ils changent ou que les marqueurs changent
  useEffect(() => {
    applyFilters()
  }, [animalMarkers, activeFilters])

  // Fonction pour définir le style de chaque pays
  const countryStyle = (feature) => {
    const countryId = feature.properties['ISO3166-1-Alpha-3'] || feature.id || feature.properties.iso_a3
    const isActive = activeCountryId === countryId

    return {
      fillColor: isActive ? '#2D2C7E' : 'transparent',
      weight: isActive ? 2 : 0,
      opacity: 1,
      color: '#2D2C7E',
      fillOpacity: isActive ? 0.3 : 0,
      className: isActive ? 'country-interactive country-active' : 'country-interactive'
    }
  }

  const onEachCountry = (feature, layer) => {
    layer.on({
      click: (e) => {
        const countryId = feature.properties['ISO3166-1-Alpha-3'] || feature.id || feature.properties.iso_a3

        if (activeCountryId === countryId) {
          setActiveCountryId(null)
          fetchAnimals(null)
        } else {
          setActiveCountryId(countryId)
          const apiCode = feature.properties['ISO3166-1-Alpha-2'] || feature.properties.iso_a2 || countryId

          console.log("----- CLIC PAYS -----")
          console.log("Properties:", feature.properties)
          console.log("Code envoyé à l'API:", apiCode)

          fetchAnimals(apiCode)
        }

        L.DomEvent.stopPropagation(e)
        layer.bringToFront()
      }
    })
  }

  const fetchAnimals = async (countryCode = null) => {
    setLoading(true)
    try {
      let animal_data;
      if (!localStorage.getItem('lastFetchedAnimals') || countryCode) {
        const url = countryCode
          ? `/animal_countries?country=${countryCode}`
          : '/animal_countries'

        const response = await api.get(url)
        animal_data = await response.json()
        localStorage.setItem('lastFetchedAnimals', animal_data ? JSON.stringify(animal_data) : '[]')
      }

      else {
        animal_data = JSON.parse(localStorage.getItem('lastFetchedAnimals'))
      }
      const groupedAnimals = {}

      animal_data.forEach(item => {
        const animalId = item.animal.id

        if (!groupedAnimals[animalId]) {
          groupedAnimals[animalId] = {
            ...item.animal,
            countries: []
          }
        }

        groupedAnimals[animalId].countries.push({
          ...item.country,
          origin: item.origin,
          presenceType: item.presenceType
        })
      })

      const animalsList = Object.values(groupedAnimals)

      const limit = countryCode ? 30 : 150
      const limitedAnimals = animalsList.slice(0, limit)

      setAnimals(limitedAnimals)
      placeAnimalsOnMap(limitedAnimals, countryCode)
    } catch (error) {
      console.error('Erreur API:', error)
    } finally {
      setLoading(false)
    }
  }

  const placeAnimalsOnMap = (animalsList, forcedCountryCode = null) => {
    const markers = []
    const countriesIndexByCode = {}
    const countriesIndexByName = {}

    countriesData.features.forEach(country => {
      const props = country.properties
      const isoCode = country.id || props.id || props['ISO3166-1-Alpha-2'] || props.ISO_A2 || props.iso_a2 || props.codeIso
      if (isoCode && isoCode !== '-99') {
        countriesIndexByCode[isoCode] = country
      }
      const name = props.name || props.NAME || props.admin
      if (name) {
        countriesIndexByName[name.toLowerCase()] = country
      }
    })

    animalsList.forEach(animal => {
      if (!animal.countries) return

      let targetCountries = []

      if (forcedCountryCode) {
        const isInCountry = animal.countries.find(c => c.codeIso === forcedCountryCode)
        if (isInCountry) {
          targetCountries = [isInCountry]
        }
      } else {
        const shuffledCountries = [...animal.countries].sort(() => Math.random() - 0.5)
        targetCountries = shuffledCountries.slice(0, 2)
      }

      targetCountries.forEach(country => {
        let countryGeoJson = countriesIndexByCode[country.codeIso]

        if (!countryGeoJson) {
          const countryNameLower = country.countryName ? country.countryName.toLowerCase() : ''
          countryGeoJson = countriesIndexByName[countryNameLower]
        }

        if (countryGeoJson) {
          if (!countryGeoJson.properties) {
            countryGeoJson.properties = {}
          }
          if (!countryGeoJson.properties.name) {
            countryGeoJson.properties.name = country.countryName
          }
          if (!countryGeoJson.properties.iso_a2) {
            countryGeoJson.properties.iso_a2 = country.codeIso
          }

          const minDistance = 10
          const position = findRandomNonOverlappingPosition(countryGeoJson, minDistance)

          if (position && position.latitude && position.longitude) {
            markers.push({
              id: `${animal.id}-${country.codeIso}`,
              animal: animal,
              country: country,
              latitude: position.latitude,
              longitude: position.longitude
            })
          }
        }
      })
    })

    console.log(`Placement terminés : ${animalsList.length} animaux traités -> ${markers.length} markers générés.`)
    setAnimalMarkers(markers)
  }

  const applyFilters = () => {
    let filtered = [...animalMarkers]

    if (activeFilters.family.length > 0) {
      filtered = filtered.filter(marker =>
        activeFilters.family.includes(marker.animal.family)
      )
    }

    if (activeFilters.type.length > 0) {
      filtered = filtered.filter(marker =>
        activeFilters.type.includes(marker.animal.type)
      )
    }

    if (activeFilters.extinctLevel.length > 0) {
      filtered = filtered.filter(marker =>
        activeFilters.extinctLevel.includes(marker.animal.extinctLevel)
      )
    }

    if (activeFilters.country.length > 0) {
      filtered = filtered.filter(marker => {
        const animalCountries = marker.animal.countries || []
        return activeFilters.country.some(countryName =>
          animalCountries.some(c => c.countryName === countryName)
        )
      })
    }

    if (activeFilters.origin.length > 0) {
      filtered = filtered.filter(marker => {
        const animalCountries = marker.animal.countries || []
        return activeFilters.origin.some(origin =>
          animalCountries.some(c => c.origin === origin)
        )
      })
    }

    if (activeFilters.presence.length > 0) {
      filtered = filtered.filter(marker => {
        const animalCountries = marker.animal.countries || []
        return activeFilters.presence.some(presence =>
          animalCountries.some(c => c.presenceType === presence)
        )
      })
    }

    if (activeFilters.environmentName.length > 0) {
      filtered = filtered.filter(marker => {
        const animalEnvironments = marker.animal.environments || []
        return activeFilters.environmentName.some(envName =>
          animalEnvironments.some(env => env.environmentName === envName)
        )
      })
    }

    if (activeFilters.environmentType.length > 0) {
      filtered = filtered.filter(marker => {
        const animalEnvironments = marker.animal.environments || []
        return activeFilters.environmentType.some(envType =>
          animalEnvironments.some(env => env.type === envType)
        )
      })
    }

    setFilteredMarkers(filtered)
  }

  const handleLocationFound = (coords) => {
    setMapCenter(coords)
    if (mapRef.current) {
      mapRef.current.setView(coords, 12)
    }
  }

  const handleSearchChange = async (nouvelleValeur) => {
    setSearchTerm(nouvelleValeur)
    if (nouvelleValeur && nouvelleValeur !== "") {
      try {
        const response = await api.get('/animalSearch/' + nouvelleValeur)
        const animal_data = await response.json()
        setSuggestions(animal_data.slice(0, 5))
      } catch (error) {
        console.error("Erreur lors de la recherche", error)
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (animal) => {
    setSelectedAnimal(animal)
    setSuggestions([])
    setSearchTerm('')
  }

  const handleFilterChange = (filters) => {
    setActiveFilters(filters)
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }} className="map-page">
      <MapSearch
        value={searchTerm}
        onChange={handleSearchChange}
        onLocationFound={handleLocationFound}
      />

      <WarningPopup />

      <div className="map-controls">
        <button
          className="map-filter-button"
          onClick={() => setIsFilterOpen(true)}
          title={t('map.openFilters')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 6h18v2H3V6m3 5h12v2H6v-2m3 5h6v2H9v-2z" />
          </svg>
          {t('map.filter')}
        </button>

        <button
          className="map-reset-button"
          onClick={() => {
            localStorage.removeItem('lastFetchedAnimals')
            localStorage.removeItem('articles')
            window.location.reload()
          }}
          title={t('map.resetMap')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,4V1L8,5l3.92,4V6A6,6,0,1,1,6,12H4a8,8,0,1,0,8-8Z" />
          </svg>
          {t('map.reset')}
        </button>
      </div>

      <MapFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />

      {suggestions.length > 0 && (
        <ul className="map-auto-completion">
          {suggestions.map((animal, index) => (
            <li key={animal.id || index} onClick={() => handleSuggestionClick(animal)}>
              {animal.commonName || animal.scientificName || animal.name || "Nom indisponible"}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="loading-indicator">
          {t('map.loadingAnimals')}
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <GeoJSON
          data={countriesData}
          style={countryStyle}
          onEachFeature={onEachCountry}
        />

        {filteredMarkers.map((marker) => (
          <AnimalMarker
            key={marker.id}
            animal={marker.animal}
            position={[marker.latitude, marker.longitude]}
            onClick={() => setSelectedAnimal(marker.animal)}
          />
        ))}
      </MapContainer>

      {selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
        />
      )}
    </div>
  )
}

export default Map