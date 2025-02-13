import React, { useState } from 'react';
import { ChevronDown, User, Mail, Phone, Building2, FileText, Briefcase, 
         AlertCircle, Euro, Calendar, Clock, Target, Shield } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Select from '@radix-ui/react-select';

// Constants
const TOTAL_STEPS = 2;

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

// Main Component
function FullCalculator() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Contact and Company Information
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        registrationNumber: '',
        companyAge: '',
        annualTurnover: '',
        profitLoss: '',
        position: '',
        mainActivity: '',

        // Financial Information
        currentLoanAmount: '',
        currentLoanInstitution: '',
        taxDebt: '',
        taxDebtAmount: '',
        delayedPayments: false,
        requiredAmount: '',
        desiredTerm: '',
        urgency: '',
        purpose: [],
        financialProduct: '',
        collateral: '',
        collateralDescription: '',
        otherInstitutions: false,
        
        // Consent
        dataProcessing: false,
        marketing: false,
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
        <div className="max-w-2xl mx-auto p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Aizpildi pieteikumu</h2>
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
}

export default FullCalculator;
