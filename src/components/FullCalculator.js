import { useState } from 'react';
import { ChevronDown, InfoIcon } from 'lucide-react';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Tooltip from '@radix-ui/react-tooltip';

const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="flex justify-between mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
                <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                        ${i + 1 === currentStep 
                            ? 'bg-blue-500 text-white' 
                            : i + 1 < currentStep 
                                ? 'bg-blue-100 text-blue-500' 
                                : 'bg-gray-100 text-gray-500'}`}
                >
                    {i + 1}
                </div>
                {i < totalSteps - 1 && (
                    <div className={`w-full h-0.5 ${i + 1 < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
                )}
            </div>
        ))}
    </div>
);

const FormField = ({ label, error, tooltip, children }) => (
    <Form.Field className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
            <Form.Label className="text-sm text-gray-700 flex items-center gap-1">
                {label}
                {tooltip && (
                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <InfoIcon className="w-4 h-4 text-gray-400" />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content 
                                    className="bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg"
                                    sideOffset={5}
                                >
                                    {tooltip}
                                    <Tooltip.Arrow className="fill-gray-900" />
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                )}
            </Form.Label>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        <Form.Control asChild>
            {children}
        </Form.Control>
    </Form.Field>
);

const CustomSelect = ({ value, onValueChange, placeholder, items }) => (
    <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger 
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-md text-left text-gray-900 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            <Select.Value placeholder={placeholder} />
            <Select.Icon>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
            <Select.Content 
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200"
                position="popper"
                sideOffset={4}
            >
                <Select.Viewport className="p-1">
                    {items.map(([value, label]) => (
                        <Select.Item
                            key={value}
                            value={value}
                            className="relative flex items-center px-8 py-2 text-sm text-gray-900 rounded-sm hover:bg-blue-50 hover:text-blue-900 outline-none cursor-default"
                        >
                            <Select.ItemText>{label}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                                <CheckIcon className="w-4 h-4" />
                            </Select.ItemIndicator>
                        </Select.Item>
                    ))}
                </Select.Viewport>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
);

const PoliticallyExposedTooltip = () => (
    <div className="max-w-xs">
        <p>Politiski nozīmīga persona ir persona, kas ieņem vai ir ieņēmusi nozīmīgu publisku amatu:</p>
        <ul className="list-disc pl-4 mt-2">
            <li>Valsts vai pašvaldības vadītājs</li>
            <li>Ministrs vai parlamenta deputāts</li>
            <li>Augstākās tiesas tiesnesis</li>
            <li>Vēstnieks vai diplomātiskais pārstāvis</li>
        </ul>
    </div>
);

const LoanCalculator = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const [formData, setFormData] = useState({
        // Personal Info
        firstName: '',
        lastName: '',
        personalCode: '',
        email: '',
        phone: '',
        
        // Address
        city: '',
        gender: '',
        
        // Financial
        politicallyExposed: '',
        dependents: '',
        beneficiary: '',
        
        // Additional
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

    const validateStep = (step) => {
        const newErrors = {};
        
        switch(step) {
            case 1:
                if (!formData.firstName) newErrors.firstName = 'Obligāti aizpildāms lauks';
                if (!formData.lastName) newErrors.lastName = 'Obligāti aizpildāms lauks';
                if (!formData.personalCode) newErrors.personalCode = 'Obligāti aizpildāms lauks';
                break;
            case 2:
                if (!formData.city) newErrors.city = 'Obligāti aizpildāms lauks';
                if (!formData.gender) newErrors.gender = 'Obligāti aizpildāms lauks';
                break;
            case 3:
                if (!formData.politicallyExposed) newErrors.politicallyExposed = 'Obligāti aizpildāms lauks';
                break;
            case 4:
                if (!formData.acceptTerms) newErrors.acceptTerms = 'Jums jāpiekrīt noteikumiem';
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <>
                        <FormField label="Vārds" error={errors.firstName}>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </FormField>
                        
                        <FormField label="Uzvārds" error={errors.lastName}>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </FormField>

                        <FormField 
                            label="Personas kods" 
                            error={errors.personalCode}
                            tooltip="Nepieciešams identifikācijas procesam"
                        >
                            <input
                                type="text"
                                value={formData.personalCode}
                                onChange={(e) => handleInputChange('personalCode', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </FormField>
                    </>
                );
            case 2:
                return (
                    <>
                        <FormField label="Pilsēta" error={errors.city}>
                            <CustomSelect
                                value={formData.city}
                                onValueChange={(value) => handleInputChange('city', value)}
                                placeholder="Izvēlieties pilsētu"
                                items={[
                                    ['riga', 'Rīga'],
                                    ['daugavpils', 'Daugavpils'],
                                    ['liepaja', 'Liepāja'],
                                    ['jelgava', 'Jelgava']
                                ]}
                            />
                        </FormField>

                        <FormField label="Dzimums" error={errors.gender}>
                            <RadioGroup.Root
                                value={formData.gender}
                                onValueChange={(value) => handleInputChange('gender', value)}
                                className="flex gap-8"
                            >
                                <div className="flex items-center">
                                    <RadioGroup.Item
                                        value="female"
                                        id="female"
                                        className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                                    >
                                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-500" />
                                    </RadioGroup.Item>
                                    <label htmlFor="female">Sieviete</label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroup.Item
                                        value="male"
                                        id="male"
                                        className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                                    >
                                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-500" />
                                    </RadioGroup.Item>
                                    <label htmlFor="male">Vīrietis</label>
                                </div>
                            </RadioGroup.Root>
                        </FormField>
                    </>
                );
            case 3:
                return (
                    <>
                        <FormField 
                            label="Vai Jūs esat politiski nozīmīga persona?" 
                            error={errors.politicallyExposed}
                            tooltip={<PoliticallyExposedTooltip />}
                        >
                            <CustomSelect
                                value={formData.politicallyExposed}
                                onValueChange={(value) => handleInputChange('politicallyExposed', value)}
                                placeholder="Izvēlieties"
                                items={[
                                    ['no', 'Nē, es neesmu'],
                                    ['yes', 'Jā, esmu']
                                ]}
                            />
                        </FormField>

                        <FormField label="Vai Jums ir apgādājamā/s personas?">
                            <CustomSelect
                                value={formData.dependents}
                                onValueChange={(value) => handleInputChange('dependents', value)}
                                placeholder="Izvēlieties"
                                items={[
                                    ['no', 'Nē, man nav'],
                                    ['yes', 'Jā, ir']
                                ]}
                            />
                        </FormField>

                        <FormField label="Esmu patiesā labuma guvējs">
                            <CustomSelect
                                value={formData.beneficiary}
                                onValueChange={(value) => handleInputChange('beneficiary', value)}
                                placeholder="Izvēlieties"
                                items={[
                                    ['yes', 'Jā, es esmu'],
                                    ['no', 'Nē, neesmu']
                                ]}
                            />
                        </FormField>
                    </>
                );
            case 4:
                return (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-2">
                                <Checkbox.Root
                                    id="terms"
                                    checked={formData.acceptTerms}
                                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                                    className="w-4 h-4 mt-1 border border-gray-300 rounded"
                                >
                                    <Checkbox.Indicator>
                                        <CheckIcon className="w-4 h-4 text-blue-500" />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <Label.Root htmlFor="terms" className="text-sm">
                                    Apliecinu, ka sniegtā informācija ir patiesa un esmu iepazinies ar 
                                    <a href="/terms" className="text-blue-500 hover:underline ml-1">
                                        datu apstrādes noteikumiem
                                    </a>
                                </Label.Root>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                            )}

                            <div className="flex items-start space-x-2">
                                <Checkbox.Root
                                    id="marketing"
                                    checked={formData.acceptMarketing}
                                    onCheckedChange={(checked) => handleInputChange('acceptMarketing', checked)}
                                    className="w-4 h-4 mt-1 border border-gray-300 rounded"
                                >
                                    <Checkbox.Indicator>
                                        <CheckIcon className="w-4 h-4 text-blue-500" />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <Label.Root htmlFor="marketing" className="text-sm">
                                    Piekrītu saņemt personalizētus piedāvājumus
                                </Label.Root>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };
}   

export default FullCalculator;