<?php
/**
 * Pipedrive Field Mapper Admin Page
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add admin menu
add_action('admin_menu', 'pipedrive_field_mapper_menu');

function pipedrive_field_mapper_menu() {
    add_management_page(
        'Pipedrive Field Mapper', 
        'Pipedrive Fields', 
        'manage_options', 
        'pipedrive-field-mapper', 
        'pipedrive_field_mapper_page'
    );
}

function pipedrive_field_mapper_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // Check for API key
    if (!defined('PIPEDRIVE_API_KEY')) {
        echo '<div class="notice notice-error"><p><strong>Error:</strong> PIPEDRIVE_API_KEY not defined in wp-config.php</p></div>';
        return;
    }
    
    $api_key = PIPEDRIVE_API_KEY;
    
    // Helper function to make API requests
    function get_pipedrive_data($endpoint, $api_key) {
        $url = "https://api.pipedrive.com/v1/$endpoint?" . http_build_query(['api_token' => $api_key]);
        $response = wp_remote_get($url, ['timeout' => 30]);
        
        if (is_wp_error($response)) {
            return [
                'success' => false,
                'error' => $response->get_error_message()
            ];
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (empty($body['success'])) {
            return [
                'success' => false,
                'error' => isset($body['error']) ? $body['error'] : 'Unknown API error'
            ];
        }
        
        return [
            'success' => true,
            'data' => $body['data']
        ];
    }
    
    // Fetch lead fields
    $lead_fields = get_pipedrive_data('leadFields', $api_key);
    $deal_fields = get_pipedrive_data('dealFields', $api_key);
    
    // Display the page
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <h2 class="nav-tab-wrapper">
            <a href="#lead-fields" class="nav-tab nav-tab-active">Lead Fields</a>
            <a href="#deal-fields" class="nav-tab">Deal Fields</a>
            <a href="#generated-code" class="nav-tab">Generated Code</a>
        </h2>
        
        <div id="lead-fields" class="tab-content" style="display:block;">
            <h2>Lead Fields</h2>
            <?php if (!$lead_fields['success']): ?>
                <div class="notice notice-error"><p>Error fetching lead fields: <?php echo $lead_fields['error']; ?></p></div>
            <?php else: ?>
                <p>These are all available lead fields from Pipedrive. Fields marked with an asterisk (*) are custom fields.</p>
                
                <table class="widefat striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Key</th>
                            <th>Type</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($lead_fields['data'] as $field): 
                            $is_custom = (isset($field['key']) && strpos($field['key'], 'cf_') === 0) ? ' *' : '';
                        ?>
                            <tr>
                                <td><?php echo esc_html($field['name'] . $is_custom); ?></td>
                                <td><code><?php echo esc_html($field['key']); ?></code></td>
                                <td><?php echo esc_html($field['field_type']); ?></td>
                                <td>
                                    <?php if (in_array($field['field_type'], ['enum', 'set']) && !empty($field['options'])): ?>
                                        <ul style="margin-top:0;">
                                            <?php foreach ($field['options'] as $option): ?>
                                                <li><strong><?php echo esc_html($option['id']); ?></strong> - <?php echo esc_html($option['label']); ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
        
        <div id="deal-fields" class="tab-content" style="display:none;">
            <h2>Deal Fields</h2>
            <?php if (!$deal_fields['success']): ?>
                <div class="notice notice-error"><p>Error fetching deal fields: <?php echo $deal_fields['error']; ?></p></div>
            <?php else: ?>
                <p>These are custom deal fields that could be inherited by leads. Fields marked with an asterisk (*) are custom fields.</p>
                
                <table class="widefat striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Key</th>
                            <th>Type</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($deal_fields['data'] as $field): 
                            // Only show custom fields
                            if (isset($field['key']) && strpos($field['key'], 'cf_') === 0):
                        ?>
                            <tr>
                                <td><?php echo esc_html($field['name'] . ' *'); ?></td>
                                <td><code><?php echo esc_html($field['key']); ?></code></td>
                                <td><?php echo esc_html($field['field_type']); ?></td>
                                <td>
                                    <?php if (in_array($field['field_type'], ['enum', 'set']) && !empty($field['options'])): ?>
                                        <ul style="margin-top:0;">
                                            <?php foreach ($field['options'] as $option): ?>
                                                <li><strong><?php echo esc_html($option['id']); ?></strong> - <?php echo esc_html($option['label']); ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endif; endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
        
        <div id="generated-code" class="tab-content" style="display:none;">
            <h2>Generated PHP Code for Field Mapping</h2>
            <p>Copy this code into your api.php file to properly map form fields to Pipedrive fields.</p>
            
            <textarea style="width:100%; height:500px; font-family:monospace; font-size:12px; white-space:pre;">
// Custom field mapping for Pipedrive Lead fields
// Generated on <?php echo date('Y-m-d H:i:s'); ?>

<?php if ($lead_fields['success']): 
    foreach ($lead_fields['data'] as $field):
        if (in_array($field['field_type'], ['enum', 'set'])):
            $field_name = str_replace([' ', '-'], '_', strtolower($field['name']));
            $field_key = $field['key'];
?>
// <?php echo $field['name']; ?> (key: <?php echo $field_key; ?>) - <?php echo $field['field_type']; ?> field
if (!empty($data['<?php echo $field_name; ?>'])) {
    // Map to the correct option ID
    $<?php echo $field_name; ?>_map = [
<?php if (!empty($field['options'])): 
        foreach ($field['options'] as $option):
            $option_key = str_replace([' ', '-'], '_', strtolower($option['label']));
?>
        '<?php echo $option_key; ?>' => <?php echo $option['id']; ?>,  // <?php echo $option['label']; ?>
<?php endforeach; endif; ?>
    ];

    $<?php echo $field_name; ?>_value = isset($<?php echo $field_name; ?>_map[$data['<?php echo $field_name; ?>']]) ? $<?php echo $field_name; ?>_map[$data['<?php echo $field_name; ?>']] : <?php echo !empty($field['options'][0]['id']) ? $field['options'][0]['id'] : 'null'; ?>;
<?php if ($field['field_type'] === 'set'): ?>
    // For set fields, we need to send an array of option IDs
    $lead_data['<?php echo $field_key; ?>'] = [$<?php echo $field_name; ?>_value];
<?php else: ?>
    $lead_data['<?php echo $field_key; ?>'] = $<?php echo $field_name; ?>_value;
<?php endif; ?>
}

<?php elseif ($field['field_type'] === 'varchar' || $field['field_type'] === 'text'):
            $field_name = str_replace([' ', '-'], '_', strtolower($field['name']));
            $field_key = $field['key'];
?>
// <?php echo $field['name']; ?> (key: <?php echo $field_key; ?>)
if (!empty($data['<?php echo $field_name; ?>'])) {
    $lead_data['<?php echo $field_key; ?>'] = $data['<?php echo $field_name; ?>'];
}

<?php endif; endforeach; endif; ?>
            </textarea>
        </div>
    </div>
    
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            // Tab switching
            $('.nav-tab').on('click', function(e) {
                e.preventDefault();
                
                // Hide all tab contents
                $('.tab-content').hide();
                
                // Show the selected tab content
                $($(this).attr('href')).show();
                
                // Update active tab
                $('.nav-tab').removeClass('nav-tab-active');
                $(this).addClass('nav-tab-active');
            });
        });
    </script>
    <?php
}