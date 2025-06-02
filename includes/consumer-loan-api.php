<?php
/**
 * Consumer Loan Calculator API Endpoints
 */

if (!defined('ABSPATH')) {
    exit;
}

function create_accountscoring_invitation($request) {
    $params = $request->get_params();

    // Validate required parameters
    $required_fields = ['email', 'phone', 'firstName', 'lastName', 'personalCode'];
    foreach ($required_fields as $field) {
        if (empty($params[$field])) {
            return new WP_Error('missing_field', 'Trūkst obligāto lauku: ' . $field, array('status' => 400));
        }
    }

    // Get API key from settings or fallback (should be configured in settings)
    $api_key = get_option('loan_calculator_accountscoring_api_key', '');
    if (empty($api_key)) {
        $api_key = 'YOUR_ACCOUNTSCORING_API_KEY'; // fallback
        error_log('⚠️ Using fallback API key (should be set in settings)');
    }

    // Get client ID from settings or fallback
    $client_id = get_option('loan_calculator_accountscoring_client_id', '');
    if (empty($client_id)) {
        $client_id = '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI'; // fallback
        error_log('⚠️ Using fallback client ID (should be set in settings)');
    }

    // Prepare the API URL
    $api_url = 'https://prelive.accountscoring.com/api/v2/invitations';

    // Build request payload
    $request_body = [
        'email'         => $params['email'],
        'phone'         => $params['phone'],
        'first_name'    => $params['firstName'],
        'last_name'     => $params['lastName'],
        'personal_code' => $params['personalCode'],
        'client_id'     => $client_id
    ];

    // Prepare headers
    $headers = [
        'Authorization' => 'Bearer ' . trim($api_key),
        'Content-Type'  => 'application/json',
        'Accept'        => 'application/json'
    ];

    // Log for debugging (optional, remove in production)
    error_log('🔗 POST ' . $api_url);
    error_log('➡️ Headers: ' . print_r($headers, true));
    error_log('➡️ Body: ' . json_encode($request_body));

    // Make the API call
    $response = wp_remote_post($api_url, [
        'headers' => $headers,
        'body'    => json_encode($request_body),
        'timeout' => 30
    ]);

    // Check response
    if (is_wp_error($response)) {
        return new WP_Error('request_failed', 'Neizdevās izsūtīt pieprasījumu uz AccountScoring API', [
            'status' => 500,
            'details' => $response->get_error_message()
        ]);
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($code === 201 && isset($body['invitation_id'])) {
        return rest_ensure_response([
            'success' => true,
            'invitation_id' => $body['invitation_id']
        ]);
    } else {
        return new WP_Error('api_error', 'Kļūda no AccountScoring API', [
            'status' => 500,
            'response_code' => $code,
            'response_body' => $body
        ]);
    }
}
