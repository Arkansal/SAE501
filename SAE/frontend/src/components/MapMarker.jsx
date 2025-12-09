import { CircleMarker, Popup } from 'react-leaflet'

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

  return (
    <CircleMarker 
      center={position} 
      radius={8}
      fillColor={fillColor}
      color="#fff"
      weight={2}
      opacity={1}
      fillOpacity={0.8}
      eventHandlers={{
        click: () => onClick(animal)
      }}
    >
      <Popup>
        <div onClick={() => onClick(animal)} style={{ cursor: 'pointer' }}>
          <strong>{animal.common_name}</strong>
          <p>{animal.scientific_name}</p>
        </div>
      </Popup>
    </CircleMarker>

  /*<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
	<path fill="currentColor" d="M352 348.4c64.1-14.5 112-71.9 112-140.4c0-79.5-64.5-144-144-144s-144 64.5-144 144c0 68.5 47.9 125.9 112 140.4V544c0 17.7 14.3 32 32 32s32-14.3 32-32zM328 160c-30.9 0-56 25.1-56 56c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-57.4 46.6-104 104-104c13.3 0 24 10.7 24 24s-10.7 24-24 24" />
</svg>*/ 
  )
}

export default AnimalMarker

