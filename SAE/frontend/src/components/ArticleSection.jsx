import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ArticleSection.css'

function ArticleSection({ onItemClick }) {
  // État pour gérer les favoris
  const [favorites, setFavorites] = useState(new Set())

  // Données temporaires  ATTENTION - à remplacer par des données dynamiques plus tard
  const recentArticles = [
    {
      id: 1,
      title: "Ils refusent d'abandonner : des bénévoles font de la ventes de chocolat pour...",
      image: "https://tse4.mm.bing.net/th/id/OIP.mq6o78g5GvTxApO2EtsIOQHaE7?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      timeAgo: "12h",
      route: "/articles/article-1"
    },
    {
      id: 2,
      title: "La biodiversité marine en danger : nouvelles mesures de protection",
      image: "https://th.bing.com/th/id/R.a357088411e8efa444fcf5b461b761e0?rik=R%2fODZMqWYzZc3A&riu=http%3a%2f%2fwww.photoway.com%2fimages%2fportugal%2fPO98_099-arbre.jpg&ehk=360MlcresQzVmwwArz3vcLZ%2bW%2bRmwp4ubBhbA0lBpls%3d&risl=&pid=ImgRaw&r=0",
      timeAgo: "1j",
      route: "/articles/article-2"
    },
    {
      id: 3,
      title: "Des espèces rares découvertes dans la forêt amazonienne",
      image: "https://a-z-animals.com/media/2022/11/shutterstock_1842848809.jpg",
      timeAgo: "2j",
      route: "/articles/article-3"
    }
  ]

  // Fonction pour gérer les favoris
  const toggleFavorite = (e, articleId) => {
    e.preventDefault() // Empêcher la navigation vers l'article
    e.stopPropagation() // Empêcher la propagation de l'événement
    
    const newFavorites = new Set(favorites)
    
    if (newFavorites.has(articleId)) {
      newFavorites.delete(articleId)
      console.log(`Article ${articleId} retiré des favoris`)
    } else {
      newFavorites.add(articleId)
      console.log(`Article ${articleId} ajouté aux favoris`)
      // Ici vous pourrez ajouter l'article à la base de données des favoris plus tard
    }
    
    setFavorites(newFavorites)
  }

  return (
    <div className="article-section">
      <div className="article-section-header">
        <span className="article-section-icon">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8h2m-2 4h2m0 4H7m0-8v4h4V8zM5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"></path>
            </svg>
        </span>
        <h3 className="article-section-title">Articles</h3>
      </div>

      <div className="article-scroll-container">
        <div className="article-scroll-content">
          {recentArticles.map((article) => (
            <Link
              key={article.id}
              to={article.route}
              className="article-card"
              onClick={onItemClick}
            >
              <div className="article-image-container">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                  onError={(e) => {
                    e.target.src = '/images/article-placeholder.jpg'
                  }}
                />
              </div>
              <div className="article-info">
                <h4 className="article-title">{article.title}</h4>
                <span className="article-time">{article.timeAgo}</span>
              </div>
              <div 
                className={`article-favorite ${favorites.has(article.id) ? 'article-favorite-active' : ''}`}
                onClick={(e) => toggleFavorite(e, article.id)}
              >
                {favorites.has(article.id) ? (
                  // Icône coeur plein (favori actif)
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21.19 12.683c-2.5 5.41-8.62 8.2-8.88 8.32a.85.85 0 0 1-.62 0c-.25-.12-6.38-2.91-8.88-8.32c-1.55-3.37-.69-7 1-8.56a4.93 4.93 0 0 1 4.36-1.05a6.16 6.16 0 0 1 3.78 2.62a6.15 6.15 0 0 1 3.79-2.62a4.93 4.93 0 0 1 4.36 1.05c1.78 1.56 2.65 5.19 1.09 8.56" />
                  </svg>
                ) : (
                  // Icône coeur vide (favori inactif)
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.99.99 0 0 0 1.024 0C21.126 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3" />
                  </svg>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Link to="/articles" className="article-section-see-more" onClick={onItemClick}>
        Voir plus +
      </Link>
    </div>
  )
}

export default ArticleSection