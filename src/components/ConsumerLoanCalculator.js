import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';

// Rule: Use functional and declarative programming patterns
const ConsumerLoanCalculator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBankConnected, setIsBankConnected] = useState(false);

  // Form setup with React Hook Form
  // Rule: minimizing animations and refreshes when interacting with form elements
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: 'Sandis',
      lastName: 'Sirmais',
      personalCode: '160600-22559',
      email: 'sandissirmais8@gmail.com',
      phone: '25641934',
      consentToTerms: false
    }
  });
  
  // Initialize AccountScoring with modal version
  const initializeAccountScoring = useCallback((invitationId) => {
    if (!invitationId) {
      console.error('❌ Missing invitation ID');
      setError('Kļūda veidojot bankas savienojumu. Lūdzu, mēģiniet vēlreiz.');
      return;
    }
    
    // Hardcoded client ID for simplicity
    const clientId = '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI';
    
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
            setIsSuccess(true);
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
    
  }, [setIsBankConnected, setError]);
  
  // Create a mock invitation ID for testing
  const createMockInvitation = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For testing, we'll use a hardcoded invitation ID
      // In production, this would come from an API call
      const mockInvitationId = 'test_invitation_' + Date.now();
      
      // Initialize AccountScoring with the mock invitation ID
      initializeAccountScoring(mockInvitationId);
      
      return true;
    } catch (error) {
      console.error('Error creating mock invitation:', error);
      setError('Kļūda veidojot bankas savienojumu. Lūdzu, mēģiniet vēlreiz.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    console.log('Form data:', data);
    createMockInvitation();
  };

  // Rule: tighter spacing between form rows (gap-4) and two-column layout for Step 1
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {isSuccess ? (
        <div className="text-center py-10">
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Paldies par pieteikumu!</h2>
            <p>Jūsu bankas konts ir veiksmīgi savienots. Mēs ar jums sazināsimies tuvākajā laikā.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Rule: more space below section titles (mb-6) */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Bankas konta savienojums</h2>
            <p className="mb-4">Lai turpinātu, lūdzu, aizpildiet formu un savienojiet savu bankas kontu.</p>
          </div>
          
          {/* Rule: tighter spacing between form rows (gap-4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                Vārds
              </label>
              <input
                id="firstName"
                type="text"
                className={`w-full p-3 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                {...register('firstName', { required: 'Lauks ir obligāts' })}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
            </div>
            
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                Uzvārds
              </label>
              <input
                id="lastName"
                type="text"
                className={`w-full p-3 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                {...register('lastName', { required: 'Lauks ir obligāts' })}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
            </div>
            
            {/* Personal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="personalCode">
                Personas kods
              </label>
              <input
                id="personalCode"
                type="text"
                className={`w-full p-3 border rounded-lg ${errors.personalCode ? 'border-red-500' : 'border-gray-300'}`}
                {...register('personalCode', { required: 'Lauks ir obligāts' })}
              />
              {errors.personalCode && <p className="mt-1 text-sm text-red-600">{errors.personalCode.message}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                E-pasts
              </label>
              <input
                id="email"
                type="email"
                className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                {...register('email', { 
                  required: 'Lauks ir obligāts',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Nederīga e-pasta adrese'
                  }
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                Telefons
              </label>
              <input
                id="phone"
                type="tel"
                className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                {...register('phone', { required: 'Lauks ir obligāts' })}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>
          
          {/* Consent to Terms */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consentToTerms"
                  type="checkbox"
                  className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${errors.consentToTerms ? 'border-red-500' : ''}`}
                  {...register('consentToTerms', { required: 'Jums jāpiekrīt noteikumiem, lai turpinātu' })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="consentToTerms" className="font-medium text-gray-700">
                  Es piekrītu <a href="#" className="text-blue-600 hover:underline">noteikumiem un nosacījumiem</a>
                </label>
                {errors.consentToTerms && <p className="mt-1 text-sm text-red-600">{errors.consentToTerms.message}</p>}
              </div>
            </div>
          </div>
          
          {/* Hidden button for AccountScoring modal */}
          <button id="ascModal" type="button" style={{ display: 'none' }}>Open AccountScoring</button>
          
          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className={`w-full px-6 py-4 rounded-lg font-medium shadow-sm flex items-center justify-center ${isLoading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#FFC600] hover:bg-[#E6B400] text-black transition-all'}`}
              disabled={isLoading}
            >
              {isLoading ? 'Apstrādā...' : 'Savienot bankas kontu'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ConsumerLoanCalculator;