<?php
/**
 * Plugin Name: Loan Calculator
 * Description: Modern loan calculator with React
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function loan_calculator_enqueue_scripts() {
    // Enqueue the built files
    wp_enqueue_script(
        'loan-calculator',
        plugins_url('dist/index.js', __FILE__),
        ['wp-element'],  // This includes React
        filemtime(plugin_dir_path(__FILE__) . 'dist/index.js'),
        true
    );

    wp_enqueue_style(
        'loan-calculator-style',
        plugins_url('dist/index.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'dist/index.css')
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

// Add a shortcode to render the calculator
function loan_calculator_shortcode() {
    return '<div id="loan-calculator-root"></div>';
}
add_shortcode('loan_calculator', 'loan_calculator_shortcode');