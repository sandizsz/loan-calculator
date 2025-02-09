import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { InfoCircledIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const LoanCalculator = () => {
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
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
                <div className="relative">
                    <div 
                        className="flex items-center justify-between mb-6 cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="flex items-center gap-2">
                            {selectedKredit?.icon ? (
                                <img src={selectedKredit.icon} alt="" className="w-6 h-6" />
                            ) : (
                                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                            )}
                            <h2 className="text-xl font-medium">
                                {selectedKredit?.title || 'Izvēlieties kredīta veidu'}
                            </h2>
                        </div>
                        <button className="text-gray-500">
                            {isDropdownOpen ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Kredits Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-2 z-10 overflow-hidden">
                            {kredits.map((kredit) => (
                                <a
                                    key={kredit.id}
                                    href={kredit.url}
                                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                                >
                                    {kredit.icon ? (
                                        <img src={kredit.icon} alt="" className="w-6 h-6" />
                                    ) : (
                                        <div className="w-6 h-6 bg-gray-200 rounded-full" />
                                    )}
                                    <span className="text-gray-900">{kredit.title}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amount Slider */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Aizdevuma summa</span>
                        <span className="text-xl font-semibold">{formData.amount} €</span>
                    </div>
                    <input
                        type="range"
                        min="500"
                        max="25000"
                        value={formData.amount}
                        onChange={(e) => handleInputChange({
                            target: { name: 'amount', value: e.target.value }
                        })}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>500 €</span>
                        <span>25000 €</span>
                    </div>
                </div>

                {/* Term Slider */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Aizdevuma termiņš</span>
                        <span className="text-xl font-semibold">{formData.term} mēn.</span>
                    </div>
                    <input
                        type="range"
                        min="3"
                        max="120"
                        value={formData.term}
                        onChange={(e) => handleInputChange({
                            target: { name: 'term', value: e.target.value }
                        })}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>3 mēn.</span>
                        <span>120 mēn.</span>
                    </div>
                </div>

                {/* Monthly Payment */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{monthlyPayment} €/mēn.</span>
                        <InfoCircledIcon className="text-blue-500 w-5 h-5" />
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+371</span>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Jūsu tālrunis"
                            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={() => {}}
                        className="w-full py-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Pieteikties
                    </button>
                </div>

                <div className="mt-4 flex items-center gap-2 text-gray-600 text-sm">
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
               