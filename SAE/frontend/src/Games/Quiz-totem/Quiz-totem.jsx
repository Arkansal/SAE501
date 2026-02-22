import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Quiz-totem.css';
import '../../components/animalDetail.css';

const QuizTotem = () => {
  const { t } = useTranslation()

  // Générer les questions traduites
  const QUESTIONS = useMemo(() => [
    {
      id: 1,
      question: t('gamesC.quizTotem.questions.q1'),
      options: [
        { text: t('gamesC.quizTotem.questions.q1_o1'), traits: ['Curieux'] },
        { text: t('gamesC.quizTotem.questions.q1_o2'), traits: ['Discret'] },
        { text: t('gamesC.quizTotem.questions.q1_o3'), traits: ['Calme'] },
        { text: t('gamesC.quizTotem.questions.q1_o4'), traits: ['Timide'] },
      ],
    },
    {
      id: 2,
      question: t('gamesC.quizTotem.questions.q2'),
      options: [
        { text: t('gamesC.quizTotem.questions.q2_o1'), traits: ['Protecteur'] },
        { text: t('gamesC.quizTotem.questions.q2_o2'), traits: ['Malin'] },
        { text: t('gamesC.quizTotem.questions.q2_o3'), traits: ['Calme'] },
        { text: t('gamesC.quizTotem.questions.q2_o4'), traits: ['Sociable'] },
      ],
    },
    {
      id: 3,
      question: t('gamesC.quizTotem.questions.q3'),
      options: [
        { text: t('gamesC.quizTotem.questions.q3_o1'), traits: ['Indépendant'] },
        { text: t('gamesC.quizTotem.questions.q3_o2'), traits: ['Sociable'] },
        { text: t('gamesC.quizTotem.questions.q3_o3'), traits: ['Timide'] },
        { text: t('gamesC.quizTotem.questions.q3_o4'), traits: ['Aventurier'] },
      ],
    },
    {
      id: 4,
      question: t('gamesC.quizTotem.questions.q4'),
      options: [
        { text: t('gamesC.quizTotem.questions.q4_o1'), traits: ['Brave'] },
        { text: t('gamesC.quizTotem.questions.q4_o2'), traits: ['Patient'] },
        { text: t('gamesC.quizTotem.questions.q4_o3'), traits: ['Malin'] },
        { text: t('gamesC.quizTotem.questions.q4_o4'), traits: ['Calme'] },
      ],
    },
    {
      id: 5,
      question: t('gamesC.quizTotem.questions.q5'),
      options: [
        { text: t('gamesC.quizTotem.questions.q5_o1'), traits: ['Aventurier'] },
        { text: t('gamesC.quizTotem.questions.q5_o2'), traits: ['Calme'] },
        { text: t('gamesC.quizTotem.questions.q5_o3'), traits: ['Sociable'] },
        { text: t('gamesC.quizTotem.questions.q5_o4'), traits: ['Indépendant'] },
      ],
    },
    {
      id: 6,
      question: t('gamesC.quizTotem.questions.q6'),
      options: [
        { text: t('gamesC.quizTotem.questions.q6_o1'), traits: ['Malin'] },
        { text: t('gamesC.quizTotem.questions.q6_o2'), traits: ['Patient'] },
        { text: t('gamesC.quizTotem.questions.q6_o3'), traits: ['Brave'] },
        { text: t('gamesC.quizTotem.questions.q6_o4'), traits: ['Discret'] },
      ],
    },
    {
      id: 7,
      question: t('gamesC.quizTotem.questions.q7'),
      options: [
        { text: t('gamesC.quizTotem.questions.q7_o1'), traits: ['Protecteur'] },
        { text: t('gamesC.quizTotem.questions.q7_o2'), traits: ['Aventurier'] },
        { text: t('gamesC.quizTotem.questions.q7_o3'), traits: ['Sociable'] },
        { text: t('gamesC.quizTotem.questions.q7_o4'), traits: ['Timide'] },
      ],
    },
    {
      id: 8,
      question: t('gamesC.quizTotem.questions.q8'),
      options: [
        { text: t('gamesC.quizTotem.questions.q8_o1'), traits: ['Déterminé'] },
        { text: t('gamesC.quizTotem.questions.q8_o2'), traits: ['Patient'] },
        { text: t('gamesC.quizTotem.questions.q8_o3'), traits: ['Malin'] },
        { text: t('gamesC.quizTotem.questions.q8_o4'), traits: ['Calme'] },
      ],
    },
    {
      id: 9,
      question: t('gamesC.quizTotem.questions.q9'),
      options: [
        { text: t('gamesC.quizTotem.questions.q9_o1'), traits: ['Aventurier'] },
        { text: t('gamesC.quizTotem.questions.q9_o2'), traits: ['Patient'] },
        { text: t('gamesC.quizTotem.questions.q9_o3'), traits: ['Malin'] },
        { text: t('gamesC.quizTotem.questions.q9_o4'), traits: ['Calme'] },
      ],
    },
    {
      id: 10,
      question: t('gamesC.quizTotem.questions.q10'),
      options: [
        { text: t('gamesC.quizTotem.questions.q10_o1'), traits: ['Protecteur'] },
        { text: t('gamesC.quizTotem.questions.q10_o2'), traits: ['Brave'] },
        { text: t('gamesC.quizTotem.questions.q10_o3'), traits: ['Timide'] },
        { text: t('gamesC.quizTotem.questions.q10_o4'), traits: ['Discret'] },
      ],
    },
    {
      id: 11,
      question: t('gamesC.quizTotem.questions.q11'),
      options: [
        { text: t('gamesC.quizTotem.questions.q11_o1'), traits: ['Curieux'] },
        { text: t('gamesC.quizTotem.questions.q11_o2'), traits: ['Curieux'] },
        { text: t('gamesC.quizTotem.questions.q11_o3'), traits: ['Protecteur'] },
        { text: t('gamesC.quizTotem.questions.q11_o4'), traits: ['Brave'] },
      ],
    },
    {
      id: 12,
      question: t('gamesC.quizTotem.questions.q12'),
      options: [
        { text: t('gamesC.quizTotem.questions.q12_o1'), traits: ['Déterminé'] },
        { text: t('gamesC.quizTotem.questions.q12_o2'), traits: ['Déterminé'] },
        { text: t('gamesC.quizTotem.questions.q12_o3'), traits: ['Discret'] },
        { text: t('gamesC.quizTotem.questions.q12_o4'), traits: ['Indépendant'] },
      ],
    },
  ], [t])

  const TRAITS = {
    Calme: { animalId: 499354 },
    Curieux: { animalId: 544742 },
    Discret: { animalId: 747133 },
    Sociable: { animalId: 2773889 },
    Indépendant: { animalId: 22696060 },
    Malin: { animalId: 23062 },
    Patient: { animalId: 12392 },
    Timide: { animalId: 3157819 },
    Déterminé: { animalId: 19855 },
    Protecteur: { animalId: 3746 },
    Aventurier: { animalId: 45354964 },
  };

  // Profils combinés
  const COMBINED_PROFILES = {
    'Brave+Protecteur': { animalId: 41688 },
    'Brave+Déterminé': { animalId: 6557 },
    'Curieux+Aventurier': { animalId: 15954 },
    'Curieux+Malin': { animalId: 915487 },
    'Calme+Patient': { animalId: 22103 },
    'Calme+Discret': { animalId: 12519 },
    'Sociable+Protecteur': { animalId: 41775 },
    'Sociable+Curieux': { animalId: 22724813 },
    'Timide+Discret': { animalId: 714 },
    'Timide+Malin': { animalId: 899 },
    'Indépendant+Aventurier': { animalId: 22732 },
    'Déterminé+Patient': { animalId: 516500 },
  };

  // États
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [traitScores, setTraitScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultProfile, setResultProfile] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [animalData, setAnimalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [habitatData, setHabitatData] = useState(null);
  const [isLocalFavorited, setIsLocalFavorited] = useState(false);

  // Initialiser les scores
  const initializeScores = () => {
    const scores = {};
    Object.keys(TRAITS).forEach(trait => {
      scores[trait] = 0;
    });
    return scores;
  };

  // Récupérer les données de l'animal
  const fetchAnimalData = async (animalId) => {
    setLoading(true);
    try {
      // Récupérer les données de l'animal
      const animalResponse = await fetch(`http://127.0.0.1:8000/api/animals/${animalId}`);
      const animalDataResult = await animalResponse.json();
      console.log('Données de l\'animal récupérées:', animalDataResult);
      setAnimalData(animalDataResult);

      // Récupérer les pays de l'animal
      const countriesResponse = await fetch(`http://127.0.0.1:8000/api/animalCountries/${animalId}`);
      const animalCountries = await countriesResponse.json();

      // Récupérer les environnements de l'animal
      const environmentsResponse = await fetch(`http://127.0.0.1:8000/api/animalEnvironments/${animalId}`);
      const environments = await environmentsResponse.json().catch(() => []);

      // Combiner les données
      setHabitatData({
        countries: animalCountries,
        environments: environments
      });

      setImageIndex(getInitialImageIndex(animalId));
    } catch (error) {
      console.error('Erreur API:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gérer la sélection d'une réponse
  const handleAnswer = (selectedOption) => {
    const newScores = currentQuestion === -1 || Object.keys(traitScores).length === 0 ? initializeScores() : { ...traitScores };

    // Ajouter les points pour chaque trait
    selectedOption.traits.forEach(trait => {
      newScores[trait] = (newScores[trait] || 0) + 2;
    });

    setTraitScores(newScores);

    // Vérifier si c'est la dernière question
    if (currentQuestion === QUESTIONS.length - 1) {
      calculateResult(newScores);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Calculer le profil final
  const calculateResult = (scores) => {
    // Trier les traits par score décroissant
    const sortedTraits = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([trait]) => trait);

    const trait1 = sortedTraits[0];
    const trait2 = sortedTraits[1];
    const score1 = scores[trait1];
    const score2 = scores[trait2];

    let profile;
    let animalId;

    // Vérifier si profil combiné ou simple
    const scoreDifference = Math.abs(score1 - score2);

    if (scoreDifference <= 1) {
      // PROFIL COMBINÉ : les deux traits sont très proches
      const combinationKey1 = `${trait1}+${trait2}`;
      const combinationKey2 = `${trait2}+${trait1}`;

      // Chercher la combinaison
      if (COMBINED_PROFILES[combinationKey1]) {
        profile = combinationKey1;
        animalId = COMBINED_PROFILES[combinationKey1].animalId;
      } else if (COMBINED_PROFILES[combinationKey2]) {
        profile = combinationKey2;
        animalId = COMBINED_PROFILES[combinationKey2].animalId;
      } else {
        // Si combinaison ne existe pas, prendre le trait le meilleur
        profile = trait1;
        animalId = TRAITS[trait1].animalId;
      }
    } else {
      // PROFIL SIMPLE : le premier trait domine clairement
      profile = trait1;
      animalId = TRAITS[trait1].animalId;
    }

    setResultProfile({
      profile,
      animalId,
      scores,
    });
    setSelectedAnimal(animalId);
    console.log('🎯 Animal Totem ID:', animalId, '| Profil:', profile);
    fetchAnimalData(animalId);
    setShowResult(true);
  };

  // Réinitialiser le quiz
  const resetQuiz = () => {
    setCurrentQuestion(-1);
    setTraitScores({});
    setShowResult(false);
    setResultProfile(null);
    setSelectedAnimal(null);
    setAnimalData(null);
    setImageIndex(0);
  };

  // Gestion des images
  const handleImageError = () => {
    if (animalData?.image && imageIndex < animalData.image.length - 1) {
      setImageIndex(imageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    setImageIndex((prev) => (prev === 0 ? (animalData?.image?.length || 1) - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setImageIndex((prev) => (prev === (animalData?.image?.length || 1) - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const toggleFavorite = () => {
    setIsLocalFavorited(!isLocalFavorited);
  };

  const getInitialImageIndex = (animalId) => {
    switch (animalId) {
      case 23062: return 2;
      case 41688: return 4;
      default: return 0;
    }
  };

  const displayAnimal = animalData;
  const question = currentQuestion >= 0 ? QUESTIONS[currentQuestion] : null;
  const progress = currentQuestion >= 0 ? ((currentQuestion + 1) / QUESTIONS.length) * 100 : 0;

  // Rendu
  return showResult ? (
    <div className="detail-modal-overlay" onClick={resetQuiz}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER FIXE */}
        <div className="detail-modal-header">
          <button
            className={`detail-modal-favorite-btn ${isLocalFavorited ? 'detail-modal-favorite-active' : ''}`}
            onClick={toggleFavorite}
            title={isLocalFavorited ? t('gamesC.quizTotem.removeFromFavorites') : t('gamesC.quizTotem.addToFavorites')}
          >
            {isLocalFavorited ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.19 12.683c-2.5 5.41-8.62 8.2-8.88 8.32a.85.85 0 0 1-.62 0c-.25-.12-6.38-2.91-8.88-8.32c-1.55-3.37-.69-7 1-8.56a4.93 4.93 0 0 1 4.36-1.05a6.16 6.16 0 0 1 3.78 2.62a6.15 6.15 0 0 1 3.79-2.62a4.93 4.93 0 0 1 4.36 1.05c1.78 1.56 2.65 5.19 1.09 8.56" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.99.99 0 0 0 1.024 0C21.126 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3" />
              </svg>
            )}
          </button>
        </div>

        {/* CONTENU SCROLLABLE */}
        <div className="detail-modal-scroll-container">
          {loading ? (
            <p className="detail-loading">{t('gamesC.quizTotem.loading')}</p>
          ) : (
            <>
              {/* Titre + Sous-titre */}
              <div className="detail-animal-title-header">

                <h2>{t('gamesC.quizTotem.totemResult')}<br />{displayAnimal?.commonName || t('gamesC.quizTotem.noName')}</h2>
                <p className="detail-scientific-name">{displayAnimal?.scientificName || t('gamesC.quizTotem.notAvailable')}</p>
              </div>

              {/* Badges d'extinction - 5 colonnes avec niveau au centre */}
              <div className="detail-extinction-badges">
                {(() => {
                  const extinctionLevels = ['NE', 'DI', 'PM', 'QM', 'VU', 'ED', 'DC', 'ES', 'ET']
                  const extinctionColors = {
                    'NE': '#C7C7C7',
                    'DI': '#C7C7C7',
                    'PM': '#047060',
                    'QM': '#D4D125',
                    'VU': '#FDB216',
                    'ED': '#FA6B13',
                    'DC': '#F00707',
                    'ES': '#C41111',
                    'ET': '#000000'
                  }

                  const currentLevel = displayAnimal?.extinctLevel || 'LC'
                  const extinctionMapping = {
                    'NE': 'NE',
                    'DD': 'DI',
                    'LC': 'PM',
                    'NT': 'QM',
                    'VU': 'VU',
                    'EN': 'ED',
                    'CR': 'DC',
                    'EW': 'ES',
                    'EX': 'ET'
                  }
                  const currentLevelFR = extinctionMapping[currentLevel] || 'PM'
                  const currentIndex = extinctionLevels.indexOf(currentLevelFR)

                  const badges = []

                  for (let i = currentIndex - 2; i < currentIndex; i++) {
                    if (i >= 0) {
                      badges.push(extinctionLevels[i])
                    } else {
                      badges.push(null)
                    }
                  }

                  badges.push(currentLevelFR)

                  for (let i = currentIndex + 1; i <= currentIndex + 2; i++) {
                    if (i < extinctionLevels.length) {
                      badges.push(extinctionLevels[i])
                    } else {
                      badges.push(null)
                    }
                  }

                  return badges.map((level, index) =>
                    level ? (
                      <Link
                        key={index}
                        to={`/criteria/${level}`}
                        onClick={resetQuiz}
                        style={{ textDecoration: 'none' }}
                      >
                        <span
                          className={`detail-badge ${level === currentLevelFR ? 'detail-badge-active' : ''}`}
                          style={{
                            backgroundColor: extinctionColors[level]
                          }}
                        >
                          {level}
                        </span>
                      </Link>
                    ) : (
                      <span
                        key={index}
                        className="detail-badge"
                        style={{
                          backgroundColor: 'white'
                        }}
                      />
                    )
                  )
                })()}
              </div>

              <div className="detail-animal-content-grid">
                <div className="detail-animal-image-section">
                  <img
                    src={
                      displayAnimal?.image && displayAnimal.image.length > 0
                        ? displayAnimal.image[imageIndex]
                        : '/placeholder-animal.png'
                    }
                    alt={displayAnimal?.commonName}
                    className="detail-animal-image"
                    onError={handleImageError}
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <div className="detail-quick-info">
                  <p><strong>{t('gamesC.quizTotem.family')}</strong> {displayAnimal.family || t('gamesC.quizTotem.notAvailable')}</p>
                  <p><strong>{t('gamesC.quizTotem.type')}</strong> {displayAnimal.type || t('gamesC.quizTotem.notAvailable')}</p>
                  <p><strong>{t('gamesC.quizTotem.population')}</strong> {displayAnimal.population || t('gamesC.quizTotem.notAvailable')}</p>
                </div>
              </div>

              {/* Section Habitat - Pays */}
              {habitatData?.countries && habitatData.countries.length > 0 ? (
                <div className="detail-habitat-section">
                  <h3>{t('gamesC.quizTotem.habitat')}</h3>
                  <div className="detail-countries-list">
                    {habitatData.countries.map((country, countryIndex) => (
                      <div key={countryIndex} className="detail-country-item">
                        <h4>{country.countryName || country.name || t('gamesC.quizTotem.unknownCountry')}</h4>
                        <p><strong>{t('gamesC.quizTotem.origin')}:</strong> {country.origin || t('gamesC.quizTotem.notAvailable')}</p>
                        <p><strong>{t('gamesC.quizTotem.presence')}:</strong> {country.presenceType || t('gamesC.quizTotem.notAvailable')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="detail-habitat-section">
                  <h3>{t('gamesC.quizTotem.habitat')}</h3>
                  <p className="no-data">{t('gamesC.quizTotem.lackOfData')}</p>
                </div>
              )}

              {/* Section Environnements */}
              {habitatData?.environments && habitatData.environments.length > 0 ? (
                <div className="detail-habitat-section">
                  <h3>{t('gamesC.quizTotem.environments')}</h3>
                  <div className="detail-environments-names">
                    <ul>
                      {habitatData.environments.map((env, envIndex) => (
                        <li key={envIndex}>
                          <strong>{env.environmentName}</strong>
                          {env.type && <span> — {env.type}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="detail-habitat-section">
                  <h3>{t('gamesC.quizTotem.environments')}</h3>
                  <p className="no-data">{t('gamesC.quizTotem.lackOfData')}</p>
                </div>
              )}
              {/* Section Evolution de la population */}
              <div className="detail-habitat-section">
                <h3>{t('gamesC.quizTotem.populationEvolution')}</h3>
                <div className="detail-habitat-section">
                  <p>{t('gamesC.quizTotem.lackOfData')}</p>
                </div>
              </div>

              {/* Carrousel Images */}
              {showImageModal && displayAnimal?.image && displayAnimal.image.length > 0 && (
                <div className="detail-image-modal-overlay" onClick={handleCloseImageModal}>
                  <div className="detail-image-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="detail-image-modal-close" onClick={handleCloseImageModal}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16">
                        <path fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"></path>
                      </svg>
                    </button>
                    <img
                      src={displayAnimal?.image?.[imageIndex]}
                      alt={`${displayAnimal?.commonName} - Image ${imageIndex + 1}`}
                      className="detail-image-modal-image"
                    />

                    {displayAnimal?.image?.length > 1 && (
                      <>
                        <button className="detail-image-nav-btn detail-image-nav-prev" onClick={handlePreviousImage}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="white" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                          </svg>
                        </button>
                        <button className="detail-image-nav-btn detail-image-nav-next" onClick={handleNextImage}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="white" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                          </svg>
                        </button>
                      </>
                    )}
                    <div className="detail-image-counter">
                      {imageIndex + 1} / {displayAnimal?.image?.length}
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton recommencer */}
              <button className="restart-btn" onClick={resetQuiz}>
                {t('gamesC.quizTotem.restartButton')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="quiz-totem-container">
      {currentQuestion === -1 && (
        <div className="introduction">
          <h1>{t('gamesC.quizTotem.introduction')}</h1>
          <p>
            {t('gamesC.quizTotem.introText')}
          </p>
          <button
            className="start-btn"
            onClick={() => setCurrentQuestion(0)}
          >
            {t('gamesC.quizTotem.startButton')}
          </button>
        </div>
      )}

      {currentQuestion >= 0 && (
        <>
          <div className="quiz-top-bar">
            <div className="game-title">
              <button className="quit-btn" onClick={resetQuiz}>
                {t('gamesC.quizTotem.quitButton')}
              </button>
              <h3>{t('gamesC.quizTotem.title')}</h3>
              <p>{currentQuestion + 1}/12</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={`question-container ${currentQuestion === -1 ? 'hidden' : ''}`}>
        <div className="question-content">
          {question && (
            <>
              <h2>{question.question}</h2>
              <div className="options">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className="option-btn"
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="option-text">{option.text}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTotem;
