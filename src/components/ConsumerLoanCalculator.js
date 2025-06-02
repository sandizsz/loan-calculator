import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { ChevronRight, ChevronLeft, Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { translate } from '../translations';

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

const ConsumerLoanCalculator = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invitationId, setInvitationId] = useState(null);
  const [isBankConnected, setIsBankConnected] = useState(false);

  // Form setup with React Hook Form
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      loanAmount: 5000,
      loanTerm: 36,
      firstName: 'Sandis',
      lastName: 'Sirmais',
      personalCode: '160600-22559',
      email: 'sandissirmais8@gmail.com',
      phone: '25641934',
      monthlyIncome: '1200',
      otherLoans: 'no',
      consentToTerms: false
    }
  });

  const initializeAccountScoring = useCallback((invitationId) => {
    if (!invitationId) {
      console.error('❌ Missing invitation ID');
      setError('Kļūda veidojot bankas savienojumu. Lūdzu, mēģiniet vēlreiz.');
      return;
    }
    
    // Get the client ID from window.loanCalculatorData or use the hardcoded value
    const clientId = window.loanCalculatorData?.accountScoringClientId || '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI';
    
    console.log('🔑 Using AccountScoring Client ID:', clientId);
    console.log('🆔 Using Invitation ID:', invitationId);
    
    // Function to initialize AccountScoring
    const initASC = () => {
      if (!window.ASCEMBED) {
        console.log('⏳ ASCEMBED not available yet, loading script...');
        
        // Load the script if it's not already loaded
        const existingScript = document.getElementById('accountscoring-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'accountscoring-script';
          script.src = 'https://prelive.accountscoring.com/static/asc-embed-v2.js';
          script.async = true;
          script.onload = () => {
            console.log('✅ AccountScoring script loaded, initializing...');
            setTimeout(initASC, 300); // Try again after script is loaded
          };
          document.head.appendChild(script);
        } else {
          // Script exists but ASCEMBED not available yet, wait a bit longer
          setTimeout(initASC, 500);
        }
        return;
      }
      
      try {
        // Clear any previous initialization
        if (typeof window.ASCEMBED.clear === 'function') {
          window.ASCEMBED.clear();
        }
        
        console.log('🚀 Initializing AccountScoring with modal version');
        
        // Initialize with the correct parameters for modal version
        window.ASCEMBED.initialize({
          btn_id: 'ascModal', // Button ID that will trigger the modal
          invitation_id: invitationId,
          client_id: clientId,
          locale: 'lv_LV',
          is_modal: true, // Using modal version
          onConfirmAllDone: function(status) {
            console.log('✅ Bank connection completed:', status);
            setIsBankConnected(true);
            setStep(2);
          },
          onClose: function() {
            console.log('Modal closed');
          }
        });
        
        // Trigger the modal to open automatically
        setTimeout(() => {
          const modalButton = document.getElementById('ascModal');
          if (modalButton) {
            console.log('🖱️ Clicking modal button to open AccountScoring');
            modalButton.click();
          } else {
            console.error('❌ Modal button not found');
            setError('Kļūda - nevar atrast bankas savienojuma pogu.');
          }
        }, 300);
      } catch (error) {
        console.error('❌ Error initializing AccountScoring:', error);
        setError('Kļūda inicializējot bankas savienojumu: ' + error.message);
      }
    };
    
    // Start the initialization process
    initASC();
    
  }, [setStep, setIsBankConnected, setError]);

  // Watch form values for calculations
  const loanAmount = watch('loanAmount');
  const loanTerm = watch('loanTerm');

  // Calculate monthly payment
  const monthlyPayment = useMemo(() => {
    const annualRate = 0.12; // 12% annual interest rate
    const monthlyRate = annualRate / 12;
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                   (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return payment.toFixed(2);
  }, [loanAmount, loanTerm]);

  // Render bank connection section
  const renderBankConnectionSection = () => {
    if (invitationId) {
      return (
        <div id="bank-connection-section" className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            {translate('Savienojiet savu bankas kontu')}
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            {translate('Lai turpinātu pieteikumu, lūdzu, savienojiet savu bankas kontu, izmantojot drošo AccountScoring pakalpojumu.')}
          </p>
          {/* Hidden button for AccountScoring modal trigger */}
          <button
            id="ascModal"
            type="button"
            style={{ display: 'none' }}
            className="w-full px-6 py-4 rounded-lg font-medium shadow-sm bg-[#FFC600] hover:bg-[#E6B400] text-black transition-all"
          >
            Savienot ar banku
          </button>
        </div>
      );
    }
    return null;
  };
  
  // Handle Step 1 submission (separate from main submit to avoid form validation issues)
  const handleSubmitStep1 = async () => {
    // Manual validation for required fields in step 1
    const isValid = await handleSubmit(async (data) => {
      // Validation passed, continue with submission
      setIsSubmitting(true);
      setError(null);
      
      try {
        // Create invitation in AccountScoring
        const response = await axios.post('/wp-json/loan-calculator/v1/create-invitation', {
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          personalCode: data.personalCode,
          loanAmount: data.loanAmount,
          loanTerm: data.loanTerm,
          monthlyIncome: data.monthlyIncome
        });
        
        if (response.data && response.data.success && response.data.invitation_id) {
          // Store the invitation ID
          const invId = response.data.invitation_id;
          setInvitationId(invId);
          console.log('🆔 Received invitation ID:', invId);
          
          // Initialize and open AccountScoring modal
          initializeAccountScoring(invId);
        } else {
          setError('Kļūda izveidojot pieteikumu. Lūdzu, mēģiniet vēlreiz.');
        }
      } catch (error) {
        console.error('❌ Error creating invitation:', error);
        
        // Provide detailed error message
        let errorMessage = 'Kļūda izveidojot pieteikumu. Lūdzu, mēģiniet vēlreiz.';
        
        if (error.response) {
          console.error('Error response data:', error.response.data);
          
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.request) {
          errorMessage = 'Nav saņemta atbilde no servera. Lūdzu, pārbaudiet interneta savienojumu.';
        }
        
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    })();
    
    // If validation fails, the handleSubmit function will handle errors
    return isValid;
  };
  
  // Form submission handler
  const onSubmit = async (data) => {
    // Prevent validation errors from showing during submission
    setIsSubmitting(true);
    setError(null);
    
    if (step === 1) {
      // This should not be called directly anymore, using handleSubmitStep1 instead
      // But keeping for compatibility
      handleSubmitStep1();
      return;
    }
    
    // Final submission (step 2)
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Submit final application data
      const response = await axios.post('/wp-json/loan-calculator/v1/submit-application', {
        ...data,
        invitationId: invitationId,
        isBankConnected: isBankConnected
      });
      
      if (response.data && response.data.success) {
        setIsSuccess(true);
        reset();
      } else {
        setError('Kļūda iesniedzot pieteikumu. Lūdzu, mēģiniet vēlreiz.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError(error.response?.data?.message || 'Kļūda iesniedzot pieteikumu. Lūdzu, mēģiniet vēlreiz.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Custom field component with error handling
  const FormField = ({ name, label, required, children, hint }) => {
    const showError = errors[name] && isSubmitting;
    
    return (
      <div className="mb-6">
        <Label.Root className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label.Root>
        {children}
        {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
        {showError && (
          <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
        )}
     </div>
    );
  };

  // Success message after form submission
  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{translate('Paldies par pieteikumu!')}</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {translate('Jūsu pieteikums ir veiksmīgi iesniegts. Mēs ar jums sazināsimies tuvākajā laikā.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
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
          {step === 1 ? translate('Patēriņa kredīta pieteikums') : translate('Papildu informācija')}
        </h2>
        
        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          {step === 1 
            ? translate('Aizpildiet informāciju par sevi, lai mēs varētu sagatavot personalizētu kredīta piedāvājumu.') 
            : translate('Lūdzu, aizpildiet papildu informāciju, lai pabeigtu pieteikumu.')}
        </p>
      </div>
  
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 ? (
          <>
            {/* Step 1: Basic Information and Bank Connection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loan Amount */}
              <FormField 
                name="loanAmount" 
                label={translate('Aizdevuma summa')} 
                required
              >
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{loanAmount} €</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    {...register('loanAmount', { 
                      required: translate('Obligāti aizpildāms lauks'),
                      valueAsNumber: true,
                      shouldUnregister: false
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>500 €</span>
                    <span>10000 €</span>
                  </div>
                </div>
              </FormField>

              {/* Loan Term */}
              <FormField 
                name="loanTerm" 
                label={translate('Aizdevuma termiņš')} 
                required
              >
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{loanTerm} {translate('mēneši')}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="60"
                    step="1"
                    {...register('loanTerm', { 
                      required: translate('Obligāti aizpildāms lauks'),
                      valueAsNumber: true,
                      shouldUnregister: false
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3 {translate('mēn.')}</span>
                    <span>60 {translate('mēn.')}</span>
                  </div>
                </div>
              </FormField>
            </div>

            {/* Monthly Payment Box */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-medium">{monthlyPayment} €/mēn.</span>
                <div className="relative ml-1">
                  <Info className="w-4 h-4 text-blue-500 cursor-help" />
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {translate('Ikmēneša maksājums')}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                name="firstName" 
                label={translate('Vārds')} 
                required
              >
                <input
                  type="text"
                  id="firstName"
                  {...register('firstName', { 
                    required: translate('Obligāti aizpildāms lauks'),
                    shouldUnregister: false
                  })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600]"
                />
              </FormField>

              <FormField 
                name="lastName" 
                label={translate('Uzvārds')} 
                required
              >
                <input
                  type="text"
                  id="lastName"
                  {...register('lastName', { 
                    required: translate('Obligāti aizpildāms lauks'),
                    shouldUnregister: false
                  })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600]"
                />
              </FormField>

              <FormField 
                name="personalCode" 
                label={translate('Personas kods')} 
                required
              >
                <input
                  type="text"
                  id="personalCode"
                  placeholder="XXXXXX-XXXXX"
                  {...register('personalCode', { 
                    required: translate('Obligāti aizpildāms lauks'),
                    pattern: {
                      value: /^\d{6}-\d{5}$/,
                      message: translate('Nepareizs personas koda formāts (XXXXXX-XXXXX)')
                    },
                    shouldUnregister: false
                  })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600]"
                />
              </FormField>

              <FormField 
                name="email" 
                label={translate('E-pasts')} 
                required
              >
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: translate('Obligāti aizpildāms lauks'),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: translate('Nepareizs e-pasta formāts')
                    },
                    shouldUnregister: false
                  })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600]"
                />
              </FormField>

              <FormField 
                name="phone" 
                label={translate('Tālrunis')} 
                required
              >
                <input
                  type="tel"
                  id="phone"
                  placeholder="2XXXXXXX"
                  {...register('phone', { 
                    required: translate('Obligāti aizpildāms lauks'),
                    pattern: {
                      value: /^[2-6]\d{7}$/,
                      message: translate('Nepareizs tālruņa numura formāts')
                    },
                    shouldUnregister: false
                  })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600]"
                />
              </FormField>

              <FormField 
                name="monthlyIncome" 
                label={translate('Ikmēneša ienākumi (€)')} 
                required
              >
                <input
                  type="number"
                  id="monthlyIncome"
                  min="0"
                  step="1"
                  {...register('monthlyIncome', { 
                    required: translate('Obligāti aizpildāms lauks'),
                    valueAsNumber: true,
                    min: {
                      value: 500,
                      message: translate('Ienākumiem jābūt vismaz 500€')
                    },
                    shouldUnregister: false
                  })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600]"
                />
              </FormField>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consentToTerms"
                  {...register('consentToTerms', { 
                    required: translate('Jums jāpiekrīt noteikumiem, lai turpinātu'),
                    shouldUnregister: false
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="consentToTerms" className="ml-2 block text-sm text-gray-700">
                  {translate('Es piekrītu')} <a href="#" className="text-blue-600 hover:underline">{translate('noteikumiem un nosacījumiem')}</a> {translate('un apstiprinu, ka visa manis sniegtā informācija ir patiesa.')}
                </label>
              </div>
              {errors.consentToTerms && isSubmitting && (
                <p className="mt-1 text-sm text-red-600">{errors.consentToTerms.message}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Additional Information */}
            <div className="space-y-6">
              {/* Bank connection status */}
              <div className={`p-4 rounded-lg ${isBankConnected ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isBankConnected ? "M5 13l4 4L19 7" : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                  </svg>
                  <span>
                    {isBankConnected 
                      ? translate('Bankas konta informācija veiksmīgi savienota.') 
                      : translate('Bankas konta informācija nav savienota. Lūdzu, savienojiet savu bankas kontu, lai turpinātu.')}
                  </span>
                </div>
              </div>

              {/* Other loans */}
              <FormField 
                name="otherLoans" 
                label={translate('Vai jums ir citi aktīvi kredīti?')} 
                required
              >
                <RadioGroup.Root 
                  className="flex flex-col space-y-2"
                  defaultValue="no"
                  onValueChange={(value) => setValue('otherLoans', value, { shouldDirty: true, shouldValidate: false })}
                >
                  <div className="flex items-center">
                    <RadioGroup.Item
                      id="otherLoans-no"
                      value="no"
                      className="h-4 w-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-600" />
                    </RadioGroup.Item>
                    <label htmlFor="otherLoans-no" className="ml-2 text-gray-700">
                      {translate('Nē')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item
                      id="otherLoans-yes"
                      value="yes"
                      className="h-4 w-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-600" />
                    </RadioGroup.Item>
                    <label htmlFor="otherLoans-yes" className="ml-2 text-gray-700">
                      {translate('Jā')}
                    </label>
                  </div>
                </RadioGroup.Root>
              </FormField>
            </div>
          </>
        )}
        
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
        
        {/* Bank connection section */}
        {renderBankConnectionSection()}
  
        <div className="flex flex-col space-y-4 pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="back-button px-6 py-3 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all flex items-center font-medium shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              {translate('Atpakaļ')}
            </button>
          )}
          
          {step === 1 ? (
            <button
              type="button"
              onClick={handleSubmitStep1}
              className={`w-full px-6 py-4 rounded-lg font-medium shadow-sm flex items-center justify-center ${isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#FFC600] hover:bg-[#E6B400] text-black transition-all'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {translate('Apstrādā...')}
                </>
              ) : (
                <>
                  {translate('Turpināt')}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          ) : (
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
                  {translate('Apstrādā...')}
                </>
              ) : (
                <>
                  {translate('Iesniegt pieteikumu')}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
      
      {/* Hidden elements for AccountScoring */}
      <div id="asc-container" style={{ display: 'none' }}></div>

    </div>
  );
};

export default ConsumerLoanCalculator;
      