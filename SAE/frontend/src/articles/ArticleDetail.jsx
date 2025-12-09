import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ArticleDetail.css'

function ArticleDetail() {
  const { id } = useParams() // Récupère l'ID depuis l'URL
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  // Base de données temporaire des articles (à remplacer par un appel API plus tard)
  const articlesDatabase = {
    1: {
      id: 1,
      title: "Ils refusent d'abandonner : des bénévoles font de la ventes de chocolat pour...",
      image: "http://inaturalist-open-data.s3.amazonaws.com/photos/219428475/medium.jpg",
      timeAgo: "12h",
      date: "9 décembre 2025",
      author: "Marie Dubois",
      content: `
        <p>Dans un petit village de Normandie, un groupe de bénévoles passionnés refuse de baisser les bras face à la fermeture imminente de leur refuge animalier local.</p>
        
        <p>Depuis plus de 20 ans, le refuge "Les Amis des Animaux" accueille et soigne des animaux abandonnés ou maltraités. Mais face aux difficultés financières croissantes, l'association risque de devoir fermer ses portes d'ici la fin de l'année.</p>
        
        <h3>Une mobilisation sans précédent</h3>
        
        <p>Pour sauver leur refuge, les bénévoles ont lancé une campagne de vente de chocolats artisanaux. "Nous avons décidé de nous battre", explique Sophie, présidente de l'association. "Chaque euro compte pour nourrir et soigner nos protégés."</p>
        
        <p>L'initiative a rapidement pris de l'ampleur, touchant non seulement les habitants du village mais aussi de nombreux sympathisants dans toute la région.</p>
        
        <h3>Un espoir pour l'avenir</h3>
        
        <p>Grâce à cette action, le refuge a déjà collecté plus de 15 000 euros. Un montant encourageant qui permettra de maintenir les activités pendant plusieurs mois supplémentaires.</p>
        
        <p>"Nous ne voulons pas seulement sauver le refuge, mais aussi sensibiliser le public à la cause animale", conclut Sophie avec émotion.</p>
      `,
    },
    2: {
      id: 2,
      title: "La biodiversité marine en danger : nouvelles mesures de protection",
      image: "http://inaturalist-open-data.s3.amazonaws.com/photos/111432589/medium.jpeg",
      timeAgo: "1j",
      date: "8 décembre 2025",
      author: "Pierre Martin",
      content: `
        <p>Face à la détérioration rapide des écosystèmes marins, plusieurs pays européens ont annoncé de nouvelles mesures de protection drastiques.</p>
        
        <p>Les océans, qui couvrent plus de 70% de la surface de la Terre, subissent des pressions sans précédent : pollution plastique, surpêche, réchauffement climatique et acidification.</p>
        
        <h3>Des zones marines protégées étendues</h3>
        
        <p>La France s'engage à protéger 30% de ses eaux territoriales d'ici 2030. Ces zones interdites à la pêche industrielle permettront aux écosystèmes de se régénérer.</p>
        
        <h3>La mobilisation des scientifiques</h3>
        
        <p>Des chercheurs du CNRS alertent sur l'urgence d'agir : "Nous avons une fenêtre d'action très limitée. Si nous n'agissons pas maintenant, certaines espèces marines pourraient disparaître dans les 10 prochaines années."</p>
      `,
    },
    3: {
      id: 3,
      title: "Des espèces rares découvertes dans la forêt amazonienne",
      image: "http://inaturalist-open-data.s3.amazonaws.com/photos/160126381/medium.jpeg",
      timeAgo: "2j",
      date: "7 décembre 2025",
      author: "Lucas Bernard",
      content: `
        <p>Une expédition scientifique menée dans une zone reculée de l'Amazonie a permis la découverte de plusieurs espèces jusqu'alors inconnues.</p>
        
        <h3>Une biodiversité insoupçonnée</h3>
        
        <p>Parmi les découvertes : trois nouvelles espèces de grenouilles, deux espèces de papillons et une espèce de singe nocturne. Ces trouvailles témoignent de la richesse incroyable de la forêt amazonienne.</p>
        
        <p>"Chaque expédition nous rappelle à quel point nous connaissons mal notre planète", explique le Dr. Silva, biologiste en chef de l'expédition.</p>
        
        <h3>Une course contre la montre</h3>
        
        <p>Malheureusement, ces découvertes surviennent alors que la déforestation s'accélère dans la région. Les scientifiques estiment que des milliers d'espèces pourraient disparaître avant même d'avoir été découvertes.</p>
      `,
    }
  }

  useEffect(() => {
    // Simule un chargement (plus tard, ce sera un appel API)
    setLoading(true)
    setTimeout(() => {
      const foundArticle = articlesDatabase[id]
      setArticle(foundArticle)
      setLoading(false)
    }, 300)
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