import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ArticleDetail.css'

function ArticleDetail() {
  const { id } = useParams() // Récupère l'ID depuis l'URL
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetch(`http://localhost:8000/api/articles/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Article non trouvé')
        }
        return response.json()
      })
      .then((data) => {
        setArticle(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setArticle(null)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="article-detail-container">
        <div className="article-detail-loading">Chargement...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="article-detail-container">
        <div className="article-detail-error">
          <h2>Article non trouvé</h2>
          <button onClick={() => navigate('/articles')} className="article-detail-back-btn">
            Retour aux articles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="article-detail-container">
      <div className="article-detail-header">
        <button className="article-detail-back-button" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"/>
          </svg>
        </button>
        <h1 className="article-detail-header-title">Article</h1>
      </div>

      <div className="article-detail-content">
        <div className="article-detail-image-container">
          <img src={article.image} alt={article.title} className="article-detail-image" />
          <span className="article-detail-category">{article.category}</span>
        </div>

        <div className="article-detail-body">
          <h2 className="article-detail-title">{article.title}</h2>
          
          <div className="article-detail-meta">
            <span className="article-detail-author">Par {article.author}</span>
            <span className="article-detail-separator">•</span>
            <span className="article-detail-date">{article.date}</span>
          </div>

          <div 
            className="article-detail-text"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  )
}

export default ArticleDetail
