<?php
/**
 * Plugin Name: Loan Calculator
 * Description: Modern loan calculator with React
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit;
}



// Enqueue Scripts and Styles
function loan_calculator_enqueue_scripts() {
    global $post;
    
    if (!$post) return;

    // Register scripts
    wp_register_script(
        'loan-calculator', 
        plugins_url('build/main.js', __FILE__),
        ['react', 'react-dom'],
        filemtime(plugin_dir_path(__FILE__) . 'build/main.js'),
        true
    );

    // Get all kredits posts
    $kredits = get_posts([
        'post_type' => 'kredits',
        'posts_per_page' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC',
        'post_status' => 'publish'
    ]);

    // Transform kredits data
    $kredits_data = array_map(function($kredit) {
        return [
            'id' => $kredit->ID,
            'title' => $kredit->post_title,
            'url' => get_permalink($kredit->ID),
            'icon' => get_post_meta($kredit->ID, 'kredita_ikona', true),
            'slug' => $kredit->post_name
        ];
    }, $kredits);

    // Common data
    $calculator_data = [
        'kredits' => $kredits_data,
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('loan_calculator_nonce'),
        'siteUrl' => get_site_url(),
        'currentPostId' => $post->ID
    ];

    // Localize script
    wp_localize_script('loan-calculator', 'loanCalculatorData', $calculator_data);
    
    // Enqueue script
    wp_enqueue_script('loan-calculator');

    // Enqueue styles
    wp_enqueue_style(
        'loan-calculator-style',
        plugins_url('build/main.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'build/main.css')
    );

    // Debug output if needed
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Loan Calculator Data: ' . print_r($calculator_data, true));
    }
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