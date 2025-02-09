<?php
/**
 * Plugin Name: Loan Calculator
 * Description: Modern loan calculator with React
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: loan-calculator
 */

if (!defined('ABSPATH')) {
    exit;
}

class LoanCalculator {
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', [$this, 'register_kredits_post_type']);
        add_action('add_meta_boxes', [$this, 'add_kredit_meta_boxes']);
        add_action('save_post_kredits', [$this, 'save_kredit_meta']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_shortcode('loan_calculator', [$this, 'render_calculator']);
        add_shortcode('full_loan_calculator', [$this, 'render_full_calculator']);
    }

    /**
     * Register Kredits custom post type
     */
    public function register_kredits_post_type() {
        register_post_type('kredits', [
            'labels' => [
                'name' => __('Kredits', 'loan-calculator'),
                'singular_name' => __('Kredit', 'loan-calculator'),
            ],
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-money-alt',
            'supports' => ['title', 'editor', 'thumbnail'],
            'show_in_rest' => true,
            'rewrite' => ['slug' => 'kredits'],
        ]);
    }

    /**
     * Add meta boxes for Kredits
     */
    public function add_kredit_meta_boxes() {
        add_meta_box(
            'kredit_meta_box',
            __('Kredit Details', 'loan-calculator'),
            [$this, 'render_kredit_meta_box'],
            'kredits',
            'normal',
            'high'
        );
    }

    /**
     * Render meta box content
     */
    public function render_kredit_meta_box($post) {
        // Add nonce for security
        wp_nonce_field('kredit_meta_box', 'kredit_meta_box_nonce');

        $icon = get_post_meta($post->ID, 'kredita_ikona', true);
        ?>
        <div class="kredit-meta-box">
            <p>
                <label for="kredita_ikona">
                    <?php _e('Icon URL', 'loan-calculator'); ?>
                </label>
                <input 
                    type="text" 
                    id="kredita_ikona" 
                    name="kredita_ikona" 
                    value="<?php echo esc_attr($icon); ?>" 
                    class="widefat"
                />
                <button type="button" class="button media-upload" data-target="kredita_ikona">
                    <?php _e('Select Icon', 'loan-calculator'); ?>
                </button>
            </p>
        </div>
        <script>
            jQuery(document).ready(function($) {
                $('.media-upload').click(function(e) {
                    e.preventDefault();
                    const button = $(this);
                    const targetInput = $('#' + button.data('target'));
                    
                    const mediaUploader = wp.media({
                        title: '<?php _e("Select Icon", "loan-calculator"); ?>',
                        button: {
                            text: '<?php _e("Use this icon", "loan-calculator"); ?>'
                        },
                        multiple: false
                    });

                    mediaUploader.on('select', function() {
                        const attachment = mediaUploader.state().get('selection').first().toJSON();
                        targetInput.val(attachment.url);
                    });

                    mediaUploader.open();
                });
            });
        </script>
        <?php
    }

    /**
     * Save meta box data
     */
    public function save_kredit_meta($post_id) {
        if (!isset($_POST['kredit_meta_box_nonce']) || 
            !wp_verify_nonce($_POST['kredit_meta_box_nonce'], 'kredit_meta_box')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        if (isset($_POST['kredita_ikona'])) {
            update_post_meta(
                $post_id,
                'kredita_ikona',
                sanitize_text_field($_POST['kredita_ikona'])
            );
        }
    }

    /**
     * Enqueue scripts and styles
     */
    public function enqueue_scripts() {
        global $post;

        // Only load on pages with our shortcode
        if (!is_a($post, 'WP_Post') || 
            (!has_shortcode($post->post_content, 'loan_calculator') && 
             !has_shortcode($post->post_content, 'full_loan_calculator'))) {
            return;
        }

        wp_enqueue_script('react');
        wp_enqueue_script('react-dom');

        // Get all kredits
        $kredits = get_posts([
            'post_type' => 'kredits',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC'
        ]);

        $kredits_data = array_map(function($kredit) {
            return [
                <?php
                'id' => $kredit->ID,
                'title' => $kredit->post_title,
                'url' => get_permalink($kredit->ID),
                'icon' => get_post_meta($kredit->ID, 'kredita_ikona', true),
                'description' => get_the_excerpt($kredit->ID),
                'order' => $kredit->menu_order
            ];
        }, $kredits);

        // Get current page/post info
        $current_url = home_url($_SERVER['REQUEST_URI']);
        
        // Calculator configuration
        $calculator_config = [
            'post_id' => $post->ID,
            'default_amount' => 3000,
            'min_amount' => 500,
            'max_amount' => 25000,
            'default_term' => 36,
            'min_term' => 3,
            'max_term' => 120,
            'interest_rate' => 12,
            'currency' => '€'
        ];

        // Allow filtering of calculator config
        $calculator_config = apply_filters('loan_calculator_config', $calculator_config);

        // Enqueue main calculator script
        wp_enqueue_script(
            'loan-calculator-app',
            plugins_url('build/main.js', __FILE__),
            ['react', 'react-dom'],
            filemtime(plugin_dir_path(__FILE__) . 'build/main.js'),
            true
        );

        // Localize script with data
        wp_localize_script(
            'loan-calculator-app',
            'loanCalculatorData',
            [
                'kredits' => $kredits_data,
                'config' => $calculator_config,
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('loan_calculator_nonce'),
                'currentUrl' => $current_url
            ]
        );

        // Enqueue styles
        wp_enqueue_style(
            'loan-calculator-style',
            plugins_url('build/main.css', __FILE__),
            [],
            filemtime(plugin_dir_path(__FILE__) . 'build/main.css')
        );
    }

    /**
     * Render calculator shortcode
     */
    public function render_calculator() {
        ob_start();
        ?>
        <div 
            id="loan-calculator-root" 
            class="loan-calculator-wrapper"
            data-loading="<?php esc_attr_e('Loading calculator...', 'loan-calculator'); ?>"
        >
            <div class="loan-calculator-loading">
                <?php esc_html_e('Loading calculator...', 'loan-calculator'); ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render full calculator shortcode
     */
    public function render_full_calculator() {
        ob_start();
        ?>
        <div 
            id="full-calculator-root" 
            class="full-calculator-wrapper"
            data-loading="<?php esc_attr_e('Loading calculator...', 'loan-calculator'); ?>"
        >
            <div class="full-calculator-loading">
                <?php esc_html_e('Loading calculator...', 'loan-calculator'); ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Plugin activation
     */
    public static function activate() {
        // Flush rewrite rules for custom post types
        flush_rewrite_rules();

        // Create necessary database tables if needed
        self::create_tables();
    }

 
    /**
     * Plugin deactivation
     */
    public static function deactivate() {
        // Clean up if necessary
    }
}

// Initialize the plugin
function loan_calculator_init() {
    $loan_calculator = new LoanCalculator();
}
add_action('plugins_loaded', 'loan_calculator_init');

// Register activation and deactivation hooks
register_activation_hook(__FILE__, ['LoanCalculator', 'activate']);
register_deactivation_hook(__FILE__, ['LoanCalculator', 'deactivate']);

// Add settings link to plugins page
function loan_calculator_settings_link($links) {
    $settings_link = '<a href="' . admin_url('edit.php?post_type=kredits') . '">' . 
        __('Settings', 'loan-calculator') . '</a>';
    array_unshift($links, $settings_link);
    return $links;
}
$plugin = plugin_basename(__FILE__);
add_filter("plugin_action_links_$plugin", 'loan_calculator_settings_link');

/**
 * Add custom column to kredits list
 */
function add_kredits_columns($columns) {
    $new_columns = array();
    foreach ($columns as $key => $value) {
        if ($key === 'title') {
            $new_columns[$key] = $value;
            $new_columns['icon'] = __('Icon', 'loan-calculator');
        } else {
            $new_columns[$key] = $value;
        }
    }
    return $new_columns;
}
add_filter('manage_kredits_posts_columns', 'add_kredits_columns');

/**
 * Display custom column content
 */
function display_kredits_column($column, $post_id) {
    if ($column === 'icon') {
        $icon_url = get_post_meta($post_id, 'kredita_ikona', true);
        if ($icon_url) {
            echo '<img src="' . esc_url($icon_url) . '" style="max-width: 50px; height: auto;" />';
        }
    }
}
add_action('manage_kredits_posts_custom_column', 'display_kredits_column', 10, 2);