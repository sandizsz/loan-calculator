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
    const dropdownRef = useRef(null);

    // Get all kredits from WordPress data
    const kredits = window.loanCalculatorData?.kredits || [];
    const [selectedKredit, setSelectedKredit] = useState(kredits[0] || null);

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

    return (
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6">
            {/* Simple Dropdown */}
            <div className="relative mb-8" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                    <div className="flex items-center gap-2">
                        {selectedKredit?.icon ? (
                            <img src={selectedKredit.icon} alt="" className="w-6 h-6" />
                        ) : (
                            <Calendar className="w-6 h-6 text-blue-500" />
                        )}
                        <span className="text-lg font-medium">
                            {selectedKredit?.title || 'Patēriņa kredīts'}
                        </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                    <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-50">
                        {kredits.map((kredit) => (
                            <a
                                key={kredit.id}
                                href={kredit.url}
                                className="flex items-center gap-2 p-3 hover:bg-gray-50"
                            >
                                <img src={kredit.icon} alt="" className="w-6 h-6" />
                                <span>{kredit.title}</span>
                            </a>
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
                <input
                    type="range"
                    min="500"
                    max="25000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #3B82F6 ${(amount - 500) / (25000 - 500) * 100}%, #E5E7EB ${(amount - 500) / (25000 - 500) * 100}%)`
                    }}
                />
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>500 €</span>
                    <span>25000 €</span>
                </div>
            </div>

            {/* Term Slider */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Aizdevuma termiņš</span>
                    <span className="font-medium">{term} mēn.</span>
                </div>
                <input
                    type="range"
                    min="3"
                    max="120"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #3B82F6 ${(term - 3) / (120 - 3) * 100}%, #E5E7EB ${(term - 3) / (120 - 3) * 100}%)`
                    }}
                />
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>3 mēn.</span>
                    <span>120 mēn.</span>
                </div>
            </div>

            {/* Monthly Payment Box */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-1">
                    <span className="text-2xl font-medium">{monthlyPayment} €/mēn.</span>
                    <Info className="w-4 h-4 text-blue-500 cursor-help" title="Kredīta kalkulatoram ir ilustratīva nozīme" />
                </div>
                <span className="text-sm text-gray-600">Ikmēneša maksājums</span>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Jūsu e-pasts"
                        className={`w-full p-3 border rounded-lg outline-none transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && (
                        <div className="text-sm text-red-500 mt-1">{errors.email}</div>
                    )}
                </div>

                <div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            +371
                        </span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 8) {
                                    setPhone(value);
                                }
                            }}
                            placeholder="Jūsu tālrunis"
                            className={`w-full p-3 pl-12 border rounded-lg outline-none transition-colors ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    </div>
                    {errors.phone && (
                        <div className="text-sm text-red-500 mt-1">{errors.phone}</div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                    Pieteikties
                </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Nodrošinām bankas līmeņa aizsardzību Jūsu datiem</span>
            </div>
        </div>
    );
};

export default LoanCalculator;