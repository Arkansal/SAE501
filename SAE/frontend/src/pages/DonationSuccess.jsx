import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './DonationSuccess.css'
import artemisLogo from '../assets/images/LogoArtemis.svg'

function DonationSuccess() {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [paymentData, setPaymentData] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const sessionId = searchParams.get('session_id')

        if (!sessionId) {
            setError(t('donationSuccess.invalidSession'))
            setLoading(false)
            return
        }

        // Vérifier le paiement auprès du backend
        const verifyPayment = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/verify-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionId })
                })

                const data = await response.json()

                if (data.success && data.status === 'paid') {
                    setPaymentData(data)
                } else {
                    setError(t('donationSuccess.paymentNotConfirmed'))
                }
            } catch (err) {
                console.error('Erreur lors de la vérification:', err)
                setError(t('donationSuccess.verifyError'))
            } finally {
                setLoading(false)
            }
        }

        verifyPayment()
    }, [searchParams])

    if (loading) {
        return (
            <div className="donation-success-container">
                <div className="donation-success-content">
                    <div className="loading-spinner">
                        <p>{t('donationSuccess.verifyingPayment')}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="donation-success-container">
                <div className="donation-success-content">
                    <div className="error-message">
                        <h2>{t('donationSuccess.error')}</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate('/donation')} className="return-button">
                            {t('donationSuccess.returnButton')}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="donation-success-container">
            <div className="donation-success-content">
                <div className="success-card">
                    <div className="success-icon">✅</div>
                    <h1>{t('donationSuccess.thankYou')}</h1>
                    <p className="success-message">
                        {t('donationSuccess.donationReceived')} <strong>{paymentData?.amount}€</strong> {t('donationSuccess.successMessageEnd')}
                    </p>

                    <div className="payment-details">
                        <h3>{t('donationSuccess.donationDetails')}</h3>
                        <div className="detail-row">
                            <span>{t('donationSuccess.amount')} :</span>
                            <span>{paymentData?.amount}€</span>
                        </div>
                        <div className="detail-row">
                            <span>{t('donationSuccess.email')} :</span>
                            <span>{paymentData?.customerEmail}</span>
                        </div>
                        <div className="detail-row">
                            <span>{t('donationSuccess.status')} :</span>
                            <span className="status-paid">{t('donationSuccess.paid')}</span>
                        </div>
                    </div>

                    <div className="thank-you-message">
                        <img src={artemisLogo} alt="Artémis" className="logo" />
                        <p>
                            Votre générosité nous permet de poursuivre notre mission de
                            sensibilisation et de protection des espèces en danger.
                            Un reçu fiscal vous sera envoyé par email.
                        </p>
                    </div>

                    <button onClick={() => navigate('/')} className="return-home-button">
                        {t('donationSuccess.returnButton')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DonationSuccess