import * as turf from '@turf/turf';

// Liste globale pour stocker les positions déjà attribuées
const usedPositions = [];

/**
 * Réinitialise la liste des positions utilisées.
 * À appeler avant de générer une nouvelle série de marqueurs (ex: après une recherche).
 */
export function resetUsedPositions() {
    usedPositions.length = 0; 
    // console.log('Liste des positions utilisées réinitialisée.'); // Décommenter pour debug
}

/**
 * Tente de trouver une coordonnée aléatoire valide dans les limites du pays.
 * @param {Object} countryGeoJson - Le Feature GeoJSON du pays cible.
 * @param {number} minDistanceKm - Distance minimale requise entre les marqueurs (en km).
 * @returns {{latitude: number, longitude: number}} - Les coordonnées trouvées ou le centroïde en cas d'échec.
 */
export function findRandomNonOverlappingPosition(countryGeoJson, minDistanceKm = 75) {
    if (!countryGeoJson) return { latitude: 0, longitude: 0 };

    const countryPolygon = turf.feature(countryGeoJson.geometry);
    const bbox = turf.bbox(countryPolygon); 

    let attempts = 0;
    const MAX_ATTEMPTS = 2000; 
    const countryName = countryGeoJson.properties?.name || countryGeoJson.properties?.iso_a2 || 'Unknown Country';

    while (attempts < MAX_ATTEMPTS) {
        attempts++;

        // 1. Génération d'un point aléatoire dans la Bounding Box
        const [minLon, minLat, maxLon, maxLat] = bbox;
        const randomLon = minLon + (Math.random() * (maxLon - minLon));
        const randomLat = minLat + (Math.random() * (maxLat - minLat));
        const randomPoint = turf.point([randomLon, randomLat]);
        
        // 2. Vérification "Point in Polygon" (PIP)
        if (turf.booleanPointInPolygon(randomPoint, countryPolygon)) {
            let isOverlapping = false;

            // 3. Vérification de la superposition (Distance)
            for (const usedFeature of usedPositions) {
                const distance = turf.distance(randomPoint, usedFeature, { units: 'kilometers' });

                if (distance < minDistanceKm) {
                    isOverlapping = true;
                    break;
                }
            }

            // 4. Validation et Enregistrement
            if (!isOverlapping) {
                usedPositions.push(randomPoint);
                return {
                    latitude: randomLat,
                    longitude: randomLon
                };
            }
        }
    }
    
    // Fallback : Retourne le centroïde
    const centroidCoords = turf.centroid(countryPolygon).geometry.coordinates;
    console.warn(`Position aléatoire non trouvée après ${MAX_ATTEMPTS} tentatives pour ${countryName}. Retour au centroïde.`);
    return { 
        latitude: centroidCoords[1], 
        longitude: centroidCoords[0] 
    };
}