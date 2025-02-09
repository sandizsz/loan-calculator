import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Info, Shield } from 'lucide-react';

const LoanCalculator = () => {
    // Initialize state with WordPress data
    const [kredits, setKredits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [amount, setAmount] = useState(3000);
    const [term, setTerm] = useState(36);
    const [monthlyPayment, setMonthlyPayment] = useState(92.49);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [selectedKredit, setSelectedKredit] = useState(null);
    const dropdownRef = useRef(null);

    // Load WordPress data
    useEffect(() => {
        const wpData = window.loanCalculatorData || {};
        console.log('WordPress Data:', wpData);
        
        if (wpData.kredits && Array.isArray(wpData.kredits)) {
            setKredits(wpData.kredits);
            
            // Set initial selected kredit
            const currentUrl = window.location.href;
            const matchingKredit = wpData.kredits.find(kredit => 
                currentUrl.includes(kredit.slug) || currentUrl.includes(kredit.url)
            );
            setSelectedKredit(matchingKredit || wpData.kredits[0]);
        }
        
        setIsLoading(false);
    }, []);

    // Calculate monthly payment
    useEffect(() => {
        const annualRate = 0.12; // 12% annual interest rate
        const monthlyRate = annualRate / 12;
        const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                       (Math.pow(1 + monthlyRate, term) - 1);
        setMonthlyPayment(payment.toFixed(2));
    }, [amount, term]);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Form validation
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

    // Form submission
    const handleSubmit = () => {
        if (validateForm()) {
            const params = new URLSearchParams({
                amount,
                term,
                email,
                phone,
                kredit_id: selectedKredit?.id || ''
            }).toString();
            
            window.location.href = `${window.loanCalculatorData.siteUrl}/forma/?${params}`;
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading calculator...</div>;
    }

    return (
        <div className="calculator-container">
            {/* Dropdown Header */}
            {kredits.length > 0 && (
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
                        <ChevronDown 
                            className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-100">
                            {kredits.map((kredit) => (
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
                            ))}
                        </div>
                    )}
                </div>
            )}

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
                        <Info className="w-4 h-4 text-blue-500 cursor-help" />
                        {isTooltipVisible && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap">
                                <div className="relative">
                                    Kredīta kalkulatoram ir ilustratīva nozīme.
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
                <Shield className="w-4 h-4" />
                Nodrošinām bankas līmeņa aizsardzību Jūsu datiem
            </div>
        </div>
    );
};

export default LoanCalculator;