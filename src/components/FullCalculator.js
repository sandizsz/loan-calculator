import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { ChevronRight, ChevronLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';

// Fixed SelectItem component with proper ref handling
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

SelectItem.displayName = 'SelectItem';

const FullCalculator = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [kredits, setKredits] = useState([]);

  // Load WordPress data for kredits
  useEffect(() => {
    const wpData = window.loanCalculatorData || {};
    
    if (wpData.kredits && Array.isArray(wpData.kredits)) {
      const secureKredits = wpData.kredits.map(kredit => ({
        ...kredit,
        icon: kredit.icon ? kredit.icon.replace('http://', 'https://') : null
      }));
      setKredits(secureKredits);
    }
  }, []);

  // Get URL parameters and match kredit title
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const wpData = window.loanCalculatorData || {};
    const kreditId = params.get('kredit_id');
    let matchedKreditTitle = '';

    if (kreditId && wpData.kredits && Array.isArray(wpData.kredits)) {
      const matchingKredit = wpData.kredits.find(k => k.id.toString() === kreditId);
      if (matchingKredit) {
        matchedKreditTitle = matchingKredit.title;
      }
    }
    
    return {
      amount: params.get('amount') || '',
      term: params.get('term') || '',
      email: params.get('email') || '',
      phone: params.get('phone') || '',
      kredit_id: matchedKreditTitle
    };
  };

  // Get initial values from URL or defaults
  const urlParams = getUrlParams();

  // Form setup with proper validation
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    mode: 'onSubmit',        // Only validate when leaving a field, not during typing
    reValidateMode: 'onBlur', // Only re-validate on submit
    criteriaMode: 'firstError',
    defaultValues: {
      financialProduct: urlParams.kredit_id,
      loanAmount: urlParams.amount,
      loanTerm: urlParams.term,
      email: urlParams.email,
      phone: urlParams.phone,
      hasAppliedElsewhere: '',
      collateralType: '',
      collateralDescription: '',
      financingPurposes: [],
      contactName: 'John Doe',
      companyName: 'Test Company SIA',
      regNumber: '40000000000',
      companyAge: '6-12',
      annualTurnover: '200k-500k',
      profitLossStatus: 'profit',
      companyPosition: 'owner',
      coreActivity: 'Tirdzniecība ar būvmateriāliem',
    },
    shouldFocusError: false, // Prevent automatic focus on error fields
  });


  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      h2 {
        font-family: inherit !important;
        font-size: 2.25rem !important;
        font-weight: 700 !important;
        color: #1F2937 !important;
        margin-bottom: 0.5rem !important;
        line-height: 1.2 !important;
        text-align: center !important;
      }

      h3 {
        font-size: 1.125rem !important;
        color: #6B7280 !important;
        text-align: center !important;
        margin-bottom: 2.5rem !important;
      }

      /* Base form container */
      .loan-form-container {
        background: #ffffff !important;
        border-radius: 16px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        padding: 2.5rem !important;
        max-width: 800px !important;
        margin: 2rem auto !important;
      }

      /* Form inputs */
      .loan-form-input {
        display: block !important;
        width: 100% !important;
        height: 56px !important;
        padding: 1rem !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
        color: #1f2937 !important;
        background-color: #ffffff !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 8px !important;
        transition: all 0.2s ease-in-out !important;
      }

      .loan-form-input[aria-invalid="true"] {
        border-color: #dc2626 !important;
      }

      .loan-form-input::placeholder {
        color: #9CA3AF !important;
      }

      .loan-form-input:focus {
        outline: none !important;
        border-color: #2563eb !important;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
      }

      /* Multi-select checkbox styling */
      .loan-form-checkbox-group {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
        gap: 0.75rem !important;
      }

      .loan-form-checkbox-wrapper {
        display: flex !important;
        align-items: center !important;
        padding: 0.5rem !important;
        border-radius: 0.375rem !important;
        transition: background-color 0.2s !important;
      }

      .loan-form-checkbox-wrapper:hover {
        background-color: #f3f4f6 !important;
      }

      .loan-form-checkbox-root {
        width: 1.25rem !important;
        height: 1.25rem !important;
        border-radius: 0.25rem !important;
        border: 2px solid #d1d5db !important;
        background-color: white !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
      }

      .loan-form-checkbox-root[data-state='checked'] {
        border-color: #2563eb !important;
        background-color: #2563eb !important;
      }

      .loan-form-checkbox-indicator {
        color: white !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .loan-form-input:disabled {
        background-color: #f3f4f6 !important;
        cursor: not-allowed !important;
      }




      
   /* Custom Select styling */
/* RESET the select styling completely */
.loan-form-select-trigger {
  all: unset !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  height: 56px !important;
  padding: 0 1rem !important;
  background-color: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  color: #1f2937 !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
}

.loan-form-select-trigger[data-placeholder] {
  color: #9CA3AF !important;
}

.loan-form-select-trigger[aria-invalid="true"] {
  border-color: #dc2626 !important;
}

.loan-form-select-trigger:focus {
  outline: none !important;
  border-color: #2563eb !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
}

/* Fix dropdown positioning and styling */
.loan-form-select-content {
  background-color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  z-index: 1000 !important;
  overflow: hidden !important;
  width: var(--radix-select-trigger-width) !important;
  max-height: 300px !important;
  animation-duration: 0.6s !important;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Ensure the portal content is positioned correctly */
.SelectPortal {
  position: fixed; /* Ensure the portal is fixed in the viewport */
  z-index: 1000; /* Ensure it appears above other content */
}

/* Select item styling */
.select-item {
  font-size: 1rem !important;
  line-height: 1.5 !important;
  display: flex !important;
  align-items: center !important;
  padding: 0.5rem 1rem !important;
  position: relative !important;
  user-select: none !important;
  color: #1f2937 !important;
}

.select-item:hover {
  background-color: #f3f4f6 !important;
  cursor: pointer !important;
}

/* Simple dropdown animations */
@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Override Elementor button styles for loan term unit toggle */
.loan-term-unit-toggle [type=button] {
  display: block !important;
  font-weight: normal !important;
  color: #4B5563 !important;
  text-align: center !important;
  white-space: nowrap !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  user-select: none !important;
  background-color: transparent !important;
  border: none !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.875rem !important;
  border-radius: 0.5rem !important;
  transition: all 0.2s ease-in-out !important;
}

.loan-term-unit-toggle [type=button][data-state=checked] {
  background-color: white !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}
}

.loan-form-select-content[data-side="bottom"] {
  animation-name: slideDownAndFade !important;
}

.loan-form-select-content[data-side="top"] {
  animation-name: slideUpAndFade !important;
}






      /* Checkbox styling */
      .loan-form-checkbox-root {
        all: unset !important;
        width: 24px !important;
        height: 24px !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
      }

      .loan-form-checkbox-root[data-state="checked"] {
        background-color: #2563eb !important;
        border-color: #2563eb !important;
      }

      .loan-form-checkbox-indicator {
        color: white !important;
      }

      /* Radio button styling */
      .loan-form-radio-root {
        all: unset !important;
        width: 24px !important;
        height: 24px !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
      }

      .loan-form-radio-root[data-state="checked"] {
        border-color: #2563eb !important;
      }

      .loan-form-radio-indicator {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 12px !important;
        height: 12px !important;
        border-radius: 50% !important;
        background-color: #2563eb !important;
      }

      /* Labels */
      .loan-form-label {
        display: block !important;
        margin-bottom: 0.75rem !important;
        font-size: 1rem !important;
        font-weight: 500 !important;
        color: #374151 !important;
      }

      /* Form field container */
      .form-field {
        margin-bottom: 1.5rem !important;
      }

      /* Error messages */
      .loan-form-error {
        margin-top: 0.5rem !important;
        font-size: 0.875rem !important;
        color: #dc2626 !important;
        font-weight: 500 !important;
      }

      /* Helper text */
      .form-helper-text {
        margin-top: 0.375rem !important;
        font-size: 0.875rem !important;
        color: #6B7280 !important;
      }

      /* Buttons */
      .loan-form-button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0.75rem 1.5rem !important;
        font-size: 1rem !important;
        font-weight: 500 !important;
        color: white !important;
        background-color: #2563eb !important;
        border: none !important;
        border-radius: 0.5rem !important;
        cursor: pointer !important;
        transition: all 0.2s ease-in-out !important;
      }

      .loan-form-button:hover {
        background-color: #4338ca !important;
      }

      .loan-form-button:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
      }

      /* Progress bar */
      .loan-form-progress {
        height: 0.25rem !important;
        background-color: #e5e7eb !important;
        border-radius: 9999px !important;
        margin: 1rem 0 2rem !important;
        width: 300px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .loan-form-progress-bar {
        height: 100% !important;
        background-color: #2563eb !important;
        border-radius: 9999px !important;
        transition: width 0.3s ease-in-out !important;
        opacity: 0.8 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Form submission function
  const submitForm = async (data) => {
    try {
      // Add your API endpoint here
      const response = await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'submit_loan_application',
          nonce: loanCalculatorData.nonce,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Neizdevās nosūtīt pieteikumu. Lūdzu, mēģiniet vēlreiz.');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Neizdevās nosūtīt pieteikumu. Lūdzu, mēģiniet vēlreiz.');
      }

      // Reset form and show success message
      alert('Paldies! Jūsu pieteikums ir veiksmīgi nosūtīts.');
      setStep(1);
      reset();
    } catch (error) {
      throw new Error('Neizdevās nosūtīt pieteikumu: ' + error.message);
    }
  };

  // Form submission handler with proper error handling
  // Handle phone input to only allow digits


  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Move to next step or submit
      if (step < 2) {
        setStep(step + 1);
      } else {
        // Add your API call here
        await submitForm(data);
      }
    } catch (err) {
      setError(err.message || 'Kļūda, lūdzu mēģiniet vēlāk');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom field component with error handling
  const FormField = ({ name, label, required, children, hint }) => (
    <div className="form-field">
      <Label.Root className="loan-form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </Label.Root>
      {children}
      {hint && <p className="form-helper-text">{hint}</p>}
      {errors[name] && (
        <p className="loan-form-error">
          {errors[name].message}
        </p>
      )}
    </div>
  );

  const renderStep1 = () => (
    <>

<FormField
        name="contactName"
        label="Kontaktpersonas vārds, uzvārds"
        required
      >
        <input
          type="text"
          className="loan-form-input"
          aria-invalid={errors.contactName ? 'true' : 'false'}
          {...register('contactName', { required: 'Šis lauks ir obligāts' })}
        />
      </FormField>

      <FormField
  name="email"
  label="E-pasta adrese"
  required
>
<input
  type="email"
  className="loan-form-input"
  placeholder="example@domain.com"
  aria-invalid={errors.email ? 'true' : 'false'}
  {...register('email', {
    required: 'Šis lauks ir obligāts',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Lūdzu, ievadiet derīgu e-pasta adresi'
    }
  })}
/>
</FormField>


<FormField
        name="phone"
        label="Telefona numurs"
        required
        hint="Ievadiet 8 ciparu telefona numuru"
      >
        <div className="relative w-full">
          <div className="absolute left-0 flex items-center justify-center h-full pointer-events-none pl-4">

          </div>
          <input
  type="tel"
  className="loan-form-input pl-16"
  maxLength="8"
  placeholder="12345678"
  aria-invalid={errors.phone ? 'true' : 'false'}
  {...register('phone', {
    required: 'Šis lauks ir obligāts',
    pattern: {
      value: /^[0-9]{8}$/,
      message: 'Lūdzu, ievadiet 8 ciparu telefona numuru'
    }
  })}
/>
        </div>
      </FormField>
   
      <FormField
        name="companyName"
        label="Uzņēmuma nosaukums"
        required
      >
        <input
          type="text"
          className="loan-form-input"
          aria-invalid={errors.companyName ? 'true' : 'false'}
          {...register('companyName', { required: 'Šis lauks ir obligāts' })}
        />
      </FormField>

      <FormField
        name="regNumber"
        label="Reģistrācijas numurs"
        required
      >
        <input
          type="text"
          className="loan-form-input"
          aria-invalid={errors.regNumber ? 'true' : 'false'}
          {...register('regNumber', { required: 'Šis lauks ir obligāts' })}
        />
      </FormField>

    

    

    

<FormField
  name="companyAge"
  label="Uzņēmuma vecums"
  required
>
  <div className="w-full relative">
    <Select.Root 
      value={watch('companyAge')} 
      onValueChange={(value) => {
        setValue('companyAge', value, { shouldValidate: true });
      }}
    >
      <Select.Trigger 
        className="loan-form-select-trigger"
        aria-invalid={errors.companyAge ? 'true' : 'false'}
        {...register('companyAge', { required: 'Šis lauks ir obligāts' })}
      >
        <Select.Value placeholder="Izvēlieties vecumu" className="text-gray-400" />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content 
          className="loan-form-select-content" 
          position="popper" 
          sideOffset={8}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronUp className="w-4 h-4" />
          </Select.ScrollUpButton>
          
          <Select.Viewport className="p-2">
            <SelectItem value="0-6">Līdz 6 mēnešiem</SelectItem>
            <SelectItem value="6-12">6-12 mēneši</SelectItem>
            <SelectItem value="1-2">1-2 gadi</SelectItem>
            <SelectItem value="2-3">2-3 gadi</SelectItem>
            <SelectItem value="3+">Vairāk kā 3 gadi</SelectItem>
          </Select.Viewport>
          
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronDown className="w-4 h-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
</FormField>

<FormField
  name="annualTurnover"
  label="Apgrozījums pēdējā gadā (EUR)"
  required
>
  <div className="w-full relative">
    <Select.Root 
      value={watch('annualTurnover')} 
      onValueChange={(value) => {
        setValue('annualTurnover', value, { shouldValidate: true });
      }}
    >
      <Select.Trigger 
        className="loan-form-select-trigger"
        aria-invalid={errors.annualTurnover ? 'true' : 'false'}
        {...register('annualTurnover', { required: 'Šis lauks ir obligāts' })}
      >
        <Select.Value placeholder="Izvēlieties apgrozījumu" className="text-gray-400" />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content 
          className="loan-form-select-content" 
          position="popper" 
          sideOffset={8}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronUp className="w-4 h-4" />
          </Select.ScrollUpButton>
          
          <Select.Viewport className="p-2">
            <SelectItem value="lt200k">&lt; 200 000</SelectItem>
            <SelectItem value="200k-500k">200 001 – 500 000</SelectItem>
            <SelectItem value="500k-1m">500 001 – 1 000 000</SelectItem>
            <SelectItem value="gt1m">&gt; 1 000 000</SelectItem>
          </Select.Viewport>
          
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronDown className="w-4 h-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
</FormField>

<FormField
  name="profitLossStatus"
  label="Peļņa vai zaudējumi pēdējā gadā"
  required
>
  <div className="w-full relative">
    <Select.Root 
      value={watch('profitLossStatus')} 
      onValueChange={(value) => {
        setValue('profitLossStatus', value, { shouldValidate: true });
      }}
    >
      <Select.Trigger 
        className="loan-form-select-trigger"
        aria-invalid={errors.profitLossStatus ? 'true' : 'false'}
        {...register('profitLossStatus', { required: 'Šis lauks ir obligāts' })}
      >
        <Select.Value placeholder="Izvēlieties statusu" className="text-gray-400" />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content 
          className="loan-form-select-content" 
          position="popper" 
          sideOffset={8}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronUp className="w-4 h-4" />
          </Select.ScrollUpButton>
          
          <Select.Viewport className="p-2">
            <SelectItem value="profit">Peļņa</SelectItem>
            <SelectItem value="loss">Zaudējumi</SelectItem>
            <SelectItem value="noData">Nav pieejamu datu</SelectItem>
          </Select.Viewport>
          
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronDown className="w-4 h-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
</FormField>

<FormField
  name="companyPosition"
  label="Jūsu pozīcija uzņēmumā"
  required
>
  <div className="w-full relative">
    <Select.Root 
      value={watch('companyPosition')} 
      onValueChange={(value) => {
        setValue('companyPosition', value, { shouldValidate: true });
      }}
    >
      <Select.Trigger 
        className="loan-form-select-trigger"
        aria-invalid={errors.companyPosition ? 'true' : 'false'}
        {...register('companyPosition', { required: 'Šis lauks ir obligāts' })}
      >
        <Select.Value placeholder="Izvēlieties pozīciju" className="text-gray-400" />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content 
          className="loan-form-select-content" 
          position="popper" 
          sideOffset={8}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronUp className="w-4 h-4" />
          </Select.ScrollUpButton>
          
          <Select.Viewport className="p-2">
            <SelectItem value="owner">Īpašnieks</SelectItem>
            <SelectItem value="board">Valdes loceklis</SelectItem>
            <SelectItem value="finance">Finanšu direktors</SelectItem>
            <SelectItem value="other">Cits</SelectItem>
          </Select.Viewport>
          
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronDown className="w-4 h-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
</FormField>

<FormField
  name="coreActivity"
  label="Pamata darbība (īss apraksts)"
  required
>
  <textarea
    className="loan-form-input min-h-[100px] resize-none"
    placeholder="(piemēram: būvniecība, tirdzniecība, ražošana utt.)"
    aria-invalid={errors.coreActivity ? 'true' : 'false'}
    {...register('coreActivity', { required: 'Šis lauks ir obligāts' })}
  />
</FormField>

    </>

    
  );

  const renderStep2 = () => (
    <>
      <FormField
        name="loanAmount"
        label="Nepieciešamā aizdevuma summa (EUR)"
        required
      >
        <input
          type="number"
          className="loan-form-input"
          min="1000"
          max="1000000"
          {...register('loanAmount', { 
            required: 'Šis lauks ir obligāts',
            min: {
              value: 1000,
              message: 'Minimālā summa ir €1,000'
            },
            max: {
              value: 1000000,
              message: 'Maksimālā summa ir €1,000,000'
            }
          })}
        />
      </FormField>

      <FormField
        name="loanTerm"
        label="Vēlamais aizdevuma termiņš"
        required
      >
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="loan-form-input"
              placeholder="Ievadiet termiņu"
              aria-invalid={errors.loanTerm ? 'true' : 'false'}
              {...register('loanTerm', { 
                required: 'Šis lauks ir obligāts',
                validate: (value) => {
                  const num = parseFloat(value);
                  if (isNaN(num)) return 'Lūdzu, ievadiet skaitli';
                  
                  const isYears = watch('loanTermUnit') === 'years';
                  const min = 1;
                  const max = isYears ? 10 : 120;
                  
                  if (num < min) return isYears ? 'Minimālais termiņš ir 1 gads' : 'Minimālais termiņš ir 1 mēnesis';
                  if (num > max) return isYears ? 'Maksimālais termiņš ir 10 gadi' : 'Maksimālais termiņš ir 120 mēneši';
                  return true;
                }
              })}
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1 loan-term-unit-toggle">
            <RadioGroup.Root 
              className="flex"
              value={watch('loanTermUnit') || 'months'}
              onValueChange={(value) => {
                const currentTerm = watch('loanTerm');
                const oldUnit = watch('loanTermUnit');
                setValue('loanTermUnit', value);
                
                // Only convert if there's a value and we're actually changing units
                if (currentTerm && oldUnit && oldUnit !== value) {
                  const numericTerm = parseFloat(currentTerm);
                  if (!isNaN(numericTerm)) {
                    if (value === 'years' && oldUnit === 'months') {
                      setValue('loanTerm', Math.round(numericTerm / 12));
                    } else if (value === 'months' && oldUnit === 'years') {
                      setValue('loanTerm', numericTerm * 12);
                    }
                  }
                }
              }}
            >
              <div className="flex items-center">
                <RadioGroup.Item 
                  value="months" 
                  className="px-3 py-1 rounded-md focus:outline-none data-[state=checked]:bg-white data-[state=checked]:shadow-sm"
                >
                  <span className="text-sm font-medium">Mēneši</span>
                </RadioGroup.Item>
              </div>
              <div className="flex items-center">
                <RadioGroup.Item 
                  value="years" 
                  className="px-3 py-1 rounded-md focus:outline-none data-[state=checked]:bg-white data-[state=checked]:shadow-sm"
                >
                  <span className="text-sm font-medium">Gadi</span>
                </RadioGroup.Item>
              </div>
            </RadioGroup.Root>
          </div>
        </div>
      </FormField>

      <FormField
  name="loanPurpose"
  label="Aizdevuma mērķis"
  required
>
  <div className="w-full relative">
    <Select.Root 
      value={watch('loanPurpose')} 
      onValueChange={(value) => {
        setValue('loanPurpose', value, { shouldValidate: true });
      }}
    >
      <Select.Trigger 
        className={`loan-form-select-trigger ${errors.loanPurpose ? 'border-red-500' : ''}`}
        {...register('loanPurpose', { required: 'Šis lauks ir obligāts' })}
      >
        <Select.Value placeholder="Izvēlieties mērķi" className="text-gray-400" />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content 
          className="loan-form-select-content" 
          position="popper" 
          sideOffset={8}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronUp className="w-4 h-4" />
          </Select.ScrollUpButton>
          
          <Select.Viewport className="p-2">
            <SelectItem value="apgrozamie">Apgrozāmie līdzekļi</SelectItem>
            <SelectItem value="pamatlidzekli">Pamatlīdzekļu iegāde</SelectItem>
            <SelectItem value="refinansesana">Kredītu refinansēšana</SelectItem>
            <SelectItem value="projekti">Projektu finansēšana</SelectItem>
            <SelectItem value="cits">Cits mērķis</SelectItem>
          </Select.Viewport>
          
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
            <ChevronDown className="w-4 h-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    
  </div>
</FormField>

      <FormField
        name="taxDebtStatus"
        label="Vai uzņēmumam ir nodokļu parāds?"
        required
      >
        <div className="w-full relative">
          <Select.Root 
            value={watch('taxDebtStatus')} 
            onValueChange={(value) => {
              setValue('taxDebtStatus', value, { shouldValidate: true });
            }}
          >
            <Select.Trigger 
              className="loan-form-select-trigger"
              aria-invalid={errors.taxDebtStatus ? 'true' : 'false'}
              {...register('taxDebtStatus', { required: 'Šis lauks ir obligāts' })}
            >
              <Select.Value placeholder="Izvēlieties statusu" className="text-gray-400" />
              <Select.Icon>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content 
                className="loan-form-select-content" 
                position="popper" 
                sideOffset={8}
              >
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronUp className="w-4 h-4" />
                </Select.ScrollUpButton>
                
                <Select.Viewport className="p-2">
                  <SelectItem value="no">Nav</SelectItem>
                  <SelectItem value="withSchedule">Ir, ar VID grafiku</SelectItem>
                  <SelectItem value="withoutSchedule">Ir, bez VID grafika</SelectItem>
                </Select.Viewport>
                
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronDown className="w-4 h-4" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </FormField>

      {watch('taxDebtStatus') && watch('taxDebtStatus') !== 'no' && (
        <FormField
          name="taxDebtAmount"
          label="Nodokļu parāda summa (EUR)"
          required
        >
          <input
            type="number"
            className="loan-form-input"
            placeholder="Ievadiet summu"
            aria-invalid={errors.taxDebtAmount ? 'true' : 'false'}
            {...register('taxDebtAmount', { 
              required: 'Šis lauks ir obligāts',
              min: {
                value: 0,
                message: 'Summai jābūt lielākai par 0'
              }
            })}
          />
        </FormField>
      )}

      <FormField
        name="hadPaymentDelays"
        label="Vai pēdējo 12 mēnešu laikā ir bijušas kavētas kredītmaksājumu vai nodokļu maksājumu saistības? *"
        required
      >
        <RadioGroup.Root 
          className="flex gap-4"
          defaultValue={watch('hadPaymentDelays')}
          onValueChange={(value) => setValue('hadPaymentDelays', value)}
        >
          <div className="flex items-center">
            <RadioGroup.Item 
              value="yes" 
              className="loan-form-radio-root"
              id="hadPaymentDelays-yes"
            >
              <RadioGroup.Indicator className="loan-form-radio-indicator" />
            </RadioGroup.Item>
            <label className="pl-2" htmlFor="hadPaymentDelays-yes">Jā</label>
          </div>
          <div className="flex items-center">
            <RadioGroup.Item 
              value="no" 
              className="loan-form-radio-root"
              id="hadPaymentDelays-no"
            >
              <RadioGroup.Indicator className="loan-form-radio-indicator" />
            </RadioGroup.Item>
            <label className="pl-2" htmlFor="hadPaymentDelays-no">Nē</label>
          </div>
        </RadioGroup.Root>
      </FormField>

      
      <FormField
        name="financialProduct"
        label="Nepieciešamais finanšu produkts"
        required
      >
        <div className="w-full relative">
          <Select.Root 
            value={watch('financialProduct')} 
            onValueChange={(value) => setValue('financialProduct', value, { shouldValidate: true })}
          >
            <Select.Trigger 
              className="loan-form-select-trigger"
              aria-invalid={errors.financialProduct ? 'true' : 'false'}
              {...register('financialProduct', { required: 'Šis lauks ir obligāts' })}
            >
              <Select.Value placeholder="Izvēlieties produktu" className="text-gray-400" />
              <Select.Icon>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content 
                className="loan-form-select-content" 
                position="popper" 
                sideOffset={8}
              >
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronUp className="w-4 h-4" />
                </Select.ScrollUpButton>
                
                <Select.Viewport className="p-2">
                {window.loanCalculatorData?.kredits?.map((kredit) => (
                  <SelectItem key={kredit.id} value={kredit.title}>
                    <div className="flex items-center gap-2">
                      {kredit.icon && (
                        <img 
                          src={kredit.icon} 
                          alt=""
                          className="w-4 h-4 object-contain"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      {kredit.title}
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="Cits finanšu produkts">Cits finanšu produkts</SelectItem>
              </Select.Viewport>
                
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronDown className="w-4 h-4" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </FormField>

      <FormField
        name="financingPurposes"
        label="Finansējuma mērķis (var būt vairāki)"
        required
        {...register('financingPurposes', { 
          required: 'Lūdzu, izvēlieties vismaz vienu mērķi',
          validate: value => {
            if (!Array.isArray(value) || value.length === 0) {
              return 'Lūdzu, izvēlieties vismaz vienu mērķi';
            }
            return true;
          }
        })}
      >
        <div className="loan-form-checkbox-group border border-gray-200 rounded-lg p-4">
          {[
            { id: 'working-capital', label: 'Apgrozāmie līdzekļi' },
            { id: 'equipment', label: 'Iekārtu iegāde' },
            { id: 'real-estate', label: 'Nekustamais īpašums' },
            { id: 'vehicles', label: 'Transportlīdzekļi' },
            { id: 'refinancing', label: 'Refinansēšana' },
            { id: 'other', label: 'Cits' }
          ].map((purpose) => (
            <div key={purpose.id} className="loan-form-checkbox-wrapper">
              <Checkbox.Root
                className="loan-form-checkbox-root"
                id={`purpose-${purpose.id}`}
                onCheckedChange={(checked) => {
                  const currentPurposes = watch('financingPurposes') || [];
                  if (checked) {
                    setValue('financingPurposes', [...currentPurposes, purpose.id]);
                  } else {
                    setValue('financingPurposes', currentPurposes.filter(p => p !== purpose.id));
                  }
                }}
                checked={(watch('financingPurposes') || []).includes(purpose.id)}
              >
                <Checkbox.Indicator className="loan-form-checkbox-indicator">
                  <Check className="w-4 h-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label 
                className="pl-2 text-sm text-gray-700" 
                htmlFor={`purpose-${purpose.id}`}
              >
                {purpose.label}
              </label>
            </div>
          ))}
        </div>
        {errors.financingPurposes && (
          <div className="text-red-500 text-sm mt-1">
            Lūdzu, izvēlieties vismaz vienu mērķi
          </div>
        )}
      </FormField>

      <FormField
        name="collateralType"
        label="Piedāvātais nodrošinājums"
        required
      >
        <div className="w-full relative">
          <Select.Root 
            value={watch('collateralType')} 
            onValueChange={(value) => setValue('collateralType', value, { shouldValidate: true })}
          >
            <Select.Trigger 
              className="loan-form-select-trigger"
              aria-invalid={errors.collateralType ? 'true' : 'false'}
              {...register('collateralType', { required: 'Šis lauks ir obligāts' })}
            >
              <Select.Value placeholder="Izvēlieties nodrošinājuma veidu" className="text-gray-400" />
              <Select.Icon>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content 
                className="loan-form-select-content" 
                position="popper" 
                sideOffset={8}
              >
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronUp className="w-4 h-4" />
                </Select.ScrollUpButton>
                
                <Select.Viewport className="p-2">
                  <SelectItem value="real-estate">Nekustamais īpašums</SelectItem>
                  <SelectItem value="vehicles">Transportlīdzekļi</SelectItem>
                  <SelectItem value="commercial-pledge">Komercķīla</SelectItem>
                  <SelectItem value="none">Nav nodrošinājuma</SelectItem>
                  <SelectItem value="other">Cits</SelectItem>
                </Select.Viewport>
                
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronDown className="w-4 h-4" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </FormField>

      {watch('collateralType') && watch('collateralType') !== 'none' && (
        <FormField
          name="collateralDescription"
          label="Aprakstiet piedāvāto nodrošinājumu"
          required
        >
          <textarea
            className="loan-form-input min-h-[100px] resize-none"
            placeholder="Lūdzu, sniedziet detalizētu informāciju par piedāvāto nodrošinājumu"
            aria-invalid={errors.collateralDescription ? 'true' : 'false'}
            {...register('collateralDescription', { 
              required: 'Šis lauks ir obligāts',
              minLength: {
                value: 10,
                message: 'Lūdzu, sniedziet detalizētāku aprakstu'
              }
            })}
          />
        </FormField>
      )}

      <FormField
        name="hasAppliedElsewhere"
        label="Vai pēdējo 3 mēnešu laikā esat vērušies citā finanšu iestādē?"
        required
      >
        <RadioGroup.Root 
          className="flex gap-4"
          defaultValue={watch('hasAppliedElsewhere')}
          onValueChange={(value) => setValue('hasAppliedElsewhere', value)}
        >
          <div className="flex items-center">
            <RadioGroup.Item 
              value="yes" 
              className="loan-form-radio-root"
              id="hasAppliedElsewhere-yes"
            >
              <RadioGroup.Indicator className="loan-form-radio-indicator" />
            </RadioGroup.Item>
            <label className="pl-2" htmlFor="hasAppliedElsewhere-yes">Jā</label>
          </div>
          <div className="flex items-center">
            <RadioGroup.Item 
              value="no" 
              className="loan-form-radio-root"
              id="hasAppliedElsewhere-no"
            >
              <RadioGroup.Indicator className="loan-form-radio-indicator" />
            </RadioGroup.Item>
            <label className="pl-2" htmlFor="hasAppliedElsewhere-no">Nē</label>
          </div>
        </RadioGroup.Root>
      </FormField>

      <FormField
        name="gdprConsent"
        label="Piekrītu personas datu apstrādei"
        required
      >
        <div className="flex items-center">
          <Checkbox.Root 
            className="loan-form-checkbox-root"
            onCheckedChange={(checked) => setValue('gdprConsent', checked)}
          >
            <Checkbox.Indicator className="loan-form-checkbox-indicator">
              <Check className="w-4 h-4" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label className="pl-2 text-sm text-gray-600">
            Piekrītu, ka mani personas dati tiks apstrādāti saskaņā ar privātuma politiku
          </label>
        </div>
      </FormField>
    </>
  );

  return (
    <div className="loan-form-container">
      <div className="mb-8">
      <div className="loan-form-progress">
          <div
            className="loan-form-progress-bar"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {step === 1 ? 'Kontaktinformācija un Uzņēmuma informācija' : 'Aizdevuma vajadzības'}
        </h2>
     
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 ? renderStep1() : renderStep2()}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="loan-form-button bg-gray-500"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Iepriekšējais
            </button>
          )}
          
          <button
            type="submit"
            className="loan-form-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Apstrādā...' : step === 2 ? 'Iesniegt' : 'Nākamais'}
            {step < 2 && <ChevronRight className="w-5 h-5 ml-2" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FullCalculator;