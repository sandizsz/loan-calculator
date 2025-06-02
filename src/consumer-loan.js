// src/consumer-loan.js
import { createRoot } from 'react-dom/client';
import ConsumerLoanCalculator from './components/ConsumerLoanCalculator';
import './styles/main.css';

// Add AccountScoring script to the page
function addAccountScoringScript() {
  // Remove existing script to avoid duplicates
  const existingScript = document.getElementById('accountscoring-script');
  if (existingScript) {
    existingScript.remove();
  }

  // Create and add the script
  const script = document.createElement('script');
  script.id = 'accountscoring-script';
  script.src = 'https://prelive.accountscoring.com/static/asc-embed-v2.js'; // Using prelive environment
  script.async = true;
  
  // Add script to head
  document.head.appendChild(script);
  
  // Create modal button with high z-index to ensure it appears above everything
  // This is the button that will be clicked to open the modal
  // Rule: UI and Styling - Use Tailwind CSS for styling
  const modalButton = document.createElement('button');
  modalButton.id = 'ascModal';
  modalButton.style.position = 'fixed';
  modalButton.style.top = '50%';
  modalButton.style.left = '50%';
  modalButton.style.transform = 'translate(-50%, -50%)';
  modalButton.style.opacity = '0';
  modalButton.style.pointerEvents = 'none';
  modalButton.style.zIndex = '999999';
  modalButton.style.width = '1px';
  modalButton.style.height = '1px';
  modalButton.style.overflow = 'hidden';
  modalButton.style.clip = 'rect(0 0 0 0)';
  modalButton.style.margin = '-1px';
  modalButton.style.padding = '0';
  modalButton.style.border = '0';
  document.body.appendChild(modalButton);
  
  // Add global styles to ensure modal appears above everything
  // Rule: UI and Styling - Implement responsive design for different screen sizes
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Override any existing AccountScoring styles */
    #accountscoring-iframe-container,
    #accountscoring-modal-container,
    .accountscoring-modal,
    .accountscoring-modal-overlay,
    .accountscoring-iframe-container,
    .accountscoring-modal-container,
    .asc-modal-overlay,
    .asc-modal-container,
    div[class*="accountscoring"],
    div[class*="asc-modal"] {
      z-index: 2147483647 !important; /* Maximum possible z-index */
      position: fixed !important;
    }
    
    /* Modal overlay */
    .asc-modal-overlay,
    .accountscoring-modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background-color: rgba(0, 0, 0, 0.8) !important;
      width: 100% !important;
      height: 100% !important;
    }
    
    /* Modal container */
    .asc-modal-container,
    .accountscoring-modal-container {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      max-height: 90vh !important;
      max-width: 90vw !important;
      width: 90% !important;
      height: auto !important;
      overflow: visible !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      border-radius: 8px !important;
    }
    
    /* Modal iframe */
    #accountscoring-iframe,
    .accountscoring-iframe {
      width: 100% !important;
      height: 100% !important;
      max-height: 80vh !important;
      border: none !important;
      border-radius: 8px !important;
    }
  `;
  document.head.appendChild(styleEl);
  
  console.log('✅ AccountScoring PRELIVE script added:', script.src);
  
  // Return the script element so we can attach onload handlers if needed
  return script;
}


function initApp() {
  const rootElement = document.getElementById('consumer-loan-calculator-root');
  
  if (rootElement) {
    // First add the AccountScoring script and get the script element
    const scriptElement = addAccountScoringScript();
    
    // Create a global window object to store the ASCEMBED instance if needed
    window.loanCalculatorData = window.loanCalculatorData || {};
    
    // Render the React component immediately
    // The ConsumerLoanCalculator will handle its own initialization
    createRoot(rootElement).render(<ConsumerLoanCalculator />);
    
    // Log when script is loaded
    scriptElement.onload = () => {
      console.log('🚀 AccountScoring script loaded successfully');
    };
    
    scriptElement.onerror = () => {
      console.error('❌ Failed to load AccountScoring script');
    };
  } else {
    console.error('Consumer loan calculator root element not found');
  }
}

// Initialize once page is fully loaded
window.addEventListener('load', function() {
  initApp();
});