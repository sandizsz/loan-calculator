import { useState, useEffect } from 'react';
import { ChevronDown, Check, User, Mail, Phone, Building2, FileText, Briefcase, 
         AlertCircle, Euro, Calendar, Clock, Target, Shield, Search, MessageCircle } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';

const StepIndicator = ({ currentStep, totalSteps }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                {[...Array(totalSteps)].map((_, index) => (
                    <div
                        key={index}
                        className={`flex items-center ${index < totalSteps - 1 ? 'flex-1' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                            ${index + 1 === currentStep ? 'border-primary bg-primary text-white' : 
                              index + 1 < currentStep ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
                        >
                            {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        {index < totalSteps - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 
                                ${index + 1 < currentStep ? 'bg-primary' : 'bg-gray-300'}`}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between px-2">
                <span className="text-sm">Personīgā informācija</span>
                <span className="text-sm">Uzņēmuma info</span>
                <span className="text-sm">Finanšu info</span>
                <span className="text-sm">Papildus info</span>
            </div>
        </div>
    );
};

const FormField = ({ name, label, error, children }) => (
    <div className="space-y-2">
        <div className="flex items-baseline justify-between">
            <Label.Root className="text-sm font-medium">{label}</Label.Root>
            {error && <span className="text-sm text-red-500">{error}</span>}
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
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const [formData, setFormData] = useState({
        // Step 1
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        
        // Step 2
        companyName: '',
        registrationNumber: '',
        position: '',
        mainActivity: '',
        
        // Step 3
        requiredAmount: '',
        desiredTerm: '',
        currentLoans: 'no',
        taxDebt: 'no',
        
        // Step 4
        loanPurpose: '',
        collateral: '',
        acceptTerms: false,
        acceptMarketing: false
    });
    
    const [errors, setErrors] = useState({});

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField name="firstName" label="Vārds" error={errors.firstName}>
                            <Input 
                                icon={User}
                                placeholder="Ievadiet vārdu"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                        </FormField>
                        <FormField name="lastName" label="Uzvārds" error={errors.lastName}>
                            <Input 
                                icon={User}
                                placeholder="Ievadiet uzvārdu"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                        </FormField>
                        <FormField name="email" label="E-pasts" error={errors.email}>
                            <Input 
                                icon={Mail}
                                type="email"
                                placeholder="example@domain.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </FormField>
                        <FormField name="phone" label="Tālrunis" error={errors.phone}>
                            <Input 
                                icon={Phone}
                                placeholder="+371"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </FormField>
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField name="companyName" label="Uzņēmuma nosaukums" error={errors.companyName}>
                            <Input 
                                icon={Building2}
                                placeholder="SIA Example"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                            />
                        </FormField>
                        <FormField name="registrationNumber" label="Reģistrācijas numurs" error={errors.registrationNumber}>
                            <Input 
                                icon={FileText}
                                placeholder="40000000000"
                                value={formData.registrationNumber}
                                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                            />
                        </FormField>
                        <FormField name="position" label="Amats" error={errors.position}>
                            <Input 
                                icon={Briefcase}
                                placeholder="Valdes loceklis"
                                value={formData.position}
                                onChange={(e) => handleInputChange('position', e.target.value)}
                            />
                        </FormField>
                        <FormField name="mainActivity" label="Galvenā darbības nozare" error={errors.mainActivity}>
                            <Input 
                                icon={Target}
                                placeholder="Piemēram: Tirdzniecība"
                                value={formData.mainActivity}
                                onChange={(e) => handleInputChange('mainActivity', e.target.value)}
                            />
                        </FormField>
                    </div>
                );
            case 3:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField name="requiredAmount" label="Nepieciešamā summa" error={errors.requiredAmount}>
                            <Input 
                                icon={Euro}
                                type="number"
                                placeholder="50000"
                                value={formData.requiredAmount}
                                onChange={(e) => handleInputChange('requiredAmount', e.target.value)}
                            />
                        </FormField>
                        <FormField name="desiredTerm" label="Vēlamais termiņš (mēnešos)" error={errors.desiredTerm}>
                            <Input 
                                icon={Calendar}
                                type="number"
                                placeholder="24"
                                value={formData.desiredTerm}
                                onChange={(e) => handleInputChange('desiredTerm', e.target.value)}
                            />
                        </FormField>
                        <FormField name="currentLoans" label="Esošie kredīti" error={errors.currentLoans}>
                            <Select.Root 
                                value={formData.currentLoans}
                                onValueChange={(value) => handleInputChange('currentLoans', value)}
                            >
                                <Select.Trigger className="w-full h-11 px-4 border border-gray-200 rounded-lg flex items-center justify-between">
                                    <Select.Value placeholder="Izvēlieties" />
                                    <Select.Icon>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="bg-white rounded-lg shadow-lg border">
                                        <Select.Viewport className="p-1">
                                            <Select.Item value="no" className="relative flex items-center px-8 py-2 rounded-md text-sm hover:bg-gray-100">
                                                <Select.ItemText>Nav</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value="yes" className="relative flex items-center px-8 py-2 rounded-md text-sm hover:bg-gray-100">
                                                <Select.ItemText>Ir</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </FormField>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <FormField name="loanPurpose" label="Kredīta mērķis" error={errors.loanPurpose}>
                            <Input 
                                icon={Target}
                                placeholder="Aprakstiet kredīta mērķi"
                                value={formData.loanPurpose}
                                onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                            />
                        </FormField>
                        
                        <div className="space-y-4">
                            <div className="flex items-start space-x-2">
                                <Checkbox.Root
                                    id="terms"
                                    checked={formData.acceptTerms}
                                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                                    className="w-5 h-5 border border-gray-200 rounded"
                                >
                                    <Checkbox.Indicator>
                                        <Check className="w-4 h-4" />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <Label.Root htmlFor="terms" className="text-sm">
                                    Apliecinu, ka sniegtā informācija ir patiesa un esmu iepazinies ar
                                    <a href="/terms" className="text-primary hover:underline ml-1">
                                        noteikumiem
                                    </a>
                                </Label.Root>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        switch(step) {
            case 1:
                if (!formData.firstName) newErrors.firstName = 'Lūdzu ievadiet vārdu';
                if (!formData.lastName) newErrors.lastName = 'Lūdzu ievadiet uzvārdu';
                if (!formData.email) newErrors.email = 'Lūdzu ievadiet e-pastu';
                if (!formData.phone) newErrors.phone = 'Lūdzu ievadiet tālruni';
                break;
                
            case 2:
                if (!formData.companyName) newErrors.companyName = 'Lūdzu ievadiet uzņēmuma nosaukumu';
                if (!formData.registrationNumber) newErrors.registrationNumber = 'Lūdzu ievadiet reģistrācijas numuru';
                break;
                
            case 3:
                if (!formData.requiredAmount) newErrors.requiredAmount = 'Lūdzu ievadiet summu';
                if (!formData.desiredTerm) newErrors.desiredTerm = 'Lūdzu ievadiet termiņu';
                break;
                
            case 4:
                if (!formData.loanPurpose) newErrors.loanPurpose = 'Lūdzu ievadiet kredīta mērķi';
                if (!formData.acceptTerms) newErrors.acceptTerms = 'Lūdzu piekrītiet noteikumiem';
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep(currentStep) && currentStep === totalSteps) {
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

                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {renderStepContent()}

                    {errors.submit && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex justify-between gap-4 mt-8">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 bg-gray-100 text-gray-700 h-11 px-8 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Atpakaļ
                            </button>
                        )}
                        <button
                            type={currentStep === totalSteps ? 'submit' : 'button'}
                            onClick={currentStep === totalSteps ? undefined : nextStep}
                            className="flex-1 bg-primary text-white h-11 px-8 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            {currentStep === totalSteps ? 'Iesniegt pieteikumu' : 'Tālāk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FullCalculator;