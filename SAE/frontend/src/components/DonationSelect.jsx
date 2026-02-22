import React, { useState, useEffect, useRef } from 'react'

// Custom Select pour le Genre
function CustomGenderSelect({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef(null)

    const genders = [
        { code: 'male', name: 'Monsieur', label: 'M.' },
        { code: 'female', name: 'Madame', label: 'Mme' }
    ]

    const selectedGender = genders.find(gender => gender.code === value)

    const handleSelect = (genderCode) => {
        onChange(genderCode)
        setIsOpen(false)
    }

    // Fermer le select quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="donation-custom-select" ref={selectRef}>
            <div
                className={`donation-select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="donation-select-label">Genre :&nbsp;</span>
                <span className="donation-selected-value">
                    {selectedGender ? selectedGender.name : 'Choisir un genre'}
                </span>
            </div>

            {isOpen && (
                <div className="donation-select-options">
                    {genders.map(gender => (
                        <div
                            key={gender.code}
                            className={`donation-select-option ${value === gender.code ? 'selected' : ''}`}
                            onClick={() => handleSelect(gender.code)}
                        >
                            <span className="donation-option-label">{gender.label}</span>
                            <span className="donation-option-name">{gender.name}</span>
                            <div className={`donation-radio ${value === gender.code ? 'checked' : ''}`}></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Custom Select pour la Forme Juridique
function CustomLegalFormSelect({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef(null)

    const legalForms = [
        { code: 'sarl', name: 'SARL', fullName: 'Société à Responsabilité Limitée' },
        { code: 'sas', name: 'SAS', fullName: 'Société par Actions Simplifiée' },
        { code: 'sasu', name: 'SASU', fullName: 'Société par Actions Simplifiée Unipersonnelle' },
        { code: 'eurl', name: 'EURL', fullName: 'Entreprise Unipersonnelle à Responsabilité Limitée' },
        { code: 'sa', name: 'SA', fullName: 'Société Anonyme' },
        { code: 'sci', name: 'SCI', fullName: 'Société Civile Immobilière' },
        { code: 'association', name: 'Association', fullName: 'Association Loi 1901' },
        { code: 'ei', name: 'EI', fullName: 'Entreprise Individuelle' },
        { code: 'micro', name: 'Micro-entreprise', fullName: 'Auto-entrepreneur' }
    ]

    const selectedForm = legalForms.find(form => form.code === value)

    const handleSelect = (formCode) => {
        onChange(formCode)
        setIsOpen(false)
    }

    // Fermer le select quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="donation-custom-select" ref={selectRef}>
            <div
                className={`donation-select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="donation-select-label">Forme juridique :&nbsp;</span>
                <span className="donation-selected-value">
                    {selectedForm ? selectedForm.name : 'Choisissez'}
                </span>
            </div>

            {isOpen && (
                <div className="donation-select-options">
                    {legalForms.map(form => (
                        <div
                            key={form.code}
                            className={`donation-select-option ${value === form.code ? 'selected' : ''}`}
                            onClick={() => handleSelect(form.code)}
                        >
                            <div className="donation-form-info">
                                <span className="donation-form-name">{form.name}</span>
                                <span className="donation-form-full-name">{form.fullName}</span>
                            </div>
                            <div className={`donation-radio ${value === form.code ? 'checked' : ''}`}></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export { CustomGenderSelect, CustomLegalFormSelect }