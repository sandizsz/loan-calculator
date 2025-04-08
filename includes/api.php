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
    
    // Log the incoming data for debugging
    error_log('Received form data: ' . json_encode($data, JSON_PRETTY_PRINT));
    
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
        'name' => $data['companyName'],
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
    
    // Log organization creation response
    error_log('Organization creation response: ' . wp_remote_retrieve_response_code($org_response));
    error_log('Organization data: ' . json_encode($org_body, JSON_PRETTY_PRINT));

    // Create person
    $person_data = array(
        'name' => $data['contactName'],
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
    
    // Log person creation response
    error_log('Person creation response: ' . wp_remote_retrieve_response_code($person_response));
    error_log('Person data: ' . json_encode($person_body, JSON_PRETTY_PRINT));

    // Prepare Pipedrive lead data with custom fields
    // Base lead data
    $lead_data = array(
        'title' => 'Aizdevuma pieteikums - ' . $data['companyName'],
        'owner_id' => $owner_id,
        'value' => array(
            'amount' => floatval(str_replace(array(' ', ','), array('', '.'), $data['loanAmount'])),
            'currency' => 'EUR'
        ),
        'expected_close_date' => date('Y-m-d', strtotime('+30 days'))
    );
    
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
    
    // ----------------------
    // CUSTOM FIELD MAPPINGS
    // ----------------------
    
    // Reģistrācijas numurs (key: 35e584f3aeee47a58265149def733427d7beb2a2)
    if (!empty($data['regNumber'])) {
        $lead_data['35e584f3aeee47a58265149def733427d7beb2a2'] = $data['regNumber'];
    }
    
    // Uzņēmuma vecums (key: e0b1fa455bd6e56030f83ae350863a357ed7e236) - enum field
    if (!empty($data['companyAge'])) {
        // Map the company age to the correct option ID
        $company_age_map = [
            '0-6' => 32,    // Līdz 6 mēnešiem
            '6-12' => 33,   // 6-12 mēneši
            '1-2' => 34,    // 1-2 gadi
            '2-3' => 71,    // 2-3 gadi
            '3+' => 72,     // Vairāk kā 3 gadi
        ];
        
        $age_value = isset($company_age_map[$data['companyAge']]) ? $company_age_map[$data['companyAge']] : 32;
        $lead_data['e0b1fa455bd6e56030f83ae350863a357ed7e236'] = $age_value;
    }
    
    // Apgrozījums pēdējā gadā (EUR) (key: 30b6a6278feea6cdfe8b2bcf7a295145804365d1) - enum field
    if (!empty($data['annualTurnover'])) {
        // Map the turnover to the correct option ID
        $turnover_map = [
            'lt200k' => 28,     // < 200 000
            '200k-500k' => 29,  // 200 001 – 500 000
            '500k-1m' => 30,    // 500 001 – 1 000 000
            'gt1m' => 31,       // > 1 000 000
        ];
        
        $turnover_value = isset($turnover_map[$data['annualTurnover']]) ? $turnover_map[$data['annualTurnover']] : 28;
        $lead_data['30b6a6278feea6cdfe8b2bcf7a295145804365d1'] = $turnover_value;
    }
    
    // Peļņa vai zaudējumi pēdējā gadā (key: c4cbde23802f42ce2856908a0ff6decf94dc7185) - enum field
    if (!empty($data['profitLossStatus'])) {
        // Map profit/loss status to the correct option ID
        $profit_loss_map = [
            'profit' => 35,    // Peļņa
            'loss' => 36,      // Zaudējumi
            'noData' => 37,    // Nav pieejamu datu
        ];
        
        $profit_loss_value = isset($profit_loss_map[$data['profitLossStatus']]) ? $profit_loss_map[$data['profitLossStatus']] : 35;
        $lead_data['c4cbde23802f42ce2856908a0ff6decf94dc7185'] = $profit_loss_value;
    }
    
    // Jūsu pozīcija uzņēmumā (key: 2cd024df7983ad750a8b2828f8a0597fb764bd34) - enum field
    if (!empty($data['companyPosition'])) {
        // Map position to the correct option ID
        $position_map = [
            'owner' => 38,        // Īpašnieks / valdes loceklis
            'board' => 39,        // Valdes loceklis
            'other' => 41,        // Cits
        ];

     
        

        
        $position_value = isset($position_map[$data['companyPosition']]) ? $position_map[$data['companyPosition']] : 38;
        $lead_data['2cd024df7983ad750a8b2828f8a0597fb764bd34'] = $position_value;
    }
    
    // Pamata darbība (īss apraksts) (key: 6c695fa59d23ce5853c14a270f19fef16e471c65)
    if (!empty($data['coreActivity'])) {
        $lead_data['6c695fa59d23ce5853c14a270f19fef16e471c65'] = $data['coreActivity'];
    }
    
    // Nepieciešamā summa (EUR) (key: 5f3b98c8992283a4e7d4d6a1491b4f854cd99dbc)
    if (!empty($data['loanAmount'])) {
        $lead_data['5f3b98c8992283a4e7d4d6a1491b4f854cd99dbc'] = floatval(str_replace(array(' ', ','), array('', '.'), $data['loanAmount']));
    }
    
    // Vēlamais termiņš (mēneši/gadi) (key: 1b3bc3ee821b653b33c255b2012db731749ad292)
    if (!empty($data['loanTerm'])) {
        $lead_data['1b3bc3ee821b653b33c255b2012db731749ad292'] = $data['loanTerm'] . ' mēneši';
    }
    
    // Aizdevuma mērķis (key: 27aa379d105b5516eb80e88e563bca3829a56533) - set field (multipleOption)
    if (!empty($data['loanPurpose'])) {
        // Map loan purpose to the correct option ID(s)
        $purpose_map = [
            'apgrozamie' => 49,      // Apgrozāmie līdzekļi
            'pamatlidzekli' => 50,   // Pamatlīdzekļu iegāde
            'refinansesana' => 51,   // Kredītu refinansēšana
            'projekti' => 52,        // Projektu finansēšana
            'cits' => 54,            // Cits
        ];
        
        $purpose_value = isset($purpose_map[$data['loanPurpose']]) ? $purpose_map[$data['loanPurpose']] : 49;
        // For multipleOption fields, we need to send an array of option IDs
        $lead_data['27aa379d105b5516eb80e88e563bca3829a56533'] = [$purpose_value];
    }
    
    // Nepieciešamais finanšu produkts (key: 15ff4b6ef37a1fee1b1893c9e1f892f62c38a0ca) - enum field
    if (!empty($data['financialProduct'])) {
        // Log the incoming financial product value
        error_log('Financial product from form: ' . $data['financialProduct']);
        
        // Define known product options
        $product_map = [
            'Aizdevums uzņēmumiem' => 55,
            'Aizdevums pret ķīlu' => 56,
            'Auto līzings uznēmumiem' => 57, 
            'Faktorings' => 58,
            'Pārkreditācija' => 59,
            'Cits mērķis' => 70,
            'Cits finanšu produkts' => 70  // Map "Cits finanšu produkts" to "Cits mērķis"
        ];
        
        // Try direct match first
        if (isset($product_map[$data['financialProduct']])) {
            $product_value = $product_map[$data['financialProduct']];
        } else {
            // Try partial matching
            $product_value = 55; // Default to Aizdevums
            foreach ($product_map as $name => $id) {
                if (stripos($data['financialProduct'], $name) !== false) {
                    $product_value = $id;
                    break;
                }
            }
        }
        
        $lead_data['15ff4b6ef37a1fee1b1893c9e1f892f62c38a0ca'] = $product_value;
        error_log('Mapped financial product to: ' . $product_value);
    } else {
        // Set default value
        $lead_data['15ff4b6ef37a1fee1b1893c9e1f892f62c38a0ca'] = 55; // Default to 'Aizdevums uzņēmumiem'
    }
    
    // Vai uzņēmumam ir nodokļu parāds? (key: 1508bb85c76de81b3ccb042eff4ceccfbb22209c) - enum field
    if (!empty($data['taxDebtStatus'])) {
        $tax_debt_map = [
            'no' => 44,              // Nav
            'withSchedule' => 45,    // Ir, ar VID grafiku
            'withoutSchedule' => 46, // Ir, bez VID grafika
        ];
        
        $tax_debt_value = isset($tax_debt_map[$data['taxDebtStatus']]) ? $tax_debt_map[$data['taxDebtStatus']] : 44;
        $lead_data['1508bb85c76de81b3ccb042eff4ceccfbb22209c'] = $tax_debt_value;
    }
    
    // Nodokļu parāda summa (ja ir) (key: 3fc43a8dd0d75adfec6faeeb4ed1728cb5e11dc8) - double field
    if (!empty($data['taxDebtAmount']) && isset($data['taxDebtStatus']) && $data['taxDebtStatus'] !== 'no') {
        $lead_data['3fc43a8dd0d75adfec6faeeb4ed1728cb5e11dc8'] = floatval(str_replace(array(' ', ','), array('', '.'), $data['taxDebtAmount']));
    }
    
    // Vai pēdējo 12 mēnešu laikā ir bijušas kavētas kredītmaksājumu vai nodokļu saistības? (key: 3499355bdbd3c8aab330f92b79d61e8cd61476f4) - enum field
    if (!empty($data['hadPaymentDelays'])) {
        $payment_delays_map = [
            'yes' => 47, // Jā
            'no' => 48   // Nē
        ];
        
        $payment_delays_value = isset($payment_delays_map[$data['hadPaymentDelays']]) ? $payment_delays_map[$data['hadPaymentDelays']] : 48;
        $lead_data['3499355bdbd3c8aab330f92b79d61e8cd61476f4'] = $payment_delays_value;
    }
    
    // Piedāvātais nodrošinājums (key: d41ac0a12ff272eb9932c157db783b12fa55d4a8) - set field (multipleOption)
    if (!empty($data['collateralType'])) {
        // Map collateral type to the correct option ID
        $collateral_map = [
            'real-estate' => 60,        // Nekustamais īpašums
            'vehicles' => 61,           // Transportlīdzekļi
            'commercial-pledge' => 62,  // Komercķīla
            'none' => 63,               // Nav nodrošinājuma
            'other' => 64,              // Cits
        ];
        
        $collateral_value = isset($collateral_map[$data['collateralType']]) ? $collateral_map[$data['collateralType']] : 63;
        // For multipleOption fields, we need to send an array of option IDs
        $lead_data['d41ac0a12ff272eb9932c157db783b12fa55d4a8'] = [$collateral_value];
        error_log('Mapped collateral type to: ' . $collateral_value);
    }
    
    // Aprakstiet piedāvāto nodrošinājumu (key: 9431e23f2b409deafaf14bccf8ca006a8d54da33)
    if (!empty($data['collateralDescription'])) {
        $lead_data['9431e23f2b409deafaf14bccf8ca006a8d54da33'] = $data['collateralDescription'];
    }
    
    // Vai pēdējo 3 mēnešu laikā esat vērsušies citā finanšu iestādē? (key: aaf42dc07ef7a915caf41d82e5fad57e79adc0ef) - enum field
    if (!empty($data['hasAppliedElsewhere'])) {
        // Map yes/no to the correct option ID
        $applied_elsewhere_map = [
            'yes' => 65,  // Jā
            'no' => 66,   // Nē
        ];
        
        $applied_elsewhere_value = isset($applied_elsewhere_map[$data['hasAppliedElsewhere']]) ? $applied_elsewhere_map[$data['hasAppliedElsewhere']] : 66;
        $lead_data['aaf42dc07ef7a915caf41d82e5fad57e79adc0ef'] = $applied_elsewhere_value;
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
        return new WP_Error('pipedrive_error', 'Failed to create lead: ' . 
            (!empty($lead_body['error']) ? $lead_body['error'] : 'Unknown error'), array('status' => 500));
    }
    
    if (empty($lead_body['data']['id'])) {
        error_log('Pipedrive Lead API Error: No lead ID returned in successful response');
        error_log('Pipedrive Lead API Response: ' . print_r($lead_body, true));
        return new WP_Error('pipedrive_error', 'Failed to create lead: No lead ID returned', array('status' => 500));
    }

    $lead_id = $lead_body['data']['id'];




// Create note for the lead with additional details in Latvian
$note_content = "Aizdevuma pieteikuma detaļas:\n\n";
    
// Company information
$note_content .= "Reģistrācijas numurs: " . (!empty($data['regNumber']) ? $data['regNumber'] : 'Nav norādīts') . "\n";

// Map company position to Latvian
$position_labels = [
    'owner' => 'Īpašnieks / valdes loceklis',
    'board' => 'Valdes loceklis',
    'other' => 'Cits'
];
$position_label = !empty($data['companyPosition']) && isset($position_labels[$data['companyPosition']]) 
    ? $position_labels[$data['companyPosition']] 
    : 'Nav norādīts';
$note_content .= "Jūsu pozīcija uzņēmumā: " . $position_label . "\n";

// Map company age to Latvian
$age_labels = [
    '0-6' => 'Līdz 6 mēnešiem',
    '6-12' => '6-12 mēneši',
    '1-2' => '1-2 gadi',
    '2-3' => '2-3 gadi',
    '3+' => 'Vairāk kā 3 gadi'
];
$age_label = !empty($data['companyAge']) && isset($age_labels[$data['companyAge']]) 
    ? $age_labels[$data['companyAge']] 
    : 'Nav norādīts';
$note_content .= "Uzņēmuma vecums: " . $age_label . "\n";

// Map annual turnover to Latvian
$turnover_labels = [
    'lt200k' => '< 200 000',
    '200k-500k' => '200 001 – 500 000',
    '500k-1m' => '500 001 – 1 000 000',
    'gt1m' => '> 1 000 000'
];
$turnover_label = !empty($data['annualTurnover']) && isset($turnover_labels[$data['annualTurnover']]) 
    ? $turnover_labels[$data['annualTurnover']] 
    : 'Nav norādīts';
$note_content .= "Apgrozījums pēdējā gadā (EUR): " . $turnover_label . "\n";

// Map profit/loss status to Latvian
$profit_loss_labels = [
    'profit' => 'Peļņa',
    'loss' => 'Zaudējumi',
    'noData' => 'Nav pieejamu datu'
];
$profit_loss_label = !empty($data['profitLossStatus']) && isset($profit_loss_labels[$data['profitLossStatus']]) 
    ? $profit_loss_labels[$data['profitLossStatus']] 
    : 'Nav norādīts';
$note_content .= "Peļņa vai zaudējumi pēdējā gadā: " . $profit_loss_label . "\n";

$note_content .= "Pamata darbība: " . (!empty($data['coreActivity']) ? $data['coreActivity'] : 'Nav norādīts') . "\n\n";

// Loan information
$note_content .= "Aizdevuma summa (EUR): " . (!empty($data['loanAmount']) ? $data['loanAmount'] : 'Nav norādīts') . "\n";
$note_content .= "Aizdevuma termiņš: " . (!empty($data['loanTerm']) ? $data['loanTerm'] . ' mēneši' : 'Nav norādīts') . "\n";

// Map loan purpose to Latvian
$purpose_labels = [
    'apgrozamie' => 'Apgrozāmie līdzekļi',
    'pamatlidzekli' => 'Pamatlīdzekļu iegāde',
    'refinansesana' => 'Kredītu refinansēšana',
    'projekti' => 'Projektu finansēšana',
    'cits' => 'Cits'
];
$purpose_label = !empty($data['loanPurpose']) && isset($purpose_labels[$data['loanPurpose']]) 
    ? $purpose_labels[$data['loanPurpose']] 
    : 'Nav norādīts';
$note_content .= "Aizdevuma mērķis: " . $purpose_label . "\n";

// Map financial product to Latvian (using direct value as it should already be in Latvian)
$note_content .= "Nepieciešamais finanšu produkts: " . (!empty($data['financialProduct']) ? $data['financialProduct'] : 'Nav norādīts') . "\n\n";

// Tax and financial status
$tax_debt_labels = [
    'no' => 'Nav',
    'withSchedule' => 'Ir, ar VID grafiku',
    'withoutSchedule' => 'Ir, bez VID grafika'
];
$tax_debt_label = !empty($data['taxDebtStatus']) && isset($tax_debt_labels[$data['taxDebtStatus']]) 
    ? $tax_debt_labels[$data['taxDebtStatus']] 
    : 'Nav norādīts';
$note_content .= "Nodokļu parāda statuss: " . $tax_debt_label . "\n";

if (!empty($data['taxDebtAmount']) && !empty($data['taxDebtStatus']) && $data['taxDebtStatus'] !== 'no') {
    $note_content .= "Nodokļu parāda summa: " . $data['taxDebtAmount'] . " EUR\n";
}

$payment_delays_labels = [
    'yes' => 'Jā',
    'no' => 'Nē'
];
$payment_delays_label = !empty($data['hadPaymentDelays']) && isset($payment_delays_labels[$data['hadPaymentDelays']]) 
    ? $payment_delays_labels[$data['hadPaymentDelays']] 
    : 'Nav norādīts';
$note_content .= "Kavētas maksājumu saistības: " . $payment_delays_label . "\n\n";

// Collateral information
$collateral_labels = [
    'real-estate' => 'Nekustamais īpašums',
    'vehicles' => 'Transportlīdzekļi',
    'commercial-pledge' => 'Komercķīla',
    'none' => 'Nav nodrošinājuma',
    'other' => 'Cits'
];
$collateral_label = !empty($data['collateralType']) && isset($collateral_labels[$data['collateralType']]) 
    ? $collateral_labels[$data['collateralType']] 
    : 'Nav norādīts';
$note_content .= "Piedāvātais nodrošinājums: " . $collateral_label . "\n";

if (!empty($data['collateralDescription']) && !empty($data['collateralType']) && $data['collateralType'] !== 'none') {
    $note_content .= "Nodrošinājuma apraksts: " . $data['collateralDescription'] . "\n";
}

// Additional information
$applied_elsewhere_labels = [
    'yes' => 'Jā',
    'no' => 'Nē'
];
$applied_elsewhere_label = !empty($data['hasAppliedElsewhere']) && isset($applied_elsewhere_labels[$data['hasAppliedElsewhere']]) 
    ? $applied_elsewhere_labels[$data['hasAppliedElsewhere']] 
    : 'Nav norādīts';
$note_content .= "Vērsies citā finanšu iestādē: " . $applied_elsewhere_label;

// Add this right after creating the note_data array
error_log('Note content: ' . $note_content);
    
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
} else {
    $note_status = wp_remote_retrieve_response_code($note_response);
    $note_body = wp_remote_retrieve_body($note_response);
    error_log('Pipedrive Note API response code: ' . $note_status);
    error_log('Pipedrive Note API response body: ' . $note_body);
}

$note_data = array(
    'content' => $note_content,
    'lead_id' => $lead_id
);
}