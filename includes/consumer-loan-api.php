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
    
    // Try both v2 and v3 endpoints - v2 might be required for some accounts
    $api_version = 'v2'; // Start with v2 as default
    $api_url = $is_test_mode 
        ? "https://prelive.accountscoring.com/api/{$api_version}/invitation" 
        : "https://accountscoring.com/api/{$api_version}/invitation";
    
    error_log('Using API URL: ' . $api_url . ' (Test mode: ' . ($is_test_mode ? 'Yes' : 'No') . ')');
    
    // Format phone number to international format if needed
    $phone = sanitize_text_field($params['phone']);
    if (substr($phone, 0, 1) !== '+') {
        // Add Latvian country code if not present
        $phone = '+371' . preg_replace('/[^0-9]/', '', $phone);
    }
    
    // Prepare request body according to AccountScoring documentation
    // Based on the exact API specification from AccountScoring
    $request_body = array(
        // Required fields
        'client_id' => $client_id,
        'email' => sanitize_email($params['email']),
        'phone' => $phone,
        'name' => sanitize_text_field($params['firstName'] . ' ' . $params['lastName']),
        'locale' => 'lv_LV', // Latvian locale
    );
    
    // Optional fields - only add if they have values
    if (!empty($params['personalCode'])) {
        $request_body['personal_id'] = sanitize_text_field($params['personalCode']);
    }
    
    if (isset($params['loanAmount']) && $params['loanAmount'] > 0) {
        $request_body['amount'] = floatval($params['loanAmount']);
    }
    
    if (isset($params['loanTerm']) && $params['loanTerm'] > 0) {
        $request_body['term'] = intval($params['loanTerm']);
    }
    
    if (isset($params['monthlyIncome']) && $params['monthlyIncome'] > 0) {
        $request_body['monthly_income'] = floatval($params['monthlyIncome']);
    }
    
    // Add callback URLs
    $request_body['redirect_url'] = home_url('/pateriņa-kredīts/paldies/');
    $request_body['postback_url'] = home_url('/wp-json/loan-calculator/v1/accountscoring-callback');
    
    // Log the full request for debugging
    error_log('AccountScoring API request URL: ' . $api_url);
    error_log('AccountScoring API request body: ' . json_encode($request_body));
    
    // Try different authorization formats based on AccountScoring documentation
    $auth_attempts = [
        // Attempt 1: API Key in header
        function($url, $body, $key) {
            return wp_remote_post($url, [
                'headers' => [
                    'X-Api-Key' => $key,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json'
                ],
                'body' => json_encode($body),
                'timeout' => 30
            ]);
        },
        // Attempt 2: Bearer token
        function($url, $body, $key) {
            return wp_remote_post($url, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $key,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json'
                ],
                'body' => json_encode($body),
                'timeout' => 30
            ]);
        },
        // Attempt 3: API Key in URL
        function($url, $body, $key) {
            $url_with_key = add_query_arg(['api_key' => $key], $url);
            return wp_remote_post($url_with_key, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json'
                ],
                'body' => json_encode($body),
                'timeout' => 30
            ]);
        },
    ];
    
    $response = null;
    $success = false;
    
    // Try each authentication method until one works
    foreach ($auth_attempts as $index => $attempt_func) {
        error_log("Trying authentication method {$index}");
        $response = $attempt_func($api_url, $request_body, $api_key);
        
        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) !== 401) {
            $success = true;
            error_log("Authentication method {$index} succeeded");
            break;
        }
        
        error_log("Authentication method {$index} failed with status: " . 
                 (is_wp_error($response) ? $response->get_error_message() : wp_remote_retrieve_response_code($response)));
    }
    
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
    // According to documentation: "it returns and id and invitation_id. id is a parameter that AccountScoring keeps in database as a hashed value and this can't be returned again. This is used to create links for PSU. invitation_id parameter is something that is can be user throughout the system as a unique identifier for an invitation."
    return rest_ensure_response(array(
        'success' => true,
        'invitation_id' => isset($body['invitation_id']) ? $body['invitation_id'] : '',
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
    // 1. Save to your database
    // 2. Send to your CRM (e.g., Pipedrive)
    // 3. Send notification emails
    
    // Example: Save to a custom table (you would need to create this table first)
    global $wpdb;
    $table_name = $wpdb->prefix . 'loan_applications';
    
    // Check if table exists
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        // Table doesn't exist, log error but continue
        error_log('Loan applications table does not exist: ' . $table_name);
    } else {
        // Insert into database
        $result = $wpdb->insert(
            $table_name,
            $application_data,
            array('%s', '%s', '%s', '%s', '%s', '%f', '%d', '%f', '%s', '%s', '%d', '%s', '%s')
        );
        
        if ($result === false) {
            error_log('Failed to insert loan application: ' . $wpdb->last_error);
        }
    }
    
    // Log the application
    error_log('Consumer loan application submitted: ' . print_r($application_data, true));
    
    // Send email notification
    $admin_email = get_option('admin_email');
    $subject = 'Jauns patēriņa kredīta pieteikums';
    $message = "Jauns patēriņa kredīta pieteikums no {$application_data['first_name']} {$application_data['last_name']}.\n\n";
    $message .= "E-pasts: {$application_data['email']}\n";
    $message .= "Tālrunis: {$application_data['phone']}\n";
    $message .= "Summa: {$application_data['loan_amount']} EUR\n";
    $message .= "Termiņš: {$application_data['loan_term']} mēneši\n";
    $message .= "Bankas konts savienots: " . ($is_bank_connected ? 'Jā' : 'Nē') . "\n";
    
    wp_mail($admin_email, $subject, $message);
    
    // Return success response
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Pieteikums veiksmīgi iesniegts'
    ));
}
