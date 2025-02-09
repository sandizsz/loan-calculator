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

// Register Kredits Custom Post Type
function register_kredits_post_type() {
    register_post_type('kredits', [
        'labels' => [
            'name' => 'Kredits',
            'singular_name' => 'Kredit',
            'add_new' => 'Add New',
            'add_new_item' => 'Add New Kredit',
            'edit_item' => 'Edit Kredit',
            'view_item' => 'View Kredit'
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'page-attributes'],
        'menu_icon' => 'dashicons-money-alt',
        'rewrite' => ['slug' => 'kredits']
    ]);
}
add_action('init', 'register_kredits_post_type');

// Add Meta Box for Kredit Icon
function add_kredit_meta_boxes() {
    add_meta_box(
        'kredit_icon_meta_box',
        'Kredit Icon',
        'render_kredit_icon_meta_box',
        'kredits',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'add_kredit_meta_boxes');

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

// Shortcodes
function loan_calculator_shortcode() {
    ob_start();
    ?>
    <div id="loan-calculator-root">
        <div class="loading-message" style="padding: 20px; text-align: center;">
            Loading calculator...
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('loan_calculator', 'loan_calculator_shortcode');