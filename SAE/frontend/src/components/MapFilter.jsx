import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './MapFilter.css'

function MapFilter({ isOpen, onClose, onFilterChange }) {
  const { t } = useTranslation()
  const [selectedFilters, setSelectedFilters] = useState({
    family: [],
    type: [],
    extinctLevel: [],
    country: [],
    origin: [],
    presence: [],
    environmentName: [],
    environmentType: []
  })
  
  const [expandedSections, setExpandedSections] = useState({
    family: false,
    type: false,
    extinctLevel: false,
    country: false,
    origin: false,
    presence: false,
    environmentName: false,
    environmentType: false
  })

  const [families, setFamilies] = useState([])
  const [types, setTypes] = useState([])
  const [extinctLevels, setExtinctLevels] = useState([])
  const [countries, setCountries] = useState([])
  const [origins, setOrigins] = useState([])
  const [presences, setPresences] = useState([])
  const [environmentNames, setEnvironmentNames] = useState([])
  const [environmentTypes, setEnvironmentTypes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchFilterData()
    }
  }, [isOpen])

  const fetchFilterData = async () => {
    setLoading(true)
    try {
      const animalsResponse = await fetch('http://127.0.0.1:8000/api/animalCountries')
      if (animalsResponse.ok) {
        const animalsData = await animalsResponse.json()
        
        const familySet = new Set()
        const typeSet = new Set()
        const extinctSet = new Set()
        const countrySet = new Set()
        const originSet = new Set()
        const presenceSet = new Set()

        animalsData.forEach(animal => {
          if (animal.family) familySet.add(animal.family)
          if (animal.type) typeSet.add(animal.type)
          if (animal.extinctLevel) extinctSet.add(animal.extinctLevel)
          if (animal.countries && Array.isArray(animal.countries)) {
            animal.countries.forEach(country => {
              if (country.countryName) countrySet.add(country.countryName)
              if (country.origin) originSet.add(country.origin)
              if (country.presenceType) presenceSet.add(country.presenceType)
            })
          }
        })

        setFamilies(Array.from(familySet).sort())
        setTypes(Array.from(typeSet).sort())
        setExtinctLevels(Array.from(extinctSet).sort())
        setCountries(Array.from(countrySet).sort())
        setOrigins(Array.from(originSet).sort())
        setPresences(Array.from(presenceSet).sort())
      }

      const envResponse = await fetch('http://127.0.0.1:8000/api/environments')
      if (envResponse.ok) {
        const envData = await envResponse.json()
        
        const envNameSet = new Set()
        const envTypeSet = new Set()

        envData.forEach(env => {
          if (env.environmentName || env.name) {
            envNameSet.add(env.environmentName || env.name)
          }
          if (env.type || env.environmentType) {
            envTypeSet.add(env.type || env.environmentType)
          }
        })

        setEnvironmentNames(Array.from(envNameSet).sort())
        setEnvironmentTypes(Array.from(envTypeSet).sort())
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (category, value) => {
    const updated = { ...selectedFilters }
    if (updated[category].includes(value)) {
      updated[category] = updated[category].filter(v => v !== value)
    } else {
      updated[category].push(value)
    }
    setSelectedFilters(updated)
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleReset = () => {
    const resetFilters = {
      family: [],
      type: [],
      extinctLevel: [],
      country: [],
      origin: [],
      presence: [],
      environmentName: [],
      environmentType: []
    }
    setSelectedFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const handleApply = () => {
    onFilterChange(selectedFilters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="map-filter-overlay" onClick={onClose}>
      <div className="map-filter-content" onClick={(e) => e.stopPropagation()}>
        <div className="map-filter-header">
          <h2>{t('mapFilter.title')}</h2>
          <button className="map-filter-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
            </svg>
          </button>
        </div>

        <div className="map-filter-scroll">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>{t('mapFilter.loading')}</p>
          ) : (
            <>
              {/* ANIMAUX */}
              <h3>{t('mapFilter.animals')}</h3>

              {/* Famille */}
              {families.length > 0 && (
                <div className="map-filter-section">
                  <button 
                    className={`map-filter-section-header ${selectedFilters.family.length > 0 ? 'active' : ''}`}
                    onClick={() => toggleSection('family')}
                  >
                    <h4>{t('mapFilter.family')} {selectedFilters.family.length > 0 && `(${selectedFilters.family.length})`}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      style={{ transform: expandedSections.family ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 14l-5-5l-5 5" />
                    </svg>
                  </button>
                  {expandedSections.family && (
                    <div className="map-filter-options">
                      {families.map(family => (
                        <label key={family} className="map-filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.family.includes(family)}
                            onChange={() => handleFilterChange('family', family)}
                          />
                          <span>{family}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Type */}
              {types.length > 0 && (
                <div className="map-filter-section">
                  <button 
                    className={`map-filter-section-header ${selectedFilters.type.length > 0 ? 'active' : ''}`}
                    onClick={() => toggleSection('type')}
                  >
                    <h4>{t('mapFilter.type')} {selectedFilters.type.length > 0 && `(${selectedFilters.type.length})`}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      style={{ transform: expandedSections.type ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 14l-5-5l-5 5" />
                    </svg>
                  </button>
                  {expandedSections.type && (
                    <div className="map-filter-options">
                      {types.map(type => (
                        <label key={type} className="map-filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.type.includes(type)}
                            onChange={() => handleFilterChange('type', type)}
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Extinction Level */}
              {extinctLevels.length > 0 && (
                <div className="map-filter-section">
                  <button 
                    className={`map-filter-section-header ${selectedFilters.extinctLevel.length > 0 ? 'active' : ''}`}
                    onClick={() => toggleSection('extinctLevel')}
                  >
                    <h4>{t('mapFilter.extinction')} {selectedFilters.extinctLevel.length > 0 && `(${selectedFilters.extinctLevel.length})`}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      style={{ transform: expandedSections.extinctLevel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 14l-5-5l-5 5" />
                    </svg>
                  </button>
                  {expandedSections.extinctLevel && (
                    <div className="map-filter-options">
                      {extinctLevels.map(level => (
                        <label key={level} className="map-filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.extinctLevel.includes(level)}
                            onChange={() => handleFilterChange('extinctLevel', level)}
                          />
                          <span>{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* HABITAT */}
              <h3>{t('mapFilter.habitat')}:</h3>

              {/* Pays */}
              {countries.length > 0 && (
                <div className="map-filter-section">
                  <button 
                    className={`map-filter-section-header ${selectedFilters.country.length > 0 ? 'active' : ''}`}
                    onClick={() => toggleSection('country')}
                  >
                    <h4>{t('mapFilter.country')} {selectedFilters.country.length > 0 && `(${selectedFilters.country.length})`}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      style={{ transform: expandedSections.country ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 14l-5-5l-5 5" />
                    </svg>
                  </button>
                  {expandedSections.country && (
                    <div className="map-filter-options">
                      {countries.map(country => (
                        <label key={country} className="map-filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.country.includes(country)}
                            onChange={() => handleFilterChange('country', country)}
                          />
                          <span>{country}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Origine */}
              {origins.length > 0 && (
                <div className="map-filter-section">
                  <button 
                    className={`map-filter-section-header ${selectedFilters.origin.length > 0 ? 'active' : ''}`}
                    onClick={() => toggleSection('origin')}
                  >
                    <h4>{t('mapFilter.origin')} {selectedFilters.origin.length > 0 && `(${selectedFilters.origin.length})`}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      style={{ transform: expandedSections.origin ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 14l-5-5l-5 5" />
                    </svg>
                  </button>
                  {expandedSections.origin && (
                    <div className="map-filter-options">
                      {origins.map(origin => (
                        <label key={origin} className="map-filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.origin.includes(origin)}
                            onChange={() => handleFilterChange('origin', origin)}
                          />
                          <span>{origin}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Présence */}
              {presences.length > 0 && (
                <div className="map-filter-section">
                  <button 
                    className={`map-filter-section-header ${selectedFilters.presence.length > 0 ? 'active' : ''}`}
                    onClick={() => toggleSection('presence')}
                  >
                    <h4>{t('mapFilter.presence')} {selectedFilters.presence.length > 0 && `(${selectedFilters.presence.length})`}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      style={{ transform: expandedSections.presence ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 14l-5-5l-5 5" />
                    </svg>
                  </button>
                  {expandedSections.presence && (
                    <div className="map-filter-options">
                      {presences.map(presence => (
                        <label key={presence} className="map-filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.presence.includes(presence)}
                            onChange={() => handleFilterChange('presence', presence)}
                          />
                          <span>{presence}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ENVIRONNEMENTS */}
              <h3>{t('mapFilter.environments')}:</h3>

              {/* Biotope */}
              {environmentNames.length > 0 && (
                <div className="map-filter-section">
                  <button 
                    className={`map-filter-section-header ${selectedFilters.environmentName.length > 0 ? 'active' : ''}`}
                    onClick={() => toggleSection('environmentName')}
                  >
                    <h4>{t('mapFilter.biotope')} {selectedFilters.environmentName.length > 0 && `(${selectedFilters.environmentName.length})`}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      style={{ transform: expandedSections.environmentName ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 14l-5-5l-5 5" />
                    </svg>
                  </button>
                  {expandedSections.environmentName && (
                    <div className="map-filter-options">
                      {environmentNames.map(name => (
                        <label key={name} className="map-filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.environmentName.includes(name)}
                            onChange={() => handleFilterChange('environmentName', name)}
                          />
                          <span>{name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Type d'environnement */}
              {environmentTypes.length > 0 && (
                <div className="map-filter-section">
                  <button 
                    className={`map-filter-section-header ${selectedFilters.environmentType.length > 0 ? 'active' : ''}`}
                    onClick={() => toggleSection('environmentType')}
                  >
                    <h4>{t('mapFilter.environmentType')} {selectedFilters.environmentType.length > 0 && `(${selectedFilters.environmentType.length})`}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      style={{ transform: expandedSections.environmentType ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 14l-5-5l-5 5" />
                    </svg>
                  </button>
                  {expandedSections.environmentType && (
                    <div className="map-filter-options">
                      {environmentTypes.map(envType => (
                        <label key={envType} className="map-filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.environmentType.includes(envType)}
                            onChange={() => handleFilterChange('environmentType', envType)}
                          />
                          <span>{envType}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="map-filter-footer">
          <button className="map-filter-reset" onClick={handleReset}>
            {t('mapFilter.reset')}
          </button>
          <button className="map-filter-apply" onClick={handleApply}>
            {t('mapFilter.apply')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapFilter