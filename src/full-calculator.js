// src/full-calculator.js
import { createRoot } from 'react-dom/client';
import FullCalculator from './components/FullCalculator';
import './styles/main.css';

function initFullCalculator() {
  const rootElement = document.getElementById('full-calculator-root');
  
  if (rootElement) {
    setTimeout(() => {
      console.log('Mounting Full Calculator React app');
      const root = createRoot(rootElement);
      root.render(<FullCalculator />);
    }, 0);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'complete') {
  initFullCalculator();
} else {
  document.addEventListener('DOMContentLoaded', initFullCalculator);
}
