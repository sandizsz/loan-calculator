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

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Monthly Payment Display */}
                <div className="bg-blue-50 p-4 rounded-lg mb-8">
                    <div className="flex items-center justify-center">
                        <span className="text-2xl font-medium">{monthlyPayment} €/mēn.</span>
                        <div className="tooltip-trigger ml-2">
                            <svg className="w-4 h-4 text-blue-500 cursor-help" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                            <div className="tooltip-content">
                                Kredīta kalkulatoram ir ilustratīva nozīme
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Vārds"
                            className={`form-input ${errors.firstName ? 'error' : ''}`}
                        />
                        {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                    </div>

                    <div className="input-wrapper">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Uzvārds"
                            className={`form-input ${errors.lastName ? 'error' : ''}`}
                        />
                        {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                    </div>
                </div>

                <div className="input-wrapper">
                    <input
                        type="text"
                        name="personalCode"
                        value={formData.personalCode}
                        onChange={handleInputChange}
                        placeholder="Personas kods"
                        className={`form-input ${errors.personalCode ? 'error' : ''}`}
                    />
                    <div className="text-xs text-gray-500 mt-1">Nepieciešams identifikācijas procesam</div>
                    {errors.personalCode && <div className="error-text">{errors.personalCode}</div>}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="input-wrapper">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="E-pasts"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && <div className="error-text">{errors.email}</div>}
                    </div>

                    <div className="phone-input-container">
                        <span className="phone-prefix">+371</span>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Tālrunis"
                            className={`form-input phone ${errors.phone ? 'error' : ''}`}
                        />
                        {errors.phone && <div className="error-text">{errors.phone}</div>}
                    </div>
                </div>

                {/* City and Gender Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="flex gap-4">
                        <label className="flex items-center flex-1">
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
                        <label className="flex items-center flex-1">
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
                </div>

                {/* Additional Questions */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vai Jūs esat politiski nozīmīga persona?
                            <span className="ml-1 text-blue-500 cursor-help tooltip-trigger">
                                ⓘ
                                <span className="tooltip-content">
                                    Persona, kura ieņem vai ir ieņēmusi nozīmīgu publisku amatu
                                </span>
                            </span>
                        </label>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vai Jums ir apgādājamā/s personas?
                        </label>
                        <select
                            name="dependents"
                            value={formData.dependents}
                            onChange={handleInputChange}
                            className="form-input"
                        >
                            <option value="no">Nē, man nav</option>
                            <option value="yes">Jā, ir</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Esmu patiesā labuma guvējs
                        </label>
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
                </div>

                {/* Terms and Marketing Consent */}
                <div className="space-y-4">
                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                        <span className="text-sm">
                            Apliecinu, ka sniegtā informācija ir patiesa un esmu iepazinies ar 
                            <a href="/terms" className="text-blue-500 hover:underline ml-1">
                                datu apstrādes noteikumiem
                            </a>.
                        </span>
                    </label>
                    {errors.acceptTerms && <div className="error-text">{errors.acceptTerms}</div>}

                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            name="acceptMarketing"
                            checked={formData.acceptMarketing}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                        <span className="text-sm">
                            Piekrītu saņemt jaunumus un personalizētus piedāvājumus.
                        </span>
                    </label>
                </div>

                {/* Error Message */}
                {errors.submit && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                        {errors.submit}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="submit-button"
                >
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