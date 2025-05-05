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

// Include API functions
require_once plugin_dir_path(__FILE__) . 'includes/api.php';
require_once plugin_dir_path(__FILE__) . 'includes/consumer-loan-api.php';

require_once(plugin_dir_path(__FILE__) . 'pipedrive-admin.php');

// Register Kredits Custom Post Type



function render_kredit_icon_meta_box($post) {
    $icon = get_post_meta($post->ID, 'kredita_ikona', true);
    wp_nonce_field('kredit_icon_meta_box', 'kredit_icon_meta_box_nonce');
    ?>
    <p>
        <label for="kredita_ikona">Icon URL:</label>
        <input type="text" id="kredita_ikona" name="kredita_ikona" value="<?php echo esc_attr($icon); ?>" style="width: 100%">
    </p>
    <?php
}

function save_kredit_meta_boxes($post_id) {
    if (!isset($_POST['kredit_icon_meta_box_nonce'])) {
        return;
    }

    if (!wp_verify_nonce($_POST['kredit_icon_meta_box_nonce'], 'kredit_icon_meta_box')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (isset($_POST['kredita_ikona'])) {
        update_post_meta($post_id, 'kredita_ikona', sanitize_text_field($_POST['kredita_ikona']));
    }
}
add_action('save_post', 'save_kredit_meta_boxes');

// Enqueue Scripts and Styles
function loan_calculator_enqueue_scripts() {
    // Register scripts
    wp_register_script(
        'loan-calculator', 
        plugins_url('build/main.js', __FILE__),
        ['wp-element', 'wp-components'], // wp-element contains React
        filemtime(plugin_dir_path(__FILE__) . 'build/main.js'),
        true
    );
    
    // Add defer attribute to script
    add_filter('script_loader_tag', function($tag, $handle) {
        if ('loan-calculator' === $handle) {
            return str_replace(' src', ' defer src', $tag);
        }
        return $tag;
    }, 10, 2);

    // Register full calculator script
    // Register React and ReactDOM
    wp_register_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', [], '18.0.0', true);
    wp_register_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', ['react'], '18.0.0', true);

    wp_register_script(
        'full-calculator', 
        plugins_url('build/fullCalculator.js', __FILE__),
        ['react', 'react-dom', 'wp-element', 'wp-components', 'loan-calculator'],
        filemtime(plugin_dir_path(__FILE__) . 'build/fullCalculator.js'),
        true
    );
    
    // Register consumer loan calculator script
    wp_register_script(
        'consumer-loan-calculator', 
        plugins_url('build/consumerLoan.js', __FILE__),
        ['react', 'react-dom', 'wp-element', 'wp-components', 'loan-calculator'],
        filemtime(plugin_dir_path(__FILE__) . 'build/consumerLoan.js'),
        true
    );

    // Get all kredits posts
    $kredits = get_posts([
        'post_type' => 'kredits',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'ASC',
        'post_status' => 'publish',
        'tax_query' => [
            [
                'taxonomy' => 'category',
                'field' => 'term_id',
                'terms' => 10
            ]
        ]
    ]);

    // Transform kredits data
    $kredits_data = array_map(function($kredit) {
        // Get icon using ACF
       
        
        return [
            'id' => $kredit->ID,
            'title' => $kredit->post_title,
            'url' => get_permalink($kredit->ID),
            'icon' => get_field('kredita_ikona', $kredit->ID),
            'slug' => $kredit->post_name
        ];
    }, $kredits);

    // Optimize data structure
    $calculator_data = [
        'kredits' => array_map(function($kredit) {
            return [
                'id' => $kredit['id'],
                'title' => $kredit['title'],
                'url' => $kredit['url'],
                'icon' => $kredit['icon'],
                'slug' => $kredit['slug']
            ];
        }, $kredits_data),
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('loan_calculator_nonce'),
        'currentPostId' => get_the_ID(),
        'siteUrl' => home_url()
    ];

    // Localize script for both calculators
    wp_localize_script('loan-calculator', 'loanCalculatorData', $calculator_data);
    wp_localize_script('full-calculator', 'loanCalculatorData', $calculator_data);
    
    // Check for shortcodes in the current content
    global $post;
    $should_load_calculator = false;
    $should_load_full_calculator = false;
    $should_load_consumer_loan = false;
    
    if ($post && $post->post_content) {
        $should_load_calculator = has_shortcode($post->post_content, 'loan_calculator');
        $should_load_full_calculator = has_shortcode($post->post_content, 'full_calculator');
        $should_load_consumer_loan = has_shortcode($post->post_content, 'consumer_loan_calculator');
    }
    
    // Also check for shortcodes in widgets
    if (!$should_load_calculator && !$should_load_full_calculator) {
        $widgets = get_option('widget_text');
        if (is_array($widgets)) {
            foreach ($widgets as $widget) {
                if (is_array($widget) && isset($widget['text'])) {
                    if (strpos($widget['text'], '[loan_calculator]') !== false) {
                        $should_load_calculator = true;
                    }
                    if (strpos($widget['text'], '[full_calculator]') !== false) {
                        $should_load_full_calculator = true;
                    }
                    if (strpos($widget['text'], '[consumer_loan_calculator]') !== false) {
                        $should_load_consumer_loan = true;
                    }
                }
            }
        }
    }

    // Enqueue scripts if needed
    if ($should_load_calculator) {
        wp_enqueue_script('loan-calculator');
    }
    if ($should_load_full_calculator) {
        wp_enqueue_script('full-calculator');
    }
    if ($should_load_consumer_loan) {
        wp_enqueue_script('consumer-loan-calculator');
    }

    // Enqueue styles
    wp_enqueue_style(
        'loan-calculator-style',
        plugins_url('build/main.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'build/main.css')
    );

    // Enqueue full calculator styles if needed
    if ($should_load_full_calculator) {
        wp_enqueue_style(
            'full-calculator-style',
            plugins_url('build/fullCalculator.css', __FILE__),
            [],
            filemtime(plugin_dir_path(__FILE__) . 'build/fullCalculator.css')
        );
    }
    
    // Enqueue consumer loan calculator styles if needed
    if ($should_load_consumer_loan) {
        wp_enqueue_style(
            'consumer-loan-style',
            plugins_url('build/consumerLoan.css', __FILE__),
            [],
            filemtime(plugin_dir_path(__FILE__) . 'build/consumerLoan.css')
        );
    }

    // Debug output if needed
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Loan Calculator Data: ' . print_r($calculator_data, true));
    }
}
add_action('wp_enqueue_scripts', 'loan_calculator_enqueue_scripts');

// Shortcodes
function loan_calculator_shortcode($atts = []) {
    // Parse attributes
    $atts = shortcode_atts([
        'no_redirect' => 'false', // Default to allowing redirects
        'consumer_loan' => 'false', // Default to business loan
        'redirect_url' => '', // Custom redirect URL
    ], $atts);
    
    // Enqueue the script
    wp_enqueue_script('loan-calculator');
    
    // Add the attributes to the data passed to JavaScript
    $script = "<script>window.loanCalculatorConfig = { 
        noRedirect: {$atts['no_redirect']},
        consumerLoan: {$atts['consumer_loan']},
        redirectUrl: '{$atts['redirect_url']}'
    };
    
    // Add AccountScoring client ID if available
    window.loanCalculatorData = window.loanCalculatorData || {};
    window.loanCalculatorData.accountScoringClientId = '" . get_option('loan_calculator_accountscoring_client_id', '') . "';
    </script>";
    
    ob_start();
    echo $script;
    ?>
    <div id="loan-calculator-root">
        <div class="loading-container" style="padding: 20px; text-align: center;">
            <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 0, 0, 0.1); border-radius: 50%; border-top-color: #FFC600; animation: spin 1s ease-in-out infinite;"></div>
        </div>
    </div>
    <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
    <?php
    return ob_get_clean();
}
add_shortcode('loan_calculator', 'loan_calculator_shortcode');

function full_calculator_shortcode() {
    ob_start();
    ?>
    <div id="full-calculator-root">
        <div class="loading-container" style="padding: 20px; text-align: center;">
            <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 0, 0, 0.1); border-radius: 50%; border-top-color: #FFC600; animation: spin 1s ease-in-out infinite;"></div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('full_calculator', 'full_calculator_shortcode');

function consumer_loan_calculator_shortcode() {
    ob_start();
    ?>
    <div id="consumer-loan-calculator-root">
        <div class="loading-container" style="padding: 20px; text-align: center;">
            <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 0, 0, 0.1); border-radius: 50%; border-top-color: #FFC600; animation: spin 1s ease-in-out infinite;"></div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('consumer_loan_calculator', 'consumer_loan_calculator_shortcode');

// Add settings for AccountScoring API
function loan_calculator_register_settings() {
    register_setting('loan_calculator_settings', 'loan_calculator_accountscoring_api_key');
    register_setting('loan_calculator_settings', 'loan_calculator_accountscoring_client_id');
}
add_action('admin_init', 'loan_calculator_register_settings');

// Add settings page
function loan_calculator_add_settings_page() {
    add_submenu_page(
        'options-general.php',
        'Loan Calculator Settings',
        'Loan Calculator',
        'manage_options',
        'loan-calculator-settings',
        'loan_calculator_settings_page'
    );
}
add_action('admin_menu', 'loan_calculator_add_settings_page');

// Settings page content
function loan_calculator_settings_page() {
    ?>
    <div class="wrap">
        <h1>Loan Calculator Settings</h1>
        <form method="post" action="options.php">
            <?php settings_fields('loan_calculator_settings'); ?>
            <?php do_settings_sections('loan_calculator_settings'); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">AccountScoring API Key</th>
                    <td><input type="text" name="loan_calculator_accountscoring_api_key" value="<?php echo esc_attr(get_option('loan_calculator_accountscoring_api_key')); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">AccountScoring Client ID</th>
                    <td><input type="text" name="loan_calculator_accountscoring_client_id" value="<?php echo esc_attr(get_option('loan_calculator_accountscoring_client_id')); ?>" class="regular-text" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}