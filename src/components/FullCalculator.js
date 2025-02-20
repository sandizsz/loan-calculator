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

const LoanApplicationForm = () => {
  // Form setup with proper validation
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      // ... your default values remain the same
    },
    mode: 'onChange' // Enable real-time validation
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Base form container */
      .loan-form-container {
        background: #ffffff !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        padding: 2rem !important;
        max-width: 800px !important;
        margin: 0 auto !important;
      }

      /* Form inputs */
      .loan-form-input {
        display: block !important;
        width: 100% !important;
        height: 48px !important;
        padding: 0.75rem 1rem !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
        color: #1f2937 !important;
        background-color: #ffffff !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 0.5rem !important;
        transition: all 0.2s ease-in-out !important;
      }

      .loan-form-input:focus {
        outline: none !important;
        border-color: #4f46e5 !important;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
      }

      .loan-form-input:disabled {
        background-color: #f3f4f6 !important;
        cursor: not-allowed !important;
      }

      /* Custom Select styling */
      .loan-form-select-trigger {
        all: unset !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        height: 48px !important;
        padding: 0 1rem !important;
        background-color: white !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 0.5rem !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
        color: #1f2937 !important;
        cursor: pointer !important;
      }

      .loan-form-select-trigger:focus {
        outline: none !important;
        border-color: #4f46e5 !important;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
      }

      .loan-form-select-content {
        overflow: hidden !important;
        background-color: white !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        z-index: 1000 !important;
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
        background-color: #4f46e5 !important;
        border-color: #4f46e5 !important;
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
        border-color: #4f46e5 !important;
      }

      .loan-form-radio-indicator {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 12px !important;
        height: 12px !important;
        border-radius: 50% !important;
        background-color: #4f46e5 !important;
      }

      /* Labels */
      .loan-form-label {
        display: block !important;
        margin-bottom: 0.5rem !important;
        font-size: 0.875rem !important;
        font-weight: 500 !important;
        color: #374151 !important;
      }

      /* Error messages */
      .loan-form-error {
        margin-top: 0.5rem !important;
        font-size: 0.875rem !important;
        color: #dc2626 !important;
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
        background-color: #4f46e5 !important;
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
        height: 0.5rem !important;
        background-color: #e5e7eb !important;
        border-radius: 9999px !important;
      }

      .loan-form-progress-bar {
        height: 100% !important;
        background-color: #4f46e5 !important;
        border-radius: 9999px !important;
        transition: width 0.3s ease-in-out !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Form submission handler with proper error handling
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      console.log('Form data:', data);
      
      // Move to next step or submit
      if (step < 2) {
        setStep(step + 1);
      } else {
        // Add your API call here
        await submitForm(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom field component with error handling
  const FormField = ({ name, label, required, children, hint }) => (
    <div className="mb-4">
      <Label.Root className="loan-form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </Label.Root>
      {children}
      {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
      {errors[name] && (
        <p className="loan-form-error">
          {errors[name].message}
        </p>
      )}
    </div>
  );

  return (
    <div className="loan-form-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {step === 1 ? 'Kontaktinformācija un Uzņēmuma informācija' : 'Aizdevuma vajadzības'}
        </h2>
        <div className="loan-form-progress">
          <div
            className="loan-form-progress-bar"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
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

export default LoanCalculator;