import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import AnimalDetailModal from '../components/AnimalDetail'
import MapSearch from '../components/MapSearch'
import AnimalMarker from '../components/MapMarker'
import { findRandomNonOverlappingPosition } from './useRandomPlacement'
import countriesData from '../data/countries.json'
import './Map.css'

function Map() {
  const [animals, setAnimals] = useState([])
  const [animalMarkers, setAnimalMarkers] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState([46.603354, 1.888334])
  const mapRef = useRef(null)

  useEffect(() => {
    fetchInitialAnimals()
  }, [])

  const fetchInitialAnimals = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/animalCountries')
      const data = await response.json()
      const limitedAnimals = data.slice(0, 50)
      setAnimals(limitedAnimals)
      placeAnimalsOnMap(limitedAnimals)
    } catch (error) {
      console.error('Erreur API:', error)
    } finally {
      setLoading(false)
    }
  }

  const placeAnimalsOnMap = (animalsList) => {
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
      const shuffledCountries = [...animal.countries].sort(() => Math.random() - 0.5)
      const limitedCountries = shuffledCountries.slice(0, 2)

      limitedCountries.forEach(country => {
        let countryGeoJson = countriesIndexByCode[country.codeIso]

        if (!countryGeoJson) {
          const countryNameLower = country.countryName.toLowerCase()
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

    setAnimalMarkers(markers)
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
        const response = await fetch('http://127.0.0.1:8000/api/animalSearch/' + nouvelleValeur)
        const data = await response.json()
        setSuggestions(data.slice(0, 5))
      } catch (error) {
        console.error("Erreur lors de la recherche", error)
      }
    } else {
      setSuggestions([])
    }
  }

  // --- C'EST ICI QUE ÇA CHANGE ---
  const handleSuggestionClick = (animal) => {
    // 1. On ouvre la modale avec l'animal cliqué
    setSelectedAnimal(animal)

    // 2. On ferme la liste de suggestions
    setSuggestions([])

    // 3. Optionnel : On peut vider le champ de recherche pour faire plus propre
    setSearchTerm('')
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }} className="map-page">
      <MapSearch
        value={searchTerm}
        onChange={handleSearchChange}
        onLocationFound={handleLocationFound}
      />

      {/* Liste d'autocomplétion */}
      {suggestions.length > 0 && (
        <ul className="map-auto-completion" style={{
          position: 'absolute',
          top: '70px',
          left: '50px',
          zIndex: 10000,
          backgroundColor: 'white',
          listStyle: 'none',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          minWidth: '200px'
        }}>
          {suggestions.map((animal, index) => (
            <li
              key={animal.id || index}
              onClick={() => handleSuggestionClick(animal)}
              style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            >
              {/* J'ai mis commonName en priorité car c'est souvent ce qu'on veut voir */}
              {animal.commonName || animal.scientificName || animal.name || "Nom indisponible"}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          Chargement des animaux...
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {animalMarkers.map((marker) => (
          <AnimalMarker
            key={marker.id}
            animal={marker.animal}
            position={[marker.latitude, marker.longitude]}
            onClick={() => setSelectedAnimal(marker.animal)}
          />
        ))}
      </MapContainer>

      {/* C'est ce bloc qui affiche la fiche quand selectedAnimal est rempli */}
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