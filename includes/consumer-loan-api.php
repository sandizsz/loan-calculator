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
// Key part of the consumer-loan-api.php that needs fixing
function create_accountscoring_invitation($request) {
    $params = $request->get_params();
    
    // Validate required parameters
    $required_fields = ['email', 'phone', 'firstName', 'lastName', 'personalCode'];
    foreach ($required_fields as $field) {
        if (empty($params[$field])) {
            return new WP_Error('missing_field', 'Trūkst obligāto lauku: ' . $field, array('status' => 400));
        }
    }
    
    // Get API key from options or use hardcoded value if not set
    $api_key = get_option('loan_calculator_accountscoring_api_key', '');
    
    // If no API key in options, use hardcoded value (for development)
    if (empty($api_key)) {
        // WARNING: This should be properly configured in production
        $api_key = 'YOUR_ACCOUNTSCORING_API_KEY'; 
        error_log('Using hardcoded API key - should be configured in WordPress settings');
    }
    
    // Get client ID from options or use hardcoded value
    $client_id = get_option('loan_calculator_accountscoring_client_id', '');
    
    // If no client ID in options, use hardcoded value (for development)
    if (empty($client_id)) {
        // This matches the client ID from logs
        $client_id = '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI';
        error_log('Using hardcoded client ID: ' . $client_id);
    }
    
    // Rest of the function...
    
    // When preparing headers, ensure the API key is properly formatted
    $headers = [
        'Authorization' => 'Bearer ' . trim($api_key),
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
    ];
    
    // Log the API call for debugging
    error_log('API Request to: ' . $api_url);
    error_log('Headers: ' . print_r($headers, true));
    error_log('Request body: ' . json_encode($request_body));
    
    // Make the API request
    $response = wp_remote_post($api_url, [
        'headers' => $headers,
        'body' => json_encode($request_body),
        'timeout' => 30
    ]);
    
    // Rest of the function...
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