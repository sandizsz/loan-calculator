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
        'person_id' => create_pipedrive_person($data, $pipedrive_api_key),
        'organization_id' => create_pipedrive_organization($data, $pipedrive_api_key),
        'value' => floatval($data['loan_amount']),
        'currency' => 'EUR',
        'visible_to' => 3, // Shared with entire company
        'custom_fields' => array(
            'loan_term' => $data['loan_term'],
            'loan_purpose' => $data['loan_purpose'],
            'collateral_type' => $data['collateral_type'],
            'collateral_description' => $data['collateral_description'],
            'has_applied_elsewhere' => $data['has_applied_elsewhere'],
            'company_age' => $data['company_age'],
            'annual_turnover' => $data['annual_turnover'],
            'profit_loss_status' => $data['profit_loss_status'],
            'core_activity' => $data['core_activity']
        )
    );

    // Create lead in Pipedrive
    $response = wp_remote_post('https://api.pipedrive.com/v1/leads', array(
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($lead_data),
        'timeout' => 30,
        'query' => array(
            'api_token' => $pipedrive_api_key
        )
    ));

    if (is_wp_error($response)) {
        return new WP_Error('pipedrive_error', $response->get_error_message(), array('status' => 500));
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (!$body['success']) {
        return new WP_Error('pipedrive_error', 'Failed to create lead in Pipedrive', array('status' => 500));
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
