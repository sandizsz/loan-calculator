import { ruTranslations } from './ru';

/**
 * Checks if the current URL contains the Russian language path
 * @returns {boolean} True if URL contains '/ru/'
 */
export const isRussianLanguage = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.includes('/ru/');
};

/**
 * Translates text based on current language
 * @param {string} text - Original Latvian text
 * @returns {string} - Translated text or original if no translation exists
 */
export const translate = (text) => {
  // If not Russian, return original Latvian text
  if (!isRussianLanguage()) return text;
  
  // Return Russian translation if available, otherwise return original text
  return ruTranslations[text] || text;
};

/**
 * Translates validation error messages
 * @param {Object} validationRules - Original validation rules object
 * @returns {Object} - Translated validation rules
 */
export const translateValidation = (validationRules) => {
  if (!isRussianLanguage()) return validationRules;
  
  // Create a deep copy to avoid mutating the original
  const translatedRules = JSON.parse(JSON.stringify(validationRules));
  
  // Translate required message if present
  if (translatedRules.required && typeof translatedRules.required === 'string') {
    translatedRules.required = translate(translatedRules.required);
  }
  
  // Translate pattern message if present
  if (translatedRules.pattern && translatedRules.pattern.message) {
    translatedRules.pattern.message = translate(translatedRules.pattern.message);
  }
  
  return translatedRules;
};
