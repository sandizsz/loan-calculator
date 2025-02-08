import React, { useState, useEffect } from 'react';

const FullCalculator = () => {
    const [formData, setFormData] = useState({
        amount: '',
        term: '',
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        personalCode: '',
        city: '',
        gender: '',
        income: '',
        politicallyExposed: 'no',
        dependents: 'no',
        beneficiary: 'yes',
        acceptTerms: false,
        acceptMarketing: false
    });
    
    const [errors, setErrors] = useState({});
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        setFormData(prev => ({
            ...prev,
            amount: params.get('amount') || '',
            term: params.get('term') || '',
            email: params.get('email') || '',
            phone: params.get('phone') || ''
        }));
    }, []);

    useEffect(() => {
        if (formData.amount && formData.term) {
            const annualRate = 12 / 100; // 12% annual interest rate
            const monthlyRate = annualRate / 12;
            const payment = (formData.amount * monthlyRate * Math.pow(1 + monthlyRate, formData.term)) / 
                          (Math.pow(1 + monthlyRate, formData.term) - 1);
            setMonthlyPayment(payment.toFixed(2));
        }
    }, [formData.amount, formData.term]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName) newErrors.firstName = 'Obligāti aizpildāms lauks';
        if (!formData.lastName) newErrors.lastName = 'Obligāti aizpildāms lauks';
        if (!formData.personalCode) newErrors.personalCode = 'Obligāti aizpildāms lauks';
        if (!formData.email) {
            newErrors.email = 'Obligāti aizpildāms lauks';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Nepareizs e-pasta formāts';
        }
        if (!formData.phone) {
            newErrors.phone = 'Obligāti aizpildāms lauks';
        } else if (!/^\d{8}$/.test(formData.phone)) {
            newErrors.phone = 'Nepareizs tālruņa numura formāts';
        }
        if (!formData.city) newErrors.city = 'Obligāti aizpildāms lauks';
        if (!formData.gender) newErrors.gender = 'Obligāti aizpildāms lauks';
        if (!formData.acceptTerms) newErrors.acceptTerms = 'Jums jāpiekrīt noteikumiem';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Submit form data to WordPress backend
                const response = await fetch('/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'submit_loan_application',
                        ...formData,
                        nonce: window.loanCalculatorData?.nonce
                    })
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = '/pieteikums-sanemts/';
                } else {
                    setErrors({ submit: data.message || 'Kļūda nosūtot pieteikumu' });
                }
            } catch (error) {
                setErrors({ submit: 'Kļūda nosūtot pieteikumu' });
            }
        }
    };

    return (
        <div className="calculator-container">
            <h2 className="text-2xl font-bold mb-6 text-center">Aizpildiet pieteikumu</h2>
            <p className="text-center text-gray-600 mb-8">saņemiet aizdevumu!</p>

            <form onSubmit={handleSubmit} className="application-form">
                <div className="form-group">
                    <label>Vārds</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                    />
                    {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                </div>
                <div className="form-group">
                    <label>Uzvārds</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                    />
                    {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                </div>
                <div className="form-group">
                    <label>Personas kods</label>
                    <input
                        type="text"
                        name="personalCode"
                        value={formData.personalCode}
                        onChange={handleInputChange}
                        className={`form-input ${errors.personalCode ? 'error' : ''}`}
                    />
                    {errors.personalCode && <div className="error-text">{errors.personalCode}</div>}
                </div>
                <div className="form-group">
                    <label>Jūsu pilsētība</label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`form-input ${errors.city ? 'error' : ''}`}
                    >
                        <option value="">Jūsu pilsētība</option>
                        <option value="riga">Rīga</option>
                        <option value="daugavpils">Daugavpils</option>
                        <option value="liepaja">Liepāja</option>
                        <option value="jelgava">Jelgava</option>
                        <option value="jurmala">Jūrmala</option>
                        <option value="ventspils">Ventspils</option>
                        <option value="rezekne">Rēzekne</option>
                        <option value="valmiera">Valmiera</option>
                    </select>
                    {errors.city && <div className="error-text">{errors.city}</div>}
                </div>
                <div className="form-group">
                    <label>Dzimums</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Sieviete
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Vīrietis
                        </label>
                    </div>
                    {errors.gender && <div className="error-text">{errors.gender}</div>}
                </div>
                <div className="form-group">
                    <label>Vai Jūs esat politiski nozīmīga persona?</label>
                    <select
                        name="politicallyExposed"
                        value={formData.politicallyExposed}
                        onChange={handleInputChange}
                        className="form-input"
                    >
                        <option value="no">Nē, es neesmu</option>
                        <option value="yes">Jā, esmu</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Esmu patiesā labuma guvējs</label>
                    <select
                        name="beneficiary"
                        value={formData.beneficiary}
                        onChange={handleInputChange}
                        className="form-input"
                    >
                        <option value="yes">Jā, es esmu</option>
                        <option value="no">Nē, neesmu</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">
                    Turpināt
                </button>

                {/* Security Note */}
                <div className="security-badge">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                    </svg>
                    <span>Mēs nodrošinām bankas līmeņa aizsardzību Jūsu datu drošībai</span>
                </div>
            </form>
        </div>
    );
}; 

export default FullCalculator;