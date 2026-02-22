import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExtinctionGame.css";

function ExtinctionGame() {
  const navigate = useNavigate();
  
  // Game State
  const [gameState, setGameState] = useState("start"); // 'start', 'playing', 'finished'
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const MAX_QUESTIONS = 10;

  // Data State
  const [animal, setAnimal] = useState(null);
  const [extinctionLevels, setExtinctionLevels] = useState([]);
  const [currentChoices, setCurrentChoices] = useState([]);
  
  // Interaction State
  const [selectedChoice, setSelectedChoice] = useState(null); // Choix en cours (avant validation)
  const [submittedChoice, setSubmittedChoice] = useState(null); // Choix validé
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Colors for criteria buttons (IUCN Standard Codes)
  const colors = {
    NE: "#bfbfbf", // Non évalué
    DD: "#d9d9d9", // Données insuffisantes
    LC: "#0c8f78", // Préoccupation mineure
    NT: "#d7c926", // Quasi menacé
    VU: "#e8a21a", // Vulnérable
    EN: "#f97b18", // En danger
    CR: "#d90f0f", // En danger critique
    EW: "#951313", // Éteint à l'état sauvage
    EX: "#000000", // Éteint
  };

  // 1. Initial Load: Fetch all extinction levels
  useEffect(() => {
    fetch("http://localhost:8000/api/extinctLevel")
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les niveaux d'extinction");
        return res.json();
      })
      .then((data) => setExtinctionLevels(data))
      .catch((err) => {
        console.error("Error fetching extinction levels:", err);
        setError("Erreur de chargement des données de jeu.");
      });
  }, []);

  // 2. Start Game
  const startGame = () => {
    setScore(0);
    setQuestionCount(1);
    setGameState("playing");
    fetchNewAnimal();
  };

  // 3. Fetch New Animal
  const fetchNewAnimal = async () => {
    setLoading(true);
    setError(null);
    setSelectedChoice(null);
    setSubmittedChoice(null);
    setIsCorrect(null);
    setAnimal(null); // Clear previous animal to prevent UI flickering
    setCurrentChoices([]); // Clear choices

    try {
      const response = await fetch("http://localhost:8000/api/randomAnimalWithExtinctionLevel");
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      const data = await response.json();
      setAnimal(data);
    } catch (err) {
      console.error("Error fetching animal:", err);
      setError("Impossible de charger l'animal. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Generate Choices when animal changes
  useEffect(() => {
    if (animal && extinctionLevels.length > 0) {
      const correctCode = animal.extinctLevel.extinctLevel;
      const correctLevel = extinctionLevels.find((lvl) => lvl.extinctLevel === correctCode);
      
      if (!correctLevel) {
        console.warn("Niveau d'extinction de l'animal introuvable dans la liste référentielle.");
        return;
      }

      const otherLevels = extinctionLevels.filter((lvl) => lvl.extinctLevel !== correctCode);
      const shuffledOthers = [...otherLevels].sort(() => 0.5 - Math.random());
      const distractors = shuffledOthers.slice(0, 3);
      const choices = [correctLevel, ...distractors].sort(() => 0.5 - Math.random());
      
      setCurrentChoices(choices);
    }
  }, [animal, extinctionLevels]);

  // 5. Select Choice (Click on bubble)
  const handleSelect = (choiceCode) => {
    if (submittedChoice) return; // Prevent changing after validation
    setSelectedChoice(choiceCode);
  };

  // 6. Validate Answer
  const handleValidate = () => {
    if (!selectedChoice || submittedChoice) return;

    setSubmittedChoice(selectedChoice);
    const correctCode = animal.extinctLevel.extinctLevel;
    const isRight = selectedChoice === correctCode;
    
    setIsCorrect(isRight);
    if (isRight) {
      setScore((prev) => prev + 1);
    }
  };

  // 7. Next Question
  const handleNextQuestion = () => {
    if (questionCount >= MAX_QUESTIONS) {
      setGameState("finished");
    } else {
      setQuestionCount((prev) => prev + 1);
      fetchNewAnimal();
    }
  };

  const handleRestart = () => {
    setGameState("start");
    setError(null);
  };

  // --- RENDER HELPERS ---

  if (gameState === "start") {
    return (
      <div className="extinction-game-container">
        <div className="introduction">
          <h1>Jeu d'Extinction</h1>
          <p>
            Testez vos connaissances ! On vous présente un animal, et vous devez deviner son statut de conservation (Vulnérable, En Danger, Éteint, etc.).
          </p>
          <p>
            Vous aurez <strong>{MAX_QUESTIONS} questions</strong>. Êtes-vous prêt ?
          </p>
          <button className="start-btn" onClick={startGame}>
            Commencer le jeu
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
    return (
      <div className="extinction-game-container">
        <div className="result-container">
          <h2>Partie Terminée !</h2>
          <div className="final-score">
            Votre score : {score} / {MAX_QUESTIONS}
          </div>
          <p className="result-message">
            {score === MAX_QUESTIONS ? "Incroyable ! Un vrai expert !" : 
             score >= MAX_QUESTIONS / 2 ? "Bien joué ! Vous connaissez bien la faune." : 
             "Continuez à apprendre, la nature a besoin de vous !"}
          </p>
          <button className="start-btn" onClick={handleRestart}>
            Rejouer
          </button>
          <br /><br />
          <button className="quit-btn" onClick={() => navigate(-1)} style={{display: 'inline-block'}}>
            Quitter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="extinction-game-container">
      {/* Top Bar */}
      <div className="game-top-bar">
        <button className="quit-btn" onClick={() => navigate(-1)}>
          Quitter
        </button>
        <div className="score-display">
          Question {questionCount} / {MAX_QUESTIONS}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(questionCount / MAX_QUESTIONS) * 100}%` }}
        ></div>
      </div>

      {/* Main Game Content */}
      <div className="question-container">
        {loading ? (
          <div className="game-loading">Chargement de l'animal...</div>
        ) : error ? (
          <div className="game-error">
            <h2>⚠️ Oups</h2>
            <p>{error}</p>
            <button className="start-btn" onClick={fetchNewAnimal}>Réessayer</button>
          </div>
        ) : animal && animal.extinctLevel ? (
          <>
            <h2 className="question-title">
              Quel est le statut de <br/>
              <strong>{animal.commonName || animal.scientificName}</strong> ?
            </h2>
            
            <div className="animal-image-container">
              {animal.images && animal.images.length > 0 ? (
                <img
                  src={animal.images[0]}
                  alt={animal.commonName}
                  className="animal-image"
                />
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888'}}>
                  Image indisponible
                </div>
              )}
            </div>

            <div className="extinction-choices">
              {currentChoices.map((level) => {
                const code = level.extinctLevel;
                const bgColor = colors[code] || "#555";
                
                // Determine styling based on state
                let extraClass = "";
                const isSelected = selectedChoice === code;
                
                if (submittedChoice) {
                    // Game finished for this question
                    if (code === animal.extinctLevel.extinctLevel) extraClass = "correct";
                    else if (code === submittedChoice && code !== animal.extinctLevel.extinctLevel) extraClass = "incorrect";
                    else extraClass = "disabled-choice";
                } else {
                    // Selection phase
                    if (isSelected) extraClass = "selected";
                    else if (selectedChoice) extraClass = "dimmed"; // Dim others when one is selected
                }

                return (
                  <button
                    key={code}
                    onClick={() => handleSelect(code)}
                    className={`choice-btn ${extraClass}`}
                    style={{ backgroundColor: bgColor, transform: isSelected ? 'scale(1.15)' : 'scale(1)', border: isSelected ? '4px solid #3825A5' : 'none' }}
                    disabled={!!submittedChoice}
                  >
                    {code}
                  </button>
                );
              })}
            </div>

            {/* Display Selected Name & Validation Button */}
            {!submittedChoice && selectedChoice && (
               <div style={{marginTop: '20px', animation: 'slideUp 0.3s ease-out'}}>
                   <h3 style={{color: '#3825A5', marginBottom: '10px'}}>
                     {currentChoices.find(c => c.extinctLevel === selectedChoice)?.levelName}
                   </h3>
                   <button className="next-btn" onClick={handleValidate} style={{background: '#4CAF50'}}>
                     Valider
                   </button>
               </div>
            )}

            {submittedChoice && (
              <div className="feedback-container">
                {isCorrect ? (
                  <p className="feedback-correct">
                      ✅ Bonne réponse ! C'est bien {animal.extinctLevel.extinctLevel} ({animal.extinctLevel.levelName}).
                  </p>
                ) : (
                  <p className="feedback-incorrect">
                    ❌ Faux. C'était {animal.extinctLevel.extinctLevel} ({animal.extinctLevel.levelName}).
                  </p>
                )}
                
                {animal.extinctLevel.description && (
                  <div className="feedback-description" style={{margin: '15px 0', fontSize: '0.95em', color: '#555', textAlign: 'left', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '10px'}}>
                    {animal.extinctLevel.description}
                  </div>
                )}

                <button className="next-btn" onClick={handleNextQuestion}>
                  {questionCount >= MAX_QUESTIONS ? "Voir les résultats" : "Question suivante"}
                </button>
              </div>
            )}
          </>
        ) : (
           <div className="game-loading">Préparation du jeu...</div>
        )}
      </div>
    </div>
  );
}

export default ExtinctionGame;
