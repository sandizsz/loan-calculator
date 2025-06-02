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
      if (window.ASCEMBED) {
        console.log('✅ ASCEMBED already loaded');
        resolve();
        return;
      }
      
      // First remove any existing script to avoid conflicts
      const existingScripts = document.querySelectorAll('script[src*="accountscoring.com"]');
      existingScripts.forEach(script => script.remove());
      
      // Create and add the script
      const script = document.createElement('script');
      script.src = 'https://prelive.accountscoring.com/static/asc-embed-v2.js';
      script.async = true;
      
      // Add event listeners
      script.onload = () => {
        console.log('✅ ASCEMBED script loaded successfully');
        
        // Verify that ASCEMBED is actually available
        if (window.ASCEMBED) {
          console.log('✅ ASCEMBED object is available in window');
          resolve();
        } else {
          console.error('❌ ASCEMBED object not found in window after script load');
          reject(new Error('ASCEMBED not found after script load'));
        }
      };
      
      script.onerror = (error) => {
        console.error('❌ Error loading ASCEMBED script:', error);
        reject(error);
      };
      
      // Add the script to the document
      document.head.appendChild(script);
      console.log('📝 Added ASCEMBED script to document head');
    });
  }, []);
  
  // Function to handle bank selection from custom UI - using LKPP approach
  const handleBankSelect = useCallback(async (bankCode) => {
    // Rule: minimizing animations and refreshes when interacting with form elements
    setSelectedBank(bankCode);
    console.log('🏦 Selected bank:', bankCode);
    
    // Get the current invitation ID from state
    const invitationId = window.currentInvitationId;
    console.log('🔍 Checking invitation ID:', invitationId);
    
    if (!invitationId) {
      console.error('❌ No invitation ID available for bank selection');
      setError('Nav pieejams ielūguma ID. Lūdzu, mēģiniet vēlreiz sākt procesu.');
      return;
    }
    
    try {
      // Load the AccountScoring script if not already loaded
      console.log('🔎 Loading AccountScoring script...');
      await loadScript();
      
      // Check if ASCEMBED is available
      if (!window.ASCEMBED) {
        console.error('❌ ASCEMBED not available after script load');
        setError('Kļūda ielādējot bankas savienojuma skriptu. Lūdzu, mēģiniet vēlreiz vēlāk.');
        return;
      }
      
      console.log('✅ ASCEMBED loaded successfully');
      
      // Get client ID from WordPress configuration or use fallback
      // Rule: Security - Handle sensitive data properly
      const clientId = window.loanCalculatorData?.accountScoringClientId || '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI';
      console.log('🔑 Using AccountScoring Client ID for bank selection:', clientId);
      
      // Create a hidden button for AccountScoring to use
      const buttonId = 'accountscoring-button';
      let button = document.getElementById(buttonId);
      
      // If button doesn't exist, create it
      if (!button) {
        button = document.createElement('button');
        button.id = buttonId;
        button.type = 'button';
        button.style.position = 'absolute';
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
        button.style.width = '1px';
        button.style.height = '1px';
        button.style.overflow = 'hidden';
        document.body.appendChild(button);
        console.log('🔍 Created hidden AccountScoring button with ID:', buttonId);
      }
      
      // Initialize AccountScoring with the invitation ID
      console.log('🏦 Initializing AccountScoring for bank selection');
      
      // Using the LKPP approach with MutationObserver to detect when the modal is ready
      let lock = true;
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
          // Look for the specific bank button in the AccountScoring modal
          const bankButton = document.querySelector(`.asc-container-banks-btn__${bankCode}`);
          
          if (bankButton && lock) {
            console.log('✅ Found bank button for', bankCode, 'clicking it automatically');
            // Show the AccountScoring modal
            const ascModal = document.getElementById('ascMainModalId');
            if (ascModal) {
              ascModal.style.display = 'flex';
            }
            
            // Click the bank button
            bankButton.click();
            lock = false;
            
            // We can stop observing once we've clicked the button
            setTimeout(() => observer.disconnect(), 1000);
          }
          
          // Handle the case when bank selection is shown
          const bankContainer = document.querySelector('.asc-container-banks');
          if (bankContainer) {
            const ascModal = document.getElementById('ascMainModalId');
            if (ascModal) {
              ascModal.style.display = 'flex';
            }
          }
        });
      });
      
      // Start observing the document body for changes
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Initialize AccountScoring with modal version
      window.ASCEMBED.initialize({
        btn_id: buttonId,
        invitation_id: invitationId,
        client_id: clientId,
        locale: 'lv_LV',
        is_modal: true,
        environment: 'prelive',
        onConfirmAllDone: function(status) {
          console.log('✅ Bankas savienojums pabeigts:', status);
          setIsBankConnected(true);
          setIsSuccess(true);
          observer.disconnect();
        },
        onClose: function() {
          console.log('Banku savienojums aizvērts');
          setSelectedBank(null);
          observer.disconnect();
        },
        onError: function(error) {
          console.error('❌ AccountScoring kļūda:', error);
          setError(error?.message || error?.error || 'Kļūda bankas savienojumā. Lūdzu, mēģiniet vēlreiz vēlāk.');
          observer.disconnect();
        }
      });
      
      // Click the button to open the AccountScoring modal
      setTimeout(() => {
        console.log('🔄 Triggering click on AccountScoring button');
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
    try {
      // Rule: minimizing animations and refreshes when interacting with form elements
      setIsLoading(true);
      setError(null);
      
      // Rule: Security - Handle sensitive data properly
      // Prepare data for API call
      const apiData = {
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        personalCode: formData.personalCode,
        loanAmount: formData.loanAmount,
        loanTerm: formData.loanTerm
      };
      
      console.log('💬 Creating invitation with data:', apiData);
      
      // Call WordPress REST API endpoint that will proxy to AccountScoring
      const response = await axios.post('/wp-json/loan-calculator/v1/create-invitation', apiData);
      
      console.log('📡 API Response:', response.data);
      
      if (response.data && response.data.success && response.data.invitation_id) {
        const invitationId = response.data.invitation_id;
        console.log('✅ Got invitation ID:', invitationId);
        
        // Store the invitation ID in window for debugging
        window.currentInvitationId = invitationId;
        console.log('💾 Stored invitation ID in window.currentInvitationId:', window.currentInvitationId);
        
        // Initialize AccountScoring with the invitation ID
        initializeAccountScoring(invitationId);
        return true;
      } else {
        const errorMessage = response.data?.error || 'Kļūda veidojot ielūgumu. Lūdzu, mēģiniet vēlreiz vēlāk.';
        console.error('❌ API Error:', errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('❌ Error creating invitation:', error);
      setError('Kļūda savienojoties ar serveri. Lūdzu, mēģiniet vēlreiz vēlāk.');
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