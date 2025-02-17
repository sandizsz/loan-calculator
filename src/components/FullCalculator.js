import React, { useState, useEffect, useCallback, memo } from 'react';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { ChevronRight, ChevronLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';

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

const LoanApplicationForm = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
    .h2 {
    font-size: 1.5rem !important;}
      .loan-form-container {
        background: rgba(255, 255, 255, 0.90) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(4px) !important;
        border-radius: 10px !important;
        border: 1px solid rgba(255, 255, 255, 0.18) !important;
        padding: 1.5rem !important;
        max-width: 800px !important;
        margin: 0 auto !important;
      }

      .loan-form-container button,
      .loan-form-container [type="button"],
      .loan-form-container [type="submit"] {
        border: none !important;
        background: #4F46E5 !important;
        color: white !important;
        font-weight: 600 !important;
        border-radius: 6px !important;
        transition: all 0.2s !important;
        padding: 12px 24px !important;
        cursor: pointer !important;
        line-height: 1 !important;
      }

      .loan-form-container button:hover {
        background: #4338CA !important;
      }

      .loan-form-input {
        height: 48px !important;
        font-size: 16px !important;
        width: 100% !important;
        padding: 8px 12px !important;
        border: 1px solid #D1D5DB !important;
        border-radius: 6px !important;
        outline: none !important;
        transition: border-color 0.2s ease !important;
        background: white !important;
        margin: 0 !important;
      }

      .loan-form-input:focus {
        border-color: #4F46E5 !important;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
      }

      .loan-form-select-trigger {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        height: 48px !important;
        padding: 0 12px !important;
        background: white !important;
        border: 1px solid #D1D5DB !important;
        border-radius: 6px !important;
        font-size: 16px !important;
      }

      .loan-form-select-content {
        overflow: hidden !important;
        background: white !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        z-index: 1000 !important;
      }

      .loan-form-checkbox-root {
        width: 20px !important;
        height: 20px !important;
        border: 2px solid #D1D5DB !important;
        border-radius: 4px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: white !important;
      }

      .loan-form-checkbox-root[data-state="checked"] {
        background: #4F46E5 !important;
        border-color: #4F46E5 !important;
      }

      .loan-form-checkbox-indicator {
        color: white !important;
      }

      .loan-form-radio-group {
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
      }

      .loan-form-radio-root {
        width: 20px !important;
        height: 20px !important;
        border: 2px solid #D1D5DB !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: white !important;
      }

      .loan-form-radio-root[data-state="checked"] {
        border-color: #4F46E5 !important;
      }

      .loan-form-radio-indicator {
        width: 10px !important;
        height: 10px !important;
        border-radius: 50% !important;
        background: #4F46E5 !important;
      }

      .loan-form-label {
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #374151 !important;
        margin-bottom: 4px !important;
        display: block !important;
      }

      .loan-form-hint {
        font-size: 12px !important;
        color: #6B7280 !important;
        margin-top: 4px !important;
      }

      .phone-input-container {
        position: relative !important;
      }

      .phone-prefix {
        position: absolute !important;
        left: 12px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        color: #000 !important;
        font-size: 16px !important;
        pointer-events: none !important;
      }

      .loan-form-input.phone {
        padding-left: 55px !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
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
    
    // Step 2
    currentLoans: '',
    taxDebt: 'Nav',
    taxDebtAmount: '',
    delayedPayments: 'Nē',
    requiredAmount: '',
    desiredTerm: '',
    urgency: '',
    purpose: [],
    financialProduct: '',
    collateral: [],
    collateralDescription: '',
    otherApplications: 'Nē',
    dataProcessing: false,
    marketing: false
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    requestAnimationFrame(() => {
      setFormData(prev => ({ ...prev, [name]: value }));
    });
  }, []);

  const handleCustomInputChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 8) {
      requestAnimationFrame(() => {
        setFormData(prev => ({ ...prev, phone: value }));
      });
    }
  }, []);

  const handleRegistrationChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    requestAnimationFrame(() => {
      setFormData(prev => ({ ...prev, registrationNumber: value }));
    });
  }, []);

  const FormField = memo(({ label, required, children, hint }) => (
    <div className="mb-4">
      <Label.Root className="loan-form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </Label.Root>
      {children}
      {hint && <p className="loan-form-hint">{hint}</p>}
    </div>
  ));    

  const CustomSelect = ({ name, value, onChange, options, placeholder }) => (
    <Select.Root value={value} onValueChange={(value) => onChange(name, value)}>
      <Select.Trigger className="loan-form-select-trigger">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content className="loan-form-select-content">
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700">
            <ChevronUp className="w-4 h-4" />
          </Select.ScrollUpButton>
          
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select.Viewport>
          
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700">
            <ChevronDown className="w-4 h-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <FormField label="Vārds, Uzvārds" required>
        <Input
          type="text"
          className="loan-form-input"
          value={formData.fullName}
          name="fullName"
          onChange={handleInputChange}
          placeholder="Ievadiet vārdu un uzvārdu"
          required
        />
      </FormField>
  
      <FormField label="E-pasts" required>
        <Input
          type="email"
          className="loan-form-input"
          value={formData.email}
          name="email"
          onChange={handleInputChange}
          placeholder="jusu.epasts@example.com"
          required
        />
      </FormField>
  
      <FormField label="Tālrunis" required>
        <div className="phone-input-container">
          <span className="phone-prefix">+371</span>
          <Input
            type="tel"
            className="loan-form-input phone"
            value={formData.phone}
            name="phone"
            onChange={handlePhoneChange}
            placeholder="12345678"
            required
          />
        </div>
      </FormField>
  
      <FormField label="Uzņēmuma nosaukums" required>
        <Input
          type="text"
          className="loan-form-input"
          value={formData.companyName}
          name="companyName"
          onChange={handleInputChange}
          placeholder="Ievadiet uzņēmuma nosaukumu"
          required
        />
      </FormField>
  
      <FormField label="Reģistrācijas numurs" required>
        <Input
          type="text"
          className="loan-form-input"
          value={formData.registrationNumber}
          name="registrationNumber"
          onChange={handleRegistrationChange}
          placeholder="40001234567"
          required
        />
      </FormField>
  
      <FormField label="Uzņēmuma vecums">
        <CustomSelect
          name="companyAge"
          value={formData.companyAge}
          onChange={handleCustomInputChange}
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
          onChange={handleCustomInputChange}
          placeholder="Izvēlieties apgrozījumu"
          options={[
            { value: '< 200 000', label: '< 200 000' },
            { value: '200 001 - 500 000', label: '200 001 – 500 000' },
            { value: '500 001 - 1 000 000', label: '500 001 – 1 000 000' },
            { value: '> 1 000 000', label: '> 1 000 000' }
          ]}
        />
      </FormField>
  
      <FormField label="Peļņa vai zaudējumi pēdējā gadā">
        <CustomSelect
          name="profitLoss"
          value={formData.profitLoss}
          onChange={handleCustomInputChange}
          placeholder="Izvēlieties rezultātu"
          options={[
            { value: 'Peļņa', label: 'Peļņa' },
            { value: 'Zaudējumi', label: 'Zaudējumi' },
            { value: 'Nav pieejamu datu', label: 'Nav pieejamu datu' }
          ]}
        />
      </FormField>
  
      <FormField label="Jūsu pozīcija uzņēmumā">
        <CustomSelect
          name="position"
          value={formData.position}
          onChange={handleCustomInputChange}
          placeholder="Izvēlieties pozīciju"
          options={[
            { value: 'Īpašnieks', label: 'Īpašnieks' },
            { value: 'Valdes loceklis', label: 'Valdes loceklis' },
            { value: 'Finanšu direktors', label: 'Finanšu direktors' },
            { value: 'Cits', label: 'Cits' }
          ]}
        />
      </FormField>
  
      <FormField 
        label="Pamata darbība" 
        hint="(piemēram: būvniecība, tirdzniecība, ražošana utt.)"
      >
        <textarea
          className="loan-form-input min-h-[100px] resize-none"
          value={formData.mainActivity}
          onChange={(e) => handleInputChange('mainActivity', e.target.value)}
          placeholder="Aprakstiet uzņēmuma pamata darbības veidu"
        />
      </FormField>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <FormField 
        label="Tekošās kredītsaistības" 
        required
        hint="Pamatsummas atlikums EUR, Finanšu iestāde"
      >
        <input
          type="text"
          className="loan-form-input"
          value={formData.currentLoans}
          onChange={(e) => handleInputChange('currentLoans', e.target.value)}
          required
        />
      </FormField>

      <FormField label="Vai uzņēmumam ir nodokļu parāds?">
        <CustomSelect
          name="taxDebt"
          value={formData.taxDebt}
          onChange={handleCustomInputChange}
          placeholder="Izvēlieties"
          options={[
            { value: 'Nav', label: 'Nav' },
            { value: 'Ir, ar VID grafiku', label: 'Ir, ar VID grafiku' },
            { value: 'Ir, bez VID grafika', label: 'Ir, bez VID grafika' }
          ]}
        />
      </FormField>

      {formData.taxDebt !== 'Nav' && (
        <FormField label="Nodokļu parāda summa">
          <input
            type="text"
            className="loan-form-input"
            value={formData.taxDebtAmount}
            onChange={(e) => handleInputChange('taxDebtAmount', e.target.value)}
            placeholder="Ievadiet summu"
          />
        </FormField>
      )}

      <FormField label="Vai pēdējo 12 mēnešu laikā ir bijušas kavētas kredītmaksājumu vai nodokļu maksājumu saistības?">
        <RadioGroup.Root 
          className="loan-form-radio-group"
          value={formData.delayedPayments}
          onValueChange={(value) => handleInputChange('delayedPayments', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroup.Item className="loan-form-radio-root" value="Jā">
              <RadioGroup.Indicator className="loan-form-radio-indicator" />
            </RadioGroup.Item>
            <label>Jā</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroup.Item className="loan-form-radio-root" value="Nē">
              <RadioGroup.Indicator className="loan-form-radio-indicator" />
            </RadioGroup.Item>
            <label>Nē</label>
          </div>
        </RadioGroup.Root>
      </FormField>

      <FormField label="Nepieciešamā summa (EUR)" required>
        <input
          type="text"
          className="loan-form-input"
          value={formData.requiredAmount}
          onChange={(e) => handleInputChange('requiredAmount', e.target.value)}
          required
        />
      </FormField>

      <FormField label="Vēlamais termiņš (mēneši/gadi)" required>
        <input
          type="text"
          className="loan-form-input"
          value={formData.desiredTerm}
          onChange={(e) => handleInputChange('desiredTerm', e.target.value)}
          required
        />
      </FormField>

      <FormField label="Cik ātri nepieciešams finansējums?">
        <input
          type="text"
          className="loan-form-input"
          value={formData.urgency}
          onChange={(e) => handleInputChange('urgency', e.target.value)}
          placeholder="Norādiet steidzamību"
        />
      </FormField>

      <FormField label="Finansējuma mērķis (var būt vairāki)">
        <div className="space-y-2">
          {[
            'Apgrozāmie līdzekļi',
            'Iekārtu iegāde',
            'Nekustamais īpašums',
            'Transportlīdzekļi',
            'Refinansēšana',
            'Cits'
          ].map((purpose) => (
            <div key={purpose} className="flex items-center space-x-2">
              <Checkbox.Root
                className="loan-form-checkbox-root"
                checked={formData.purpose.includes(purpose)}
                onCheckedChange={(checked) => {
                  const newPurposes = checked
                    ? [...formData.purpose, purpose]
                    : formData.purpose.filter(p => p !== purpose);
                  handleInputChange('purpose', newPurposes);
                }}
              >
                <Checkbox.Indicator className="loan-form-checkbox-indicator">
                  <Check className="w-4 h-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label>{purpose}</label>
            </div>
          ))}
        </div>
      </FormField>

      <FormField label="Nepieciešamais finanšu produkts">
        <CustomSelect
          name="financialProduct"
          value={formData.financialProduct}
          onChange={handleCustomInputChange}
          placeholder="Izvēlieties produktu"
          options={[
            { value: 'Aizdevums', label: 'Aizdevums' },
            { value: 'Kredītlīnija', label: 'Kredītlīnija' },
            { value: 'Līzings', label: 'Līzings' },
            { value: 'Faktorings', label: 'Faktorings' },
            { value: 'Cits', label: 'Cits' }
          ]}
        />
      </FormField>

      <FormField label="Piedāvātais nodrošinājums">
        <div className="space-y-2">
          {[
            'Nekustamais īpašums',
            'Transportlīdzekļi',
            'Komercķīla',
            'Nav nodrošinājuma',
            'Cits'
          ].map((collateralType) => (
            <div key={collateralType} className="flex items-center space-x-2">
              <Checkbox.Root
                className="loan-form-checkbox-root"
                checked={formData.collateral.includes(collateralType)}
                onCheckedChange={(checked) => {
                  const newCollateral = checked
                    ? [...formData.collateral, collateralType]
                    : formData.collateral.filter(c => c !== collateralType);
                  handleInputChange('collateral', newCollateral);
                }}
              >
                <Checkbox.Indicator className="loan-form-checkbox-indicator">
                  <Check className="w-4 h-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label>{collateralType}</label>
            </div>
          ))}
        </div>
      </FormField>

      <FormField label="Aprakstiet piedāvāto nodrošinājumu">
        <textarea
          className="loan-form-input min-h-[100px] resize-none"
          value={formData.collateralDescription}
          onChange={(e) => handleInputChange('collateralDescription', e.target.value)}
          placeholder="Sniedziet detalizētu aprakstu"
        />
      </FormField>

      <FormField label="Vai pēdējo 3 mēnešu laikā esat vērsušies citā finanšu iestādē?">
        <RadioGroup.Root 
          className="loan-form-radio-group"
          value={formData.otherApplications}
          onValueChange={(value) => handleInputChange('otherApplications', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroup.Item className="loan-form-radio-root" value="Jā">
              <RadioGroup.Indicator className="loan-form-radio-indicator" />
            </RadioGroup.Item>
            <label>Jā</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroup.Item className="loan-form-radio-root" value="Nē">
              <RadioGroup.Indicator className="loan-form-radio-indicator" />
            </RadioGroup.Item>
            <label>Nē</label>
          </div>
        </RadioGroup.Root>
      </FormField>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox.Root
            className="loan-form-checkbox-root"
            checked={formData.dataProcessing}
            onCheckedChange={(checked) => handleInputChange('dataProcessing', checked)}
            required
          >
            <Checkbox.Indicator className="loan-form-checkbox-indicator">
              <Check className="w-4 h-4" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label>Piekrītu datu apstrādei</label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox.Root
            className="loan-form-checkbox-root"
            checked={formData.marketing}
            onCheckedChange={(checked) => handleInputChange('marketing', checked)}
          >
            <Checkbox.Indicator className="loan-form-checkbox-indicator">
              <Check className="w-4 h-4" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label>Vēlos saņemt mārketinga ziņas</label>
        </div>
      </div>
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="loan-form-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {step === 1 ? 'Kontaktinformācija un Uzņēmuma informācija' : 'Aizdevuma vajadzības'}
        </h2>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? renderStep1() : renderStep2()}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Iepriekšējais
            </button>
          )}
          
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center ml-auto"
            >
              Nākamais
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center ml-auto"
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