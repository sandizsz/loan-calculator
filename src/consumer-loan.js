// src/consumer-loan.js
import { createRoot } from 'react-dom/client';
import ConsumerLoanCalculator from './components/ConsumerLoanCalculator';
import './styles/main.css';

// Add AccountScoring script to the page
function addAccountScoringScript() {
  // First check if the script is already loaded
  if (window.ASCEMBED) {
    console.log('AccountScoring script already loaded');
    return;
  }
  
  // Remove any existing script to avoid duplicates
  const existingScript = document.getElementById('accountscoring-script');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  // Add the script with correct URL
  const script = document.createElement('script');
  script.id = 'accountscoring-script';
  script.src = isDev 
    ? 'https://prelive.accountscoring.com/static/asc-embed-v2.js'
    : 'https://accountscoring.com/static/asc-embed-v2.js';
  script.async = false; // Important: load synchronously
  
  // Add the script to the document head
  document.head.appendChild(script);
  
  // Create container and button elements
  const ascContainer = document.createElement('div');
  ascContainer.id = 'asc-container';
  
  const modalButton = document.createElement('button');
  modalButton.id = 'ascModal';
  modalButton.textContent = 'Savienot ar banku';
  modalButton.style.display = 'none';
  
  // Add container and button to the document
  document.body.appendChild(ascContainer);
  document.body.appendChild(modalButton);
  
  console.log(`AccountScoring script added from: ${script.src} (Dev mode: ${isDev ? 'Yes' : 'No'})`);
}

function initApp() {
  const rootElement = document.getElementById('consumer-loan-calculator-root');
  
  if (rootElement) {
    // First add the AccountScoring script
    addAccountScoringScript();
    
    // Wait a bit to ensure script is loaded
    setTimeout(() => {
      createRoot(rootElement).render(<ConsumerLoanCalculator />);
    }, 200);
  } else {
    console.error('Consumer loan calculator root element not found');
  }
}

// Initialize once page is fully loaded
window.addEventListener('load', function() {
  initApp();
});