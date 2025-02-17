import React, { useState, useEffect } from 'react';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChevronRight, ChevronLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';

const LoanApplicationForm = () => {
  // Add custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .loan-form-container {
        background: rgba(255, 255, 255, 0.90);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(4px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        padding: 1.5rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .loan-form-container button,
      .loan-form-container [type="button"],
      .loan-form-container [type="submit"] {
        border: none !important;
        background: #4F46E5 !important;
        color: white !important;
        font-weight: 500 !important;
        border-radius: 6px !important;
        transition: all 0.2s !important;
        padding: 12px 24px !important;
        cursor: pointer !important;
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
      }

      .loan-form-input:focus {
        border-color: #4F46E5 !important;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
      }

      .loan-form-select {
        position: relative;
        width: 100%;
      }

      .loan-form-label {
        display: block !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #374151 !important;
        margin-bottom: 4px !important;
      }

      .loan-form-checkbox {
        margin-right: 8px !important;
      }

      .loan-form-select-trigger {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        padding: 12px !important;
        background: white !important;
        border: 1px solid #D1D5DB !important;
        border-radius: 6px !important;
        font-size: 16px !important;
      }

      .loan-form-select-content {
        overflow: hidden;
        background: white;
        border-radius: 6px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-top: 4px;
      }

      .loan-form-field {
        margin-bottom: 16px !important;
      }

      .required-mark {
        color: #EF4444 !important;
        margin-left: 4px !important;
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

  const FormField = ({ label, required, children, className = '' }) => (
    <div className={`loan-form-field ${className}`}>
      <label className="loan-form-label">
        {label} {required && <span className="required-mark">*</span>}
      </label>
      {children}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <FormField label="Vārds, Uzvārds" required>
        <input
          type="text"
          name="fullName"
          required
          className="loan-form-input"
          value={formData.fullName}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="E-pasts" required>
        <input
          type="email"
          name="email"
          required
          className="loan-form-input"
          value={formData.email}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Tālrunis" required>
        <div className="phone-input-container">
          <span className="phone-prefix">+371</span>
          <input
            type="tel"
            name="phone"
            required
            className="loan-form-input phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
      </FormField>

      <FormField label="Uzņēmuma nosaukums" required>
        <input
          type="text"
          name="companyName"
          required
          className="loan-form-input"
          value={formData.companyName}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Reģistrācijas numurs" required>
        <input
          type="text"
          name="registrationNumber"
          required
          className="loan-form-input"
          value={formData.registrationNumber}
          onChange={handleInputChange}
        />
      </FormField>

      {/* Continue with other Step 1 fields... */}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <FormField label="Tekošās kredītsaistības" required>
        <input
          type="text"
          name="currentLoans"
          required
          className="loan-form-input"
          placeholder="Pamatsummas atlikums EUR, Finanšu iestāde"
          value={formData.currentLoans}
          onChange={handleInputChange}
        />
      </FormField>

      {/* Add all other Step 2 fields... */}

      <div className="space-y-2">
        <FormField label="">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="dataProcessing"
              className="loan-form-checkbox"
              checked={formData.dataProcessing}
              onChange={handleInputChange}
              required
            />
            <span>Piekrītu datu apstrādei</span>
          </label>
        </FormField>

        <FormField label="">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="marketing"
              className="loan-form-checkbox"
              checked={formData.marketing}
              onChange={handleInputChange}
            />
            <span>Vēlos saņemt mārketinga ziņas</span>
          </label>
        </FormField>
      </div>
    </div>
  );

  return (
    <div className="loan-form-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {step === 1 ? 'Kontaktinformācija un Uzņēmuma informācija' : 'Finanses, Kredītsaistības, Aizdevuma vajadzības'}
        </h2>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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