import React, { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { ChevronRight, ChevronLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';

const FormField = ({ label, required, children }) => (
  <div className="space-y-2">
    <Label.Root className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label.Root>
    {children}
  </div>
);

const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className="relative flex items-center px-8 py-2 text-sm text-gray-700 hover:bg-blue-50 focus:bg-blue-50 rounded-md focus:outline-none select-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700"
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
        <Check className="w-4 h-4" />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

const CustomSelect = ({ name, value, onChange, options, placeholder }) => (
  <Select.Root value={value} onValueChange={(value) => onChange({ target: { name, value } })}>
    <Select.Trigger
      className="inline-flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      aria-label={name}
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Select.Icon>
    </Select.Trigger>
    
    <Select.Portal>
      <Select.Content
        className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200"
        position="popper"
        align="start"
        sideOffset={5}
      >
        <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
          <ChevronUp className="w-4 h-4" />
        </Select.ScrollUpButton>
        
        <Select.Viewport className="p-1">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select.Viewport>
        
        <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
          <ChevronDown className="w-4 h-4" />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const LoanApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 fields
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
    
    // Step 2 fields
    currentLoans: '',
    taxDebt: 'Nav',
    taxDebtAmount: '',
    delayedPayments: 'Nē',
    requiredAmount: '',
    desiredTerm: '',
    urgency: '',
    purpose: [],
    productType: '',
    collateral: [],
    collateralDescription: '',
    otherApplications: 'Nē',
    dataProcessing: false,
    marketing: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'purpose' || name === 'collateral') {
        const updatedArray = formData[name].includes(value)
          ? formData[name].filter(item => item !== value)
          : [...formData[name], value];
        setFormData(prev => ({ ...prev, [name]: updatedArray }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Vārds, Uzvārds" required>
          <input
            type="text"
            name="fullName"
            required
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField label="E-pasts" required>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.email}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField label="Uzņēmuma vecums">
          <CustomSelect
            name="companyAge"
            value={formData.companyAge}
            onChange={handleInputChange}
            placeholder="Izvēlieties uzņēmuma vecumu"
            options={[
              { value: '< 2 gads', label: '< 2 gads' },
              { value: '2-5 gadi', label: '2–5 gadi' },
              { value: '> 5 gadi', label: '> 5 gadi' }
            ]}
          />
        </FormField>

        <FormField label="Apgrozījums pēdējā gadā (EUR)">
          <CustomSelect
            name="annualTurnover"
            value={formData.annualTurnover}
            onChange={handleInputChange}
            placeholder="Izvēlieties apgrozījumu"
            options={[
              { value: '< 200 000', label: '< 200 000' },
              { value: '200 001 - 500 000', label: '200 001 – 500 000' },
              { value: '500 001 - 1 000 000', label: '500 001 – 1 000 000' },
              { value: '> 1 000 000', label: '> 1 000 000' }
            ]}
          />
        </FormField>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Tekošās kredītsaistības" required>
          <input
            type="text"
            name="currentLoans"
            required
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.currentLoans}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField label="Vai uzņēmumam ir nodokļu parāds?">
          <CustomSelect
            name="taxDebt"
            value={formData.taxDebt}
            onChange={handleInputChange}
            placeholder="Izvēlieties statusu"
            options={[
              { value: 'Nav', label: 'Nav' },
              { value: 'Ir, ar VID grafiku', label: 'Ir, ar VID grafiku' },
              { value: 'Ir, bez VID grafika', label: 'Ir, bez VID grafika' }
            ]}
          />
        </FormField>

        <div className="col-span-2">
          <FormField label="Finansējuma mērķis">
            <div className="space-y-2">
              {['Apgrozāmie līdzekļi', 'Iekārtu iegāde', 'Nekustamais īpašums', 
                'Transportlīdzekļi', 'Refinansēšana', 'Cits'].map((purpose) => (
                <div key={purpose} className="flex items-center space-x-2">
                  <Checkbox.Root
                    className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    checked={formData.purpose.includes(purpose)}
                    onCheckedChange={(checked) => {
                      handleInputChange({
                        target: {
                          name: 'purpose',
                          value: purpose,
                          type: 'checkbox',
                          checked
                        }
                      });
                    }}
                  >
                    <Checkbox.Indicator>
                      <Check className="h-3 w-3 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <Label.Root className="text-sm text-gray-700">{purpose}</Label.Root>
                </div>
              ))}
            </div>
          </FormField>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox.Root
            className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            checked={formData.dataProcessing}
            onCheckedChange={(checked) => {
              handleInputChange({
                target: {
                  name: 'dataProcessing',
                  type: 'checkbox',
                  checked
                }
              });
            }}
            required
          >
            <Checkbox.Indicator>
              <Check className="h-3 w-3 text-white" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <Label.Root className="text-sm text-gray-700">
            Piekrītu datu apstrādei
          </Label.Root>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 ? 'Kontaktinformācija un Uzņēmuma informācija' : 'Finanses, Kredītsaistības, Aizdevuma vajadzības'}
          </h2>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-4 h-4 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 ? renderStep1() : renderStep2()}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Iepriekšējais
            </button>
          )}
          
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-auto"
            >
              Nākamais
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-auto"
            >
              Iesniegt
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm;