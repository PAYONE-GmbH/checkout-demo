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

?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="https://docs.payone.com/s/en_GB/7901/abf7b35644d5a5d1d7e4b0969a83e8eb2b569fb5/283/_/favicon.ico">

  <link rel="stylesheet" href="css/style.css">

  <script src="https://secure.pay1.de/client-api/js/v1/payone_hosted.js" defer></script>
  <script src="js/PayoneCheckout.js" defer></script>
  <script src="js/helpers.js" defer></script>
  <script src="js/main.js" defer></script>

  <title>PAYONE checkout demo app</title>
</head>
<body>

<div class="container mt-0">
  <h1 class="app-title">PAYONE checkout demo app</h1>
</div>

<div class="container">
  <div class="column">
    <section id="checkout" class="payone-checkout">
      <form>
        <section class="payone-checkout__fields" id="payoneCheckoutFields"></section>
  
        <div id="payoneCheckoutLastRow" class="payone-checkout__row">
          <button class="payone-checkout__submit-btn" id="checkoutSubmitButton" type="submit">Pay</button>
        </div>
      </form>
    </section>
  </div>

  <div class="column">
    <section class="cart">
      <div class="cart__row">
        <h2>Your cart</h2>
      </div>

      <div class="cart__row">
        <img class="cart__image" src="/images/PayHappy.svg" alt="Cool hoodie">
        <section class="cart__item-description">
          <span>€15.00</span>
          <h3>Cool item #1 (x2)</h3>
        </section>
      </div>
      <div class="cart__row">
        <img class="cart__image" src="/images/PayHappy.svg" alt="Cool joggers">
        <section class="cart__item-description">
          <span>€8.40</span>
          <h3>Cool item #2</h3>
        </section>
      </div>

      <div class="cart__row">
        <h3>Subtotal: €38.40</h3>
      </div>
    </section>
  </div>
</div>


<div class="container">
  <div class="column">
    <section class="response" id="creditCardCheckResponse"></section>
  </div>

  <div class="column">
    <section class="response" id="paymentResponse"></section>
  </div>
</div>

<div class="container">
  <div class="column">
    <section class="response" id="transactionStatusNotification"></section>
  </div>
</div>

<script>
  // Setting globals for credentials
  window.payoneApiCredentials = {
    merchantId: '<?php echo $_ENV['PAYONE_MERCHANT_ID'] ?>',
    portalId: '<?php echo $_ENV['PAYONE_PORTAL_ID'] ?>',
    subAccountId: '<?php echo $_ENV['PAYONE_SUBACCOUNT_ID'] ?>',
    hash: '<?php echo $Payone->generateJsHash() ?>'
  }

  window.payoneApiMode = '<?php echo $_ENV['PAYONE_MODE'] ?>'
</script>

</body>
</html>