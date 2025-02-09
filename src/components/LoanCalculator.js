import React, { useState, useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Calendar, ChevronDown, Info, Shield } from 'lucide-react';
import { Label } from '@radix-ui/react-label';

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
        const payment = (formData.amount * monthlyRate * Math.pow(1 + monthlyRate, formData.term)) / 
                       (Math.pow(1 + monthlyRate, formData.term) - 1);
        setMonthlyPayment(payment.toFixed(2));
    }, [formData.amount, formData.term]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const params = new URLSearchParams({
                amount: formData.amount,
                term: formData.term,
                email: formData.email,
                phone: formData.phone
            }).toString();
            window.location.href = `/forma/?${params}`;
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6">
            {/* Kredit Type Selector */}
            <div className="mb-8">
                <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenu.Trigger className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
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
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white rounded-lg shadow-lg mt-2 py-1 z-50">
                            {kredits.map((kredit) => (
                                <DropdownMenu.Item
                                    key={kredit.id}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => window.location.href = kredit.url}
                                >
                                    <img src={kredit.icon} alt="" className="w-6 h-6" />
                                    <span>{kredit.title}</span>
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            {/* Amount Slider */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <Label className="text-gray-700">Aizdevuma summa</Label>
                    <span className="font-medium">{formData.amount} €</span>
                </div>
                <div className="relative">
                    <input
                        type="range"
                        min="500"
                        max="25000"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            background: `linear-gradient(to right, #3B82F6 ${(formData.amount - 500) / (25000 - 500) * 100}%, #E5E7EB ${(formData.amount - 500) / (25000 - 500) * 100}%)`
                        }}
                    />
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                        <span>500 €</span>
                        <span>25000 €</span>
                    </div>
                </div>
            </div>

            {/* Term Slider */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <Label className="text-gray-700">Aizdevuma termiņš</Label>
                    <span className="font-medium">{formData.term} mēn.</span>
                </div>
                <div className="relative">
                    <input
                        type="range"
                        min="3"
                        max="120"
                        value={formData.term}
                        onChange={(e) => handleInputChange('term', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            background: `linear-gradient(to right, #3B82F6 ${(formData.term - 3) / (120 - 3) * 100}%, #E5E7EB ${(formData.term - 3) / (120 - 3) * 100}%)`
                        }}
                    />
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                        <span>3 mēn.</span>
                        <span>120 mēn.</span>
                    </div>
                </div>
            </div>

            {/* Monthly Payment Box */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-1">
                    <span className="text-2xl font-medium">{monthlyPayment} €/mēn.</span>
                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content className="bg-gray-900 text-white text-sm px-3 py-1 rounded">
                                    Kredīta kalkulatoram ir ilustratīva nozīme
                                    <Tooltip.Arrow className="fill-gray-900" />
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                </div>
                <span className="text-sm text-gray-600">Ikmēneša maksājums</span>
            </div>

            {/* Form */}
            <Form.Root onSubmit={handleSubmit} className="space-y-4">
                <Form.Field name="email">
                    <Form.Control asChild>
                        <input
                            type="email"
                            placeholder="Jūsu e-pasts"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full p-3 border rounded-lg outline-none transition-colors ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    </Form.Control>
                    {errors.email && (
                        <div className="text-sm text-red-500 mt-1">{errors.email}</div>
                    )}
                </Form.Field>

                <Form.Field name="phone">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            +371
                        </span>
                        <Form.Control asChild>
                            <input
                                type="tel"
                                placeholder="Jūsu tālrunis"
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 8) {
                                        handleInputChange('phone', value);
                                    }
                                }}
                                className={`w-full p-3 pl-12 border rounded-lg outline-none transition-colors ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                        </Form.Control>
                    </div>
                    {errors.phone && (
                        <div className="text-sm text-red-500 mt-1">{errors.phone}</div>
                    )}
                </Form.Field>

                <Form.Submit asChild>
                    <button className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                        Pieteikties
                    </button>
                </Form.Submit>
            </Form.Root>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Nodrošinām bankas līmeņa aizsardzību Jūsu datiem</span>
            </div>
        </div>
    );
};

export default LoanCalculator;