<?php
// Test script to debug Pipedrive API integration

// Load WordPress
require_once('../../../../wp-load.php');

// Check if PIPEDRIVE_API_KEY is defined
if (!defined('PIPEDRIVE_API_KEY')) {
    echo "PIPEDRIVE_API_KEY not defined in wp-config.php\n";
    exit;
}

$api_key = PIPEDRIVE_API_KEY;
echo "Using API key: " . substr($api_key, 0, 5) . "...\n";

// Test 1: Get Pipedrive users
echo "\n--- Test 1: Get Pipedrive Users ---\n";
$users_response = wp_remote_get('https://api.pipedrive.com/v1/users?' . http_build_query([
    'api_token' => $api_key,
    'limit' => 1
]));

if (is_wp_error($users_response)) {
    echo "Error: " . $users_response->get_error_message() . "\n";
} else {
    $status_code = wp_remote_retrieve_response_code($users_response);
    $body = json_decode(wp_remote_retrieve_body($users_response), true);
    
    echo "Status code: " . $status_code . "\n";
    if ($status_code === 200) {
        echo "Success! Found " . count($body['data']) . " users\n";
        echo "First user: " . $body['data'][0]['name'] . " (ID: " . $body['data'][0]['id'] . ")\n";
    } else {
        echo "Error response: " . print_r($body, true) . "\n";
    }
}

// Test 2: Get Lead Fields
echo "\n--- Test 2: Get Lead Fields ---\n";
$fields_response = wp_remote_get('https://api.pipedrive.com/v1/leadFields?' . http_build_query([
    'api_token' => $api_key
]));

if (is_wp_error($fields_response)) {
    echo "Error: " . $fields_response->get_error_message() . "\n";
} else {
    $status_code = wp_remote_retrieve_response_code($fields_response);
    $body = json_decode(wp_remote_retrieve_body($fields_response), true);
    
    echo "Status code: " . $status_code . "\n";
    if ($status_code === 200) {
        echo "Success! Found " . count($body['data']) . " lead fields\n";
        
        // Display enum fields and their options
        echo "\nEnum fields and their options:\n";
        foreach ($body['data'] as $field) {
            if ($field['field_type'] === 'enum' || $field['field_type'] === 'set') {
                echo "- " . $field['name'] . " (key: " . $field['key'] . ", type: " . $field['field_type'] . ")\n";
                if (!empty($field['options'])) {
                    echo "  Options:\n";
                    foreach ($field['options'] as $option) {
                        echo "    * " . $option['label'] . " (id: " . $option['id'] . ")\n";
                    }
                }
                echo "\n";
            }
        }
    } else {
        echo "Error response: " . print_r($body, true) . "\n";
    }
}

// Test 3: Create a test lead with minimal data
echo "\n--- Test 3: Create Test Lead ---\n";

// Get first user ID for owner_id
$owner_id = null;
$users_response = wp_remote_get('https://api.pipedrive.com/v1/users?' . http_build_query([
    'api_token' => $api_key,
    'limit' => 1
]));

if (!is_wp_error($users_response)) {
    $users_body = json_decode(wp_remote_retrieve_body($users_response), true);
    if (!empty($users_body['data'][0]['id'])) {
        $owner_id = $users_body['data'][0]['id'];
    }
}

if (!$owner_id) {
    echo "Could not get owner_id, skipping lead creation test\n";
} else {
    // Create minimal test lead
    $test_lead_data = [
        'title' => 'Test Lead ' . date('Y-m-d H:i:s'),
        'owner_id' => $owner_id,
    ];
    
    echo "Sending test lead data: " . json_encode($test_lead_data, JSON_PRETTY_PRINT) . "\n";
    
    $lead_response = wp_remote_post('https://api.pipedrive.com/v1/leads?' . http_build_query(['api_token' => $api_key]), [
        'headers' => [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode($test_lead_data),
        'timeout' => 30
    ]);
    
    if (is_wp_error($lead_response)) {
        echo "Error: " . $lead_response->get_error_message() . "\n";
    } else {
        $status_code = wp_remote_retrieve_response_code($lead_response);
        $body = json_decode(wp_remote_retrieve_body($lead_response), true);
        
        echo "Status code: " . $status_code . "\n";
        echo "Response: " . json_encode($body, JSON_PRETTY_PRINT) . "\n";
        
        if ($status_code === 201 || $status_code === 200) {
            echo "Success! Created test lead with ID: " . $body['data']['id'] . "\n";
        } else {
            echo "Failed to create test lead\n";
        }
    }
}

echo "\nTests completed.\n";
