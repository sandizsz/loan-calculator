import React from 'react';
import { createRoot } from 'react-dom/client';
import LoanCalculator from './components/LoanCalculator';
import FullCalculator from './components/FullCalculator';
import './styles/main.css';

// Initialize the calculators
document.addEventListener('DOMContentLoaded', () => {
    // Initialize simple calculator
    const calculatorRoot = document.getElementById('loan-calculator-root');
    if (calculatorRoot) {
        createRoot(calculatorRoot).render(<LoanCalculator />);
    }

    // Initialize full calculator
    const fullCalculatorRoot = document.getElementById('full-calculator-root');
    if (fullCalculatorRoot) {
        createRoot(fullCalculatorRoot).render(<FullCalculator />);
    }
});