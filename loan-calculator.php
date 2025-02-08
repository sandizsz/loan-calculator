<?php
/**
 * Plugin Name: Loan Calculator
 * Description: Loan calculator built with React and Tailwind
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function loan_calculator_enqueue_scripts() {
    wp_enqueue_script('react', 'https://unpkg.com/react@17/umd/react.production.min.js', array(), '17.0.2', true);
    wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js', array('react'), '17.0.2', true);
    
    wp_enqueue_style(
        'tailwind',
        'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css',
        array(),
        '2.2.19'
    );
    
    wp_enqueue_script(
        'loan-calculator', 
        plugins_url('assets/js/loan-calculator.js', __FILE__), 
        array('react', 'react-dom'),
        '1.0.0',
        true
    );

    // Get kredits data
    $kredits_data = array();
    $current_post_id = get_queried_object_id();
    
    if(function_exists('get_field')) {
        $kredits = get_posts(array(
            'post_type' => 'kredits',
            'posts_per_page' => -1
        ));

        foreach ($kredits as $kredit) {
            $kredits_data[] = array(
                'title' => $kredit->post_title,
                'url' => get_permalink($kredit->ID),
                'icon' => get_field('kredita_ikona', $kredit->ID),
                'id' => $kredit->ID
            );
        }
    }

    wp_localize_script(
        'loan-calculator',
        'loanCalculatorData',
        array(
            'kredits' => $kredits_data,
            'currentPostId' => $current_post_id
        )
    );
}
add_action('wp_enqueue_scripts', 'loan_calculator_enqueue_scripts');

function loan_calculator_shortcode($atts) {
    // Parse shortcode attributes with defaults
    $attributes = shortcode_atts(array(
        'min_amount' => 500,
        'max_amount' => 25000,
        'default_amount' => 3000,
        'min_term' => 3,
        'max_term' => 120,
        'default_term' => 36,
        'interest_rate' => 12, // Annual interest rate in percentage
        'currency' => '€'
    ), $atts);

    // Pass attributes to JavaScript
    wp_localize_script(
        'loan-calculator',
        'calculatorConfig',
        $attributes
    );

    return '<div id="loan-calculator-root" class="loan-calculator-wrapper"></div>';
}
add_shortcode('loan_calculator', 'loan_calculator_shortcode');


function full_calculator_shortcode($atts) {
    // Parse shortcode attributes with defaults
    $attributes = shortcode_atts(array(
        'min_amount' => 500,
        'max_amount' => 25000,
        'default_amount' => 3000,
        'min_term' => 3,
        'max_term' => 120,
        'default_term' => 36,
        'interest_rate' => 12, // Annual interest rate in percentage
        'currency' => '€'
    ), $atts);

    // Pass attributes to JavaScript
    wp_localize_script(
        'loan-calculator',
        'calculatorConfig',
        $attributes
    );

    return '<div id="full-calculator-root" class="full-calculator-wrapper"></div>';
}
add_shortcode('full_calculator', 'full_calculator_shortcode');