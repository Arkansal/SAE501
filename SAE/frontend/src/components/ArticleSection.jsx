import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../services/api'
import './ArticleSection.css'

function ArticleSection({ onItemClick }) {
  const { t } = useTranslation()
  const [favorites, setFavorites] = useState(new Set())
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchArticles(),
        fetchFavorites()
      ])
      setLoading(false)
    }
    loadData()
  }, [])

  const fetchFavorites = async () => {
    if (api.isLoggedIn()) {
      try {
        const favoriteIds = await api.getFavoriteArticles()
        setFavorites(new Set(favoriteIds))
      } catch (err) {
        console.error('Erreur lors de la récupération des favoris:', err)
      }
    }
  }

  const fetchArticles = async () => {
    try {
      if (!localStorage.getItem('articles')) {
        const response = await api.get('/articles')

        const data = await response.json()

        const sortedArticles = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
          .map(article => ({
            id: article.id,
            title: article.title,
            image: article.image,
            date: article.date,
            author: article.author,
            content: article.content,
            timeAgo: getTimeAgo(new Date(article.date))
          }))
        localStorage.setItem('articles', JSON.stringify(sortedArticles))
        setArticles(sortedArticles)
        setError(null)
      }
      else {
        setArticles(JSON.parse(localStorage.getItem('articles')))
      }
    } catch (err) {
      console.error('Erreur API:', err)
      setArticles([])
      setError('Erreur lors de la récupération des articles')
    }
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('articles.now')
    if (diffMins < 60) return `${diffMins}${t('articles.minutes')}`
    if (diffHours < 24) return `${diffHours}${t('articles.hours')}`
    if (diffDays < 7) return `${diffDays}${t('articles.days')}`
    
    return date.toLocaleDateString('fr-FR')
  }

  const toggleFavorite = async (e, articleId) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!api.isLoggedIn()) return;

    const newFavorites = new Set(favorites)
    
    try {
      if (newFavorites.has(articleId)) {
        await api.removeFavoriteArticle(articleId)
        newFavorites.delete(articleId)
        console.log(`Article ${articleId} retiré des favoris`)
      } else {
        await api.addFavoriteArticle(articleId)
        newFavorites.add(articleId)
        console.log(`Article ${articleId} ajouté aux favoris`)
      }
      setFavorites(newFavorites)
    } catch (err) {
      console.error('Erreur lors de la modification du favori:', err)
    }
  }

  // État de chargement
  if (loading) {
    return (
      <div className="article-section">
        <div className="article-section-header">
          <span className="article-section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8h2m-2 4h2m0 4H7m0-8v4h4V8zM5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"></path>
            </svg>
          </span>
          <h3 className="article-section-title">{t('articleSection.title')}</h3>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#3825A5' }}>
          {t('articleSection.loading')}
        </div>
      </div>
    )
  }

  // Si pas d'articles
  if (articles.length === 0) {
    return (
      <div className="article-section">
        <div className="article-section-header">
          <span className="article-section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8h2m-2 4h2m0 4H7m0-8v4h4V8zM5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"></path>
            </svg>
          </span>
          <h3 className="article-section-title">{t('articleSection.title')}</h3>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          {t('articleSection.noArticles')}
        </div>
      </div>
    )
  }

  // Affichage normal
  return (
    <div className="article-section">
      <div className="article-section-header">
        <span className="article-section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8h2m-2 4h2m0 4H7m0-8v4h4V8zM5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"></path>
          </svg>
        </span>
        <h3 className="article-section-title">{t('articleSection.title')}</h3>
      </div>

      <div className="article-scroll-container">
        <div className="article-scroll-content">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="article-card"
              onClick={onItemClick}
            >
              <div className="article-image-container">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                />
              </div>
              <div className="article-info">
                <h4 className="article-title">{article.title}</h4>
                <span className="article-time">{article.timeAgo}</span>
              </div>
              {api.isLoggedIn() && (
                <div 
                  className={`article-favorite ${favorites.has(article.id) ? 'article-favorite-active' : ''}`}
                  onClick={(e) => toggleFavorite(e, article.id)}
                >
                  {favorites.has(article.id) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M21.19 12.683c-2.5 5.41-8.62 8.2-8.88 8.32a.85.85 0 0 1-.62 0c-.25-.12-6.38-2.91-8.88-8.32c-1.55-3.37-.69-7 1-8.56a4.93 4.93 0 0 1 4.36-1.05a6.16 6.16 0 0 1 3.78 2.62a6.15 6.15 0 0 1 3.79-2.62a4.93 4.93 0 0 1 4.36 1.05c1.78 1.56 2.65 5.19 1.09 8.56" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.99.99 0 0 0 1.024 0C21.126 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3" />
                    </svg>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <Link to="/articles" className="article-section-see-more" onClick={onItemClick}>
        {t('articleSection.seeMore')}
      </Link>
    </div>
  )
}

export default ArticleSection