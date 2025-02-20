// src/full-calculator.js
import { createRoot } from 'react-dom/client';
import FullCalculator from './components/FullCalculator';
import './styles/main.css';

function initFullCalculator() {
  const maxAttempts = 10;
  let attempts = 0;

  const tryMount = () => {
    const rootElement = document.getElementById('full-calculator-root');
    
    if (rootElement) {
      console.log('Mounting Full Calculator React app');
      try {
        const root = createRoot(rootElement);
        root.render(<FullCalculator />);
      } catch (error) {
        console.error('Error mounting Full Calculator:', error);
      }
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(tryMount, 100);
    } else {
      console.error('Failed to find full-calculator-root after', maxAttempts, 'attempts');
    }
  };

  tryMount();
}

// Wait for DOM to be ready
if (document.readyState === 'complete') {
  initFullCalculator();
} else {
  document.addEventListener('DOMContentLoaded', initFullCalculator);
}
