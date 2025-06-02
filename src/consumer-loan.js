// src/consumer-loan.js
import { createRoot } from 'react-dom/client';
import ConsumerLoanCalculator from './components/ConsumerLoanCalculator';
import './styles/main.css';

// Rule: Use functional and declarative programming patterns
// Add global CSS to ensure AccountScoring modal appears correctly
function addAccountScoringStyles() {
  // Add CSS to ensure modal appears correctly with high z-index
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Force modal to be visible */
    #accountscoring-modal-container,
    .accountscoring-modal-overlay,
    .accountscoring-modal,
    .accountscoring-iframe-container,
    .accountscoring-iframe {
      z-index: 2147483647 !important;
      position: fixed !important;
    }
    
    /* Ensure modal overlay covers everything */
    .accountscoring-modal-overlay {
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0,0,0,0.7) !important;
    }
    
    /* Center the modal */
    #accountscoring-modal-container {
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      max-width: 90% !important;
      max-height: 90% !important;
    }
  `;
  document.head.appendChild(styleEl);
  console.log('✅ AccountScoring global styles added');
}

function initApp() {
  const rootElement = document.getElementById('consumer-loan-calculator-root');
  
  if (rootElement) {
    // Add global styles for AccountScoring modal
    addAccountScoringStyles();
    
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