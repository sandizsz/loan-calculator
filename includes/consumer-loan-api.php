<?php
/**
 * Consumer Loan Calculator API Endpoints
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register API endpoints for consumer loan calculator
 */
function consumer_loan_register_api_routes() {
    register_rest_route('loan-calculator/v1', '/create-invitation', array(
        'methods' => 'POST',
        'callback' => 'create_accountscoring_invitation',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('loan-calculator/v1', '/submit-application', array(
        'methods' => 'POST',
        'callback' => 'submit_consumer_loan_application',
        'permission_callback' => '__return_true'
    ));
    
    // Add callback endpoint for AccountScoring postbacks
    register_rest_route('loan-calculator/v1', '/accountscoring-callback', array(
        'methods' => 'POST',
        'callback' => 'handle_accountscoring_callback',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'consumer_loan_register_api_routes');

/**
 * Create invitation in AccountScoring
 */
function create_accountscoring_invitation($request) {
    $params = $request->get_params();
    
    // Validate required parameters
    $required_fields = ['email', 'phone', 'firstName', 'lastName'];
    foreach ($required_fields as $field) {
        if (empty($params[$field])) {
            return new WP_Error('missing_field', 'Trūkst obligāto lauku: ' . $field, array('status' => 400));
        }
    }
    
    // Get API key and client ID from options
    $api_key = get_option('loan_calculator_accountscoring_api_key', '');
    $client_id = get_option('loan_calculator_accountscoring_client_id', '');
    
    if (empty($api_key)) {
        return new WP_Error('missing_api_key', 'AccountScoring API atslēga nav konfigurēta', array('status' => 500));
    }
    
    if (empty($client_id)) {
        return new WP_Error('missing_client_id', 'AccountScoring klienta ID nav konfigurēts', array('status' => 500));
    }
    
    // Log the API key (first 4 chars only for security) for debugging
    error_log('Using AccountScoring API key: ' . substr($api_key, 0, 4) . '...');
    error_log('Using AccountScoring client ID: ' . $client_id);
    
    // Log request for debugging
    error_log('AccountScoring API request: ' . print_r(array(
        'email' => sanitize_email($params['email']),
        'phone' => sanitize_text_field($params['phone']),
        'first_name' => sanitize_text_field($params['firstName']),
        'last_name' => sanitize_text_field($params['lastName']),
        'personal_code' => isset($params['personalCode']) ? sanitize_text_field($params['personalCode']) : '',
    ), true));
    
    // Make API request to AccountScoring
    // Try the API endpoint format from the documentation
    // Check if we're in test mode
    $is_test_mode = defined('WP_DEBUG') && WP_DEBUG;
    
    // Use the exact endpoint from the documentation
    $api_url = $is_test_mode 
        ? 'https://prelive.accountscoring.com/api/v3/invitation' 
        : 'https://accountscoring.com/api/v3/invitation';
        
    // Log which endpoint we're using
    error_log("Using API endpoint from documentation: {$api_url}");
    
    error_log('Using API URL: ' . $api_url . ' (Test mode: ' . ($is_test_mode ? 'Yes' : 'No') . ')');
    
    // Format phone number to international format if needed
    $phone = sanitize_text_field($params['phone']);
    if (substr($phone, 0, 1) !== '+') {
        // Add Latvian country code if not present
        $phone = '+371' . preg_replace('/[^0-9]/', '', $phone);
    }
    
    // Prepare request body according to the exact AccountScoring API documentation
    $request_body = array(
        // Required fields from the documentation
        'name' => sanitize_text_field($params['firstName'] . ' ' . $params['lastName']),
        'personal_code' => isset($params['personalCode']) ? sanitize_text_field($params['personalCode']) : '',
        'locale' => 'lv_LV', // Latvian locale as specified in documentation
        'send_email' => false, // We'll handle the flow in our app
    );
    
    // Add email (required if send_email is true)
    if (!empty($params['email'])) {
        $request_body['email'] = sanitize_email($params['email']);
    }
    
    // Add phone (not required by API but useful for our records)
    if (!empty($phone)) {
        $request_body['phone'] = $phone;
    }
    
    // Add client_id (may be required for authentication)
    $request_body['client_id'] = $client_id;
    
    // Add redirect and webhook URLs
    $request_body['redirect_url'] = home_url('/pateriņa-kredīts/paldies/');
    $request_body['webhook_url'] = home_url('/wp-json/loan-calculator/v1/accountscoring-callback');
    
    // Optional: Add transaction days (default is usually 90)
    $request_body['transaction_days'] = 90;
    
    // Optional: Add allowed banks for Latvia (LV)
    $request_body['allowed_banks'] = array(
        'HABALV22', // Swedbank
        'UNLALV2X', // SEB
        'PARXLV22', // Citadele
        'NDEALV2X', // Luminor
        'REVOGB21XXX', // Revolut
        'N26' // N26
    );
    
    // Add loan-specific data as custom fields
    if (isset($params['loanAmount']) && $params['loanAmount'] > 0) {
        $request_body['amount'] = floatval($params['loanAmount']);
    }
    
    if (isset($params['loanTerm']) && $params['loanTerm'] > 0) {
        $request_body['term'] = intval($params['loanTerm']);
    }
    
    if (isset($params['monthlyIncome']) && $params['monthlyIncome'] > 0) {
        $request_body['monthly_income'] = floatval($params['monthlyIncome']);
    }
    
    // Log the full request for debugging
    error_log('AccountScoring API request URL: ' . $api_url);
    error_log('AccountScoring API request body: ' . json_encode($request_body));
    
    // Use Bearer token authentication as specified in the documentation
    error_log("Using Bearer token authentication with API key: " . substr($api_key, 0, 4) . '...');
    
    $response = wp_remote_post($api_url, [
        'headers' => [
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ],
        'body' => json_encode($request_body),
        'timeout' => 30
    ]);
    
    if (is_wp_error($response)) {
        return new WP_Error('api_error', $response->get_error_message(), array('status' => 500));
    }
    
    $status_code = wp_remote_retrieve_response_code($response);
    $response_body = wp_remote_retrieve_body($response);
    $body = json_decode($response_body, true);
    
    // Log the full response for debugging
    error_log('AccountScoring API response status: ' . $status_code);
    error_log('AccountScoring API response body: ' . $response_body);
    
    if ($status_code !== 200 && $status_code !== 201) {
        $error_message = isset($body['message']) ? $body['message'] : 'Kļūda savienojoties ar AccountScoring API';
        error_log('AccountScoring API error: ' . $error_message . ' (Status: ' . $status_code . ')');
        return new WP_Error('api_error', $error_message, array('status' => $status_code, 'response' => $body));
    }
    
    // Log the invitation
    error_log('AccountScoring invitation created: ' . print_r($body, true));
    
    // Log response for debugging
    error_log('AccountScoring API response: ' . print_r($body, true));
    
    // Return the invitation ID
    // The API actually returns 'uuid' instead of 'invitation_id' in the prelive environment
    // We'll use whichever one is available
    $invitation_id = '';
    if (isset($body['invitation_id'])) {
        $invitation_id = $body['invitation_id'];
    } elseif (isset($body['uuid'])) {
        $invitation_id = $body['uuid'];
        error_log('Using UUID as invitation_id: ' . $invitation_id);
    } else {
        error_log('WARNING: Neither invitation_id nor uuid found in response: ' . print_r($body, true));
    }
    
    return rest_ensure_response(array(
        'success' => true,
        'invitation_id' => $invitation_id,
        'message' => 'Uzaicinājums veiksmīgi izveidots'
    ));
}

/**
 * Submit consumer loan application
 */
function submit_consumer_loan_application($request) {
    $params = $request->get_params();
    
    // Validate required parameters
    $required_fields = ['email', 'phone', 'firstName', 'lastName', 'loanAmount', 'loanTerm'];
    foreach ($required_fields as $field) {
        if (empty($params[$field])) {
            return new WP_Error('missing_field', 'Trūkst obligāto lauku: ' . $field, array('status' => 400));
        }
    }
    
    // Check if bank is connected
    $is_bank_connected = isset($params['isBankConnected']) ? (bool)$params['isBankConnected'] : false;
    
    // Prepare data for your CRM or database
    $application_data = array(
        'email' => sanitize_email($params['email']),
        'phone' => sanitize_text_field($params['phone']),
        'first_name' => sanitize_text_field($params['firstName']),
        'last_name' => sanitize_text_field($params['lastName']),
        'personal_code' => isset($params['personalCode']) ? sanitize_text_field($params['personalCode']) : '',
        'loan_amount' => floatval($params['loanAmount']),
        'loan_term' => intval($params['loanTerm']),
        'monthly_income' => isset($params['monthlyIncome']) ? floatval($params['monthlyIncome']) : 0,
        'other_loans' => isset($params['otherLoans']) ? sanitize_text_field($params['otherLoans']) : 'no',
        'invitation_id' => isset($params['invitationId']) ? sanitize_text_field($params['invitationId']) : '',
        'is_bank_connected' => $is_bank_connected,
        'application_date' => current_time('mysql'),
        'application_type' => 'consumer_loan'
    );
    
    // Here you would typically:
    // 1. Send to your CRM (e.g., Pipedrive)
    // 2. Process application data
    
    // Log the application for debugging purposes only
    error_log('Consumer loan application submitted: ' . print_r($application_data, true));
    
    // Return success response
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Pieteikums veiksmīgi iesniegts'
    ));
}
