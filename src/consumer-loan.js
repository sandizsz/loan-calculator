// src/consumer-loan.js
import { createRoot } from 'react-dom/client';
import ConsumerLoanCalculator from './components/ConsumerLoanCalculator';
import './styles/main.css';

function initApp() {
  const rootElement = document.getElementById('consumer-loan-calculator-root');
  
  if (rootElement) {
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
