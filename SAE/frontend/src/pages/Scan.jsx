import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Scan.css'

function Scan() {
  const { t } = useTranslation()

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === "MARKER_FOUND") {
                console.log("✅ Dino trouvé !");
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'black' }}>

            <iframe
                src="/Scan.html"
                style={{
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0
                }}
                title={ t('scan.title') }
            />

            <div className="scan-ar-overlay">

                <div className="scan-text">{t('scan.scanMe')}</div>

                <div className="scan-box">
                    <div className="scan-corner scan-top-left"></div>
                    <div className="scan-corner scan-top-right"></div>
                    <div className="scan-corner scan-bottom-left"></div>
                    <div className="scan-corner scan-bottom-right"></div>
                </div>

            </div>

        </div>
    );
    //
}

export default Scan;