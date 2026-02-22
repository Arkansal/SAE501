import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from '../services/api';
import "./ArticleDetail.css";

function ArticleDetail() {
  const { t } = useTranslation();
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        if (!localStorage.getItem(`articles`)) {
          const response = await api.get(`/articles/${id}`);
          const data = await response.json();
          console.log(data);
          setArticle(data);

          // Check favorite status if logged in
          if (api.isLoggedIn()) {
            try {
              const favoriteIds = await api.getFavoriteArticles();
              setIsFavorited(favoriteIds.includes(Number(id)));
            } catch (e) {
              console.error("Erreur check favori article", e);
              setIsFavorited(false);
            }
          }
        }
        else {
          const articles = JSON.parse(localStorage.getItem('articles'));
          const foundArticle = articles.find(a => a.id === Number(id));
          if (foundArticle) {
            setArticle(foundArticle);
            setIsFavorited(api.isLoggedIn() && (await api.getFavoriteArticles()).includes(Number(id)));
          } else {
            setArticle(null);
          }
        }
      } catch (error) {
        console.error(error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleFavorite = async () => {
    if (!api.isLoggedIn()) return;
    
    try {
      // Optimistic update
      const previousState = isFavorited;
      setIsFavorited(!previousState);

      if (previousState) {
        await api.removeFavoriteArticle(id);
      } else {
        await api.addFavoriteArticle(id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFavorited(isFavorited); // Revert
    }
  };

  if (loading) {
    return (
      <div className="article-detail-container">
        <div className="article-detail-loading">{t('articleDetail.loading')}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-container">
        <div className="article-detail-error">
          <h2>{t('articleDetail.notFound')}</h2>
          <button
            onClick={() => navigate("/articles")}
            className="article-detail-back-btn"
          >
            {t('articleDetail.backButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <div className="article-detail-header">
        <button
          className="article-detail-back-button"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="48"
              d="M244 400L100 256l144-144M120 256h292"
            />
          </svg>
        </button>
        <h1 className="article-detail-header-title">{t('articleDetail.title')}</h1>
        
        {api.isLoggedIn() && (
          <button 
            className="article-detail-favorite-button"
            onClick={toggleFavorite}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isFavorited ? '#e74c3c' : '#2D2C7E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px'
            }}
          >
            {isFavorited ? (
              // Icône coeur plein
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.19 12.683c-2.5 5.41-8.62 8.2-8.88 8.32a.85.85 0 0 1-.62 0c-.25-.12-6.38-2.91-8.88-8.32c-1.55-3.37-.69-7 1-8.56a4.93 4.93 0 0 1 4.36-1.05a6.16 6.16 0 0 1 3.78 2.62a6.15 6.15 0 0 1 3.79-2.62a4.93 4.93 0 0 1 4.36 1.05c1.78 1.56 2.65 5.19 1.09 8.56" />
              </svg>
            ) : (
              // Icône coeur vide
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.99.99 0 0 0 1.024 0C21.126 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="article-detail-content">
        <div className="article-detail-image-container">
          <img
            src={article.image}
            alt={article.title}
            className="article-detail-image"
          />
          <span className="article-detail-category">{article.category}</span>
        </div>

        <div className="article-detail-body">
          <h2 className="article-detail-title">{article.title}</h2>

          <div className="article-detail-meta">
            <span className="article-detail-author">{t('articleDetail.by')} {article.author}</span>
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
  );
}

export default ArticleDetail;
