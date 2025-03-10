<?php
/**
 * Script to retrieve Pipedrive custom field keys
 * 
 * This script will fetch all lead fields from Pipedrive and display their keys
 * Run this script once to get the field keys, then update your api.php file
 */

// Make sure to define PIPEDRIVE_API_KEY in wp-config.php or set it here
if (!defined('PIPEDRIVE_API_KEY')) {
    // Uncomment and set your API key here for testing
    // define('PIPEDRIVE_API_KEY', 'your_api_key_here');
    
    if (!defined('ABSPATH')) {
        echo "PIPEDRIVE_API_KEY not defined. Please set it in wp-config.php or in this script.\n";
        exit;
    }
}

$api_key = defined('PIPEDRIVE_API_KEY') ? PIPEDRIVE_API_KEY : '';

if (empty($api_key)) {
    echo "PIPEDRIVE_API_KEY is empty. Please set a valid API key.\n";
    exit;
}

// Function to make API request
function make_api_request($url, $api_key) {
    $response = wp_remote_get($url . '?' . http_build_query(['api_token' => $api_key]));
    
    if (is_wp_error($response)) {
        echo "Error: " . $response->get_error_message() . "\n";
        return null;
    }
    
    $body = json_decode(wp_remote_retrieve_body($response), true);
    
    if (empty($body['success'])) {
        echo "API Error: " . print_r($body, true) . "\n";
        return null;
    }
    
    return $body['data'];
}

// Get lead fields
$lead_fields = make_api_request('https://api.pipedrive.com/v1/leadFields', $api_key);

if ($lead_fields) {
    echo "<h2>Pipedrive Lead Fields</h2>\n";
    echo "<table border='1' cellpadding='5'>\n";
    echo "<tr><th>Field Name</th><th>Field Key</th><th>Field Type</th></tr>\n";
    
    foreach ($lead_fields as $field) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($field['name']) . "</td>";
        echo "<td>" . htmlspecialchars($field['key']) . "</td>";
        echo "<td>" . htmlspecialchars($field['field_type']) . "</td>";
        echo "</tr>\n";
    }
    
    echo "</table>\n";
    
    echo "<h3>Example Usage in api.php</h3>\n";
    echo "<pre>\n";
    echo "// Example of how to map your form data to Pipedrive lead fields\n";
    
    foreach ($lead_fields as $field) {
        $form_field = strtolower(str_replace(' ', '_', $field['name']));
        echo "if (isset(\$data['{$form_field}'])) {\n";
        echo "    \$lead_data['" . $field['key'] . "'] = \$data['{$form_field}'];\n";
        echo "}\n\n";
    }
    
    echo "</pre>\n";
} else {
    echo "Failed to retrieve lead fields from Pipedrive.\n";
}

// Also get deal fields (leads inherit from deals)
$deal_fields = make_api_request('https://api.pipedrive.com/v1/dealFields', $api_key);

if ($deal_fields) {
    echo "<h2>Pipedrive Deal Fields (Leads inherit these)</h2>\n";
    echo "<table border='1' cellpadding='5'>\n";
    echo "<tr><th>Field Name</th><th>Field Key</th><th>Field Type</th></tr>\n";
    
    foreach ($deal_fields as $field) {
        // Only show custom fields
        if (isset($field['key']) && strpos($field['key'], 'cf_') === 0) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($field['name']) . "</td>";
            echo "<td>" . htmlspecialchars($field['key']) . "</td>";
            echo "<td>" . htmlspecialchars($field['field_type']) . "</td>";
            echo "</tr>\n";
        }
    }
    
    echo "</table>\n";
}
