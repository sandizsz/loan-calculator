<?php
/**
 * Plugin Name: Loan Calculator
 * Description: Modern loan calculator with React
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}



// In loan-calculator.php
function loan_calculator_enqueue_scripts() {
    // Explicitly load WordPress React
    wp_enqueue_script('react');
    wp_enqueue_script('react-dom');
    
    // Your existing enqueue code
    wp_enqueue_script(
        'loan-calculator', 
        plugins_url('build/main.js', __FILE__),
        ['react', 'react-dom'], // Explicit dependencies
        filemtime(plugin_dir_path(__FILE__) . 'build/main.js'),
        true
    );


  // In loan-calculator.php
wp_enqueue_style(
    'loan-calculator-style',
    plugins_url('src/styles/main.css', __FILE__), // Changed from 'dist' to 'build'
    [],
    filemtime(plugin_dir_path(__FILE__) . 'src/styles/main.css')
);

    // Add any PHP variables to JavaScript
    wp_localize_script(
        'loan-calculator',
        'loanCalculatorData',
        [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('loan_calculator_nonce'),
            // Add other data here
        ]
    );
}
add_action('wp_enqueue_scripts', 'loan_calculator_enqueue_scripts');

function loan_calculator_shortcode() {
    return '
        <div id="loan-calculator-root">
            <div class="loading-message" style="padding: 20px; text-align: center;">
                Loading calculator...
            </div>
        </div>
    ';
}
add_shortcode('loan_calculator', 'loan_calculator_shortcode');