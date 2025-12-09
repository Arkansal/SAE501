import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

function AnimalMarker({ animal, onClick }) {
  // Vérifier que les coordonnées existent
  if (!animal.latitude || !animal.longitude) {
    console.warn('Coordonnées manquantes pour:', animal.common_name)
    return null
  }

  const position = [animal.latitude, animal.longitude]

  // Couleurs selon le statut d'extinction
  const getColor = (extinctionLevel) => {
    const colors = {
      'NE': '#C7C7C7',
      'DD': '#C7C7C7',
      'LC': '#047060',
      'NT': '#D4D125',
      'VU': '#FDB216',
      'EN': '#FA6B13',
      'CR': '#F00707',
      'EW': '#C41111',
      'EX': '#000000'
    }
    return colors[extinctionLevel] || '#3825A5'
  }

  const fillColor = getColor(animal.extinct_level)

  // Créer une icône personnalisée avec le SVG et la couleur adaptée
  const customIcon = L.divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 640 640" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path fill="${fillColor}" d="M352 348.4c64.1-14.5 112-71.9 112-140.4c0-79.5-64.5-144-144-144s-144 64.5-144 144c0 68.5 47.9 125.9 112 140.4V544c0 17.7 14.3 32 32 32s32-14.3 32-32zM328 160c-30.9 0-56 25.1-56 56c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-57.4 46.6-104 104-104c13.3 0 24 10.7 24 24s-10.7 24-24 24" />
      </svg>
    `,
    className: 'custom-animal-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Position l'icône au bon endroit
    popupAnchor: [0, -40] // Popup au-dessus du marker
  })

  return (
    <Marker 
      position={position} 
      icon={customIcon}
      eventHandlers={{
        click: () => onClick(animal)
      }}
    >
      <Popup>
        <div onClick={() => onClick(animal)} style={{ cursor: 'pointer' }}>
          <strong>{animal.common_name}</strong>
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
            {animal.scientific_name}
          </p>
          <p style={{ margin: '4px 0', fontSize: '11px', color: '#999' }}>
            Status: {animal.extinct_level}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

export default AnimalMarker

