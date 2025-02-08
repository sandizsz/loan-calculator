import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Use named imports

const LoanCalculator = () => {
    const [formData, setFormData] = useState({
        amount: 3000,
        term: 36,
        email: '',
        phone: ''
    });
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const config = window.calculatorConfig || {};
    const kredits = window.loanCalculatorData?.kredits || [];

    useEffect(() => {
        if (formData.amount && formData.term) {
            const annualRate = (config.interest_rate || 12) / 100;
            const monthlyRate = annualRate / 12;
            const payment = (formData.amount * monthlyRate * Math.pow(1 + monthlyRate, formData.term)) / 
                          (Math.pow(1 + monthlyRate, formData.term) - 1);
            setMonthlyPayment(payment.toFixed(2));
        }
    }, [formData.amount, formData.term]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const queryParams = new URLSearchParams(formData).toString();
            window.location.href = `/forma/?${queryParams}`;
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
                {/* Amount Slider */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Aizdevuma summa</span>
                        <span className="font-medium">{formData.amount} €</span>
                    </div>
                    <input
                        type="range"
                        min={config.min_amount || 500}
                        max={config.max_amount || 25000}
                        value={formData.amount}
                        onChange={(e) => handleInputChange({
                            target: { name: 'amount', value: e.target.value }
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Term Slider */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Aizdevuma termiņš</span>
                        <span className="font-medium">{formData.term} mēn.</span>
                    </div>
                    <input
                        type="range"
                        min={config.min_term || 3}
                        max={config.max_term || 120}
                        value={formData.term}
                        onChange={(e) => handleInputChange({
                            target: { name: 'term', value: e.target.value }
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Monthly Payment Display */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
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

                {/* Contact Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="input-wrapper">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Jūsu e-pasts"
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
                            placeholder="Jūsu tālrunis"
                            className={`form-input phone ${errors.phone ? 'error' : ''}`}
                        />
                        {errors.phone && <div className="error-text">{errors.phone}</div>}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mt-6 text-lg font-medium transition-colors duration-200"
                >
                    Pieteikties
                </button>

                {/* Security Note */}
                <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                    </svg>
                    <span>Nodrošinām bankas līmeņa aizsardzību Jūsu datiem</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default LoanCalculator