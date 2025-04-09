// src/full-calculator.js
import { createRoot } from 'react-dom/client';
import FullCalculator from './components/FullCalculator';
import './styles/main.css';

// Add at the top of full-calculator.js, after imports
// Override React's createElement to preserve translations
const originalCreateElement = React.createElement;

// Keep a cache of translations
const translationCache = {};

// Function to gather all translations from the page
function cacheAllTranslations() {
  // Get translations from the hidden div
  document.querySelectorAll('.loan-form-strings > p').forEach(el => {
    const original = el.textContent.trim();
    // If translated by TranslatePress
    if (el.hasAttribute('data-trpgettextoriginal')) {
      translationCache[el.getAttribute('data-trpgettextoriginal')] = el.textContent;
    }
    // Store the original as well
    translationCache[original] = el.textContent;
  });

  // Get any translated elements on the page
  document.querySelectorAll('[data-trpgettextoriginal]').forEach(el => {
    translationCache[el.getAttribute('data-trpgettextoriginal')] = el.textContent;
  });
  
  console.log('Translation cache populated:', Object.keys(translationCache).length, 'entries');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', cacheAllTranslations);

// Override React.createElement to handle translations
React.createElement = function() {
  let args = Array.from(arguments);
  
  // Only process string children of DOM elements (not components)
  if (typeof args[0] === 'string' && args[1] != null && args.length > 2) {
    // Check children for strings to translate
    for (let i = 2; i < args.length; i++) {
      if (typeof args[i] === 'string') {
        const original = args[i].trim();
        if (translationCache[original]) {
          args[i] = translationCache[original];
        }
      }
    }
  }
  
  // Call the original function with possibly translated children
  return originalCreateElement.apply(this, args);
};



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
