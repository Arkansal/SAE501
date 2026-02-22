import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Donation.css'
import { CustomGenderSelect, CustomLegalFormSelect } from '../components/DonationSelect'

function Donation() {
    const { t } = useTranslation()
    const [amount, setAmount] = useState('');
    const [freeAmount, setFreeAmount] = useState(false);
    const [mail, setMail] = useState('');
    const [gender, setGender] = useState('');
    const [ifCompany, setIfCompany] = useState(false);
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [country, setCountry] = useState('');
    const [adress, setAdress] = useState('');
    const [loading, setLoading] = useState(false);
    const [raisonSociale, setRaisonSociale] = useState('');
    const [siren, setSiren] = useState('');
    const [formeJuridique, setFormeJuridique] = useState('');
    const navigate = useNavigate();

    const handleAmountClick = (value) => {
        setAmount(value);
        setFreeAmount(false);
    };

    const handleFreeAmountClick = () => {
        setFreeAmount(true);
        setAmount('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Préparer les données à envoyer
            const donationData = {
                amount: parseFloat(amount),
                mail,
                gender,
                ifCompany,
                name,
                firstName,
                country,
                adress,
            };

            // Ajouter les infos entreprise si nécessaire
            if (ifCompany) {
                donationData.raisonSociale = raisonSociale;
                donationData.siren = siren;
                donationData.formeJuridique = formeJuridique;
            }

            // Appeler l'API Symfony pour créer la session Stripe
            const response = await fetch('http://localhost:8000/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData)
            });

            const data = await response.json();

            if (data.success) {
                // Rediriger vers la page de paiement Stripe
                window.location.href = data.url;
            } else {
                alert('Erreur : ' + data.error);
                setLoading(false);
            }

        } catch (error) {
            console.error('Erreur lors de la création du paiement:', error);
            alert('Erreur lors de la création du paiement. Veuillez réessayer.');
            setLoading(false);
        }
    };

    return (
        <div className="donation-container">
            <div className="donation-content">
                <div className="donation-header-section">
                    <h1>{t('donation.title')}</h1>
                </div>
                <div className="donation-amount">
                    <div className="donation-price">
                        <button
                            type="button"
                            className={`donation-price-button ${amount === '5' && !freeAmount ? 'active' : ''}`}
                            onClick={() => handleAmountClick('5')}
                        >
                            5€
                        </button>
                        <button
                            type="button"
                            className={`donation-price-button ${amount === '20' && !freeAmount ? 'active' : ''}`}
                            onClick={() => handleAmountClick('20')}
                        >
                            20€
                        </button>
                        <button
                            type="button"
                            className={`donation-price-button ${amount === '50' && !freeAmount ? 'active' : ''}`}
                            onClick={() => handleAmountClick('50')}
                        >
                            50€
                        </button>
                        <button
                            type="button"
                            className={`donation-price-button ${amount === '100' && !freeAmount ? 'active' : ''}`}
                            onClick={() => handleAmountClick('100')}
                        >
                            100€
                        </button>
                    </div>
                    <div className="donation-free-amount">
                        <button
                            type="button"
                            className={`freeAmount ${freeAmount ? 'active' : ''}`}
                            onClick={handleFreeAmountClick}
                        >
                            {t('donation.freeAmount')}
                        </button>
                        {freeAmount && (
                            <input
                                type="number"
                                placeholder={t('donation.amountPlaceholder')}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="donation-form-input"
                                min="1"
                            />
                        )}
                    </div>
                </div>
                <hr />
                <form className='donation-form' onSubmit={handleSubmit}>
                    <input
                        type='email'
                        placeholder={t('donation.email')}
                        required
                        className='donation-form-input donation-input-group'
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />
                    <CustomGenderSelect value={gender} onChange={setGender} />
                    <br />
                    <label className='donation-checkbox-label donation-checkbox-group'>
                        <input
                            type='checkbox'
                            className='donation-checkbox'
                            checked={ifCompany}
                            onChange={(e) => setIfCompany(e.target.checked)}
                        />
                        {t('donation.companyCheckbox')}
                    </label>

                    {ifCompany && (
                        <div className="donation-company-fields">
                            <input
                                type='text'
                                placeholder={t('donation.socialReason')}
                                required
                                className='donation-form-input donation-input-group'
                                value={raisonSociale}
                                onChange={(e) => setRaisonSociale(e.target.value)}
                            />
                            <input
                                type='text'
                                placeholder={t('donation.siren')}
                                required
                                className='donation-form-input donation-input-group'
                                value={siren}
                                onChange={(e) => setSiren(e.target.value)}
                                maxLength="9"
                            />
                            <CustomLegalFormSelect value={formeJuridique} onChange={setFormeJuridique} />
                        </div>
                    )}

                    <input
                        type='text'
                        placeholder={t('donation.name')}
                        required
                        className='donation-form-input donation-input-group'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder={t('donation.firstName')}
                        required
                        className='donation-form-input donation-input-group'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder={t('donation.country')}
                        required
                        className='donation-form-input donation-input-group'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder={t('donation.address')}
                        required
                        className='donation-form-input donation-input-group'
                        value={adress}
                        onChange={(e) => setAdress(e.target.value)}
                    />

                    <div className="donation-info-box">
                        <p>{t('donation.securePayment')}</p>
                        <p>{t('donation.redirectMessage')}</p>
                    </div>

                    <button
                        type="submit"
                        className='donation-submit-button donation-input-group'
                        disabled={loading || !amount}
                    >
                        {loading ? t('donation.loading') : `${t('donation.donate')} ${amount}€`}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Donation