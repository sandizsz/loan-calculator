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

  const script = document.createElement('script');
  script.id = 'accountscoring-script';
  script.src = 'https://prelive.accountscoring.com/static/asc-embed-v2.js'; // Always prelive
  script.async = false;

  // Create container and modal button
  const ascContainer = document.createElement('div');
  ascContainer.id = 'asc-container';

  const modalButton = document.createElement('button');
  modalButton.id = 'ascModal';
  modalButton.textContent = 'Savienot ar banku';
  modalButton.style.display = 'none';

  document.head.appendChild(script);
  document.body.appendChild(ascContainer);
  document.body.appendChild(modalButton);

  console.log('AccountScoring PRELIVE script added:', script.src);
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