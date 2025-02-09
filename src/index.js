// src/index.js
import { createRoot } from 'react-dom/client';
import LoanCalculator from './components/LoanCalculator';
import './styles/main.css';

function initApp() {
  const rootElement = document.getElementById('loan-calculator-root');
  
  if (rootElement) {
    // Add slight delay for Elementor compatibility
    setTimeout(() => {
      console.log('Attempting to mount React app');
      try {
        createRoot(rootElement).render(<LoanCalculator />);
        console.log('React app mounted successfully');
      } catch (error) {
        console.error('Mounting failed:', error);
      }
    }, 100);
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