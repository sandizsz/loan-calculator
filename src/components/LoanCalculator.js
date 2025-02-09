import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Info, Shield } from 'lucide-react';

const LoanCalculator = () => {
    const [amount, setAmount] = useState(3000);
    const [term, setTerm] = useState(36);
    const [monthlyPayment, setMonthlyPayment] = useState(92.49);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const dropdownRef = useRef(null);

    // Get kredits from WordPress data
    const kredits = window.loanCalculatorData?.kredits || [];
    
    // Try to find matching kredit based on current URL
    const currentUrl = window.location.href;
    const matchingKredit = kredits.find(kredit => currentUrl.includes(kredit.url));
    
    // Set initial selected kredit
    const [selectedKredit, setSelectedKredit] = useState(matchingKredit || kredits[0] || null);

    useEffect(() => {
        console.log('Kredits Data:', kredits);
    }, []);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate monthly payment
    useEffect(() => {
        const annualRate = 0.12;
        const monthlyRate = annualRate / 12;
        const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                       (Math.pow(1 + monthlyRate, term) - 1);
        setMonthlyPayment(payment.toFixed(2));
    }, [amount, term]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!email) {
            newErrors.email = 'Obligāti aizpildāms lauks';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Nepareizs e-pasta formāts';
        }

        if (!phone) {
            newErrors.phone = 'Obligāti aizpildāms lauks';
        } else if (!/^\d{8}$/.test(phone)) {
            newErrors.phone = 'Nepareizs tālruņa numura formāts';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const params = new URLSearchParams({
                amount,
                term,
                email,
                phone
            }).toString();
            window.location.href = `/forma/?${params}`;
        }
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .calculator-container {
                background: rgba(255, 255, 255, 0.90);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(4px);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.18);
                padding: 1.5rem;
            }
            .range-input::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 24px;
                height: 24px;
                background-color: #FFC600;
                border: 2px solid white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .range-input::-moz-range-thumb {
                width: 24px;
                height: 24px;
                background-color: #FFC600;
                border: 2px solid white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .input-wrapper {
                position: relative;
            }
            .phone-input-container {
                position: relative;
            }
            .phone-prefix {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #000;
                font-size: 16px;
                font-weight: normal;
                z-index: 1;
                pointer-events: none;
            }
            .form-input {
                height: 48px;
                font-size: 16px;
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #D1D5DB;
                border-radius: 6px;
                outline: none;
                transition: border-color 0.2s ease;
            }
            .form-input.phone {
                padding-left: 55px;
            }
            .form-input:focus {
                border-color: #FFC600;
            }
            .form-input.error {
                border-color: #EF4444;
            }
            .error-text {
                color: #EF4444;
                font-size: 14px;
                margin-top: 4px;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div className="calculator-container">
            {/* Dropdown Header */}
            <div className="relative mb-8" ref={dropdownRef}>
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                >
                    <div className="flex items-center gap-2">
                        {selectedKredit?.icon ? (
                            <img 
                                src={selectedKredit.icon} 
                                alt="" 
                                className="w-6 h-6"
                            />
                        ) : (
                            <div className="w-6 h-6 bg-gray-200 rounded-full" />
                        )}
                        <span className="text-gray-800 font-medium">
                            {selectedKredit?.title || 'Izvēlieties kredītu'}
                        </span>
                    </div>
                    <svg
                        className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                    </svg>
                </div>

                {isDropdownOpen && (
                    <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-100">
                       {kredits.map((kredit) => {
    console.log('Rendering Kredit:', kredit);
    return (
        <a
            key={kredit.id}
            href={kredit.url}
            className="flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors"
        >
            {kredit.icon ? (
                <img src={kredit.icon} alt="" className="w-6 h-6" />
            ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
            )}
            <span className="text-gray-800">{kredit.title}</span>
        </a>
    );
})}
                    </div>
                )}
            </div>

            {/* Amount Slider */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Aizdevuma summa</span>
                    <span className="font-medium">{amount} €</span>
                </div>
                <div className="relative">
                    <input
                        type="range"
                        min="500"
                        max="25000"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        style={{
                            width: '100%',
                            height: '6px',
                            WebkitAppearance: 'none',
                            background: `linear-gradient(to right, #FFC600 ${(amount - 500) / (25000 - 500) * 100}%, #e5e7eb ${(amount - 500) / (25000 - 500) * 100}%)`,
                            borderRadius: '5px',
                            outline: 'none',
                            opacity: '1',
                            transition: 'opacity .2s'
                        }}
                        className="range-input"
                    />
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500">
                        <span>500 €</span>
                        <span>25000 €</span>
                    </div>
                </div>
            </div>

            {/* Term Slider */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Aizdevuma termiņš</span>
                    <span className="font-medium">{term} mēn.</span>
                </div>
                <div className="relative">
                    <input
                        type="range"
                        min="3"
                        max="120"
                        value={term}
                        onChange={(e) => setTerm(Number(e.target.value))}
                        style={{
                            width: '100%',
                            height: '6px',
                            WebkitAppearance: 'none',
                            background: `linear-gradient(to right, #FFC600 ${(term - 3) / (120 - 3) * 100}%, #e5e7eb ${(term - 3) / (120 - 3) * 100}%)`,
                            borderRadius: '5px',
                            outline: 'none',
                            opacity: '1',
                            transition: 'opacity .2s'
                        }}
                        className="range-input"
                    />
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500">
                        <span>3 mēn.</span>
                        <span>120 mēn.</span>
                    </div>
                </div>
            </div>

            {/* Monthly Payment Box */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                    <span className="text-2xl font-medium">{monthlyPayment} €/mēn.</span>
                    <div 
                        className="relative ml-1"
                        onMouseEnter={() => setIsTooltipVisible(true)}
                        onMouseLeave={() => setIsTooltipVisible(false)}
                    >
                        <svg
                            className="w-4 h-4 text-blue-500 cursor-help"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {isTooltipVisible && (
                            <div 
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap"
                                style={{
                                    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
                                }}
                            >
                                <div className="relative">
                                    Kredīta kalkulatoram ir ilustratīva nozīme
                                    <div 
                                        className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
                                        style={{
                                            borderLeft: '6px solid transparent',
                                            borderRight: '6px solid transparent',
                                            borderTop: '6px solid #111827'
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                    Ikmēneša maksājums
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="col-span-2 md:col-span-1">
                    <div className="input-wrapper">
                        <input
                            type="email"
                            placeholder="Jūsu e-pasts"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && (
                            <div className="error-text">{errors.email}</div>
                        )}
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <div className="input-wrapper">
                        <div className="phone-input-container">
                            <span className="phone-prefix">+371</span>
                            <input
                                type="tel"
                                placeholder="Jūsu tālrunis"
                                value={phone}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const digits = value.replace(/\D/g, '');
                                    if (digits.length <= 8) {
                                        setPhone(digits);
                                    }
                                }}
                                className={`form-input phone ${errors.phone ? 'error' : ''}`}
                            />
                        </div>
                        {errors.phone && (
                            <div className="error-text">{errors.phone}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg mt-4 font-medium hover:bg-green-600 transition-colors"
            >
                Pieteikties
            </button>

            {/* Security Note */}
            <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    />
                </svg>
                Nodrošinām bankas līmeņa aizsardzību Jūsu datiem
            </div>
        </div>
    );
};

export default LoanCalculator;