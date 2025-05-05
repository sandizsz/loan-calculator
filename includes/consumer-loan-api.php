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
    
    // Get API key from options
    $api_key = get_option('loan_calculator_accountscoring_api_key', '');
    
    if (empty($api_key)) {
        return new WP_Error('missing_api_key', 'AccountScoring API atslēga nav konfigurēta', array('status' => 500));
    }
    
    // Log request for debugging
    error_log('AccountScoring API request: ' . print_r(array(
        'email' => sanitize_email($params['email']),
        'phone' => sanitize_text_field($params['phone']),
        'first_name' => sanitize_text_field($params['firstName']),
        'last_name' => sanitize_text_field($params['lastName']),
        'personal_code' => isset($params['personalCode']) ? sanitize_text_field($params['personalCode']) : '',
    ), true));
    
    // Make API request to AccountScoring
    // Based on the modal documentation for the invitation endpoint
    $response = wp_remote_post('https://accountscoring.com/api/v3/invitation', array(
        'headers' => array(
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type' => 'application/json'
        ),
        'body' => json_encode(array(
            'email' => sanitize_email($params['email']),
            'phone' => sanitize_text_field($params['phone']),
            // Using the field names as specified in the AccountScoring API documentation
            'name' => sanitize_text_field($params['firstName'] . ' ' . $params['lastName']),
            'personal_id' => isset($params['personalCode']) ? sanitize_text_field($params['personalCode']) : '',
            'amount' => isset($params['loanAmount']) ? floatval($params['loanAmount']) : 0,
            'term' => isset($params['loanTerm']) ? intval($params['loanTerm']) : 0,
            'locale' => 'lv_LV', // Latvian locale
            'redirect_url' => home_url('/pateriņa-kredīts/paldies/'),
            'postback_url' => home_url('/wp-json/loan-calculator/v1/accountscoring-callback')
        ))
    ));
    
    if (is_wp_error($response)) {
        return new WP_Error('api_error', $response->get_error_message(), array('status' => 500));
    }
    
    $status_code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);
    
    if ($status_code !== 200 && $status_code !== 201) {
        $error_message = isset($body['message']) ? $body['message'] : 'Kļūda savienojoties ar AccountScoring API';
        return new WP_Error('api_error', $error_message, array('status' => $status_code));
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
