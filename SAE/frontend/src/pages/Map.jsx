import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import AnimalDetailModal from '../components/AnimalDetail'
import MapSearch from '../components/MapSearch'
import AnimalMarker from '../components/MapMarker'
import { findRandomNonOverlappingPosition, resetUsedPositions } from './useRandomPlacement'
import countriesData from '../data/countries.json'
import FitMapToMarkers from './FitMapToMarkers'; // <-- NOUVEL IMPORT
import './Map.css'

function Map() {
  const [animals, setAnimals] = useState([])
  const [animalMarkers, setAnimalMarkers] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState([46.603354, 1.888334])
  const mapRef = useRef(null)

  useEffect(() => {
    fetchInitialAnimals()
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchAnimals(searchTerm)
    } else if (animalMarkers.length === 0 && !loading) {
      fetchInitialAnimals()
    }
  }, [searchTerm])

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

  const fetchAnimals = async (keyword) => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/animalSearch/${keyword}`
      )
      const data = await response.json()
      setAnimals(data)
      placeAnimalsOnMap(data)
    } catch (error) {
      console.error('Erreur API:', error)
    } finally {
      setLoading(false)
    }
  }

  const placeAnimalsOnMap = (animalsList) => {
    resetUsedPositions();

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
      animal.countries.forEach(country => {
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

          const codeIso = country.codeIso;
          let minDistance = 10;

          if (['MC', 'GI', 'LI', 'VA', 'SM', 'MT', 'IM', 'JE', 'GG'].includes(codeIso)) {
            minDistance = 0;
          }

          const position = findRandomNonOverlappingPosition(countryGeoJson, minDistance)

          if (position && position.latitude && position.longitude) {
            markers.push({
              id: `${animal.id}-${country.codeIso}`,
              animal: animal,
              country: country,
              latitude: position.latitude,
              longitude: position.longitude
            })
          } else {
            console.warn(`Coordonnées manquantes ou non trouvées pour l'animal ${animal.id} dans ${country.countryName}.`);
          }
        } else {
          console.warn(`Pays non trouvé dans GeoJSON: ${country.codeIso} (${country.countryName})`)
        }
      })
    })

    // Pour débogage :
    // console.group('Markers Générés');
    // console.table(markers.map(m => ({ id: m.id, animal: m.animal.commonName, country: m.country.countryName, latitude: m.latitude, longitude: m.longitude })));
    // console.groupEnd();

    setAnimalMarkers(markers)
  }

  const handleLocationFound = (coords) => {
    setMapCenter(coords)
    if (mapRef.current) {
      mapRef.current.setView(coords, 12)
    }
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }} className="map-page">
      <MapSearch
        value={searchTerm}
        onChange={setSearchTerm}
        onLocationFound={handleLocationFound}
      />

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

        {/* 🚀 Composant pour centrer la carte sur tous les marqueurs */}
        <FitMapToMarkers markers={animalMarkers} />

        {animalMarkers.map((marker) => (
          // Vérification pour s'assurer que les coordonnées existent avant le rendu
          marker.latitude && marker.longitude && (
            <AnimalMarker
              key={marker.id}
              animal={marker.animal}
              position={[marker.latitude, marker.longitude]}
              onClick={() => setSelectedAnimal(marker.animal)}
            />
          )
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