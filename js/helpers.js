// Helper constants for colors
const COLOR_GREEN = 'green'
const COLOR_GREENISH = '#008000a6'
const COLOR_RED = '#a42e2e'

// ------- Payone related helpers -------
function showMessageInCheckout(paymentResponse) {
  const checkoutForm = document.querySelector('form')
  checkoutForm.insertAdjacentHTML('beforeend', `<section class="message-container" id="messageContainer"></section>`)

  const messageContainer = document.querySelector('#messageContainer')

  switch (paymentResponse.status) {
    case 'success':
      messageContainer.style.color = COLOR_GREEN
      break

    case 'needs_redirect':
      messageContainer.style.color = COLOR_GREENISH
      break

    case 'error':
    default:
      messageContainer.style.color = COLOR_RED
  }

  messageContainer.innerText = paymentResponse.message
}

function insertGoToPaymentPageLink(redirectUrl) {
  const paymentResponseContainer = document.querySelector('#paymentResponse')
  paymentResponseContainer.insertAdjacentHTML('beforeend', `
    <div class="go-to-payment-page-link-container">
      <a
        class="go-to-payment-page-link js-go-to-payment-page-link--hidden"
        id="goToPaymentPageLink"
      >Go to payment page <span class="go-to-payment-page-link__arrow">➜</span>
      </a>
    </div>
  `)

  const goToPaymentPageLink = document.querySelector('#goToPaymentPageLink')
  goToPaymentPageLink.classList.remove('js-go-to-payment-page-link--hidden')
  goToPaymentPageLink.href = redirectUrl
}

function showMessageInCheckoutAfterRedirect(message, color) {
  const checkoutForm = document.querySelector('form')
  checkoutForm.insertAdjacentHTML('beforeend', `<section class="message-container" id="messageContainer"></section>`)

  const messageContainer = document.querySelector('#messageContainer')

  if (color === 'green') {
    messageContainer.style.color = COLOR_GREEN
  }
  if (color === 'greenish') {
    messageContainer.style.color = COLOR_GREENISH
  }
  if (color === 'red') {
    messageContainer.style.color = COLOR_RED
  }

  messageContainer.innerText = message
}

function showPayoneExampleTransactionStatusNotification(paymentMethod) {
  // If user hasn't clicked a payment method card, then it's the default 'card' payment method
  if (paymentMethod === null) {
    paymentMethod = 'card'
  }

  fetch(`_example-payone-transaction-statuses/${paymentMethod}.json`)
    .then(response => response.json())
    .then((response) => {
      const lastPaymentMethodSpecificData = JSON.parse(localStorage.getItem('lastPaymentMethodSpecificData'))
      response.lastname = lastPaymentMethodSpecificData.surname
      response.country = lastPaymentMethodSpecificData.country
      if (paymentMethod === 'card') {
        response.cardexpiredate = lastPaymentMethodSpecificData.cardExpireDate
        response.cardtype = lastPaymentMethodSpecificData.cardType
        response.cardpan = lastPaymentMethodSpecificData.truncatedCardPAN
      }
      if (paymentMethod === 'paydirekt') {
        response.firstname = lastPaymentMethodSpecificData.firstName
        response.lastname = lastPaymentMethodSpecificData.surname
        response.zip = lastPaymentMethodSpecificData.zip
        response.city = lastPaymentMethodSpecificData.city
      }

      const container = document.querySelector('#transactionStatusNotification')

      container.innerHTML = `
<div class="response-heading-container">
  <h2 style="text-align: center;">Payone example transaction status notification message</h2>
</div>
<div class="response__description-container">
  <p>
    Your app would receive a message like this in the future:
  </p>
</div>
<pre class="response-text" style="color: ${COLOR_GREEN}">
${JSON.stringify(response, null, 2)}
</pre>
`
    })
}

function showCreditCardCheckResponse(creditCardCheckResponse) {
  if (creditCardCheckResponse === undefined) return

  const container = document.querySelector('#creditCardCheckResponse')

  let color = ''
  switch (creditCardCheckResponse.status) {
    case 'VALID':
      color = 'green'
      break

    case 'INVALID':
    case 'ERROR':
    default:
      color = '#a42e2e'
  }

  container.innerHTML = `
<div class="response-heading-container">
  <h2 class="response-heading" style="text-align: center;">Creditcard check</h2>
</div>
<div class="response__description-container">
  <p>
    This is the output of the tokenization step:
  </p>
</div>
<pre class="response-text" style="color: ${color}">
${JSON.stringify(creditCardCheckResponse, null, 2)}
</pre>
`
}

function showPaymentResponse(response) {
  const container = document.querySelector('#paymentResponse')

  let color = ''
  switch (response.status) {
    case 'success':
      color = COLOR_GREEN
      break

    case 'needs_redirect':
      color = COLOR_GREENISH
      break

    case 'error':
    default:
      color = COLOR_RED
  }

  container.innerHTML = `
<div class="response-heading-container">
  <h2 class="response-heading" style="text-align: center;">Payment response</h2>
</div>
${response.status === 'needs_redirect' ? 
  `<div class="response__description-container">
    <p>
      This payment method needs a redirect.
    </p>
  </div>`
  : ''}
<pre class="response-text" style="color: ${color}">
${JSON.stringify(response, null, 2)}
</pre>
`
}

// ------- UI helpers -------
function setCheckoutLoading(isLoading = true) {
  const submitButton = document.querySelector('#checkoutSubmitButton')

  if (isLoading === true) {
    submitButton.disabled = true
    submitButton.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>'
  } else {
    submitButton.disabled = false
    submitButton.innerHTML = 'Pay'
  }
}