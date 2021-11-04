const { payoneApiCredentials, payoneApiMode } = window

const payoneCheckout = new PayoneCheckout({apiCredentials: payoneApiCredentials, apiMode: payoneApiMode}).mount('#payoneCheckoutFields')

document.querySelector('form').addEventListener('submit', async (evt) => {
  evt.preventDefault()
  setCheckoutLoading()

  const paymentResponse = await payoneCheckout.pay('/pay.php', {
    items: getCartStorage()
  })
  console.log('%c The payment response:', 'color: #ca880f') // orange-ish color
  console.log(paymentResponse)

  showMessageInCheckout(paymentResponse)
  showPaymentResponse(paymentResponse)
  showCreditCardCheckResponse(payoneCheckout._creditCardCheckResponse)

  if (paymentResponse.status === 'needs_redirect') {
    setCheckoutLoading()

    insertGoToPaymentPageLink(paymentResponse.redirectUrl)

    return // Stop execution to leave the icon loading
  }

  setCheckoutLoading(false)
})

// If there was a redirect, check query params and set respective messages in the checkout
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const { paymentStatus } = params
if (paymentStatus) {
  if (paymentStatus === 'success') {
    showMessageInCheckoutAfterRedirect('Payment succeeded ✓', 'green')

    // Show last payment method example Payone transaction status notification
    const lastPaymentMethod = localStorage.getItem('lastPaymentMethod')
    showPayoneExampleTransactionStatusNotification(lastPaymentMethod)
  }
  if (paymentStatus === 'error') {
    showMessageInCheckoutAfterRedirect('Error while trying to finish payment', 'red')
  }
  if (paymentStatus === 'back') {
    showMessageInCheckoutAfterRedirect('Cancelled payment', 'yellow')
  }
}


// ------- For stubbing data -------
function getCartStorage() {
  return [
    {
      id: 42,
      quantity: 2,
    },
    {
      id: 43,
      quantity: 1
    }
  ]
}
