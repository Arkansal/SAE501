import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Critere() {
  const { t } = useTranslation()
  const [critereList, setCritereList] = useState([])
  const [selectedCritere, setSelectedCritere] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Couleurs des pastilles
  const colors = {
    NE: "#bfbfbf",
    DI: "#d9d9d9",
    PM: "#0c8f78",
    QM: "#d7c926",
    VU: "#e8a21a",
    ED: "#f97b18",
    DC: "#d90f0f",
    ES: "#951313",
    ET: "#000000",
  };

  // Récupération des données + détection du Hash (#)
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/extinctLevel")
      .then((res) => res.json())
      .then((data) => {
        setCritereList(data);

        // --- Logique de sélection via l'URL ---
        const hash = location.hash.replace("#", ""); // ex: récupère "PM"
        
        if (hash && data.length > 0) {
          // On cherche dans les données si un code correspond au hash
          const found = data.find((c) => {
            const code = c.extinct_level || c.extinctLevel || c.level_code || c.code;
            return code === hash;
          });

          if (found) {
            setSelectedCritere(found);
          } else {
            setSelectedCritere(data[0]); // Par défaut le premier si non trouvé
          }
        } else if (data.length > 0) {
          setSelectedCritere(data[0]); // Par défaut le premier si pas de hash
        }
        // --------------------------------------

        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setLoading(false);
      });
  }, [location.hash]); // Se relance si le hash change sans recharger la page

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Quicksand', sans-serif" }}>
        {t('critere.loading')}
      </div>
    );
  }

  if (!critereList.length) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Quicksand', sans-serif" }}>
        {t('critere.noCriteres')}
      </div>
    );
  }

  const renderContent = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements = [];
    let currentList = [];

    lines.forEach((line, i) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
        currentList.push(trimmedLine.substring(1).trim());
      } else {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`ul-${i}`} style={{ margin: "8px 0 16px 0", paddingLeft: "20px" }}>
              {currentList.map((item, idx) => (
                <li key={idx} style={{ marginBottom: "6px" }}>{item}</li>
              ))}
            </ul>
          );
          currentList = [];
        }
        if (trimmedLine) {
          elements.push(
            <p key={`p-${i}`} style={{ margin: i === 0 ? "0 0 16px 0" : "16px 0 4px 0", fontWeight: trimmedLine.startsWith("🛈") ? "600" : "500" }}>
              {trimmedLine}
            </p>
          );
        }
      }
    });

    if (currentList.length > 0) {
      elements.push(
        <ul key="ul-final" style={{ margin: "8px 0 16px 0", paddingLeft: "20px" }}>
          {currentList.map((item, idx) => (
            <li key={idx} style={{ marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      );
    }
    return elements;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", fontFamily: "'Quicksand', sans-serif" }}>
      {/* HEADER */}
      <div style={{ backgroundColor: "#fff", padding: "16px", position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)" }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: "none", border: "none", padding: "8px", cursor: "pointer", color: "#2D2C7E", position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292" />
          </svg>
        </button>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#3825A5", margin: "0 0 2px 0" }}>{t('critere.title')}</h1>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#3825A5", margin: 0 }}>{t('critere.subtitle')}</h2>
        </div>
      </div>

      {/* PASTILLES */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "12px", padding: "20px 16px", justifyContent: "center" }}>
        {critereList.map((c, index) => {
          const levelCode = c.extinct_level || c.extinctLevel || c.level_code || c.code || "??";
          const bgColor = colors[levelCode] || "#555";
          
          // Comparaison pour l'état sélectionné
          const isSelected = selectedCritere && (
            selectedCritere === c || 
            (selectedCritere.extinct_level || selectedCritere.code) === levelCode
          );

          return (
            <button
              key={`${levelCode}-${index}`}
              onClick={() => setSelectedCritere(c)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: bgColor,
                boxShadow: isSelected ? "0 0 0 3px rgba(56, 37, 165, 0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              {levelCode}
            </button>
          );
        })}
      </div>

      {/* CONTENU DYNAMIQUE */}
      {selectedCritere && (
        <div style={{ padding: "20px 16px", maxWidth: "800px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#3825A5", marginBottom: "12px" }}>
            {selectedCritere.levelName || "Sans titre"}
          </h3>
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "20px", fontSize: "14px", color: "#2D2C7E", lineHeight: "1.6", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)" }}>
            {renderContent(selectedCritere.description || selectedCritere.text || "")}
          </div>
        </div>
      )}
    </div>
  );
}

export default Critere;