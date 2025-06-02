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
  
  // Create container for non-modal version (if needed later)
  const ascContainer = document.createElement('div');
  ascContainer.id = 'asc-container';
  ascContainer.style.display = 'none';
  document.body.appendChild(ascContainer);
  
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