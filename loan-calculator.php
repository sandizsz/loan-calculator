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
    global $post;
    
    // Explicitly load WordPress React
    wp_enqueue_script('react');
    wp_enqueue_script('react-dom');
    
    // Check if we're on the form page
    $is_form_page = has_shortcode($post->post_content, 'full_loan_calculator');
    
    // Enqueue the appropriate script based on the page
    if ($is_form_page) {
        wp_enqueue_script(
            'full-loan-calculator',
            plugins_url('build/fullCalculator.js', __FILE__),
            ['react', 'react-dom'],
            filemtime(plugin_dir_path(__FILE__) . 'build/fullCalculator.js'),
            true
        );
    } else {
        wp_enqueue_script(
            'loan-calculator', 
            plugins_url('build/main.js', __FILE__),
            ['react', 'react-dom'],
            filemtime(plugin_dir_path(__FILE__) . 'build/main.js'),
            true
        );
    }


  // Enqueue the processed CSS from build directory
wp_enqueue_style(
    'loan-calculator-style',
    plugins_url('build/main.css', __FILE__),
    [],
    filemtime(plugin_dir_path(__FILE__) . 'build/main.css')
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

function full_loan_calculator_shortcode() {
    return '
        <div id="full-calculator-root">
            <div class="loading-message" style="padding: 20px; text-align: center;">
                Loading calculator...
            </div>
        </div>
    ';
}

add_shortcode('loan_calculator', 'loan_calculator_shortcode');
add_shortcode('full_loan_calculator', 'full_loan_calculator_shortcode');