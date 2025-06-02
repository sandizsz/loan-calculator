import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

// Rule: Use functional and declarative programming patterns
const ConsumerLoanCalculator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBankConnected, setIsBankConnected] = useState(false);
  const [showBankContainer, setShowBankContainer] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const bankContainerRef = useRef(null);
  
  // Function to load the AccountScoring script
  const loadScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (window.ASCEMBED) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://prelive.accountscoring.com/static/asc-embed-v2.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ AccountScoring script loaded');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('❌ Error loading AccountScoring script:', error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }, []);
  
  // Function to handle bank selection from custom UI
  const handleBankSelect = useCallback(async (bankCode) => {
    // Rule: minimizing animations and refreshes when interacting with form elements
    setSelectedBank(bankCode);
    console.log('🏦 Selected bank:', bankCode);
    
    // Get the current invitation ID from state
    const invitationId = window.currentInvitationId;
    if (!invitationId) {
      console.error('❌ No invitation ID available for bank selection');
      setError('Kļūda inicializējot bankas savienojumu. Lūdzu, mēģiniet vēlreiz.');
      return;
    }
    
    try {
      // Load the AccountScoring script if not already loaded
      await loadScript();
      
      // Check if ASCEMBED is available
      if (!window.ASCEMBED) {
        console.error('❌ ASCEMBED not available after script load');
        setError('Kļūda ielādējot bankas savienojuma skriptu. Lūdzu, mēģiniet vēlreiz vēlāk.');
        return;
      }
      
      // Get client ID from WordPress configuration or use fallback
      // Rule: Security - Handle sensitive data properly
      const clientId = window.loanCalculatorData?.accountScoringClientId || '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI';
      console.log('🔑 Using AccountScoring Client ID for bank selection:', clientId);
      
      // Initialize AccountScoring with the selected bank
      console.log('🏦 Initializing AccountScoring for bank:', bankCode);
      
      // Create a modal button for the selected bank
      // This is needed because AccountScoring still requires a button click to open the bank auth flow
      const buttonId = 'accountscoring-button-' + Date.now();
      const button = document.createElement('button');
      button.id = buttonId;
      button.type = 'button';
      button.textContent = 'Connect to ' + bankCode;
      button.style.position = 'absolute';
      button.style.opacity = '0';
      button.style.pointerEvents = 'none';
      document.body.appendChild(button);
      
      // Initialize AccountScoring with modal version for the selected bank
      window.ASCEMBED.initialize({
        btn_id: buttonId,
        invitation_id: invitationId,
        client_id: clientId,
        locale: 'lv_LV',
        is_modal: true, // Use modal for the actual bank connection
        environment: 'prelive',
        bank_code: bankCode, // Specify the selected bank code
        onConfirmAllDone: function(status) {
          console.log('✅ Bankas savienojums pabeigts:', status);
          setIsBankConnected(true);
          setIsSuccess(true);
          if (button) button.remove();
        },
        onClose: function() {
          console.log('Banku savienojums aizvērts');
          setSelectedBank(null);
          if (button) button.remove();
        },
        onError: function(error) {
          console.error('❌ AccountScoring kļūda:', error);
          setError(error?.message || error?.error || 'Kļūda bankas savienojumā. Lūdzu, mēģiniet vēlreiz vēlāk.');
          if (button) button.remove();
        }
      });
      
      // Click the button automatically after a short delay
      setTimeout(() => {
        console.log('🔄 Triggering click on bank button');
        button.click();
      }, 300);
      
    } catch (error) {
      console.error('❌ Error handling bank selection:', error);
      setError('Kļūda inicializējot bankas savienojumu. Lūdzu, mēģiniet vēlreiz vēlāk.');
    }
  }, [loadScript, setError, setIsBankConnected, setIsSuccess, setSelectedBank]);
  
  // Function to initialize AccountScoring with container version
  const initializeContainer = useCallback(async (invitationId) => {
    if (!invitationId) {
      console.error('❌ Missing invitation ID for container');
      return;
    }
    
    // Store the invitation ID for later use with bank selection
    window.currentInvitationId = invitationId;
    
    // Show the bank container with custom UI
    setShowBankContainer(true);
    
    // No need to initialize AccountScoring here, as we'll do it when a bank is selected
    console.log('✅ Ready for bank selection with invitation ID:', invitationId);
    
  }, [setShowBankContainer]);

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
  
  // Rule: UI and Styling - Use Tailwind CSS for styling
  // Initialize AccountScoring with container version
  const initializeAccountScoring = useCallback((invitationId) => {
    if (!invitationId) {
      console.error('❌ Missing invitation ID');
      setError('Kļūda veidojot bankas savienojumu. Lūdzu, mēģiniet vēlreiz.');
      return;
    }
    
    console.log('🔄 Initializing AccountScoring with invitation ID:', invitationId);
    
    // Store the invitation ID for later use
    window.currentInvitationId = invitationId;
    
    // Show the bank container with custom UI
    setShowBankContainer(true);
  }, [setError, setShowBankContainer]);

  // Create a real invitation using AccountScoring API v3
  // Rule: Error Handling - Handle network failures gracefully
  const createInvitation = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Rule: Security - Handle sensitive data properly
      // API endpoint for AccountScoring v3
      const apiUrl = 'https://prelive.accountscoring.com/api/v3/invitation';
      
      // Get client ID from WordPress settings
      // Rule: Security - Handle sensitive data properly
      const clientId = window.loanCalculatorData?.accountScoringClientId || '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI';
      
      console.log('🔄 Creating invitation via AccountScoring API v3');
      
      // Prepare the request payload according to the API documentation
      // Rule: Use Latvian language for all text
      const requestPayload = {
        email: formData.email,
        personal_code: formData.personalCode,
        name: `${formData.firstName} ${formData.lastName}`,
        send_email: false,
        transaction_days: 90,
        language: 'lv', // Latvian language
        redirect_url: window.location.href, // Return to the same page
        valid_until: (() => {
          // Set valid until to 30 days from now
          const date = new Date();
          date.setDate(date.getDate() + 30);
          return date.toISOString().split('T')[0] + ' 23:59:59';
        })(),
        webhook_url: null,
        // Include client ID in the payload as per API documentation
        client_id: clientId,
        allowed_banks: [
          // Latvian banks
          'HABALV22', // Swedbank
          'UNLALV2X', // SEB
          'PARXLV22', // Citadele
          'NDEALV2X', // Luminor
          'REVOGB21XXX', // Revolut
          'N26' // N26
        ]
      };
      
      console.log('📤 Sending invitation request:', requestPayload);
      
      // Since we don't have a real API key for direct API access,
      // let's use the WordPress REST API endpoint that already has the API key configured
      // Rule: Error Handling - Handle network failures gracefully
      console.log('🔄 Using WordPress REST API as proxy for AccountScoring API');
      
      // Get the WordPress REST API URL
      const restUrl = window.wpApiSettings?.root || '/wp-json/';
      const restNonce = window.wpApiSettings?.nonce || '';
      
      const response = await axios.post(
        `${restUrl}loan-calculator/v1/create-invitation`,
        {
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          personalCode: formData.personalCode
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-WP-Nonce': restNonce
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Check if the response contains the invitation_id
      // The WordPress REST API returns a different format than the direct AccountScoring API
      if (response.data && response.data.success && response.data.invitation_id) {
        const invitationId = response.data.invitation_id;
        console.log('✅ Received invitation ID from WordPress API:', invitationId);
        console.log('📊 Full API response:', response.data);
        
        // Initialize AccountScoring with the real invitation ID
        initializeAccountScoring(invitationId);
        
        // The initializeAccountScoring function will call initializeContainer internally
        
        return true;
      } else {
        console.error('❌ Invalid API response:', response.data);
        setError('Kļūda saņemot bankas savienojuma ID. Lūdzu, mēģiniet vēlreiz.');
        return false;
      }
    } catch (error) {
      console.error('❌ Error creating invitation:', error);
      
      // Provide more detailed error information
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Provide a more specific error message if available
      const errorMessage = error.response?.data?.messages?.[0] || 
                          error.response?.data?.message || 
                          'Kļūda veidojot bankas savienojumu. Lūdzu, mēģiniet vēlreiz.';
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Rule: Error Handling - Handle network failures gracefully
  const onSubmit = async (data) => {
    console.log('Form data:', data);
    await createInvitation(data);
  };

  // Rule: UI and Styling - Use Tailwind CSS for styling
  return (
    <div className="loan-calculator-container bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
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
      ) : showBankContainer ? (
        <section className="section border form-auth-bank mb-6" style={{borderTop: '4px solid #E3E5EB'}}>
          <div className="section--wrap">
            <div className="small-content-block">
              <h2 className="text-xl font-bold mb-6">Vēl tikai 1 minūte Tava laika. Lūdzu, autorizējies, lai lēmums tiktu saņemts uzreiz un varam pārliecināties, ka iesniegtie dati pieder Tev!</h2>
              <p className="mb-6">Izskatīšanas procesā tiks izmantots Krediidiregister OU pakalpojums, kurš tiks izmantots mana bankas konta pārskata iegūšanai, kurš iekļaus visus ienākošos un izejošos darījumus par pilniem pēdējiem 6 kalendārajiem mēnešiem. Vairāk informācijas par datu apstrādi Krediidiregister OU privātuma politika.</p>
              
              {/* Custom bank buttons with logos */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  type="button" 
                  className="bank-button flex items-center justify-center border border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-all"
                  data-bank-code="HABALV22"
                  onClick={() => handleBankSelect('HABALV22')}
                >
                  <img src="https://www.lkpp.lv/images/banks/swedbank-logo.jpg" alt="Swedbank" className="h-8" />
                </button>
                <button 
                  type="button" 
                  className="bank-button flex items-center justify-center border border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-all"
                  data-bank-code="UNLALV2X"
                  onClick={() => handleBankSelect('UNLALV2X')}
                >
                  <img src="https://www.lkpp.lv/images/banks/seb-logo.jpg" alt="SEB" className="h-8" />
                </button>
                <button 
                  type="button" 
                  className="bank-button flex items-center justify-center border border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-all"
                  data-bank-code="NDEALV2X"
                  onClick={() => handleBankSelect('NDEALV2X')}
                >
                  <img src="https://www.lkpp.lv/images/banks/luminor-logo.jpg" alt="Luminor" className="h-8" />
                </button>
                <button 
                  type="button" 
                  className="bank-button flex items-center justify-center border border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-all"
                  data-bank-code="PARXLV22"
                  onClick={() => handleBankSelect('PARXLV22')}
                >
                  <img src="https://www.lkpp.lv/images/banks/citadele-logo.jpg" alt="Citadele" className="h-8" />
                </button>
              </div>
              
              {/* Hidden container for AccountScoring */}
              <div 
                id="ascContainer" 
                ref={bankContainerRef}
                className="hidden"
              ></div>
              
              <button
                onClick={() => setShowBankContainer(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Atpakaļ
              </button>
            </div>
          </div>
        </section>
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
          
          {/* No longer needed for container version */}
          
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