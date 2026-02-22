import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../services/api'
import AnimalDetailModal from '../components/AnimalDetail'
import './Favorites.css'

function Favorites() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('animals') // 'animals' | 'articles'
  const [animals, setAnimals] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!api.isLoggedIn()) {
        setLoading(false);
        return;
    }
    fetchData();
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [animalsData, articlesData] = await Promise.all([
        api.getMyFullFavorites(),
        api.getMyFullFavoriteArticles()
      ])
      setAnimals(animalsData)
      setArticles(articlesData)
    } catch (error) {
      console.error(t('favorites.errorLoadingFavorites'), error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAnimal = async (e, id) => {
    e.stopPropagation()
    if (window.confirm(t('favorites.removeAnimalConfirm'))) {
      try {
        await api.removeFavorite(id)
        setAnimals(prev => prev.filter(a => a.id !== id))
      } catch (error) {
        console.error(t('favorites.errorRemoving'), error)
      }
    }
  }

  const handleRemoveArticle = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(t('favorites.removeArticleConfirm'))) {
      try {
        await api.removeFavoriteArticle(id)
        setArticles(prev => prev.filter(a => a.id !== id))
      } catch (error) {
        console.error(t('favorites.errorRemoving'), error)
      }
    }
  }

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffDays === 0) return t('favorites.today')
    if (diffDays < 7) return t('favorites.daysAgo', { days: diffDays })
    return date.toLocaleDateString('fr-FR')
  }

  if (!api.isLoggedIn()) {
    return (
      <div className="favorites-container">
        <div className="favorites-empty">
          <span className="favorites-empty-icon">🔒</span>
          <h2>{t('favorites.connectMessage')}</h2>
          <Link to="/connection" className="favorites-connect-btn">{t('favorites.connectButton')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>{t('favorites.title')}</h1>
      </div>

      <div className="favorites-tabs">
        <button 
          className={`favorites-tab ${activeTab === 'animals' ? 'active' : ''}`}
          onClick={() => setActiveTab('animals')}
        >
          {t('favorites.tabAnimals')} ({animals.length})
        </button>
        <button 
          className={`favorites-tab ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          {t('favorites.tabArticles')} ({articles.length})
        </button>
      </div>

      {loading ? (
        <div className="favorites-loading">{t('favorites.loading')}</div>
      ) : (
        <div className="favorites-content">
          {activeTab === 'animals' && (
            animals.length > 0 ? (
              <div className="favorites-grid">
                {animals.map(animal => (
                  <div 
                    key={animal.id} 
                    className="favorite-animal-card"
                    onClick={() => setSelectedAnimal(animal)}
                  >
                    <img 
                      src={(animal.images && animal.images.length > 0) ? animal.images[0] : (animal.image && animal.image.length > 0 ? animal.image[0] : '/placeholder-animal.png')} 
                      alt={animal.commonName} 
                      className="favorite-animal-image"
                    />
                    <button 
                      className="favorite-delete-btn"
                      onClick={(e) => handleRemoveAnimal(e, animal.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                    <div className="favorite-animal-info">
                      <h3 className="favorite-animal-name">{animal.commonName}</h3>
                      <p className="favorite-animal-scientific">{animal.scientificName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="favorites-empty">
                <p>{t('favorites.noAnimals')}</p>
                <Link to="/" className="favorites-connect-btn" style={{marginTop: '10px'}}>{t('favorites.exploreMap')}</Link>
              </div>
            )
          )}

          {activeTab === 'articles' && (
            articles.length > 0 ? (
              <div className="favorites-articles-list">
                {articles.map(article => (
                  <Link 
                    key={article.id} 
                    to={`/article/${article.id}`} 
                    className="article-card" // Réutilisation du style global Article
                    style={{textDecoration: 'none', color: 'inherit'}}
                  >
                    <div className="article-image-container">
                      <img src={article.image} alt={article.title} className="article-image" />
                    </div>
                    <div className="article-info">
                      <h4 className="article-title">{article.title}</h4>
                      <span className="article-time">{getTimeAgo(article.date)}</span>
                    </div>
                    <div 
                      className="article-favorite article-favorite-active"
                      onClick={(e) => handleRemoveArticle(e, article.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21.19 12.683c-2.5 5.41-8.62 8.2-8.88 8.32a.85.85 0 0 1-.62 0c-.25-.12-6.38-2.91-8.88-8.32c-1.55-3.37-.69-7 1-8.56a4.93 4.93 0 0 1 4.36-1.05a6.16 6.16 0 0 1 3.78 2.62a6.15 6.15 0 0 1 3.79-2.62a4.93 4.93 0 0 1 4.36 1.05c1.78 1.56 2.65 5.19 1.09 8.56" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="favorites-empty">
                <p>{t('favorites.noArticles')}</p>
                <Link to="/articles" className="favorites-connect-btn" style={{marginTop: '10px'}}>{t('favorites.readArticles')}</Link>
              </div>
            )
          )}
        </div>
      )}

      {selectedAnimal && (
        <AnimalDetailModal 
          animal={selectedAnimal} 
          onClose={() => setSelectedAnimal(null)}
          onToggleFavorite={(id) => {
             // Si on enlève le favori depuis la modale, on le retire de la liste
             setAnimals(prev => prev.filter(a => a.id !== id))
             setSelectedAnimal(null)
          }}
          favorites={new Set(animals.map(a => a.id))} // Pour afficher l'état correct dans la modale
        />
      )}
    </div>
  )
}

export default Favorites
