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
    
    // Debug: Log all form data received
    error_log('FORM DATA RECEIVED: ' . json_encode($data, JSON_PRETTY_PRINT));
    error_log('REQUEST METHOD: ' . $_SERVER['REQUEST_METHOD']);
    error_log('REQUEST HEADERS: ' . json_encode(getallheaders(), JSON_PRETTY_PRINT));
    
    // Get Pipedrive API key from wp-config.php
    if (!defined('PIPEDRIVE_API_KEY')) {
        error_log('ERROR: PIPEDRIVE_API_KEY not defined in wp-config.php');
        return new WP_Error('pipedrive_error', 'PIPEDRIVE_API_KEY not defined in wp-config.php', array('status' => 500));
    }
    
    $pipedrive_api_key = PIPEDRIVE_API_KEY;
    error_log('API KEY CHECK: API key is defined');

    // Get the first user from Pipedrive to use as owner
    error_log('STEP: Fetching Pipedrive users');
    $users_response = wp_remote_get('https://api.pipedrive.com/v1/users?' . http_build_query([
        'api_token' => $pipedrive_api_key,
        'limit' => 1
    ]));
    
    error_log('USERS API RESPONSE CODE: ' . wp_remote_retrieve_response_code($users_response));

    if (is_wp_error($users_response)) {
        error_log('Pipedrive Users API Error: ' . $users_response->get_error_message());
        return new WP_Error('pipedrive_error', $users_response->get_error_message(), array('status' => 500));
    }

    $users_body = json_decode(wp_remote_retrieve_body($users_response), true);
    error_log('USERS API RESPONSE BODY: ' . json_encode($users_body, JSON_PRETTY_PRINT));
    
    if (empty($users_body['data'][0]['id'])) {
        error_log('ERROR: Pipedrive Users API Error: No users found');
        return new WP_Error('pipedrive_error', 'No Pipedrive users found', array('status' => 500));
    }
    
    error_log('SUCCESS: Found Pipedrive user');

    $owner_id = $users_body['data'][0]['id'];

    // Create organization first
    error_log('STEP: Creating organization');
    error_log('COMPANY NAME: ' . (isset($data['companyName']) ? $data['companyName'] : 'NOT SET'));
    
    $org_data = array(
        'name' => $data['companyName'],
        'owner_id' => $owner_id
    );
    
    error_log('ORG DATA: ' . json_encode($org_data, JSON_PRETTY_PRINT));

    $org_response = wp_remote_post('https://api.pipedrive.com/v1/organizations?' . http_build_query(['api_token' => $pipedrive_api_key]), array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($org_data)
    ));

    $org_body = json_decode(wp_remote_retrieve_body($org_response), true);
    $org_id = !empty($org_body['data']['id']) ? $org_body['data']['id'] : null;
    
    // Log organization creation response
    error_log('Organization creation response: ' . wp_remote_retrieve_response_code($org_response));
    error_log('Organization data: ' . json_encode($org_body, JSON_PRETTY_PRINT));

    // Create person
    error_log('STEP: Creating person');
    error_log('CONTACT NAME: ' . (isset($data['contactName']) ? $data['contactName'] : 'NOT SET'));
    error_log('EMAIL: ' . (isset($data['email']) ? $data['email'] : 'NOT SET'));
    error_log('PHONE: ' . (isset($data['phone']) ? $data['phone'] : 'NOT SET'));
    
    $person_data = array(
        'name' => $data['contactName'],
        'email' => array($data['email']),
        'phone' => array($data['phone']),
        'org_id' => $org_id,
        'owner_id' => $owner_id
    );
    
    error_log('PERSON DATA: ' . json_encode($person_data, JSON_PRETTY_PRINT));

    $person_response = wp_remote_post('https://api.pipedrive.com/v1/persons?' . http_build_query(['api_token' => $pipedrive_api_key]), array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($person_data)
    ));

    $person_body = json_decode(wp_remote_retrieve_body($person_response), true);
    $person_id = !empty($person_body['data']['id']) ? $person_body['data']['id'] : null;
    
    // Log person creation response
    error_log('Person creation response: ' . wp_remote_retrieve_response_code($person_response));
    error_log('Person data: ' . json_encode($person_body, JSON_PRETTY_PRINT));

    // Prepare Pipedrive lead data with custom fields
    error_log('STEP: Preparing lead data');
    error_log('FINANCIAL PRODUCT: ' . (isset($data['financialProduct']) ? $data['financialProduct'] : 'NOT SET'));
    error_log('LOAN AMOUNT: ' . (isset($data['loanAmount']) ? $data['loanAmount'] : 'NOT SET'));
    
    // Base lead data
    $lead_data = array(
        'title' => isset($data['companyName']) ? $data['companyName'] . ' - ' . $data['financialProduct'] : $data['financialProduct'],
        'owner_id' => $owner_id,
        'value' => array(
            'amount' => floatval($data['loanAmount']),
            'currency' => 'EUR'
        ),
        'expected_close_date' => date('Y-m-d', strtotime('+30 days'))
    );
    
    error_log('BASE LEAD DATA: ' . json_encode($lead_data, JSON_PRETTY_PRINT));
    
    // Ensure at least one of person_id or organization_id is set (required by Pipedrive API)
    if ($person_id) {
        $lead_data['person_id'] = $person_id;
    }
    
    if ($org_id) {
        $lead_data['organization_id'] = $org_id;
    }
    
    // If neither person_id nor organization_id was created successfully, return an error
    if (empty($lead_data['person_id']) && empty($lead_data['organization_id'])) {
        error_log('Pipedrive Lead API Error: Both person_id and organization_id are missing');
        return new WP_Error('pipedrive_error', 'Failed to create contact or organization', array('status' => 500));
    }
    
    // Map form data to Pipedrive lead custom fields using exact field keys
    $custom_fields = array();
    
    // Kontaktinformācija un Uzņēmuma informācija fields
    // Note: Some of these fields are already handled by person and organization creation
    
    // Reģistrācijas numurs (key: 35e584f3aeee47a58265149def733427d7beb2a2)
    error_log('CHECKING regNumber: ' . (isset($data['regNumber']) ? $data['regNumber'] : 'NOT SET'));
    if (isset($data['regNumber'])) {
        $custom_fields['35e584f3aeee47a58265149def733427d7beb2a2'] = $data['regNumber'];
        error_log('ADDED regNumber to custom fields');
    }
    
    // Vai uzņēmumam ir nodokļu parāds? (key: 7a9e2d5c8b3f6e0d1c4a7b2e5f8d9c6a3b2e1d4)
    error_log('CHECKING taxDebtStatus: ' . (isset($data['taxDebtStatus']) ? $data['taxDebtStatus'] : 'NOT SET'));
    if (isset($data['taxDebtStatus'])) {
        // Map tax debt status to the correct option ID
        $tax_debt_map = [
            'no' => 70,                // Nav
            'withSchedule' => 71,      // Ir, ar VID grafiku
            'withoutSchedule' => 72,   // Ir, bez VID grafika
            'default' => 70            // Default to 'Nav'
        ];
        
        $tax_debt_value = isset($tax_debt_map[$data['taxDebtStatus']]) ? $tax_debt_map[$data['taxDebtStatus']] : $tax_debt_map['default'];
        $custom_fields['7a9e2d5c8b3f6e0d1c4a7b2e5f8d9c6a3b2e1d4'] = $tax_debt_value;
        error_log('ADDED taxDebtStatus to custom fields');
    }
    
    // Nodokļu parāda summa (EUR) (key: 9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0)
    error_log('CHECKING taxDebtAmount: ' . (isset($data['taxDebtAmount']) ? $data['taxDebtAmount'] : 'NOT SET'));
    if (isset($data['taxDebtAmount']) && !empty($data['taxDebtAmount'])) {
        $custom_fields['9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0'] = $data['taxDebtAmount'];
        error_log('ADDED taxDebtAmount to custom fields');
    }
    
    // Vai pēdējo 12 mēnešu laikā ir bijušas kavētas kredītmaksājumu vai nodokļu maksājumu saistības? (key: 1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0)
    if (isset($data['hadPaymentDelays'])) {
        // Map yes/no to the correct option ID
        $payment_delays_map = [
            'yes' => 73,              // Jā
            'no' => 74,               // Nē
            'default' => 74           // Default to 'Nē'
        ];
        
        $payment_delays_value = isset($payment_delays_map[$data['hadPaymentDelays']]) ? $payment_delays_map[$data['hadPaymentDelays']] : $payment_delays_map['default'];
        $custom_fields['1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0'] = $payment_delays_value;
        error_log('ADDED hadPaymentDelays to custom fields');
    }
    
    // Uzņēmuma vecums (key: e0b1fa455bd6e56030f83ae350863a357ed7e236) - enum field
    error_log('CHECKING companyAge: ' . (isset($data['companyAge']) ? $data['companyAge'] : 'NOT SET'));
    if (isset($data['companyAge'])) {
        // Map the company age to the correct option ID
        $company_age_map = [
            '<2' => 32,       // < 2 gadi
            '2-5' => 33,      // 2–5 gadi
            '>5' => 34,       // > 5 gadi
            '6-12' => 34,     // > 5 gadi (mapping your value to closest match)
            'default' => 32   // Default to first option
        ];
        
        $age_value = isset($company_age_map[$data['companyAge']]) ? $company_age_map[$data['companyAge']] : $company_age_map['default'];
        $custom_fields['e0b1fa455bd6e56030f83ae350863a357ed7e236'] = $age_value;
        error_log('ADDED companyAge to custom fields: ' . $age_value);
    }
    
    // Apgrozījums pēdējā gadā (EUR) (key: 30b6a6278feea6cdfe8b2bcf7a295145804365d1) - enum field
    error_log('CHECKING revenue: ' . (isset($data['revenue']) ? $data['revenue'] : 'NOT SET'));
    if (isset($data['revenue'])) {
        // Map the turnover to the correct option ID
        $turnover_map = [
            '<200k' => 28,            // < 200 000
            '200k-500k' => 29,        // 200 001 – 500 000
            '500k-1m' => 30,          // 500 001 – 1 000 000
            '>1m' => 31,              // > 1 000 000
            'default' => 28           // Default to first option
        ];
        
        $turnover_value = isset($turnover_map[$data['revenue']]) ? $turnover_map[$data['revenue']] : $turnover_map['default'];
        $custom_fields['30b6a6278feea6cdfe8b2bcf7a295145804365d1'] = $turnover_value;
        error_log('ADDED revenue to custom fields: ' . $turnover_value);
    }
    
    // Peļņa vai zaudējumi pēdējā gadā (key: c4cbde23802f42ce2856908a0ff6decf94dc7185) - enum field
    if (isset($data['profitOrLoss'])) {
        // Map profit/loss status to the correct option ID
        $profit_loss_map = [
            'profit' => 35,           // Peļņa
            'loss' => 36,             // Zaudējumi
            'no_data' => 37,          // Nav pieejamu datu
            'default' => 35           // Default to first option
        ];
        
        $profit_loss_value = isset($profit_loss_map[$data['profitOrLoss']]) ? $profit_loss_map[$data['profitOrLoss']] : $profit_loss_map['default'];
        $custom_fields['c4cbde23802f42ce2856908a0ff6decf94dc7185'] = $profit_loss_value;
        error_log('ADDED profitOrLoss to custom fields');
    }
    
    // Jūsu pozīcija uzņēmumā (key: 2cd024df7983ad750a8b2828f8a0597fb764bd34) - enum field
    if (isset($data['position'])) {
        // Map position to the correct option ID
        $position_map = [
            'owner' => 38,             // Īpašnieks
            'board_member' => 39,      // Valdes loceklis // Finanšu direktors
            'other' => 41,             // Cits
            'default' => 38            // Default to first option
        ];
        
        $position_value = isset($position_map[$data['position']]) ? $position_map[$data['position']] : $position_map['default'];
        $custom_fields['2cd024df7983ad750a8b2828f8a0597fb764bd34'] = $position_value;
        error_log('ADDED position to custom fields');
    }
    
    // Pamata darbība (īss apraksts) (key: 6c695fa59d23ce5853c14a270f19fef16e471c65)
    if (isset($data['mainActivity'])) {
        $custom_fields['6c695fa59d23ce5853c14a270f19fef16e471c65'] = $data['mainActivity'];
        error_log('ADDED mainActivity to custom fields');
    }
    
    // Finanses, Kredītsaistības, Aizdevuma vajadzības fields
    
    // Nepieciešamā summa (EUR) - already handled in value (key: 5f3b98c8992283a4e7d4d6a1491b4f854cd99dbc)
    
    // Vēlamais termiņš (mēneši/gadi) (key: 1b3bc3ee821b653b33c255b2012db731749ad292)
    if (isset($data['loanTerm'])) {
        $custom_fields['1b3bc3ee821b653b33c255b2012db731749ad292'] = $data['loanTerm'];
        error_log('ADDED loanTerm to custom fields');
    }
    
    // Finansējuma mērķis (key: 27aa379d105b5516eb80e88e563bca3829a56533) - set field (multipleOption)
    if (isset($data['loanPurpose'])) {
        // Map loan purpose to the correct option ID(s)
        $purpose_map = [
            'apgrozamie' => 49,        // Apgrozāmie līdzekļi
            'iekartas' => 50,          // Iekārtu iegāde
            'nekustamais' => 51,       // Nekustamais īpašums
            'transports' => 52,         // Transportlīdzekļi
            'refinansesana' => 53,      // Refinansēšana
            'pamatlidzekli' => 50,     // Mapping to closest match (Iekārtu iegāde)
            'projekti' => 52,          // Projektu finansēšana (mapping to closest match)
            'cits' => 54,              // Cits
            'default' => 49             // Default to first option
        ];
        
        $purpose_value = isset($purpose_map[$data['loanPurpose']]) ? $purpose_map[$data['loanPurpose']] : $purpose_map['default'];
        // For multipleOption fields, we need to send an array of option IDs
        $custom_fields['27aa379d105b5516eb80e88e563bca3829a56533'] = [$purpose_value];
        error_log('ADDED loanPurpose to custom fields');
    }
    
    // Nepieciešamais finanšu produkts (key: 15ff4b6ef37a1fee1b1893c9e1f892f62c38a0ca) - enum field
    if (!empty($data['financialProduct'])) {
        // Get all available options from Pipedrive
        $pipedrive_options = [
            55 => 'Aizdevums',
            56 => 'Kredītlīnija',
            57 => 'Līzings',
            58 => 'Faktorings',
            59 => 'Cits finanšu produkts'
        ];
        
        // Log the incoming financial product value
        error_log('Financial product from form: ' . $data['financialProduct']);
        
        // First, check if the value matches a Pipedrive option name directly
        $product_value = 55; // Default to Aizdevums
        $found_direct_match = false;
        
        foreach ($pipedrive_options as $option_id => $option_name) {
            if (strcasecmp($data['financialProduct'], $option_name) === 0) {
                $product_value = $option_id;
                $found_direct_match = true;
                error_log('Found direct match for financial product: ' . $option_name . ' => ' . $option_id);
                break;
            }
        }
        
        // If no direct match, treat industry names as Aizdevums (55)
        if (!$found_direct_match) {
            $industry_names = [
                'Lauksaimniecība',
                'Ražošana',
                'Tirdzniecība un pakalpojumi',
                'Būvniecība',
                'Transports un loģistika',
                'Cits finanšu produkts'
            ];
            
            $is_industry = false;
            foreach ($industry_names as $industry) {
                if (strcasecmp($data['financialProduct'], $industry) === 0) {
                    $is_industry = true;
                    error_log('Found industry match: ' . $industry . ' => mapping to Aizdevums (55)');
                    break;
                }
            }
            
            if ($is_industry) {
                // For industry selections, default to Aizdevums
                $product_value = 55; // Aizdevums
            } else {
                // Try partial matching as a last resort
                foreach ($pipedrive_options as $option_id => $option_name) {
                    if (stripos($data['financialProduct'], $option_name) !== false) {
                        $product_value = $option_id;
                        error_log('Found partial match for financial product: ' . $option_name . ' => ' . $option_id);
                        break;
                    }
                }
            }
        }
        
        $custom_fields['15ff4b6ef37a1fee1b1893c9e1f892f62c38a0ca'] = $product_value;
        error_log('Final mapped financial product value: ' . $product_value . ' (' . $pipedrive_options[$product_value] . ')');
    } else {
        // Explicitly check if the financial product field is set in the custom fields
        $financial_product_key = '15ff4b6ef37a1fee1b1893c9e1f892f62c38a0ca';
        if (!isset($custom_fields[$financial_product_key])) {
            error_log('WARNING: Financial product field not set in custom fields. Setting default value 55 (Aizdevums)');
            $custom_fields[$financial_product_key] = 55; // Default to 'Aizdevums'
        } else {
            error_log('Financial product field is set in custom fields: ' . $custom_fields[$financial_product_key]);
        }
    }
    
    // Piedāvātais nodrošinājums (key: d41ac0a12ff272eb9932c157db783b12fa55d4a8) - set field (multipleOption)
    if (isset($data['collateralType'])) {
        // Log the incoming collateral type value
        error_log('Collateral type from form: ' . $data['collateralType']);
        
        // Map collateral type to the correct option ID
        $collateral_map = [
            // Form field values
            'real-estate' => 60,        // Nekustamais īpašums
            'vehicles' => 61,           // Transportlīdzekļi
            'commercial-pledge' => 62,  // Komercķīla
            'none' => 63,               // Nav nodrošinājuma
            'other' => 64,              // Cits
            
            // Legacy keys for backward compatibility
            'real_estate' => 60,        // Nekustamais īpašums
            'commercial' => 62,         // Komercķīla
            'Nekustamais īpašums' => 60,
            'Transportlīdzekļi' => 61,
            'Komercķīla' => 62,
            'Nav nodrošinājuma' => 63,
            'Cits' => 64,
            
            'default' => 63             // Default to 'none'
        ];
        
        if (isset($collateral_map[$data['collateralType']])) {
            $collateral_value = $collateral_map[$data['collateralType']];
        } else {
            // Try to find a partial match
            $matched = false;
            foreach ($collateral_map as $key => $value) {
                if (stripos($data['collateralType'], $key) !== false) {
                    $collateral_value = $value;
                    $matched = true;
                    break;
                }
            }
            
            if (!$matched) {
                $collateral_value = $collateral_map['default'];
            }
        }
        
        // For multipleOption fields, we need to send an array of option IDs
        $custom_fields['d41ac0a12ff272eb9932c157db783b12fa55d4a8'] = [$collateral_value];
        error_log('Mapped collateral type value: ' . $collateral_value);
    }
    
    // Aprakstiet piedāvāto nodrošinājumu (key: 9431e23f2b409deafaf14bccf8ca006a8d54da33) - varchar field
    if (isset($data['collateralDescription'])) {
        $custom_fields['9431e23f2b409deafaf14bccf8ca006a8d54da33'] = $data['collateralDescription'];
        error_log('ADDED collateralDescription to custom fields');
    }
    
    // Vai pēdējo 3 mēnešu laikā esat vērsušies citā finanšu iestādē? (key: aaf42dc07ef7a915caf41d82e5fad57e79adc0ef) - enum field
    if (isset($data['hasAppliedElsewhere'])) {
        // Map yes/no to the correct option ID
        $applied_elsewhere_map = [
            'yes' => 65,              // Jā
            'no' => 66,               // Nē
            'Jā' => 65,               // Jā (for backward compatibility)
            'Nē' => 66,               // Nē (for backward compatibility)
            'default' => 66             // Default to 'Nē'
        ];
        
        $applied_elsewhere_value = isset($applied_elsewhere_map[$data['hasAppliedElsewhere']]) ? $applied_elsewhere_map[$data['hasAppliedElsewhere']] : $applied_elsewhere_map['default'];
        $custom_fields['aaf42dc07ef7a915caf41d82e5fad57e79adc0ef'] = $applied_elsewhere_value;
        error_log('ADDED hasAppliedElsewhere to custom fields');
    }
    
    // GDPR consent is not sent to Pipedrive
    
    // For leads, custom fields need to be added to the custom_fields property
    if (!empty($custom_fields)) {
        error_log('FINAL CUSTOM FIELDS: ' . json_encode($custom_fields, JSON_PRETTY_PRINT));
    } else {
        error_log('WARNING: No custom fields were added');
    }

    // Make sure custom fields are properly structured and not directly in the lead data
    $final_lead_data = array(
        'title' => $lead_data['title'],
        'owner_id' => $lead_data['owner_id'],
        'value' => $lead_data['value'],
        'expected_close_date' => $lead_data['expected_close_date'],
        'person_id' => isset($lead_data['person_id']) ? $lead_data['person_id'] : null,
        'organization_id' => isset($lead_data['organization_id']) ? $lead_data['organization_id'] : null
    );
    
    // Add custom fields if they exist
    if (!empty($custom_fields)) {
        $final_lead_data['custom_fields'] = $custom_fields;
    }
    
    error_log('Final lead data structure: ' . json_encode($final_lead_data, JSON_PRETTY_PRINT));

    // Log the complete lead data being sent to Pipedrive with better formatting
    error_log('Sending lead data to Pipedrive: ' . json_encode($final_lead_data, JSON_PRETTY_PRINT));

    // Create lead in Pipedrive
    error_log('STEP: Creating lead in Pipedrive');
    error_log('LEAD DATA BEING SENT: ' . json_encode($lead_data, JSON_PRETTY_PRINT));
    
    try {
        $lead_response = wp_remote_post('https://api.pipedrive.com/v1/leads?' . http_build_query(['api_token' => $pipedrive_api_key]), array(
            'headers' => array(
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode($final_lead_data),
            'timeout' => 60
        ));
        
        error_log('LEAD API REQUEST COMPLETED');
    } catch (Exception $e) {
        error_log('EXCEPTION DURING LEAD CREATION: ' . $e->getMessage());
        error_log('EXCEPTION TRACE: ' . $e->getTraceAsString());
        return new WP_Error('pipedrive_error', 'Exception during lead creation: ' . $e->getMessage(), array('status' => 500));
    }

    if (is_wp_error($lead_response)) {
        error_log('ERROR: Pipedrive Lead API Error: ' . $lead_response->get_error_message());
        return new WP_Error('pipedrive_error', $lead_response->get_error_message(), array('status' => 500));
    }
    
    $response_code = wp_remote_retrieve_response_code($lead_response);
    $response_body = wp_remote_retrieve_body($lead_response);
    error_log('LEAD API RESPONSE CODE: ' . $response_code);
    error_log('LEAD API RESPONSE BODY: ' . $response_body);
    
    // Check if the response code indicates an error
    if ($response_code >= 400) {
        $error_data = json_decode($response_body, true);
        error_log('PIPEDRIVE API ERROR: ' . json_encode($error_data, JSON_PRETTY_PRINT));
        
        // Extract error message if available
        $error_message = 'Failed to create lead';
        if (isset($error_data['error'])) {
            $error_message .= ': ' . $error_data['error'];
        }
        if (isset($error_data['error_info'])) {
            $error_message .= ' - ' . $error_data['error_info'];
        }
        
        error_log('FORMATTED ERROR MESSAGE: ' . $error_message);
        return new WP_Error('pipedrive_error', $error_message, array('status' => $response_code));
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
        "Loan Amount: %s\n" .
        "Loan Term: %s\n" .
        "Loan Purpose: %s\n" .
        "Financial Product: %s\n" .
        "Tax Debt Status: %s\n" .
        "Tax Debt Amount: %s\n" .
        "Had Payment Delays: %s\n" .
        "Collateral Type: %s\n" .
        "Collateral Description: %s\n" .
        "Applied Elsewhere: %s",
        isset($data['regNumber']) ? $data['regNumber'] : 'Not provided',
        isset($data['position']) ? $data['position'] : 'Not provided',
        isset($data['companyAge']) ? $data['companyAge'] : 'Not provided',
        isset($data['revenue']) ? $data['revenue'] : 'Not provided',
        isset($data['profitOrLoss']) ? $data['profitOrLoss'] : 'Not provided',
        isset($data['mainActivity']) ? $data['mainActivity'] : 'Not provided',
        isset($data['loanAmount']) ? $data['loanAmount'] : 'Not provided',
        isset($data['loanTerm']) ? $data['loanTerm'] : 'Not provided',
        isset($data['loanPurpose']) ? $data['loanPurpose'] : 'Not provided',
        isset($data['financialProduct']) ? $data['financialProduct'] : 'Not provided',
        isset($data['taxDebtStatus']) ? $data['taxDebtStatus'] : 'Not provided',
        isset($data['taxDebtAmount']) ? $data['taxDebtAmount'] : 'Not provided',
        isset($data['hadPaymentDelays']) ? $data['hadPaymentDelays'] : 'Not provided',
        isset($data['collateralType']) ? $data['collateralType'] : 'Not provided',
        isset($data['collateralDescription']) ? $data['collateralDescription'] : 'Not provided',
        isset($data['hasAppliedElsewhere']) ? $data['hasAppliedElsewhere'] : 'Not provided'
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
        'name' => $data['contactName'],
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
        'name' => $data['companyName'],
        'visible_to' => 3,
        'custom_fields' => array(
            'registration_number' => $data['regNumber']
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
