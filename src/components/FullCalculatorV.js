import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Mail, Phone, Building2, FileText, Briefcase, 
         AlertCircle, Euro, Calendar, Clock, Target, Shield, Search, MessageCircle } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';

// Constants
const TOTAL_STEPS = 4;

// Form Components
const ProgressBar = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-8">
            <Progress.Root 
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
                value={progress}
            >
                <Progress.Indicator
                    className="bg-indigo-600 w-full h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                />
            </Progress.Root>
            <div className="mt-2 text-sm text-gray-600 text-center">
                Solis {currentStep} no {totalSteps}
            </div>
        </div>
    );
};

const FormField = ({ name, label, error, children }) => (
    <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        {children}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${props.error ? 'border-red-500' : 'border-gray-300'}`}
            {...props}
        />
    </div>
);

const SelectInput = ({ icon: Icon, options, value, onChange, placeholder }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <select
            value={value}
            onChange={onChange}
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white appearance-none cursor-pointer`}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
);

const TextArea = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        )}
        <textarea
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${props.error ? 'border-red-500' : 'border-gray-300'} min-h-[100px]`}
            {...props}
        />
    </div>
);


// Form Components
const ProgressBar = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-8">
            <Progress.Root 
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
                value={progress}
            >
                <Progress.Indicator
                    className="bg-indigo-600 w-full h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                />
            </Progress.Root>
            <div className="mt-2 text-sm text-gray-600 text-center">
                Solis {currentStep} no {totalSteps}
            </div>
        </div>
    );
};

const FormField = ({ name, label, error, children }) => (
    <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        {children}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${props.error ? 'border-red-500' : 'border-gray-300'}`}
            {...props}
        />
    </div>
);

const SelectInput = ({ icon: Icon, options, value, onChange, placeholder }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <select
            value={value}
            onChange={onChange}
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white appearance-none cursor-pointer`}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
);

const TextArea = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        )}
        <textarea
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${props.error ? 'border-red-500' : 'border-gray-300'} min-h-[100px]`}
            {...props}
        />
    </div>
);

const TOTAL_STEPS = 4;

const FullCalculator = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Info
        fullName: '',
        email: '',
        phone: '',
        
        // Company Info
        companyName: '',
        registrationNumber: '',
        position: '',
        mainActivity: '',
        companyDescription: '',
        
        // Financial Info
        currentLoans: '',
        taxDebt: 'none', // none, withSchedule, withoutSchedule
        taxDebtAmount: '',
        requiredAmount: '',
        term: '',
        urgency: '',
        purpose: [],
        product: '',
        
        // Additional Info
        collateral: '',
        collateralDescription: '',
        previousApplications: '',
        previousApplicationsDetails: '',
        referralSource: '',
        manager: '',
        
        // Agreements
        acceptTerms: false,
        acceptMarketing: false
    });
    
    // Add slider styles to document
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = sliderStyles;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <FormField name="fullName" label="Vārds Uzvārds">
                            <Input 
                                icon={User}
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="email" label="E-pasts">
                            <Input 
                                icon={Mail}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="phone" label="Tālrunis">
                            <Input 
                                icon={Phone}
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </FormField>
                    </div>
                );
                
            case 2:
                return (
                    <div className="space-y-6">
                        <FormField name="companyName" label="Uzņēmuma nosaukums">
                            <Input 
                                icon={Building2}
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="registrationNumber" label="Reģistrācijas nr.">
                            <Input 
                                icon={FileText}
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="position" label="Jūsu pozīcija uzņēmumā">
                            <Input 
                                icon={Briefcase}
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={(e) => handleInputChange('position', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="mainActivity" label="Pamata darbība">
                            <Input 
                                type="text"
                                name="mainActivity"
                                value={formData.mainActivity}
                                onChange={(e) => handleInputChange('mainActivity', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="companyDescription" label="Īsi aprakstiet ar ko nodarbojas uzņēmums">
                            <TextArea 
                                name="companyDescription"
                                value={formData.companyDescription}
                                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                            />
                        </FormField>
                    </div>
                );
                
            case 3:
                return (
                    <div className="space-y-6">
                        <FormField name="currentLoans" label="Tekošās kredītsaistības">
                            <TextArea 
                                name="currentLoans"
                                placeholder="Tekošās kredītsastības - pamatsummas atlikumu EUR un finanšu iestādi"
                                value={formData.currentLoans}
                                onChange={(e) => handleInputChange('currentLoans', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="taxDebt" label="Nodokļu parāds">
                            <RadioGroup.Root
                                className="flex flex-col space-y-2"
                                value={formData.taxDebt}
                                onValueChange={(value) => handleInputChange('taxDebt', value)}
                            >
                                <div className="flex items-center">
                                    <RadioGroup.Item
                                        value="none"
                                        className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                                    />
                                    <label>Nav</label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroup.Item
                                        value="withSchedule"
                                        className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                                    />
                                    <label>Ir, ar VID grafiku</label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroup.Item
                                        value="withoutSchedule"
                                        className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                                    />
                                    <label>Ir, bez VID grafika</label>
                                </div>
                            </RadioGroup.Root>
                        </FormField>
                        
                        {formData.taxDebt !== 'none' && (
                            <FormField name="taxDebtAmount" label="Nodokļu parāda summa">
                                <Input 
                                    icon={Euro}
                                    type="number"
                                    name="taxDebtAmount"
                                    value={formData.taxDebtAmount}
                                    onChange={(e) => handleInputChange('taxDebtAmount', e.target.value)}
                                />
                            </FormField>
                        )}
                        
                        <FormField name="requiredAmount" label="Nepieciešamā summa EUR">
                            <Input 
                                icon={Euro}
                                type="number"
                                name="requiredAmount"
                                value={formData.requiredAmount}
                                onChange={(e) => handleInputChange('requiredAmount', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="term" label="Velamais terminš">
                            <Input 
                                icon={Calendar}
                                type="text"
                                name="term"
                                placeholder="Norādot mēneši/gadi"
                                value={formData.term}
                                onChange={(e) => handleInputChange('term', e.target.value)}
                            />
                        </FormField>
                    </div>
                );
                
            case 4:
                return (
                    <div className="space-y-6">
                        <FormField name="urgency" label="Cik ātri nepieciešams kredīts">
                            <Input 
                                icon={Clock}
                                type="text"
                                name="urgency"
                                value={formData.urgency}
                                onChange={(e) => handleInputChange('urgency', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="purpose" label="Kredīta mērķis (var būt vairāki)">
                            <Input 
                                icon={Target}
                                type="text"
                                name="purpose"
                                value={formData.purpose}
                                onChange={(e) => handleInputChange('purpose', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="product" label="Nepieciešamais produkts">
                            <Input 
                                type="text"
                                name="product"
                                value={formData.product}
                                onChange={(e) => handleInputChange('product', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="collateral" label="Piedāvātais nodrošinājums">
                            <Input 
                                icon={Shield}
                                type="text"
                                name="collateral"
                                value={formData.collateral}
                                onChange={(e) => handleInputChange('collateral', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="collateralDescription" label="Aprakstiet piedāvāto nodrošinājumu">
                            <TextArea 
                                name="collateralDescription"
                                value={formData.collateralDescription}
                                onChange={(e) => handleInputChange('collateralDescription', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="previousApplications" label="Pēdējo 3 mēn. laikā esat vērsušies kādā no finanšu iestādēm?">
                            <TextArea 
                                icon={Search}
                                name="previousApplications"
                                placeholder="Ja jā - kur un kāda bija atbilde/statuss."
                                value={formData.previousApplications}
                                onChange={(e) => handleInputChange('previousApplications', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="referralSource" label="Kā par mums uzzinājāt?">
                            <Input 
                                icon={MessageCircle}
                                type="text"
                                name="referralSource"
                                value={formData.referralSource}
                                onChange={(e) => handleInputChange('referralSource', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField name="manager" label="Jūsu menedžeris">
                            <Input 
                                type="text"
                                name="manager"
                                value={formData.manager}
                                onChange={(e) => handleInputChange('manager', e.target.value)}
                            />
                        </FormField>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox.Root
                                    className="w-4 h-4 border border-gray-300 rounded"
                                    checked={formData.acceptTerms}
                                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                                >
                                    <Checkbox.Indicator>
                                        <Check className="w-4 h-4 text-indigo-600" />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <label className="text-sm text-gray-600">
                                    Spiežot pogu "Nosūtīt pieteikumu", Jūs piekrītat, ka norādītā informācija ir patiesa un piekrītat tās tālākai apstrādei. 
                                    Kā arī piekrītat mūsu privātuma un lietošanas politikai.
                                </label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox.Root
                                    className="w-4 h-4 border border-gray-300 rounded"
                                    checked={formData.acceptMarketing}
                                    onCheckedChange={(checked) => handleInputChange('acceptMarketing', checked)}
                                >
                                    <Checkbox.Indicator>
                                        <Check className="w-4 h-4 text-indigo-600" />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <label className="text-sm text-gray-600">
                                    Jā, es vēlētos saņemt mārketinga/informatīvās ziņas pa pastu, SMS vai telefonā.
                                </label>
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pieteikums kredītu salīdzināšanai</h2>
            <p className="text-gray-600 mb-8">Aizpildīšanas laiks var aizņemt līdz 5 minūtēm.</p>
            
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {renderStep()}
                
                <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Atpakaļ
                        </button>
                    )}
                    
                    <button
                        type="button"
                        onClick={currentStep === TOTAL_STEPS ? handleSubmit : nextStep}
                        className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {currentStep === TOTAL_STEPS ? 'Nosūtīt pieteikumu' : 'Tālāk'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FullCalculator;

const ProgressBar = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-8">
            <Progress.Root 
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
                value={progress}
            >
                <Progress.Indicator
                    className="bg-indigo-600 w-full h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                />
            </Progress.Root>
            <div className="mt-2 text-sm text-gray-600 text-center">
                Solis {currentStep} no {totalSteps}
            </div>
        </div>
    );
};
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

const TOTAL_STEPS = 4;

const FullCalculator = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Info
        fullName: '',
        email: '',
        phone: '',
        
        // Company Info
        companyName: '',
        registrationNumber: '',
        position: '',
        mainActivity: '',
        companyDescription: '',
        
        // Financial Info
        currentLoans: '',
        taxDebt: 'none', // none, withSchedule, withoutSchedule
        taxDebtAmount: '',
        requiredAmount: '',
        term: '',
        urgency: '',
        purpose: [],
        product: '',
        
        // Additional Info
        collateral: '',
        collateralDescription: '',
        previousApplications: '',
        previousApplicationsDetails: '',
        referralSource: '',
        manager: '',
        
        // Agreements
        acceptTerms: false,
        acceptMarketing: false
    });
    
    // Add slider styles to document
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = sliderStyles;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };
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