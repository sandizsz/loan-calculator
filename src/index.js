// src/index.js
import { createRoot } from 'react-dom/client';
import LoanCalculator from './components/LoanCalculator';

function initApp() {
  const rootElement = document.getElementById('loan-calculator-root');
  
  if (rootElement) {
    // Add slight delay for Elementor compatibility
    setTimeout(() => {
      createRoot(rootElement).render(<LoanCalculator />);
    }, 100);
  }
}

// Wait for both DOM and WordPress assets
if (document.readyState === 'complete') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
  window.addEventListener('load', initApp);
}