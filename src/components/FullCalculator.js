import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
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
  const [isSuccess, setIsSuccess] = useState(false);

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

  const onSubmit = async (data) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    // Final submission
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare basic data for Pipedrive
      // Log all form data for debugging
      console.log('Form data before submission:', data);
      console.log('Financial product value:', data.financialProduct);
      
      const pipedriveData = {
        title: `Aizdevuma pieteikums - ${data.companyName}`,
        company_name: data.companyName,
        reg_number: data.regNumber,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone,
        company_position: data.companyPosition,
        company_age: data.companyAge,
        annual_turnover: data.annualTurnover,
        profit_loss_status: data.profitLossStatus,
        core_activity: data.coreActivity,
        loan_amount: parseFloat(data.loanAmount.replace(/[^0-9.]/g, '')), // Clean and convert to number
        loan_term: `${data.loanTerm} mēneši`,
        loan_purpose: data.loanPurpose,
        collateral_type: data.collateralType,
        collateral_description: data.collateralDescription,
        has_applied_elsewhere: data.hasAppliedElsewhere ? 'Jā' : 'Nē',
        financial_product: data.financialProduct || ''
      };
      
      // Double check the financial product is being included
      if (!pipedriveData.financial_product) {
        console.warn('Financial product is empty in submission data');
      }

      console.log('Sending data to backend:', pipedriveData);
      
      const response = await axios.post('/wp-json/loan-calculator/v1/submit', pipedriveData);

      if (response.data.success) {
        setIsSuccess(true);
        reset();
        // Show success message
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to submit application');
      }
    } catch (err) {
      let errorMessage = 'Kļūda iesniedzot formu. Lūdzu, mēģiniet vēlreiz.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Form submission error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        data: err.response?.data
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      /* Typography */
      h2 {
        font-family: inherit !important;
        font-size: 2.5rem !important;
        font-weight: 700 !important;
        color: #1F2937 !important;
        margin-bottom: 0.75rem !important;
        line-height: 1.2 !important;
        text-align: center !important;
      }

      h3 {
        font-size: 1.25rem !important;
        color: #4B5563 !important;
        text-align: center !important;
        margin-bottom: 2rem !important;
        font-weight: 500 !important;
      }

      h4 {
        font-size: 1.125rem !important;
        font-weight: 600 !important;
        color: #374151 !important;
        margin-bottom: 1rem !important;
      }
      
      /* Elementor Button Overrides - Only for form navigation and submit buttons */
      .loan-form-container form > .flex.flex-col > button[type="button"],
      .loan-form-container form > .flex.flex-col > button[type="submit"] {
        background-color: #FFC600 !important;
        color: #000000 !important;
        border: none !important;
        border-radius: 0.5rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease-in-out !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .loan-form-container form > .flex.flex-col > button[type="submit"] {
        width: 100% !important;
        padding: 1rem 1.5rem !important;
        background-color: #FFC600 !important;
        color: #000000 !important;
        border-radius: 0.5rem !important;
        font-weight: 500 !important;
      }
      
      .loan-form-container form > .flex.flex-col > button[type="submit"]:hover {
        background-color: #E6B400 !important;
      }
      
      /* Make sure dropdown buttons are not affected */
      .loan-form-select-trigger,
      [data-radix-select-trigger],
      [data-radix-popper-content-wrapper] button {
        background-color: initial !important;
        color: initial !important;
        display: initial !important;
        width: initial !important;
      }
      
      /* Step Numbers */
      .loan-form-container .rounded-lg {
        border-radius: 0.5rem !important;
      }

      /* Base form container */
      .loan-form-container {
        
        border-radius: 16px !important;
        
        padding: 2.5rem !important;
        max-width: 800px !important;
        margin: 2rem auto !important;
        border: 1px solid #F3F4F6 !important;
      }

      /* Form fields */
      .form-field {
        margin-bottom: 1.5rem !important;
      }

      .loan-form-label {
        display: block !important;
        font-size: 0.95rem !important;
        font-weight: 500 !important;
        color: #4B5563 !important;
        margin-bottom: 0.5rem !important;
      }

      /* Form inputs */
      .loan-form-input {
        display: block !important;
        width: 100% !important;
        height: 56px !important;
        padding: 0.75rem 1rem !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
        color: #1F2937 !important;
        background-color: #ffffff !important;
        border: 1px solid #E5E7EB !important;
        border-radius: 8px !important;
        transition: all 0.2s ease-in-out !important;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
      }

      textarea.loan-form-input {
        height: auto !important;
        min-height: 120px !important;
        resize: vertical !important;
      }

      .loan-form-input[aria-invalid="true"] {
        border-color: #EF4444 !important;
        background-color: #FEF2F2 !important;
      }

      .loan-form-input::placeholder {
        color: #9CA3AF !important;
        opacity: 0.8 !important;
      }

      .loan-form-input:focus {
        outline: none !important;
        border-color: #3B82F6 !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
      }

      .loan-form-input:disabled {
        background-color: #F3F4F6 !important;
        cursor: not-allowed !important;
        opacity: 0.7 !important;
      }

      /* Error messages */
      .loan-form-error {
        color: #EF4444 !important;
        font-size: 0.875rem !important;
        margin-top: 0.5rem !important;
        display: flex !important;
        align-items: center !important;
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
        padding: 0.75rem !important;
        border-radius: 0.5rem !important;
        transition: all 0.2s ease !important;
        border: 1px solid #E5E7EB !important;
      }

      .loan-form-checkbox-wrapper:hover {
        background-color: #F9FAFB !important;
        border-color: #D1D5DB !important;
      }

      .loan-form-checkbox-root {
        width: 1.25rem !important;
        height: 1.25rem !important;
        border-radius: 0.25rem !important;
        border: 2px solid #D1D5DB !important;
        background-color: white !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }

      .loan-form-checkbox-root:hover {
        border-color: #3B82F6 !important;
      }

      .loan-form-checkbox-root[data-state='checked'] {
        border-color: #3B82F6 !important;
        background-color: #3B82F6 !important;
      }

      .loan-form-checkbox-indicator {
        color: white !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      /* Progress bar */
      .loan-form-progress {
        height: 8px !important;
        background-color: #E5E7EB !important;
        border-radius: 9999px !important;
        margin-bottom: 2rem !important;
        overflow: hidden !important;
      }

      .loan-form-progress-bar {
        height: 100% !important;
        background-color: #3B82F6 !important;
        border-radius: 9999px !important;
        transition: width 0.3s ease-in-out !important;
      }

      /* Custom Select styling */
      .loan-form-select-trigger {
        all: unset !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        height: 56px !important;
        padding: 0 1rem !important;
        background-color: white !important;
        border: 1px solid #E5E7EB !important;
        border-radius: 8px !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
        color: #1F2937 !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        transition: all 0.2s ease-in-out !important;
      }

      .loan-form-select-trigger:hover {
        border-color: #D1D5DB !important;
      }

      .loan-form-select-trigger[data-placeholder] {
        color: #9CA3AF !important;
      }

      .loan-form-select-trigger[aria-invalid="true"] {
        border-color: #EF4444 !important;
        background-color: #FEF2F2 !important;
      }

      .loan-form-select-trigger:focus {
        outline: none !important;
        border-color: #3B82F6 !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
      }

      /* Fix dropdown positioning and styling */
      .loan-form-select-content {
        background-color: white !important;
        border-radius: 8px !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        z-index: 1000 !important;
        overflow: hidden !important;
        width: var(--radix-select-trigger-width) !important;
        max-height: 300px !important;
        animation-duration: 0.2s !important;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
        border: 1px solid #F3F4F6 !important;
      }

      /* Buttons */
      button.loan-form-button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0.75rem 1.5rem !important;
        font-size: 1rem !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
        color: white !important;
        background-color: #3B82F6 !important;
        border: none !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        transition: all 0.2s ease-in-out !important;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
      }

      button.loan-form-button:hover {
        background-color: #2563EB !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }

      button.loan-form-button:disabled {
        opacity: 0.7 !important;
        cursor: not-allowed !important;
        background-color: #9CA3AF !important;
      }

      /* Card styling */
      .form-card {
        background-color: white !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
        padding: 1.5rem !important;
        margin-bottom: 1.5rem !important;
        border: 1px solid #F3F4F6 !important;
        transition: all 0.2s ease-in-out !important;
      }

      .form-card:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }

      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          transform: translateY(-10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .loan-form-container {
        animation: fadeIn 0.5s ease-out !important;
      }

      .form-field {
        animation: slideDown 0.3s ease-out !important;
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

  // Handle phone input to only allow digits


  // Custom field component with error handling
  const FormField = ({ name, label, required, children, hint }) => (
    <div className="form-field">
      <Label.Root className="loan-form-label flex items-center text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label.Root>
      {children}
      {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {errors[name].message}
        </p>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Contact Information - Full width on mobile, half width on larger screens */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <div className="bg-[#FFC600] p-1.5 rounded-lg mr-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Kontaktinformācija
          </h4>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="contactName"
                label="Kontaktpersonas vārds, uzvārds"
                required
              >
                <input
                  type="text"
                  className="loan-form-input w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                  aria-invalid={errors.contactName ? 'true' : 'false'}
                  {...register('contactName', { required: 'Šis lauks ir obligāts' })}
                />
              </FormField>

              <FormField
                name="phone"
                label="Telefona numurs"
                required
              >
                <input
                  type="tel"
                  className="loan-form-input w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
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
              </FormField>
            </div>
            
            <FormField
              name="email"
              label="E-pasta adrese"
              required
            >
              <input
                type="email"
                className="loan-form-input w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
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
          </div>
        </div>
  
        {/* Company Information Section */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 ">
          <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <div className="bg-[#FFC600] p-1.5 rounded-lg mr-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Uzņēmuma dati
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="companyName"
              label="Uzņēmuma nosaukums"
              required
            >
              <input
                type="text"
                className="loan-form-input w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
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
                className="loan-form-input w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
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
                    className="loan-form-select-trigger w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                    aria-invalid={errors.companyAge ? 'true' : 'false'}
                    {...register('companyAge', { required: 'Šis lauks ir obligāts' })}
                  >
                    <Select.Value placeholder="Izvēlieties uzņēmuma vecumu" className="text-gray-400" />
                    <Select.Icon>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </Select.Icon>
                  </Select.Trigger>
                  
                  <Select.Portal>
                    <Select.Content 
                      className="loan-form-select-content rounded-lg shadow-lg border border-gray-100" 
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
                    className="loan-form-select-trigger w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
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
                      className="loan-form-select-content rounded-lg shadow-lg border border-gray-100" 
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
                    className="loan-form-select-trigger w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
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
                      className="loan-form-select-content rounded-lg shadow-lg border border-gray-100" 
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
                    className="loan-form-select-trigger w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
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
                      className="loan-form-select-content rounded-lg shadow-lg border border-gray-100" 
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
            
            <div className="col-span-1 md:col-span-2">
              <FormField
                name="coreActivity"
                label="Pamata darbība (īss apraksts)"
                required
              >
                <textarea
                  className="loan-form-input min-h-[100px] resize-none w-full text-base md:text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                  placeholder="(piemēram: būvniecība, tirdzniecība, ražošana utt.)"
                  aria-invalid={errors.coreActivity ? 'true' : 'false'}
                  {...register('coreActivity', { required: 'Šis lauks ir obligāts' })}
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

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
        label="Vēlamais aizdevuma termiņš (mēneši)"
        required
      >
        <div className="flex">
          <div className="flex-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="loan-form-input"
              placeholder="Ievadiet termiņu mēnešos"
              aria-invalid={errors.loanTerm ? 'true' : 'false'}
              {...register('loanTerm', { 
                required: 'Šis lauks ir obligāts',
                validate: (value) => {
                  const num = parseFloat(value);
                  if (isNaN(num)) return 'Lūdzu, ievadiet skaitli';
                  
                  const min = 1;
                  const max = 120;
                  
                  if (num < min) return 'Minimālais termiņš ir 1 mēnesis';
                  if (num > max) return 'Maksimālais termiņš ir 120 mēneši';
                  return true;
                }
              })}
            />
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
            onValueChange={(value) => {
              console.log('Financial product selected:', value);
              setValue('financialProduct', value, { shouldValidate: true });
            }}
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

  if (isSuccess) {
    return (
      <div className="loan-form-container bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center py-12">
          <div className="mb-6 bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Paldies par pieteikumu!</h2>
          <p className="text-gray-600 mb-2 max-w-md mx-auto">Jūsu pieteikums ir veiksmīgi nosūtīts un tiks izskatīts tuvākajā laikā.</p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Mūsu speciālists sazināsies ar jums 1-2 darba dienu laikā.</p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setStep(1);
              reset();
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            Iesniegt jaunu pieteikumu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-form-container rounded-2xl border border-gray-100">
      <div className="mb-8">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${step >= 1 ? 'bg-[#FFC600] text-black' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#FFC600]' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${step >= 2 ? 'bg-[#FFC600] text-black' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
          </div>
        </div>
        
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {step === 1 ? 'Biznesa finansējuma pieteikums' : 'Aizdevuma vajadzības'}
        </h2>
        
        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          {step === 1 
            ? 'Aizpildiet informāciju par jūsu uzņēmumu, lai mēs varētu sagatavot personalizētu finansējuma piedāvājumu.' 
            : 'Pastāstiet mums par jūsu finansējuma vajadzībām, lai mēs varētu piedāvāt piemērotāko risinājumu.'}
        </p>
      </div>
  
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 ? renderStep1() : renderStep2()}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          </div>
        )}
  
        <div className="flex flex-col space-y-4 pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all flex items-center font-medium shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Iepriekšējais
            </button>
          )}
          
          <button
            type="submit"
            className={`w-full px-6 py-4 rounded-lg font-medium shadow-sm flex items-center justify-center ${
              isSubmitting 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-[#FFC600] hover:bg-[#E6B400] text-black transition-all'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Apstrādā...
              </>
            ) : (
              <>
                {step === 2 ? 'Iesniegt pieteikumu' : 'Turpināt'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FullCalculator;