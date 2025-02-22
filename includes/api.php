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

    // Prepare Pipedrive lead data
    $lead_data = array(
        'title' => $data['title'],
        'value' => array(
            'amount' => floatval($data['loan_amount']),
            'currency' => 'EUR'
        ),
        'expected_close_date' => date('Y-m-d', strtotime('+30 days')),
        'visible_to' => '3', // Shared with entire company
        'note' => sprintf(
            "Loan Application Details:\n\n" .
            "Company: %s\n" .
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
            "Applied Elsewhere: %s",
            $data['company_name'],
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
            $data['has_applied_elsewhere']
        )
    );

    error_log('Sending lead data to Pipedrive: ' . print_r($lead_data, true));

    // Create lead in Pipedrive
    $response = wp_remote_post('https://api.pipedrive.com/v1/leads?' . http_build_query(['api_token' => $pipedrive_api_key]), array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($lead_data),
        'timeout' => 30
    ));

    if (is_wp_error($response)) {
        error_log('Pipedrive API Error: ' . $response->get_error_message());
        return new WP_Error('pipedrive_error', $response->get_error_message(), array('status' => 500));
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    $status_code = wp_remote_retrieve_response_code($response);

    if ($status_code !== 201 && $status_code !== 200) {
        error_log('Pipedrive API Error: ' . print_r($body, true));
        return new WP_Error(
            'pipedrive_error',
            isset($body['error']) ? $body['error'] : 'Failed to create lead in Pipedrive',
            array('status' => $status_code)
        );
    }

    if (empty($body['data'])) {
        error_log('Pipedrive API Error: Empty response data - ' . print_r($body, true));
        return new WP_Error('pipedrive_error', 'Invalid response from Pipedrive', array('status' => 500));
    }

    // Send notification email to admin
    $admin_email = get_option('admin_email');
    $subject = 'New Loan Application Received - ' . $data['company_name'];
    $message = sprintf(
        "New loan application received:\n\nCompany: %s\nContact: %s\nAmount: €%s\nTerm: %s\n\nView in Pipedrive: %s",
        $data['company_name'],
        $data['contact_name'],
        number_format($data['loan_amount'], 2),
        $data['loan_term'],
        'https://app.pipedrive.com/leads/details/' . $body['data']['id']
    );
    
    wp_mail($admin_email, $subject, $message);

    return array(
        'success' => true,
        'message' => 'Application submitted successfully'
    );
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
