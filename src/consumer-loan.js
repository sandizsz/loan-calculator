// src/consumer-loan.js
import { createRoot } from 'react-dom/client';
import ConsumerLoanCalculator from './components/ConsumerLoanCalculator';
import './styles/main.css';

// Add AccountScoring script to the page
function addAccountScoringScript() {
  // Remove any existing script to avoid duplicates
  const existingScript = document.getElementById('accountscoring-script');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  // Add the script
  const script = document.createElement('script');
  script.id = 'accountscoring-script';
  script.src = isDev 
    ? 'https://prelive.accountscoring.com/static/asc-embed-v2.js'
    : 'https://accountscoring.com/static/asc-embed-v2.js';
  script.async = true;
  
  // Create a container div for AccountScoring if it doesn't exist
  let ascContainer = document.getElementById('asc-container');
  if (!ascContainer) {
    ascContainer = document.createElement('div');
    ascContainer.id = 'asc-container';
    document.body.appendChild(ascContainer);
  }
  
  // Create button for modal version
  let modalButton = document.getElementById('ascModal');
  if (!modalButton) {
    modalButton = document.createElement('button');
    modalButton.id = 'ascModal';
    modalButton.textContent = 'Savienot ar banku';
    modalButton.style.display = 'none';
    ascContainer.appendChild(modalButton);
  }
  
  // Add the script to the document
  document.body.appendChild(script);
  
  console.log(`AccountScoring script added from: ${script.src} (Dev mode: ${isDev ? 'Yes' : 'No'})`);
}

function initApp() {
  const rootElement = document.getElementById('consumer-loan-calculator-root');
  
  if (rootElement) {
    // First add the AccountScoring script
    addAccountScoringScript();
    
    // Check if Elementor is still initializing
    if (window.elementorFrontend && !window.elementorFrontend.isEditMode()) {
      // No delay needed if not in edit mode
      createRoot(rootElement).render(<ConsumerLoanCalculator />);
    } else {
      // Minimal delay for Elementor compatibility
      setTimeout(() => {
        createRoot(rootElement).render(<ConsumerLoanCalculator />);
      }, 50);
    }
  } else {
    console.error('Consumer loan calculator root element not found');
  }
}

// Initialize once WordPress is ready
let hasInitialized = false;

function init() {
  if (!hasInitialized) {
    hasInitialized = true;
    initApp();
  }
}

// Wait for WordPress and DOM to be ready
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}