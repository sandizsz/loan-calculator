<?php

// Register REST API endpoint
add_action('rest_api_init', function () {
    register_rest_route('loan-calculator/v1', '/submit', array(
        'methods' => 'POST',
        'callback' => 'handle_loan_submission',
        'permission_callback' => '__return_true'
    ));
});

function handle_loan_submission($request) {
    $data = $request->get_params();
    
    // Get Pipedrive API key from wp-config.php
    if (!defined('PIPEDRIVE_API_KEY')) {
        return new WP_Error('pipedrive_error', 'PIPEDRIVE_API_KEY not defined in wp-config.php', array('status' => 500));
    }
    
    $pipedrive_api_key = PIPEDRIVE_API_KEY;

    // Get the first user from Pipedrive to use as owner
    $users_response = wp_remote_get('https://api.pipedrive.com/v1/users?' . http_build_query([
        'api_token' => $pipedrive_api_key,
        'limit' => 1
    ]));

    if (is_wp_error($users_response)) {
        error_log('Pipedrive Users API Error: ' . $users_response->get_error_message());
        return new WP_Error('pipedrive_error', $users_response->get_error_message(), array('status' => 500));
    }

    $users_body = json_decode(wp_remote_retrieve_body($users_response), true);
    
    if (empty($users_body['data'][0]['id'])) {
        error_log('Pipedrive Users API Error: No users found');
        return new WP_Error('pipedrive_error', 'No Pipedrive users found', array('status' => 500));
    }

    $owner_id = $users_body['data'][0]['id'];

    // Create organization first
    $org_data = array(
        'name' => $data['company_name'],
        'owner_id' => $owner_id
    );

    $org_response = wp_remote_post('https://api.pipedrive.com/v1/organizations?' . http_build_query(['api_token' => $pipedrive_api_key]), array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($org_data)
    ));

    $org_body = json_decode(wp_remote_retrieve_body($org_response), true);
    $org_id = !empty($org_body['data']['id']) ? $org_body['data']['id'] : null;

    // Create person
    $person_data = array(
        'name' => $data['contact_name'],
        'email' => array($data['email']),
        'phone' => array($data['phone']),
        'org_id' => $org_id,
        'owner_id' => $owner_id
    );

    $person_response = wp_remote_post('https://api.pipedrive.com/v1/persons?' . http_build_query(['api_token' => $pipedrive_api_key]), array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($person_data)
    ));

    $person_body = json_decode(wp_remote_retrieve_body($person_response), true);
    $person_id = !empty($person_body['data']['id']) ? $person_body['data']['id'] : null;

    // Prepare Pipedrive lead data with custom fields
    // According to Pipedrive API docs, leads inherit custom fields from deals
    // Custom fields need to be formatted with their exact field keys from Pipedrive
    
    // Get custom field keys from Pipedrive (you can cache these values)
    $custom_field_keys = get_pipedrive_custom_field_keys($pipedrive_api_key);
    
    // Base lead data
    $lead_data = array(
        'title' => $data['title'],
        'owner_id' => $owner_id,
        'person_id' => $person_id,
        'organization_id' => $org_id,
        'value' => array(
            'amount' => floatval($data['loan_amount']),
            'currency' => 'EUR'
        ),
        'expected_close_date' => date('Y-m-d', strtotime('+30 days'))
    );
    
    // Map custom fields from FullCalculator to Pipedrive custom fields
    // The field mapping should use the actual field keys from Pipedrive
    $field_mapping = array(
        'reg_number' => 'registration_number',
        'company_position' => 'company_position',
        'company_age' => 'company_age',
        'annual_turnover' => 'annual_turnover',
        'profit_loss_status' => 'profit_loss_status',
        'core_activity' => 'core_activity',
        'loan_term' => 'loan_term',
        'loan_purpose' => 'loan_purpose',
        'collateral_type' => 'collateral_type',
        'collateral_description' => 'collateral_description',
        'has_applied_elsewhere' => 'has_applied_elsewhere',
        'financial_product' => 'financial_product',
        'financing_purposes' => 'financing_purposes'
    );
    
    // Add custom fields to lead data
    foreach ($field_mapping as $form_field => $pipedrive_field) {
        if (isset($data[$form_field]) && !empty($data[$form_field])) {
            // Find the corresponding Pipedrive field key
            $field_key = isset($custom_field_keys[$pipedrive_field]) ? $custom_field_keys[$pipedrive_field] : null;
            
            if ($field_key) {
                $lead_data[$field_key] = $data[$form_field];
            }
        }
    }

    error_log('Sending lead data to Pipedrive: ' . print_r($lead_data, true));

    // Create lead in Pipedrive
    $lead_response = wp_remote_post('https://api.pipedrive.com/v1/leads?' . http_build_query(['api_token' => $pipedrive_api_key]), array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($lead_data),
        'timeout' => 30
    ));

    if (is_wp_error($lead_response)) {
        error_log('Pipedrive Lead API Error: ' . $lead_response->get_error_message());
        return new WP_Error('pipedrive_error', $lead_response->get_error_message(), array('status' => 500));
    }

    $lead_body = json_decode(wp_remote_retrieve_body($lead_response), true);
    
    if (empty($lead_body['data']['id'])) {
        error_log('Pipedrive Lead API Error: ' . print_r($lead_body, true));
        return new WP_Error('pipedrive_error', 'Failed to create lead', array('status' => 500));
    }

    $lead_id = $lead_body['data']['id'];

    // Create note for the lead with additional details
    $note_content = sprintf(
        "Loan Application Details:\n\n" .
        "Registration Number: %s\n" .
        "Contact Position: %s\n" .
        "Company Age: %s\n" .
        "Annual Turnover: %s\n" .
        "Profit/Loss Status: %s\n" .
        "Core Activity: %s\n" .
        "Loan Term: %s\n" .
        "Loan Purpose: %s\n" .
        "Collateral Type: %s\n" .
        "Collateral Description: %s\n" .
        "Applied Elsewhere: %s\n" .
        "Financial Product: %s",
        $data['reg_number'],
        $data['company_position'],
        $data['company_age'],
        $data['annual_turnover'],
        $data['profit_loss_status'],
        $data['core_activity'],
        $data['loan_term'],
        $data['loan_purpose'],
        $data['collateral_type'],
        $data['collateral_description'],
        $data['has_applied_elsewhere'],
        isset($data['financial_product']) ? $data['financial_product'] : 'Not specified'
    );

    $note_data = array(
        'content' => $note_content,
        'lead_id' => $lead_id
    );

    // Add note to the lead
    $note_response = wp_remote_post('https://api.pipedrive.com/v1/notes?' . http_build_query(['api_token' => $pipedrive_api_key]), array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($note_data),
        'timeout' => 30
    ));

    if (is_wp_error($note_response)) {
        error_log('Pipedrive Note API Error: ' . $note_response->get_error_message());
        // Don't return error here as the lead was created successfully
    }

    return array(
        'success' => true,
        'message' => 'Application submitted successfully',
        'data' => array(
            'lead_id' => $lead_id
        )
    );
}

/**
 * Get Pipedrive custom field keys
 * This function fetches and caches the custom field keys from Pipedrive
 * 
 * @param string $api_key The Pipedrive API key
 * @return array An array of custom field keys mapped to their field names
 */
function get_pipedrive_custom_field_keys($api_key) {
    // Try to get cached field keys first
    $cached_keys = get_transient('pipedrive_custom_field_keys');
    
    if ($cached_keys !== false) {
        return $cached_keys;
    }
    
    // If no cache, fetch from Pipedrive API
    $field_keys = array();
    
    // Fetch deal fields (leads inherit custom fields from deals)
    $response = wp_remote_get('https://api.pipedrive.com/v1/dealFields?' . http_build_query([
        'api_token' => $api_key
    ]));
    
    if (!is_wp_error($response)) {
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if ($body['success'] && !empty($body['data'])) {
            foreach ($body['data'] as $field) {
                // Only include custom fields (not default Pipedrive fields)
                if (isset($field['key']) && strpos($field['key'], 'cf_') === 0) {
                    // Map a simplified name to the Pipedrive field key
                    // You'll need to manually map these based on your Pipedrive setup
                    $simplified_name = str_replace('cf_', '', $field['key']);
                    $field_keys[$simplified_name] = $field['key'];
                }
            }
        }
    }
    
    // Cache the field keys for 1 hour (3600 seconds)
    set_transient('pipedrive_custom_field_keys', $field_keys, 3600);
    
    return $field_keys;
}

function create_pipedrive_person($data, $api_key) {
    $person_data = array(
        'name' => $data['contact_name'],
        'email' => array($data['email']),
        'phone' => array($data['phone']),
        'visible_to' => 3
    );

    $response = wp_remote_post('https://api.pipedrive.com/v1/persons', array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($person_data),
        'timeout' => 30,
        'query' => array(
            'api_token' => $api_key
        )
    ));

    if (!is_wp_error($response)) {
        $body = json_decode(wp_remote_retrieve_body($response), true);
        if ($body['success']) {
            return $body['data']['id'];
        }
    }

    return null;
}

function create_pipedrive_organization($data, $api_key) {
    $org_data = array(
        'name' => $data['company_name'],
        'visible_to' => 3,
        'custom_fields' => array(
            'registration_number' => $data['reg_number']
        )
    );

    $response = wp_remote_post('https://api.pipedrive.com/v1/organizations', array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($org_data),
        'timeout' => 30,
        'query' => array(
            'api_token' => $api_key
        )
    ));

    if (!is_wp_error($response)) {
        $body = json_decode(wp_remote_retrieve_body($response), true);
        if ($body['success']) {
            return $body['data']['id'];
        }
    }

    return null;
}
