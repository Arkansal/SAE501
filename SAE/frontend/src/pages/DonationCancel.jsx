import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './DonationCancel.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'

function DonationCancel() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="donation-cancel-container">
            <div className="donation-cancel-content">
                <div className="cancel-card">
                    <div className="cancel-icon">❌</div>
                    <h1>{t('donationCancel.title')}</h1>
                    <p className="cancel-message">
                        {t('donationCancel.cancelledMessage')}
                    </p>

                    <div className="cancel-info">
                        <img src={artemisLogo} alt="Artémis" className="logo" />
                        <p>
                            {t('donationCancel.understandMessage')}
                        </p>
                    </div>

                    <div className="cancel-actions">
                        <button
                            onClick={() => navigate('/donation')}
                            className="retry-button"
                        >
                            {t('donationCancel.retryButton')}
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="return-home-button"
                        >
                            {t('donationCancel.returnHomeButton')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DonationCancel