import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import AnimalDetailModal from '../components/AnimalDetail'
import MapSearch from '../components/MapSearch'
import AnimalMarker from '../components/MapMarker'
import './Map.css'

function Map() {
  const [animals, setAnimals] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(510082)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState(() => {
    // Générer des coordonnées aléatoires à chaque montage du composant
    const randomLat = Math.random() * 180 - 90 // Entre -90 et 90
    const randomLng = Math.random() * 360 - 180 // Entre -180 et 180
    return [randomLat, randomLng]
  })
  const mapRef = useRef(null)

  // Récupérer les animaux selon la recherche
  useEffect(() => {
    if (searchTerm.trim()) {
      fetchAnimals(searchTerm)
    } else {
      setAnimals([])
    }
  }, [searchTerm])

  const fetchAnimals = async (keyword) => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/animalSearch/${keyword}`
      )
      const data = await response.json()
      setAnimals(data)
    } catch (error) {
      console.error('Erreur API:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationFound = (coords) => {
    setMapCenter(coords)
    // Centrer la carte avec un zoom approprié
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
      
      <MapContainer 
        ref={mapRef}
        center={mapCenter} 
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {animals.map((animal) => (
          <AnimalMarker
            key={animal.id}
            animal={animal}
            onClick={() => setSelectedAnimal(animal)}
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
