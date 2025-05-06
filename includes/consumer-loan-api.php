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
    $required_fields = ['email', 'phone', 'firstName', 'lastName', 'personalCode'];
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
    
    // Check if we're in test mode
    $is_test_mode = defined('WP_DEBUG') && WP_DEBUG;
    
    // Use the correct API endpoint
    $api_url = $is_test_mode 
        ? 'https://prelive.accountscoring.com/api/v3/invitation' 
        : 'https://accountscoring.com/api/v3/invitation';
    
    error_log('Using API URL: ' . $api_url . ' (Test mode: ' . ($is_test_mode ? 'Yes' : 'No') . ')');
    
    // Format phone number to international format if needed
    $phone = sanitize_text_field($params['phone']);
    if (substr($phone, 0, 1) !== '+') {
        // Add Latvian country code if not present
        $phone = '+371' . preg_replace('/[^0-9]/', '', $phone);
    }
    
    // Prepare request body according to the AccountScoring API documentation
    $request_body = array(
        // Required fields according to documentation
        'name' => sanitize_text_field($params['firstName'] . ' ' . $params['lastName']),
        'personal_code' => sanitize_text_field($params['personalCode']),
        'locale' => 'lv_LV',  // Latvian locale
        'send_email' => false, // We'll handle the flow in our app
        'transaction_days' => 90,
        
        // Add email (required if send_email is true)
        'email' => sanitize_email($params['email']),
        
        // Add phone (not required by API but useful for our records)
        'phone' => $phone,
        
        // Add redirect and webhook URLs
        'redirect_url' => home_url('/pateriņa-kredīts/paldies/'),
        'webhook_url' => home_url('/wp-json/loan-calculator/v1/accountscoring-callback'),
        
        // Latvian banks
        'allowed_banks' => array(
            'HABALV22', // Swedbank
            'UNLALV2X', // SEB
            'PARXLV22', // Citadele
            'NDEALV2X', // Luminor
            'REVOGB21XXX', // Revolut
            'N26' // N26
        ),
    );
    
    // Add loan-specific data
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
    
    // Prepare headers with Bearer token authentication
    $headers = [
        'Authorization' => 'Bearer ' . trim($api_key),
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
    ];
    
    $response = wp_remote_post($api_url, [
        'headers' => $headers,
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
    
    // Get the invitation ID (uuid) from the response
    $invitation_id = '';
    if (isset($body['uuid'])) {
        $invitation_id = $body['uuid'];
    } else {
        error_log('WARNING: uuid not found in response: ' . print_r($body, true));
        return new WP_Error('api_error', 'Neizdevās izveidot AccountScoring uzaicinājumu', array('status' => 500));
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
    // 1. Save application to database (custom post type)
    $post_id = save_loan_application($application_data);
    
    // 2. Send to your CRM (e.g., Pipedrive) if needed
    $pipedrive_integration = get_option('loan_calculator_pipedrive_enabled', false);
    if ($pipedrive_integration) {
        send_to_pipedrive($application_data);
    }
    
    // Log the application for debugging purposes
    error_log('Consumer loan application submitted: ' . print_r($application_data, true));
    
    // Return success response
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Pieteikums veiksmīgi iesniegts',
        'application_id' => $post_id
    ));
}

/**
 * Handle AccountScoring callback/webhook
 */
function handle_accountscoring_callback($request) {
    $params = $request->get_params();
    $body = $request->get_body();
    
    // Log the callback for debugging
    error_log('AccountScoring callback received: ' . $body);
    
    $data = json_decode($body, true);
    
    if (!$data || !isset($data['invitation_id'])) {
        return new WP_Error('invalid_callback', 'Invalid callback data', array('status' => 400));
    }
    
    // Process the callback based on its type
    if (isset($data['type']) && $data['type'] === 'account_access_granted') {
        // Bank account access has been granted
        // Update application status and store statement ID if provided
        if (isset($data['statement_id'])) {
            update_application_by_invitation_id($data['invitation_id'], array(
                'status' => 'bank_connected',
                'statement_id' => $data['statement_id']
            ));
            
            // Optionally trigger statement analysis here
            trigger_statement_analysis($data['statement_id']);
        }
    }
    
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Webhook received'
    ));
}

/**
 * Save loan application to database
 */
function save_loan_application($data) {
    // Create a new post for the loan application
    $post_args = array(
        'post_title'    => 'Loan Application - ' . $data['first_name'] . ' ' . $data['last_name'],
        'post_status'   => 'publish',
        'post_type'     => 'loan_application',
    );
    
    $post_id = wp_insert_post($post_args);
    
    if (!is_wp_error($post_id)) {
        // Save all application data as post meta
        foreach ($data as $key => $value) {
            update_post_meta($post_id, '_loan_' . $key, $value);
        }
        
        // Set initial status
        update_post_meta($post_id, '_loan_status', $data['is_bank_connected'] ? 'bank_connected' : 'submitted');
    }
    
    return $post_id;
}

/**
 * Update application by invitation ID
 */
function update_application_by_invitation_id($invitation_id, $data) {
    // Query for loan applications with this invitation ID
    $args = array(
        'post_type' => 'loan_application',
        'meta_query' => array(
            array(
                'key' => '_loan_invitation_id',
                'value' => $invitation_id,
                'compare' => '='
            )
        ),
        'posts_per_page' => 1
    );
    
    $query = new WP_Query($args);
    
    if ($query->have_posts()) {
        $query->the_post();
        $post_id = get_the_ID();
        
        // Update application data
        foreach ($data as $key => $value) {
            update_post_meta($post_id, '_loan_' . $key, $value);
        }
        
        wp_reset_postdata();
        return true;
    }
    
    return false;
}

/**
 * Trigger statement analysis (sample function)
 */
function trigger_statement_analysis($statement_id) {
    // This would typically make an API call to get statement predictions
    // For now, just log that we would do this
    error_log('Would trigger analysis for statement ID: ' . $statement_id);
    
    // In a real implementation, you would:
    // 1. Call the statement-predictions-v2 endpoint
    // 2. Process the credit score
    // 3. Update the application with the score and decision
}

/**
 * Send application data to Pipedrive CRM (sample function)
 */
function send_to_pipedrive($data) {
    // This is a placeholder for Pipedrive integration
    // In a real implementation, you would make API calls to Pipedrive
    error_log('Would send application to Pipedrive: ' . print_r($data, true));
}

/**
 * Register callback for handling AccountScoring webhook
 */
function handle_accountscoring_callback_endpoint($request) {
    return handle_accountscoring_callback($request);
}