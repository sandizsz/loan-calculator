import { useState, useEffect } from 'react';
import { ChevronDown, Check, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';

const MonthlyPaymentBox = ({ monthlyPayment }) => (
    <div className="bg-gradient-to-br from-primary/5 to-primary/15 p-8 rounded-xl mb-8 text-center shadow-sm border border-primary/10">
        <div className="space-y-2">
            <h4 className="text-3xl font-bold text-primary tracking-tight">{monthlyPayment} €/mēn.</h4>
            <p className="text-muted-foreground text-sm">Ikmēneša maksājums</p>
        </div>
    </div>
);

const FormField = ({ name, label, error, children }) => (
    <div className="space-y-2">
        <div className="flex items-baseline justify-between">
            <Label.Root className="text-sm font-medium">{label}</Label.Root>
            {error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
        {children}
    </div>
);

const Input = ({ icon: Icon, ...props }) => (
    <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />}
        <input
            {...props}
            className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
        />
    </div>
);

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
            const annualRate = 12 / 100;
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
        <div className="max-w-3xl mx-auto p-6">
            <div className="shadow-xl rounded-xl p-8 bg-white/50 backdrop-blur-sm border border-gray-100">
                <div className="border-b pb-6 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Aizpildiet pieteikumu</h2>
                    <p className="text-muted-foreground mt-2">saņemiet aizdevumu!</p>
                </div>
                
                <MonthlyPaymentBox monthlyPayment={monthlyPayment} />
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField name="firstName" label="Vārds" error={errors.firstName}>
                            <Input 
                                icon={User}
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </FormField>

                        <FormField name="lastName" label="Uzvārds" error={errors.lastName}>
                            <Input 
                                icon={User}
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </FormField>

                        <FormField name="email" label="E-pasts" error={errors.email}>
                            <Input 
                                icon={Mail}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </FormField>

                        <FormField name="phone" label="Tālrunis" error={errors.phone}>
                            <Input 
                                icon={Phone}
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </FormField>

                        <FormField name="city" label="Pilsēta" error={errors.city}>
                            <Select.Root 
                                value={formData.city}
                                onValueChange={(value) => handleInputChange({ 
                                    target: { name: 'city', value } 
                                })}
                            >
                                <Select.Trigger className="relative w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg flex items-center justify-between bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                    <MapPin className="absolute left-3 w-5 h-5 text-gray-400" />
                                    <Select.Value placeholder="Izvēlieties pilsētu" className="text-gray-900" />
                                    <Select.Icon className="ml-2">
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </Select.Icon>
                                </Select.Trigger>

                                <Select.Portal>
                                    <Select.Content className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 min-w-[var(--radix-select-trigger-width)] max-h-[300px]">
                                        <Select.Viewport className="p-1">
                                            {[
                                                ["riga", "Rīga"],
                                                ["daugavpils", "Daugavpils"],
                                                ["liepaja", "Liepāja"],
                                                ["jelgava", "Jelgava"],
                                                ["jurmala", "Jūrmala"],
                                                ["ventspils", "Ventspils"],
                                                ["rezekne", "Rēzekne"],
                                                ["valmiera", "Valmiera"]
                                            ].map(([value, label]) => (
                                                <Select.Item 
                                                    key={value} 
                                                    value={value}
                                                    className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-default hover:bg-gray-100 focus:bg-gray-100 outline-none"
                                                >
                                                    <Select.ItemText>{label}</Select.ItemText>
                                                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                                                        <Check className="h-4 w-4" />
                                                    </Select.ItemIndicator>
                                                </Select.Item>
                                            ))}
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </FormField>

                        <FormField name="gender" label="Dzimums" error={errors.gender}>
                            <RadioGroup.Root
                                className="flex gap-6"
                                value={formData.gender}
                                onValueChange={(value) => handleInputChange({
                                    target: { name: 'gender', value }
                                })}
                            >
                                {[
                                    ['female', 'Sieviete'],
                                    ['male', 'Vīrietis']
                                ].map(([value, label]) => (
                                    <div key={value} className="flex items-center">
                                        <RadioGroup.Item
                                            id={value}
                                            value={value}
                                            className="w-5 h-5 rounded-full border border-gray-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        >
                                            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-primary" />
                                        </RadioGroup.Item>
                                        <Label.Root htmlFor={value} className="pl-2 text-sm text-gray-900">
                                            {label}
                                        </Label.Root>
                                    </div>
                                ))}
                            </RadioGroup.Root>
                        </FormField>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                            <Checkbox.Root
                                id="terms"
                                checked={formData.acceptTerms}
                                onCheckedChange={(checked) => handleInputChange({
                                    target: { name: 'acceptTerms', checked }
                                })}
                                className="w-5 h-5 border border-gray-200 rounded hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            >
                                <Checkbox.Indicator className="flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </Checkbox.Indicator>
                            </Checkbox.Root>
                            <Label.Root htmlFor="terms" className="text-sm">
                                Apliecinu, ka sniegtā informācija ir patiesa un esmu iepazinies ar 
                                <a href="/terms" className="text-primary hover:underline ml-1">
                                    datu apstrādes noteikumiem
                                </a>
                            </Label.Root>
                        </div>
                        {errors.acceptTerms && (
                            <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                            {errors.submit}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white h-11 px-8 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Iesniegt pieteikumu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FullCalculator;