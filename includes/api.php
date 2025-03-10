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
    
    // Map form data to Pipedrive lead custom fields using exact field keys
    $custom_fields = array();
    
    // Kontaktinformācija un Uzņēmuma informācija fields
    // Note: Some of these fields are already handled by person and organization creation
    
    // Reģistrācijas numurs (key: 35e584f3aeee47a58265149def733427d7beb2a2)
    if (isset($data['reg_number'])) {
        $custom_fields['35e584f3aeee47a58265149def733427d7beb2a2'] = $data['reg_number'];
    }
    
    // Uzņēmuma vecums (key: e0b1fa455bd6e56030f83ae350863a357ed7e236)
    if (isset($data['company_age'])) {
        $custom_fields['e0b1fa455bd6e56030f83ae350863a357ed7e236'] = $data['company_age'];
    }
    
    // Apgrozījums pēdējā gadā (EUR) (key: 30b6a6278feea6cdfe8b2bcf7a295145804365d1)
    if (isset($data['annual_turnover'])) {
        $custom_fields['30b6a6278feea6cdfe8b2bcf7a295145804365d1'] = $data['annual_turnover'];
    }
    
    // Peļņa vai zaudējumi pēdējā gadā (key: c4cbde23802f42ce2856908a0ff6decf94dc7185)
    if (isset($data['profit_loss_status'])) {
        $custom_fields['c4cbde23802f42ce2856908a0ff6decf94dc7185'] = $data['profit_loss_status'];
    }
    
    // Jūsu pozīcija uzņēmumā (key: 2cd024df7983ad750a8b2828f8a0597fb764bd34)
    if (isset($data['company_position'])) {
        $custom_fields['2cd024df7983ad750a8b2828f8a0597fb764bd34'] = $data['company_position'];
    }
    
    // Pamata darbība (īss apraksts) (key: 6c695fa59d23ce5853c14a270f19fef16e471c65)
    if (isset($data['core_activity'])) {
        $custom_fields['6c695fa59d23ce5853c14a270f19fef16e471c65'] = $data['core_activity'];
    }
    
    // Finanses, Kredītsaistības, Aizdevuma vajadzības fields
    
    // Nepieciešamā summa (EUR) - already handled in value (key: 5f3b98c8992283a4e7d4d6a1491b4f854cd99dbc)
    
    // Vēlamais termiņš (mēneši/gadi) (key: 1b3bc3ee821b653b33c255b2012db731749ad292)
    if (isset($data['loan_term'])) {
        $custom_fields['1b3bc3ee821b653b33c255b2012db731749ad292'] = $data['loan_term'];
    }
    
    // Finansējuma mērķis (key: 27aa379d105b5516eb80e88e563bca3829a56533)
    if (isset($data['loan_purpose'])) {
        $custom_fields['27aa379d105b5516eb80e88e563bca3829a56533'] = $data['loan_purpose'];
    }
    
    // Nepieciešamais finanšu produkts (key: 15ff4b6ef37a1fee1b1893c9e1f892f62c38a0ca)
    if (isset($data['financial_product'])) {
        $custom_fields['15ff4b6ef37a1fee1b1893c9e1f892f62c38a0ca'] = $data['financial_product'];
    }
    
    // Piedāvātais nodrošinājums (key: d41ac0a12ff272eb9932c157db783b12fa55d4a8)
    if (isset($data['collateral_type'])) {
        $custom_fields['d41ac0a12ff272eb9932c157db783b12fa55d4a8'] = $data['collateral_type'];
    }
    
    // Aprakstiet piedāvāto nodrošinājumu (key: 9431e23f2b409deafaf14bccf8ca006a8d54da33)
    if (isset($data['collateral_description'])) {
        $custom_fields['9431e23f2b409deafaf14bccf8ca006a8d54da33'] = $data['collateral_description'];
    }
    
    // Vai pēdējo 3 mēnešu laikā esat vērsušies citā finanšu iestādē? (key: aaf42dc07ef7a915caf41d82e5fad57e79adc0ef)
    if (isset($data['has_applied_elsewhere'])) {
        $custom_fields['aaf42dc07ef7a915caf41d82e5fad57e79adc0ef'] = $data['has_applied_elsewhere'];
    }
    
    // Add custom fields to lead data
    if (!empty($custom_fields)) {
        $lead_data['custom_fields'] = $custom_fields;
    }

    // Log the complete lead data being sent to Pipedrive with better formatting
    error_log('Sending lead data to Pipedrive: ' . json_encode($lead_data, JSON_PRETTY_PRINT));

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

    // Log the complete response from Pipedrive
    $response_code = wp_remote_retrieve_response_code($lead_response);
    $response_body = wp_remote_retrieve_body($lead_response);
    error_log('Pipedrive API response code: ' . $response_code);
    error_log('Pipedrive API response body: ' . $response_body);
    
    $lead_body = json_decode($response_body, true);
    
    if ($response_code !== 200 && $response_code !== 201) {
        error_log('Pipedrive Lead API Error: Non-success status code: ' . $response_code);
        error_log('Pipedrive Lead API Error details: ' . print_r($lead_body, true));
        return new WP_Error('pipedrive_error', 'Failed to create lead', array('status' => 500));
    }
    
    if (empty($lead_body['data']['id'])) {
        error_log('Pipedrive Lead API Error: No lead ID returned in successful response');
        error_log('Pipedrive Lead API Response: ' . print_r($lead_body, true));
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
