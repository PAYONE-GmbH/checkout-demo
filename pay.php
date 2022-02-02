<?php

require_once 'loadCredentials.php';

$Payone = new \Payone\Payone([
  'mid' => $_ENV['PAYONE_MERCHANT_ID'],
  'portalid' => $_ENV['PAYONE_PORTAL_ID'],
  'aid' => $_ENV['PAYONE_SUBACCOUNT_ID'],
  'key' => $_ENV['PAYONE_KEY'],
  'mode' => $_ENV['PAYONE_MODE'],
  'integrator_name' => $_ENV['PAYONE_INTEGRATOR_NAME']
]);

$postBody = json_decode(file_get_contents('php://input'), true);

$paymentMethod = $postBody['paymentMethod'];
$surname = $postBody['surname'];
$country = $postBody['country'];
$frontendCartItems = $postBody['items'];

$cartItems = [];
foreach ($frontendCartItems as $frontendCartItem) {
  $cartItem = getItemById($frontendCartItem['id']);
  $cartItem['quantity'] = $frontendCartItem['quantity'];

  $cartItems[] = $cartItem;
}

$backToAppUrl = "";
if (isset($_SERVER['HTTP_X_FORWARDED_HOST'])) { // if it's a Gitpod instance, then use Gitpod's workspace URL; else - ours from, most probably, localhost
  $backToAppUrl = "https://{$_SERVER['HTTP_X_FORWARDED_HOST']}";
} else {
  $backToAppUrl = "http://{$_SERVER['HTTP_HOST']}";
}

$payoneResponse = null;
if ($paymentMethod === 'card') {
  $pseudoCardPAN = $postBody['pseudoCardPan'];

  $payoneResponse = $Payone->sendRequest([
    // Payment data
    'request' => 'preauthorization',
    'clearingtype' => 'cc',
    'reference' => uniqid(),
    'amount' => getTotalPriceForItems42And43(),
    'currency' => 'EUR',

    // Customer data
    'lastname' => $surname,
    'country' => $country,

    // Cart items
    'items' => $cartItems,

    // Redirect URLs
    'successurl' => "$backToAppUrl?paymentStatus=success",
    'errorurl' => "$backToAppUrl?paymentStatus=error",
    'backurl' => "$backToAppUrl?paymentStatus=back",

    // Payment data specific to 'clearingtype'
    'pseudocardpan' => $pseudoCardPAN
  ]);
} else if ($paymentMethod === 'paypal') {
  $payoneResponse = $Payone->sendRequest([
    // Payment data
    'request' => 'preauthorization',
    'clearingtype' => 'wlt',
    'reference' => uniqid(),
    'amount' => getTotalPriceForItems42And43(),
    'currency' => 'EUR',

    // Customer data
    'lastname' => $surname,
    'country' => $country,

    // Cart items
    'items' => $cartItems,

    // Redirect URLs
    'successurl' => "$backToAppUrl?paymentStatus=success",
    'errorurl' => "$backToAppUrl?paymentStatus=error",
    'backurl' => "$backToAppUrl?paymentStatus=back",

    // Payment data specific to 'clearingtype'
    'wallettype' => 'PPE'
  ]);
} else if ($paymentMethod === 'paydirekt') {
  $firstName = $postBody['firstName'];
  $zip = $postBody['zip'];
  $city = $postBody['city'];

  $payoneResponse = $Payone->sendRequest([
    // Payment data
    'request' => 'preauthorization',
    'clearingtype' => 'wlt',
    'reference' => uniqid(),
    'amount' => getTotalPriceForItems42And43(),
    'currency' => 'EUR',

    // Customer data
    'lastname' => $surname,
    'country' => $country,

    // Cart items
    'items' => $cartItems,

    // Redirect URLs
    'successurl' => "$backToAppUrl?paymentStatus=success",
    'errorurl' => "$backToAppUrl?paymentStatus=error",
    'backurl' => "$backToAppUrl?paymentStatus=back",

    // Payment data specific to 'clearingtype'
    'wallettype' => 'PDT',
    'shipping_firstname' => $firstName,
    'shipping_lastname' => $surname,
    'shipping_zip' => $zip,
    'shipping_city' => $city,
    'shipping_country' => $country,
  ]);
}

echo json_encode($payoneResponse);


function getItemById($id) {
  if ($id === 42) {
    return [
      'id' => 42,
      'type' => 'goods',
      'SKU' => 'BR-SKA-551-12',
      'price' => 1500,
      'description' => 'Cool item #1',
    ];
  }

  if ($id === 43) {
    return [
      'id' => 43,
      'type' => 'goods',
      'SKU' => 'QL-NBB-477-48',
      'price' => 840,
      'description' => 'Cool item #1',
    ];
  }
}

function getTotalPriceForItems42And43() {
  return 3840;
}