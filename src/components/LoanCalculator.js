import React, { useState, useEffect, useRef } from 'react';
import ErrorBoundary from './ErrorBoundary';

const LoanCalculator = () => {
    const dropdownRef = useRef(null);
    const [formData, setFormData] = useState({
        amount: 3000,
        term: 36,
        email: '',
        phone: ''
    });
    const [monthlyPayment, setMonthlyPayment] = useState(92.49);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedKredit, setSelectedKredit] = useState(null);
    
    // Get kredits data from WordPress
    const kredits = window.loanCalculatorData?.kredits || [];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Set initial kredit
    useEffect(() => {
        if (kredits.length > 0 && !selectedKredit) {
            setSelectedKredit(kredits[0]);
        }
    }, [kredits]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        // Calculate monthly payment here
        // This is a placeholder - implement actual calculation logic
        if (formData.amount && formData.term) {
            const annualRate = 0.12; // 12% annual interest rate
            const monthlyRate = annualRate / 12;
            const payment = (formData.amount * monthlyRate * Math.pow(1 + monthlyRate, formData.term)) / 
                          (Math.pow(1 + monthlyRate, formData.term) - 1);
            setMonthlyPayment(payment.toFixed(2));
        }
    }, [formData.amount, formData.term]);

    return (
        <ErrorBoundary>
            <div className="loan-calculator">
                {/* Loan Type Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div 
                        className="loan-header"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="flex items-center gap-2">
                            {selectedKredit?.icon ? (
                                <img src={selectedKredit.icon} alt="" className="loan-header-icon" />
                            ) : (
                                <img src="/path-to-calendar-icon.svg" alt="" className="loan-header-icon" />
                            )}
                            <h2 className="text-xl font-medium">
                                {selectedKredit?.title || 'Patēriņa kredīts'}
                            </h2>
                        </div>
                        <button className="text-gray-500">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {isDropdownOpen && (
                        <div className="loan-dropdown">
                            {kredits.map((kredit) => (
                                <a
                                    key={kredit.id}
                                    href={kredit.url}
                                    className="loan-dropdown-item"
                                    onClick={() => {
                                        setSelectedKredit(kredit);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <img src={kredit.icon} alt="" className="loan-header-icon" />
                                    <span>{kredit.title}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amount Slider */}
                <div className="slider-container">
                    <div className="slider-header">
                        <span className="slider-label">Aizdevuma summa</span>
                        <span className="slider-value">{formData.amount} €</span>
                    </div>
                    <div className="slider-track">
                        <div 
                            className="slider-range amount-range" 
                            style={{
                                width: `${((formData.amount - 500) / (25000 - 500)) * 100}%`
                            }}
                        />
                        <input
                            type="range"
                            min="500"
                            max="25000"
                            value={formData.amount}
                            onChange={(e) => handleInputChange({
                                target: { name: 'amount', value: e.target.value }
                            })}
                            className="amount-slider"
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>500 €</span>
                        <span>25000 €</span>
                    </div>
                </div>

                {/* Term Slider */}
                <div className="slider-container">
                    <div className="slider-header">
                        <span className="slider-label">Aizdevuma termiņš</span>
                        <span className="slider-value">{formData.term} mēn.</span>
                    </div>
                    <div className="slider-track">
                        <div 
                            className="slider-range term-range"
                            style={{
                                width: `${((formData.term - 3) / (120 - 3)) * 100}%`
                            }}
                        />
                        <input
                            type="range"
                            min="3"
                            max="120"
                            value={formData.term}
                            onChange={(e) => handleInputChange({
                                target: { name: 'term', value: e.target.value }
                            })}
                            className="term-slider"
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>3 mēn.</span>
                        <span>120 mēn.</span>
                    </div>
                </div>

                {/* Monthly Payment */}
                <div className="monthly-payment">
                    <div className="flex items-center gap-2">
                        <span className="monthly-payment-amount">{monthlyPayment} €/mēn.</span>
                        <svg className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-gray-600">Ikmēneša maksājums</span>
                </div>

                {/* Contact Form */}
                <div className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Jūsu e-pasts"
                        className="input-field"
                    />
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+371</span>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Jūsu tālrunis"
                            className="input-field pl-12"
                        />
                    </div>

                    <button className="submit-button">
                        Pieteikties
                    </button>
                </div>

                <div className="security-badge">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Nodrošinām bankas līmeņa aizsardzību Jūsu datiem</span>
                </div>
            </div>
        </ErrorBoundary>
    );
};



export default LoanCalculator;
               