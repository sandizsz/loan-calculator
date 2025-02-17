import React, { useState } from 'react';
import { ChevronDown, User, Mail, Phone, Building2, FileText, Briefcase, 
         AlertCircle, Euro, Calendar, Clock, Target, Shield, Check } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Select from '@radix-ui/react-select';

// Constants
const TOTAL_STEPS = 2;

// Form field options
const COMPANY_AGE_OPTIONS = [
    { value: 'less2', label: '< 2 gads' },
    { value: '2to5', label: '2–5 gadi' },
    { value: 'more5', label: '> 5 gadi' }
];

const TURNOVER_OPTIONS = [
    { value: 'less200k', label: '< 200 000' },
    { value: '200kto500k', label: '200 001 – 500 000' },
    { value: '500kto1m', label: '500 001 – 1 000 000' },
    { value: 'more1m', label: '> 1 000 000' }
];

const PROFIT_LOSS_OPTIONS = [
    { value: 'profit', label: 'Peļņa' },
    { value: 'loss', label: 'Zaudējumi' },
    { value: 'noData', label: 'Nav pieejamu datu' }
];

const POSITION_OPTIONS = [
    { value: 'owner', label: 'Īpašnieks' },
    { value: 'board', label: 'Valdes loceklis' },
    { value: 'finance', label: 'Finanšu direktors' },
    { value: 'other', label: 'Cits' }
];

const TAX_DEBT_OPTIONS = [
    { value: 'none', label: 'Nav' },
    { value: 'withSchedule', label: 'Ir, ar VID grafiku' },
    { value: 'withoutSchedule', label: 'Ir, bez VID grafika' }
];

const DELAYED_PAYMENTS_OPTIONS = [
    { value: 'yes', label: 'Jā' },
    { value: 'no', label: 'Nē' }
];

const PURPOSE_OPTIONS = [
    { value: 'workingCapital', label: 'Apgrozāmie līdzekļi' },
    { value: 'equipment', label: 'Iekārtu iegāde' },
    { value: 'realEstate', label: 'Nekustamais īpašums' },
    { value: 'vehicles', label: 'Transportlīdzekļi' },
    { value: 'refinancing', label: 'Refinansēšana' },
    { value: 'other', label: 'Cits' }
];

const FINANCIAL_PRODUCT_OPTIONS = [
    { value: 'loan', label: 'Aizdevums' },
    { value: 'creditLine', label: 'Kredītlīnija' },
    { value: 'leasing', label: 'Līzings' },
    { value: 'factoring', label: 'Faktorings' },
    { value: 'other', label: 'Cits' }
];

const COLLATERAL_OPTIONS = [
    { value: 'realEstate', label: 'Nekustamais īpašums' },
    { value: 'vehicles', label: 'Transportlīdzekļi' },
    { value: 'commercial', label: 'Komercķīla' },
    { value: 'none', label: 'Nav nodrošinājuma' },
    { value: 'other', label: 'Cits' }
];

const OTHER_INSTITUTIONS_OPTIONS = [
    { value: 'yes', label: 'Jā' },
    { value: 'no', label: 'Nē' }
];

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

const FormField = ({ name, label, error, required = false, children }) => (
    <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const Input = ({ icon: Icon, error, ...props }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
            {...props}
        />
    </div>
);

const SelectInput = ({ icon: Icon, options, value, onChange, placeholder, error }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
        )}
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
                className={`inline-flex w-full items-center justify-between rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-lg animate-fadeIn z-50"
                >
                    <Select.Viewport className="p-1">
                        {options.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className="relative flex items-center px-8 py-2 text-sm text-gray-900 rounded-md hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none select-none"
                            >
                                <Select.ItemText>{option.label}</Select.ItemText>
                                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                                    <Check className="h-4 w-4 text-indigo-600" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    </div>
);

const TextArea = ({ icon: Icon, error, ...props }) => (
    <div className="relative">
        {Icon && (
            <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        )}
        <textarea
            className={`w-full px-4 ${Icon ? 'pl-10' : ''} py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'} min-h-[100px]`}
            {...props}
        />
    </div>
);

// Main Component
const RadioInput = ({ options, value, onChange }) => (
    <div className="findexo-form">
        <RadioGroup.Root
            className="flex flex-wrap gap-4"
            value={value}
            onValueChange={onChange}
        >
            {options.map((option) => (
                <div key={option.value} className="flex items-center">
                    <RadioGroup.Item
                        id={option.value}
                        value={option.value}
                        className="hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    />
                    <label
                        htmlFor={option.value}
                        className="ml-3 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                    >
                        {option.label}
                    </label>
                </div>
            ))}
        </RadioGroup.Root>
    </div>
);

const CheckboxInput = ({ id, label, checked, onChange, error }) => (
    <div className="flex items-start">
        <Checkbox.Root
            id={id}
            checked={checked}
            onCheckedChange={onChange}
            className={`flex h-5 w-5 items-center justify-center rounded border ${error ? 'border-red-500' : 'border-gray-300'} bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
            <Checkbox.Indicator>
                <Check className="h-4 w-4 text-indigo-600" />
            </Checkbox.Indicator>
        </Checkbox.Root>
        <label htmlFor={id} className="ml-3 text-sm text-gray-700">
            {label}
        </label>
    </div>
);

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
        delayedPayments: 'no',
        requiredAmount: '',
        desiredTerm: '',
        urgency: '',
        purpose: [],
        financialProduct: '',
        collateral: '',
        collateralDescription: '',
        otherInstitutions: 'no',
        
        // Consent
        dataProcessing: false,
        marketing: false
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields for Step 1
        if (currentStep === 1) {
            if (!formData.fullName) newErrors.fullName = 'Šis lauks ir obligāts';
            if (!formData.email) newErrors.email = 'Šis lauks ir obligāts';
            if (!formData.phone) newErrors.phone = 'Šis lauks ir obligāts';
            if (!formData.companyName) newErrors.companyName = 'Šis lauks ir obligāts';
            if (!formData.registrationNumber) newErrors.registrationNumber = 'Šis lauks ir obligāts';
        }
        
        // Required fields for Step 2
        if (currentStep === 2) {
            if (!formData.currentLoanAmount) newErrors.currentLoanAmount = 'Šis lauks ir obligāts';
            if (!formData.requiredAmount) newErrors.requiredAmount = 'Šis lauks ir obligāts';
            if (!formData.desiredTerm) newErrors.desiredTerm = 'Šis lauks ir obligāts';
            if (!formData.dataProcessing) newErrors.dataProcessing = 'Jums jāpiekrīt datu apstrādei';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Handle form submission here
            console.log('Form submitted:', formData);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Kontaktinformācija un Uzņēmuma informācija</h2>
            
            <FormField name="fullName" label="Vārds, Uzvārds" required error={errors.fullName}>
                <Input
                    type="text"
                    name="fullName"
                    icon={User}
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={errors.fullName}
                />
            </FormField>

            <FormField name="email" label="E-pasts" required error={errors.email}>
                <Input
                    type="email"
                    name="email"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                />
            </FormField>

            <FormField name="phone" label="Tālrunis" required error={errors.phone}>
                <Input
                    type="tel"
                    name="phone"
                    icon={Phone}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                />
            </FormField>

            <FormField name="companyName" label="Uzņēmuma nosaukums" required error={errors.companyName}>
                <Input
                    type="text"
                    name="companyName"
                    icon={Building2}
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    error={errors.companyName}
                />
            </FormField>

            <FormField name="registrationNumber" label="Reģistrācijas numurs" required error={errors.registrationNumber}>
                <Input
                    type="text"
                    name="registrationNumber"
                    icon={FileText}
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    error={errors.registrationNumber}
                />
            </FormField>

            <FormField name="companyAge" label="Uzņēmuma vecums">
                <RadioInput
                    options={COMPANY_AGE_OPTIONS}
                    value={formData.companyAge}
                    onChange={(value) => handleInputChange('companyAge', value)}
                />
            </FormField>

            <FormField name="annualTurnover" label="Apgrozījums pēdējā gadā (EUR)">
                <RadioInput
                    options={TURNOVER_OPTIONS}
                    value={formData.annualTurnover}
                    onChange={(value) => handleInputChange('annualTurnover', value)}
                />
            </FormField>

            <FormField name="profitLoss" label="Peļņa vai zaudējumi pēdējā gadā">
                <RadioInput
                    options={PROFIT_LOSS_OPTIONS}
                    value={formData.profitLoss}
                    onChange={(value) => handleInputChange('profitLoss', value)}
                />
            </FormField>

            <FormField name="position" label="Jūsu pozīcija uzņēmumā">
                <RadioInput
                    options={POSITION_OPTIONS}
                    value={formData.position}
                    onChange={(value) => handleInputChange('position', value)}
                />
            </FormField>

            <FormField name="mainActivity" label="Pamata darbība (īss apraksts)">
                <TextArea
                    name="mainActivity"
                    icon={Briefcase}
                    value={formData.mainActivity}
                    onChange={(e) => handleInputChange('mainActivity', e.target.value)}
                    placeholder="piemēram: būvniecība, tirdzniecība, ražošana utt."
                />
            </FormField>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Finanses, Kredītsaistības, Aizdevuma vajadzības</h2>

            <FormField name="currentLoanAmount" label="Tekošās kredītsaistības" required error={errors.currentLoanAmount}>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="number"
                        name="currentLoanAmount"
                        icon={Euro}
                        placeholder="Pamatsummas atlikums EUR"
                        value={formData.currentLoanAmount}
                        onChange={(e) => handleInputChange('currentLoanAmount', e.target.value)}
                        error={errors.currentLoanAmount}
                    />
                    <Input
                        type="text"
                        name="currentLoanInstitution"
                        icon={Building2}
                        placeholder="Finanšu iestāde"
                        value={formData.currentLoanInstitution}
                        onChange={(e) => handleInputChange('currentLoanInstitution', e.target.value)}
                    />
                </div>
            </FormField>

            <FormField name="taxDebt" label="Vai uzņēmumam ir nodokļu parāds?">
                <RadioInput
                    options={TAX_DEBT_OPTIONS}
                    value={formData.taxDebt}
                    onChange={(value) => handleInputChange('taxDebt', value)}
                />
            </FormField>

            {formData.taxDebt && formData.taxDebt !== 'none' && (
                <FormField name="taxDebtAmount" label="Nodokļu parāda summa">
                    <Input
                        type="number"
                        name="taxDebtAmount"
                        icon={Euro}
                        value={formData.taxDebtAmount}
                        onChange={(e) => handleInputChange('taxDebtAmount', e.target.value)}
                    />
                </FormField>
            )}

            <FormField name="delayedPayments" label="Vai pēdējo 12 mēnešu laikā ir bijušas kavētas kredītmaksājumua vai nodokļu maksājumu saistības?">
                <RadioInput
                    options={DELAYED_PAYMENTS_OPTIONS}
                    value={formData.delayedPayments}
                    onChange={(value) => handleInputChange('delayedPayments', value)}
                />
            </FormField>

            <FormField name="requiredAmount" label="Nepieciešamā summa (EUR)" required error={errors.requiredAmount}>
                <Input
                    type="number"
                    name="requiredAmount"
                    icon={Euro}
                    value={formData.requiredAmount}
                    onChange={(e) => handleInputChange('requiredAmount', e.target.value)}
                    error={errors.requiredAmount}
                />
            </FormField>

            <FormField name="desiredTerm" label="Vēlamais termiņš (mēneši/gadi)" required error={errors.desiredTerm}>
                <Input
                    type="text"
                    name="desiredTerm"
                    icon={Calendar}
                    value={formData.desiredTerm}
                    onChange={(e) => handleInputChange('desiredTerm', e.target.value)}
                    error={errors.desiredTerm}
                />
            </FormField>

            <FormField name="urgency" label="Cik ātri nepieciešams finansējums?">
                <Input
                    type="text"
                    name="urgency"
                    icon={Clock}
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                />
            </FormField>

            <FormField name="purpose" label="Finansējuma mērķis (var būt vairāki)">
                <div className="grid grid-cols-2 gap-4">
                    {PURPOSE_OPTIONS.map((option) => (
                        <CheckboxInput
                            key={option.value}
                            id={`purpose_${option.value}`}
                            label={option.label}
                            checked={formData.purpose.includes(option.value)}
                            onChange={(checked) => {
                                const newPurpose = checked
                                    ? [...formData.purpose, option.value]
                                    : formData.purpose.filter(p => p !== option.value);
                                handleInputChange('purpose', newPurpose);
                            }}
                        />
                    ))}
                </div>
            </FormField>

            <FormField name="financialProduct" label="Nepieciešamais finanšu produkts">
                <RadioInput
                    options={FINANCIAL_PRODUCT_OPTIONS}
                    value={formData.financialProduct}
                    onChange={(value) => handleInputChange('financialProduct', value)}
                />
            </FormField>

            <FormField name="collateral" label="Piedāvātais nodrošinājums">
                <RadioInput
                    options={COLLATERAL_OPTIONS}
                    value={formData.collateral}
                    onChange={(value) => handleInputChange('collateral', value)}
                />
            </FormField>

            <FormField name="collateralDescription" label="Aprakstiet piedāvāto nodrošinājumu">
                <TextArea
                    name="collateralDescription"
                    value={formData.collateralDescription}
                    onChange={(e) => handleInputChange('collateralDescription', e.target.value)}
                />
            </FormField>

            <FormField name="otherInstitutions" label="Vai pēdējo 3 mēnešu laikā esat vērsušies citā finanšu iestādē?">
                <RadioInput
                    options={OTHER_INSTITUTIONS_OPTIONS}
                    value={formData.otherInstitutions}
                    onChange={(value) => handleInputChange('otherInstitutions', value)}
                />
            </FormField>

            <div className="space-y-4 mt-8">
                <CheckboxInput
                    id="dataProcessing"
                    label="Piekrītu datu apstrādei"
                    checked={formData.dataProcessing}
                    onChange={(checked) => handleInputChange('dataProcessing', checked)}
                    error={errors.dataProcessing}
                />

                <CheckboxInput
                    id="marketing"
                    label="Vēlos saņemt mārketinga ziņas"
                    checked={formData.marketing}
                    onChange={(checked) => handleInputChange('marketing', checked)}
                />
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}

            <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Atpakaļ
                    </button>
                )}
                {currentStep < TOTAL_STEPS ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="ml-auto px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Tālāk
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="ml-auto px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Iesniegt
                    </button>
                )}
            </div>
        </form>
    );
}

export default FullCalculator;
