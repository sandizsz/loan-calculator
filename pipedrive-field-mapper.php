<?php
/**
 * Enhanced Pipedrive Field Mapper
 * 
 * This script retrieves all custom field information from Pipedrive,
 * including enum options with their IDs, and generates PHP code for
 * proper mapping in your API integration.
 * 
 * Place this file in your WordPress plugin directory and access it directly
 * via browser to see all field details.
 */

// Load WordPress
require_once('../../../../wp-load.php');

// Check for API key
if (!defined('PIPEDRIVE_API_KEY')) {
    echo "<div style='color:red; padding:20px; background:#ffe6e6; border:1px solid #ff0000; margin:20px;'>";
    echo "<h2>Error: PIPEDRIVE_API_KEY not defined</h2>";
    echo "<p>Please add your Pipedrive API key to wp-config.php:</p>";
    echo "<pre>define('PIPEDRIVE_API_KEY', 'your-api-key-here');</pre>";
    echo "</div>";
    exit;
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

// CSS for better display
echo '<style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; margin: 20px; line-height: 1.5; color: #333; }
    h1, h2, h3 { margin-top: 30px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
    th, td { text-align: left; padding: 12px; border: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    tr:hover { background-color: #f5f5f5; }
    .option-id { font-weight: bold; color: #0066cc; }
    .key { font-family: monospace; background: #f0f0f0; padding: 2px 4px; }
    .code { background: #f8f8f8; border: 1px solid #ddd; padding: 15px; margin: 15px 0; overflow: auto; font-family: monospace; }
    .important { background-color: #ffffd9; font-weight: bold; }
    .enum-values { margin-left: 20px; }
    .download-button { display: inline-block; background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
    .tabs { display: flex; margin-bottom: 20px; }
    .tab { padding: 10px 20px; cursor: pointer; background: #f0f0f0; margin-right: 2px; }
    .tab.active { background: #007cba; color: white; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
</style>';

echo '<h1>Pipedrive Field Mapper</h1>';

// Create tabs
echo '<div class="tabs">
    <div class="tab active" onclick="switchTab(\'leadFields\')">Lead Fields</div>
    <div class="tab" onclick="switchTab(\'dealFields\')">Deal Fields</div>
    <div class="tab" onclick="switchTab(\'generatedCode\')">Generated Code</div>
</div>';

// Lead Fields Tab
echo '<div id="leadFields" class="tab-content active">';
if (!$lead_fields['success']) {
    echo "<div style='color:red;'>Error fetching lead fields: {$lead_fields['error']}</div>";
} else {
    echo "<h2>Lead Fields</h2>";
    echo "<p>These are all available lead fields from Pipedrive. Fields marked with an asterisk (*) are custom fields.</p>";
    
    echo "<table>";
    echo "<tr><th>Name</th><th>Key</th><th>Type</th><th>Options</th></tr>";
    
    foreach ($lead_fields['data'] as $field) {
        $is_custom = (isset($field['key']) && strpos($field['key'], 'cf_') === 0) ? ' *' : '';
        echo "<tr>";
        echo "<td>{$field['name']}{$is_custom}</td>";
        echo "<td class='key'>{$field['key']}</td>";
        echo "<td>{$field['field_type']}</td>";
        
        echo "<td>";
        if (in_array($field['field_type'], ['enum', 'set']) && !empty($field['options'])) {
            echo "<div class='enum-values'>";
            foreach ($field['options'] as $option) {
                echo "<div><span class='option-id'>{$option['id']}</span> - {$option['label']}</div>";
            }
            echo "</div>";
        }
        echo "</td>";
        
        echo "</tr>";
    }
    
    echo "</table>";
}
echo '</div>';

// Deal Fields Tab
echo '<div id="dealFields" class="tab-content">';
if (!$deal_fields['success']) {
    echo "<div style='color:red;'>Error fetching deal fields: {$deal_fields['error']}</div>";
} else {
    echo "<h2>Deal Fields</h2>";
    echo "<p>These are custom deal fields that could be inherited by leads. Fields marked with an asterisk (*) are custom fields.</p>";
    
    echo "<table>";
    echo "<tr><th>Name</th><th>Key</th><th>Type</th><th>Options</th></tr>";
    
    foreach ($deal_fields['data'] as $field) {
        // Only show custom fields
        if (isset($field['key']) && strpos($field['key'], 'cf_') === 0) {
            echo "<tr>";
            echo "<td>{$field['name']} *</td>";
            echo "<td class='key'>{$field['key']}</td>";
            echo "<td>{$field['field_type']}</td>";
            
            echo "<td>";
            if (in_array($field['field_type'], ['enum', 'set']) && !empty($field['options'])) {
                echo "<div class='enum-values'>";
                foreach ($field['options'] as $option) {
                    echo "<div><span class='option-id'>{$option['id']}</span> - {$option['label']}</div>";
                }
                echo "</div>";
            }
            echo "</td>";
            
            echo "</tr>";
        }
    }
    
    echo "</table>";
}
echo '</div>';

// Generated Code Tab
echo '<div id="generatedCode" class="tab-content">';
echo "<h2>Generated PHP Code for Field Mapping</h2>";
echo "<p>Copy this code into your api.php file to properly map form fields to Pipedrive fields.</p>";

echo "<div class='code'>";
echo "<pre>";
echo "// Custom field mapping for Pipedrive Lead fields\n";
echo "// Generated on " . date('Y-m-d H:i:s') . "\n\n";

// Generate code for enum fields
if ($lead_fields['success']) {
    foreach ($lead_fields['data'] as $field) {
        if (in_array($field['field_type'], ['enum', 'set'])) {
            $field_name = str_replace([' ', '-'], '_', strtolower($field['name']));
            $field_key = $field['key'];
            
            echo "// {$field['name']} (key: {$field_key}) - {$field['field_type']} field\n";
            echo "if (!empty(\$data['{$field_name}'])) {\n";
            echo "    // Map to the correct option ID\n";
            echo "    \${$field_name}_map = [\n";
            
            if (!empty($field['options'])) {
                foreach ($field['options'] as $option) {
                    $option_key = str_replace([' ', '-'], '_', strtolower($option['label']));
                    echo "        '{$option_key}' => {$option['id']},  // {$option['label']}\n";
                }
            }
            
            echo "    ];\n\n";
            echo "    \${$field_name}_value = isset(\${$field_name}_map[\$data['{$field_name}']]) ? \${$field_name}_map[\$data['{$field_name}']] : ";
            
            if (!empty($field['options'][0]['id'])) {
                echo "{$field['options'][0]['id']};\n";
            } else {
                echo "null;\n";
            }
            
            if ($field['field_type'] === 'set') {
                echo "    // For set fields, we need to send an array of option IDs\n";
                echo "    \$lead_data['{$field_key}'] = [\${$field_name}_value];\n";
            } else {
                echo "    \$lead_data['{$field_key}'] = \${$field_name}_value;\n";
            }
            echo "}\n\n";
        } else if ($field['field_type'] === 'varchar' || $field['field_type'] === 'text') {
            $field_name = str_replace([' ', '-'], '_', strtolower($field['name']));
            $field_key = $field['key'];
            
            echo "// {$field['name']} (key: {$field_key})\n";
            echo "if (!empty(\$data['{$field_name}'])) {\n";
            echo "    \$lead_data['{$field_key}'] = \$data['{$field_name}'];\n";
            echo "}\n\n";
        }
    }
}

echo "</pre>";
echo "</div>";
echo '</div>';

// JavaScript for tab switching
echo '<script>
function switchTab(tabId) {
    // Hide all tab contents
    var tabContents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    
    // Deactivate all tabs
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    
    // Show the selected tab content
    document.getElementById(tabId).classList.add("active");
    
    // Activate the clicked tab
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].textContent.toLowerCase().includes(tabId.toLowerCase())) {
            tabs[i].classList.add("active");
        }
    }
}
</script>';