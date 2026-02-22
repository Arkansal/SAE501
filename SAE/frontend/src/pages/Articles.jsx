import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../services/api'
import './Articles.css'

function Articles() {
  const { t } = useTranslation()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAuthor, setFilterAuthor] = useState('all')

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
        console.error('Erreur lors de la récupération des favoris')
      }
    }
  }

  const fetchArticles = async () => {
    try {
      if (api.isLoggedIn()) {
        localStorage.removeItem('articlesCache')
      }

      const cache = JSON.parse(localStorage.getItem('articlesCache'))
      const now = new Date().getTime()

      if (cache && (now - cache.timestamp < 3600000)) {
        setArticles(cache.data)
        setError(null)
        return
      }

      const response = await api.get('/articles')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des articles')
      }

      const data = await response.json()
      const sortedArticles = data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(article => ({
          ...article,
          timeAgo: getTimeAgo(new Date(article.date))
        }))

      setArticles(sortedArticles)
      setError(null)

      const newCache = {
        timestamp: new Date().getTime(),
        data: sortedArticles
      }
      localStorage.setItem('articlesCache', JSON.stringify(newCache))
    } catch (err) {
      console.error('Erreur API', err)
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
    if (diffMins < 60) return `${diffMins}min`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}j`

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
      } else {
        await api.addFavoriteArticle(articleId)
        newFavorites.add(articleId)
      }
      setFavorites(newFavorites)
    } catch (err) {
      console.error('Erreur lors de la modification du favori')
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAuthor = filterAuthor === 'all' || article.author === filterAuthor

    return matchesSearch && matchesAuthor
  })

  const uniqueAuthors = [...new Set(articles.map(a => a.author))]

  if (loading) {
    return (
      <div className="articles-container">
        <div className="articles-content">
          <div className="articles-header">
            <h1>{t('articles.title')}</h1>
          </div>
          <div className="articles-loading">
            {t('articles.loading')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="articles-container">
      <div className="articles-content">
        <div className="articles-header">
          <h1>{t('articles.title')}</h1>
        </div>

        <div className="articles-filters">
          <div className="articles-search">
            <input
              type="text"
              placeholder={t('articles.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="articles-search-input"
            />
          </div>

          <div className="articles-filter-author">
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="articles-select"
            >
              <option value="all">{t('articles.allAuthors')}</option>
              {uniqueAuthors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="articles-stats">
          <span>{filteredArticles.length} {t('articles.articlesFound')}</span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="articles-empty">
            <p>{t('articles.noArticles')}</p>
          </div>
        ) : (
          <div className="articles-list">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="article-card"
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
        )}
      </div>
    </div>
  )
}

export default Articles
