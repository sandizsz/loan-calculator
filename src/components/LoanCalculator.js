import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Info, Shield, Mail, Phone } from 'lucide-react';

// Add styles for range input thumb
const sliderStyles = `
    input[type='range'] {
        -webkit-appearance: none;
        height: 8px;
        padding: 0;
        margin: 0;
    }
    input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 32px;
        height: 32px;
        background: white;
        border: 3px solid #FFB800;
        border-radius: 50%;
        cursor: pointer;
        margin-top: -12px;
    }
    input[type='range']::-moz-range-thumb {
        width: 32px;
        height: 32px;
        background: white;
        border: 3px solid #FFB800;
        border-radius: 50%;
        cursor: pointer;
    }
    input[type='range']::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        cursor: pointer;
    }
    input[type='range']::-moz-range-track {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        cursor: pointer;
    }
`;

// Helper function to get slider background
const getSliderBackground = (value, min, max) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #4F46E5 ${percentage}%, #E5E7EB ${percentage}%)`;
};

// Form Components
const FormField = ({ name, label, error, children }) => (
    <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        {children}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const Input = ({ icon: Icon, className = '', ...props }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${props.error ? 'border-red-500' : 'border-gray-300'} ${className}`}
            {...props}
        />
    </div>
);

const LoanCalculator = () => {
    // Add slider styles to document
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = sliderStyles;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);


    // State declarations
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
            // Ensure all icon URLs are HTTPS
            const secureKredits = wpData.kredits.map(kredit => ({
                ...kredit,
                icon: kredit.icon ? kredit.icon.replace('http://', 'https://') : null
            }));
            
            setKredits(secureKredits);
            
            // Set initial selected kredit
            const currentUrl = window.location.href;
            const matchingKredit = secureKredits.find(kredit => 
                currentUrl.includes(kredit.slug) || currentUrl.includes(kredit.url)
            );
            setSelectedKredit(matchingKredit || secureKredits[0]);
        }
        
        setIsLoading(false);
    }, []);

    // Add styles to document head
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
                max-width: 600px;
                margin: 0 auto;
            }

            .calculator-container button,
            .calculator-container [type="button"],
            .calculator-container [type="submit"] {
                border: none;
                background: #4F46E5;
                color: white;
                font-weight: 500;
                border-radius: 6px;
                transition: all 0.2s;
            }

            .calculator-container button:hover {
                background: #4338CA;
            }

            .range-input {
                -webkit-appearance: none;
                width: 100%;
                height: 6px;
                background: #e5e7eb;
                border-radius: 5px;
                outline: none;
                opacity: 1;
                transition: opacity .2s;
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

            .range-track {
                background: linear-gradient(to right, #FFC600 var(--range-progress), #e5e7eb var(--range-progress));
            }

            .kredit-icon-wrapper {
                width: 24px;
                height: 24px;
                position: relative;
            }

            .kredit-icon {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 4px;
            }

            .kredit-icon-placeholder {
                width: 100%;
                height: 100%;
                background: #f3f4f6;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0;
                left: 0;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
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

    // Calculate range slider backgrounds
    const getSliderBackground = (value, min, max) => {
        const percentage = ((value - min) / (max - min)) * 100;
        return `linear-gradient(to right, #FFC600 ${percentage}%, #e5e7eb ${percentage}%)`;
    };

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
    const handleSubmit = (e) => {
        if (e) e.preventDefault(); // Prevent any default form submission if event exists
        
        if (validateForm()) {
            const params = new URLSearchParams({
                amount,
                term,
                email,
                phone,
                kredit_id: selectedKredit?.id || ''
            }).toString();
            
            // Get the base URL with fallbacks
            let baseUrl = 'https://findexo.lv'; // Default fallback
            
            try {
                // Try to get from WordPress data
                if (window.loanCalculatorData?.siteUrl) {
                    baseUrl = window.loanCalculatorData.siteUrl;
                } else if (window.location.origin) {
                    // Fallback to current origin if WordPress data not available
                    baseUrl = window.location.origin;
                }
            } catch (error) {
                console.error('Error getting site URL:', error);
                // Continue with default fallback
            }
            
            // Clean the URL and redirect
            const cleanBaseUrl = baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
            const redirectUrl = `${cleanBaseUrl}/forma/?${params}`;
            
            // Perform the redirect
            try {
                window.location.href = redirectUrl;
            } catch (error) {
                console.error('Error during redirect:', error);
                // Fallback to window.location.replace
                window.location.replace(redirectUrl);
            }
        }
    };

    // Function to render kredit icon
    const renderKreditIcon = (kredit) => {
        const [hasError, setHasError] = useState(false);

        if (kredit?.icon) {
            return (
                <div className="kredit-icon-wrapper">
                    {!hasError && (
                        <img 
                            src={kredit.icon} 
                            alt="" 
                            className="kredit-icon"
                            onError={() => setHasError(true)}
                        />
                    )}
                    {hasError && <div className="kredit-icon-placeholder" />}
                </div>
            );
        }
        return <div className="kredit-icon-placeholder" />;
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading calculator...</div>;
    }

    return (
        <div className="bg-white/90 backdrop-blur-md rounded-lg border border-white/20 p-6 max-w-[600px] md:max-w-full mx-auto">
            {/* Dropdown Header */}
            <div className="relative mb-8" ref={dropdownRef}>
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg border border-gray-200"
                >
                    <div className="flex items-center gap-2">
                        {selectedKredit?.icon && (
                            <img 
                                src={selectedKredit.icon} 
                                alt=""
                                className="w-6 h-6 object-contain"
                                onError={(e) => e.target.style.display = 'none'}
                            />
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
                    <div 
                        className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-[100] border border-gray-200"
                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                    >

                            {kredits.map((kredit) => (
                                <div
                                    key={kredit.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedKredit(kredit);
                                        setIsDropdownOpen(false);
                                        
                                        if (kredit.url) {
                                            // Add loading state to the clicked item
                                            e.currentTarget.classList.add('opacity-50');
                                            
                                            // Use a small delay to show the selection before navigating
                                            setTimeout(() => {
                                                window.location.href = kredit.url;
                                            }, 150);
                                        }
                                    }}
                                    className={`flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors cursor-pointer ${selectedKredit?.id === kredit.id ? 'bg-gray-50' : ''}`}
                                >
                                    {kredit.icon && (
                                        <img 
                                            src={kredit.icon} 
                                            alt=""
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                    <span className="text-gray-800">{kredit.title}</span>
                                </div>
                            ))}
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
                        max="1000000"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{ background: getSliderBackground(amount, 500, 1000000) }}
                    />
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500">
                        <span>500 €</span>
                        <span>1000000 €</span>
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{ background: getSliderBackground(term, 3, 120) }}
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
                                    Kredīta kalkulatoram ir ilustratīva nozīme
                                    <div 
                                        className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-8 border-transparent border-t-gray-900"
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
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Jūsu e-pasts"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600] ${errors.email ? 'border-red-500 mb-6' : 'border-[#ffc600]'}`}
                        />
                        {errors.email && (
                            <div className="absolute bottom-0 left-0 text-red-500 text-sm">{errors.email}</div>
                        )}
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <div className="relative">
                        <div className="relative">
                            <div className="absolute top-0 left-0 h-[42px] flex items-center pl-3 pointer-events-none">
                 
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Jūsu tālrunis"
                                value={phone}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const digits = value.replace(/\D/g, '');
                                    if (digits.length <= 8) {
                                        setPhone(digits);
                                    }
                                }}
                                style={{ textIndent: '0' }}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600] ${errors.phone ? 'border-red-500 mb-6' : 'border-[#ffc600]'}`}
                            />
                        </div>
                        {errors.phone && (
                            <div className="absolute bottom-0 left-0 text-red-500 text-sm">{errors.phone}</div>
                        )}
                    </div>
                </div>
            </div>
        
                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg mt-4 font-medium hover:bg-green-600 transition-colors border-none"
                    >
                        Pieteikties
                    </button>
        
                    {/* Security Note */}
                    <div className="mt-4 text-center text-xs md:text-sm text-gray-500 flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Nodrošinām bankas līmeņa aizsardzību Jūsu datiem
                    </div>
                </div>
            );
        };
        
        export default LoanCalculator;