// src/consumer-loan.js
import { createRoot } from 'react-dom/client';
import ConsumerLoanCalculator from './components/ConsumerLoanCalculator';
import './styles/main.css';

// Rule: UI and Styling - Use Tailwind CSS for styling
// Add global CSS to ensure AccountScoring modal appears correctly
function addAccountScoringStyles() {
  // Add CSS to ensure modal appears correctly with high z-index
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* AccountScoring modal/overlay/iframe: always on top and full viewport */
    #accountscoring-modal-container,
    .accountscoring-modal-overlay,
    .accountscoring-modal,
    .accountscoring-iframe-container,
    .accountscoring-iframe,
    [id^="accountscoring-button-"],
    [id^="asc-modal"],
    [class*="accountscoring"],
    [class*="modal-overlay"],
    [id^="asc-modal"],
    [id^="asc-modal-overlay"] {
      z-index: 2147483647 !important;
      position: fixed !important;
      transition: none !important;
    }
    .accountscoring-modal-overlay,
    [class*="modal-overlay"],
    [id^="asc-modal-overlay"] {
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0,0,0,0.7) !important;
      backdrop-filter: blur(2px) !important;
    }
    #accountscoring-modal-container {
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      max-width: 90% !important;
      max-height: 90% !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
      border-radius: 8px !important;
      overflow: hidden !important;
    }
    .accountscoring-iframe {
      border: none !important;
      width: 100% !important;
      height: 100% !important;
      display: block !important;
    }
    [id^="accountscoring-button-"] {
      font-family: system-ui, -apple-system, sans-serif !important;
      font-weight: 500 !important;
      transition: none !important;
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
    
    // Create a global window object to store the AccountScoring configuration
    window.loanCalculatorData = window.loanCalculatorData || {};
    
    // Set the AccountScoring client ID from data attributes or use fallback
    // Rule: Security - Handle sensitive data properly
    if (!window.loanCalculatorData.accountScoringClientId) {
      // Try to get from data attribute on the root element
      const clientId = rootElement.getAttribute('data-client-id') || '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI';
      window.loanCalculatorData.accountScoringClientId = clientId;
      console.log('🔑 Set AccountScoring Client ID:', clientId);
    }
    
    // Preload the AccountScoring script
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'script';
    preloadLink.href = 'https://prelive.accountscoring.com/static/asc-embed-v2.js';
    document.head.appendChild(preloadLink);
    
    // Render the React component
    createRoot(rootElement).render(<ConsumerLoanCalculator />);
  } else {
    console.error('Consumer loan calculator root element not found');
  }
}

// Inicializējam, kad lapa ir pilnībā ielādēta
window.addEventListener('load', function() {
  initApp();
});