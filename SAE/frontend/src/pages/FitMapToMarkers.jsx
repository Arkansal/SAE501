import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';

export default function FitMapToMarkers({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      // Filtrer les marqueurs qui ont des coordonnées valides
      const validMarkers = markers.filter(m => m.latitude && m.longitude);

      if (validMarkers.length === 0) return;
      
      const latLngs = validMarkers.map(marker => [marker.latitude, marker.longitude]);
      
      const bounds = L.latLngBounds(latLngs);
      
      // Ajuster la carte pour inclure toutes les limites
      map.fitBounds(bounds, { 
          padding: [50, 50], // Marge autour des marqueurs (en pixels)
          maxZoom: 8 // Empêche de zoomer excessivement sur un petit cluster
      }); 
    }
  }, [markers, map]);

  return null; 
}