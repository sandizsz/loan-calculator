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
    global $post;
    
    // Explicitly load WordPress React
    wp_enqueue_script('react');
    wp_enqueue_script('react-dom');
    
    // Check if we're on the form page
    $is_form_page = has_shortcode($post->post_content, 'full_loan_calculator');
    
    // Get all kredits posts
    $kredits = get_posts([
        'post_type' => 'kredits',
        'posts_per_page' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC'
    ]);

    $kredits_data = array_map(function($kredit) {
        // Using ACF's get_field which automatically returns the URL for image fields
        $icon = function_exists('get_field') ? get_field('kredita_ikona', $kredit->ID) : '';
        
        return [
            'id' => $kredit->ID,
            'title' => esc_html($kredit->post_title),
            'url' => esc_url(get_permalink($kredit->ID)),
            'icon' => esc_url($icon)
        ];
    }, $kredits);

    // Localize script with kredits data
    wp_localize_script(
        $is_form_page ? 'full-loan-calculator' : 'loan-calculator',
        'loanCalculatorData',
        ['kredits' => $kredits_data]
    );
    
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
}
add_action('wp_enqueue_scripts', 'loan_calculator_enqueue_scripts');

function loan_calculator_shortcode($atts) {
    // Parse shortcode attributes with defaults
    $attributes = shortcode_atts([
        'min_amount' => 500,
        'max_amount' => 25000,
        'default_amount' => 3000,
        'min_term' => 3,
        'max_term' => 120,
        'default_term' => 36,
        'interest_rate' => 12, // Annual interest rate in percentage
        'currency' => '€'
    ], $atts);

    // Pass attributes to JavaScript
    wp_localize_script(
        'loan-calculator',
        'calculatorConfig',
        $attributes
    );

    return '<div id="loan-calculator-root" class="loan-calculator-wrapper"></div>';
}
add_shortcode('loan_calculator', 'loan_calculator_shortcode');

function full_loan_calculator_shortcode() {
    return '<div id="full-calculator-root">
        <div class="loading-message" style="padding: 20px; text-align: center;">
            Loading calculator...
        </div>
    </div>';
}
add_shortcode('full_loan_calculator', 'full_loan_calculator_shortcode');