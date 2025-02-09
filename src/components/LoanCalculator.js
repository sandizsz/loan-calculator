import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Info, Shield } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';

const LoanCalculator = () => {
    const [amount, setAmount] = useState(3000);
    const [term, setTerm] = useState(36);
    const [monthlyPayment, setMonthlyPayment] = useState(92.49);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedKredit, setSelectedKredit] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});

    // Get kredits data from WordPress
    const kredits = window.loanCalculatorData?.kredits || [];

    useEffect(() => {
        if (kredits.length > 0 && !selectedKredit) {
            setSelectedKredit(kredits[0]);
        }
    }, [kredits]);

    useEffect(() => {
        const annualRate = 0.12; // 12% annual interest rate
        const monthlyRate = annualRate / 12;
        const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                      (Math.pow(1 + monthlyRate, term) - 1);
        setMonthlyPayment(payment.toFixed(2));
    }, [amount, term]);

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Obligāti aizpildāms lauks';
        if (!phone) newErrors.phone = 'Obligāti aizpildāms lauks';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Handle form submission
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
        <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md">
            <CardContent className="p-6">
                {/* Kredits Dropdown */}
                <div className="mb-8">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
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
                        <svg 
                            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-10">
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
                    />
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                        <span>3 mēn.</span>
                        <span>120 mēn.</span>
                    </div>
                </div>

                {/* Monthly Payment Box */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-medium">
                            {monthlyPayment} €/mēn.
                        </span>
                        <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm text-gray-600">
                        Ikmēneša maksājums
                    </span>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Jūsu e-pasts"
                        className={`w-full p-3 border rounded-lg outline-none transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            +371
                        </span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Jūsu tālrunis"
                            className={`w-full p-3 pl-12 border rounded-lg outline-none transition-colors ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                        Pieteikties
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Nodrošinām bankas līmeņa aizsardzību Jūsu datiem</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default LoanCalculator;