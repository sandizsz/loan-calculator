// src/index.js
import { createRoot } from 'react-dom/client';
import LoanCalculator from './components/LoanCalculator';
import './styles/main.css';

function initApp() {
  const rootElement = document.getElementById('loan-calculator-root');
  
  if (rootElement) {
    // Check if Elementor is still initializing
    if (window.elementorFrontend && !window.elementorFrontend.isEditMode()) {
      // No delay needed if not in edit mode
      createRoot(rootElement).render(<LoanCalculator />);
    } else {
      // Minimal delay for Elementor compatibility
      setTimeout(() => {
        createRoot(rootElement).render(<LoanCalculator />);
      }, 50);
    }
  } else {
    console.error('Root element not found');
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