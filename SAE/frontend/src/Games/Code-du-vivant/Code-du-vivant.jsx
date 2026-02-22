import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../services/api'
import GameAnimalFiche from './GameAnimalFiche'
import { breakdownScientificName as breakdownFr } from './latinRootsFr'
import { breakdownScientificName as breakdownEn } from './latinRootsEn'
import { breakdownScientificName as breakdownEs } from './latinRootsEs'
import './Code-du-vivant.css'

const CodeDuVivant = () => {
  const { t, i18n } = useTranslation()
  
  // Select the correct breakdown function based on language
  const breakdownScientificName = useMemo(() => {
    switch (i18n.language) {
      case 'en':
        return breakdownEn
      case 'es':
        return breakdownEs
      default:
        return breakdownFr
    }
  }, [i18n.language])
  
  // ===== ÉTATS DE JEU =====
  const [gameState, setGameState] = useState('home') // home, playing, result, summary
  const [gameMode, setGameMode] = useState(null) // 5, 10, infinity
  const [animalsList, setAnimalsList] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [score, setScore] = useState(0)
  const [showFiche, setShowFiche] = useState(false)
  const [loading, setLoading] = useState(false)
  const [completedGames, setCompletedGames] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  const navigate = useNavigate()
  const currentAnimal = animalsList[currentQuestionIndex]

  // ===== NAVIGUER LES IMAGES =====
  const previousImage = () => {
    if (currentAnimal?.images?.length) {
      setImageIndex((prev) => (prev === 0 ? currentAnimal.images.length - 1 : prev - 1))
    }
  }

  const nextImage = () => {
    if (currentAnimal?.images?.length) {
      setImageIndex((prev) => (prev === currentAnimal.images.length - 1 ? 0 : prev + 1))
    }
  }

  // ===== CHARGER LES ANIMAUX =====
  const loadGameAnimals = async (count) => {
    setLoading(true)
    
    try {
      const response = await api.get(`/game/code-du-vivant/animals/${count}`)
      const data = await response.json()
      const animals = Array.isArray(data) ? data : data.animals || []
      
      setAnimalsList(animals)
      
      setCurrentQuestionIndex(0)
      setUserAnswers({})
      setScore(0)
      setSelectedAnswer(null)
      setAnswered(false)
      setGameState('playing')
    } catch (error) {
      alert(t('gamesC.codeDuVivant.errorLoading'))
    } finally {
      setLoading(false)
    }
  }

  // ===== DÉMARRER UNE PARTIE =====
  const startGame = async (mode) => {
    setGameMode(mode)
    const count = mode === 'infinity' ? 50 : mode
    await loadGameAnimals(count)
  }

  // ===== RÉPONDRE À UNE QUESTION =====
  const handleAnswer = (index) => {
    if (answered) return

    setSelectedAnswer(index)
    const isCorrect = index === currentAnimal.correctIndex
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: {
        selected: index,
        correct: currentAnimal.correctIndex,
        isCorrect: isCorrect
      }
    })

    if (isCorrect) {
      setScore(score + 1)
    }

    setAnswered(true)
  }

  // ===== ALLER À LA QUESTION SUIVANTE =====
  const goToNextQuestion = () => {
    const totalQuestions = gameMode === 'infinity' ? animalsList.length : gameMode
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setImageIndex(0) // Réinitialiser l'index d'image
      setSelectedAnswer(null)
      setAnswered(false)
      
      // Fermer la fiche si elle est ouverte
      setShowFiche(false)
    } else {
      // Fin de partie
      endGame()
    }
  }

  // ===== TERMINER LA PARTIE =====
  const endGame = () => {
    setCompletedGames(completedGames + 1)
    setGameState('summary')
  }

  // ===== RETOUR À L'ACCUEIL =====
  const goHome = () => {
    setGameState('home')
    setGameMode(null)
    setAnimalsList([])
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setShowFiche(false)
  }

  // ===== REJEU =====
  const playAgain = async () => {
    await startGame(gameMode)
  }

  // ===== MODAL DE CHARGEMENT =====
  const LoadingModal = () => {
    if (!loading) return null
    
    return (
      <div className="cdv-loading-overlay">
        <div className="cdv-loading-content">
          <div className="cdv-spinner"></div>
          <p>{t('gamesC.codeDuVivant.loading')}</p>
        </div>
      </div>
    )
  }

  // ===== ÉCRAN D'ACCUEIL =====
  if (gameState === 'home') {
    return (
      <div className="cdv-container">
        <div className="cdv-home">
          <div className="cdv-home-content">
            <h1 className="cdv-title">{t('gamesC.codeDuVivant.title')}</h1>
            
            <div className="cdv-intro-rules">
              <p>
                {t('gamesC.codeDuVivant.intro')}
              </p>
            </div>

            <h2 className="cdv-mode-title">{t('gamesC.codeDuVivant.selectMode')}</h2>
            <div className="cdv-mode-selector">
              <button 
                className="cdv-mode-btn cdv-mode-btn-5"
                onClick={() => startGame(5)}
                disabled={loading}
              >
                <span className="cdv-mode-label">{t('gamesC.codeDuVivant.modeRapide')}</span>
                <span className="cdv-mode-subtitle">{t('gamesC.codeDuVivant.5animals')}</span>
              </button>

              <button 
                className="cdv-mode-btn cdv-mode-btn-10"
                onClick={() => startGame(10)}
                disabled={loading}
              >
                <span className="cdv-mode-label">{t('gamesC.codeDuVivant.modeClassique')}</span>
                <span className="cdv-mode-subtitle">{t('gamesC.codeDuVivant.10animals')}</span>
              </button>
            </div>

          </div>
        </div>

        <LoadingModal />
      </div>
    )
  }

  // ===== ÉCRAN DE JEU =====
  if (gameState === 'playing' && currentAnimal) {
    const totalQuestions = gameMode === 'infinity' ? animalsList.length : gameMode
    const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100

    return (
      <div className="cdv-container">
        <div className="cdv-game">
          {/* HEADER */}
          <div className="cdv-game-header">
            <div className="cdv-progress">
              <span className="cdv-counter">{currentQuestionIndex + 1}/{totalQuestions}</span>
              <div className="cdv-progress-bar">
                <div 
                  className="cdv-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="cdv-score">
              <span className="cdv-score-label">{t('gamesC.codeDuVivant.score')}</span>
              <span className="cdv-score-value">{score}</span>
            </div>
            <button className="cdv-game-quit" onClick={goHome}>
              ✕
            </button>
          </div>

          {/* IMAGE DE L'ANIMAL */}
          <div className="cdv-animal-image">
            {currentAnimal.images?.length > 1 && (
              <div className="cdv-image-controls">
                <button className="cdv-image-nav-btn cdv-image-prev" onClick={previousImage} aria-label={t('gamesC.codeDuVivant.imageNav.previous')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <span className="cdv-image-counter">
                  {imageIndex + 1}/{currentAnimal.images.length}
                </span>
                <button className="cdv-image-nav-btn cdv-image-next" onClick={nextImage} aria-label={t('gamesC.codeDuVivant.imageNav.next')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
            <img 
              src={currentAnimal.images?.[imageIndex] || '/placeholder-animal.png'}
              alt={currentAnimal.commonName}
              onError={(e) => {
                e.target.src = '/placeholder-animal.png'
              }}
              onClick={() => setShowImageModal(true)}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {/* PROPOSITIONS DE RÉPONSES */}
          <div className="cdv-answers">
            {currentAnimal.propositions?.map((proposition, index) => (
              <button
                key={index}
                className={`cdv-answer-btn ${
                  selectedAnswer === index ? (
                    index === currentAnimal.correctIndex ? 'cdv-answer-correct' : 'cdv-answer-wrong'
                  ) : (
                    answered && index === currentAnimal.correctIndex ? 'cdv-answer-correct' : ''
                  )
                } ${answered ? 'cdv-answer-disabled' : ''}`}
                onClick={() => handleAnswer(index)}
                disabled={answered}
              >
                <span className="cdv-answer-text">{proposition}</span>
              </button>
            ))}
          </div>

          {/* EXPLICATION SCIENTIFIQUE - DÉCOMPOSITION DES RACINES */}
          {answered && (
            <div className={`cdv-explanation ${selectedAnswer === currentAnimal.correctIndex ? 'cdv-explanation-correct' : 'cdv-explanation-wrong'}`}>
              <h3>{t('gamesC.codeDuVivant.scientificBreakdown')}</h3>
              <div className="cdv-name-breakdown">
                {breakdownScientificName(currentAnimal.scientificName).map((part, index) => (
                  <div key={index} className="cdv-breakdown-part">
                    <span className="cdv-breakdown-text">{part.part}</span>
                    <span className="cdv-breakdown-meaning">{part.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOUTON SUIVANT / FICHE */}
          {answered && (
            <div className="cdv-actions">
              {!showFiche && (
                <button 
                  className="cdv-see-fiche-btn"
                  onClick={() => setShowFiche(true)}
                >
                  {t('gamesC.codeDuVivant.seeSheet')}
                </button>
              )}
              <button 
                className="cdv-next-btn"
                onClick={goToNextQuestion}
              >
                {currentQuestionIndex === totalQuestions - 1 ? t('gamesC.codeDuVivant.seeResume') : t('gamesC.codeDuVivant.nextQuestion')}
              </button>
            </div>
          )}

          {/* FICHE PÉDAGOGIQUE */}
          {showFiche && (
            <GameAnimalFiche 
              animal={currentAnimal} 
              onClose={() => setShowFiche(false)}
            />
          )}

          {/* MODAL IMAGE AGRANDIE */}
          {showImageModal && (
            <div className="cdv-image-modal-overlay">
              <div className="cdv-image-modal-content">
                <img 
                  src={currentAnimal.images?.[imageIndex] || '/placeholder-animal.png'}
                  alt={currentAnimal.commonName}
                  className="cdv-image-modal-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-animal.png'
                  }}
                />
                <button 
                  className="cdv-image-modal-close"
                  onClick={() => setShowImageModal(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        <LoadingModal />
      </div>
    )
  }

  // ===== ÉCRAN RÉSUMÉ FINAL =====
  if (gameState === 'summary') {
    const totalQuestions = gameMode === 'infinity' ? Object.keys(userAnswers).length : gameMode

    return (
      <div className="cdv-container">
        <div className="cdv-summary">
          <div className="cdv-summary-content">
            <h1 className="cdv-summary-title">{t('gamesC.codeDuVivant.result')}</h1>

            <div className="cdv-score-display">
              <span className="cdv-score-result">{score}/{totalQuestions}</span>
            </div>

            <div className="cdv-results-list">
              {Object.entries(userAnswers).map(([index, answer]) => {
                const animal = animalsList[parseInt(index)]
                return (
                  <div key={index} className={`cdv-result-item ${answer.isCorrect ? 'cdv-result-correct' : 'cdv-result-wrong'}`}>
                    <span className="cdv-result-name">{animal.commonName}</span>
                    <span className="cdv-result-scientific">
                      {animal.propositions[answer.correct]}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="cdv-summary-actions">
              <button 
                className="cdv-play-again-btn"
                onClick={playAgain}
                disabled={loading}
              >
                {t('gamesC.codeDuVivant.playAgain')}
              </button>
              <button 
                className="cdv-home-btn"
                onClick={goHome}
              >
                {t('gamesC.codeDuVivant.home')}
              </button>
            </div>

          </div>
        </div>

        <LoadingModal />
      </div>
    )
  }

  return null
}

export default CodeDuVivant