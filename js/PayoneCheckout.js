class PayoneCheckout {
  _apiCredentials
  _apiMode
  _style
  _supportedCardTypes
  _checkout
  _container
  _creditCardCheckResponse

  paymentMethod = 'card' // default payment method

  constructor(config) {
    this._apiCredentials = config.apiCredentials
    this._apiMode = config.apiMode ?? 'test'
    this._style = config.style
    this._supportedCardTypes = config.supportedCardTypes ?? ['V', 'M']

    // Payone's hosted JS, in order to invoke handler for successful credit card check, expects string name of a global function.
    // That's why we need to make the handler global. In this case, name of the handler is 'storeCreditCardCheckResponse'
    window.storeCreditCardCheckResponse = this._storeCreditCardCheckResponse.bind(this)
  }

  mount(selector) {
    const container = document.querySelector(selector)
    this._container = container
    if (this._container === null) throw new Error(`Couldn't mount to selector '${selector}'. Provide valid selector for the checkout container`)

    // Insert <style> tag with necessary styles for the checkout
    document.head.insertAdjacentHTML("beforeend", `
<style>
.payone-checkout__payment-methods-line {
  display: flex;
}

.payone-checkout__payment-method-card {
  margin-right: 20px;
  padding: 25px 30px;
  background-color: transparent;
  border: 1px solid lightgray;
  border-radius: 5px;
  cursor: pointer;
}
.payone-checkout__payment-method-card:focus {
  outline: none;
  border-color: #0969da;
  box-shadow: rgba(9, 105, 218, 0.5) 0 0 0 3px;
}
.payone-checkout__payment-method-card:last-child {
  margin-right: 0;
}
.payone-js-checkout__payment-method-card--chosen {
  box-shadow: rgba(9, 105, 218, 0.5) 0 0 0 3px;
}


/** Checkout **/
.payone-checkout {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 18px;
  color: #141414;
  width: 400px;
  background-color: white;
  padding: 13px 31px;
  border-radius: 4px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

/* Card types line */
.payone-checkout__card-types-line {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}

.payone-checkout__card {
  margin-right: 15px;
  padding: 2px;
}
.payone-checkout__card-visa {
  height: 20px;
}
.payone-checkout__card:last-child {
  margin-right: 0;
}

.payone-js-checkout__card--highlighted {
  outline: 2px solid cornflowerblue;
}

/* Checkout row */
.payone-checkout__row {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.payone-checkout__row:last-child {
  margin-bottom: 0;
}
.payone-checkout__row:only-child {
  margin-bottom: 0;
}

.payone-checkout__fields {
  margin-bottom: 20px;
}

.payone-checkout__row label {
  margin-bottom: 6px;
}

.payone-checkout__row input {
  border: 1px solid lightgray;
  border-radius: 5px;
  font-size: 18px;
  box-sizing: border-box;
  padding: 8px 10px;
}
.payone-checkout__row input:focus {
  border-color: #0969da;
  outline: none;
}

/* Checkout row inner */
.payone-checkout__row-inner {
  display: flex;
  justify-content: space-between;
}

.payone-checkout__row-inner .payone-checkout__col input {
  width: 185px;
}

/* Checkout column */
.payone-checkout__col {
  display: flex;
  flex-direction: column;
}

.payone-checkout__col label {
  font-size: 14px;
}

/* Checkout submit button */
.payone-checkout__submit-btn {
  border: none;
  cursor: pointer;
  padding: 9px 12px;
  background-color: #1f9cd0;
  color: white;
  border-radius: 4px;
  font-size: 18px;
}
.payone-checkout__submit-btn:hover {
  background-color: rgba(35, 165, 220, 0.95);
}
.payone-checkout__submit-btn:focus {
  border-color: #0969da;
  outline: none;
  box-shadow: rgba(9, 105, 218, 0.3) 0 0 0 3px;
}
.payone-checkout__submit-btn:disabled {
  cursor: not-allowed;
  background-color: rgba(35, 165, 220, 0.47);
}

/* Checkout select */
.payone-checkout select {
  width: 185px;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 5px;
  font-size: 17px;
  /* Specify this for Firefox */
  border: 1px solid lightgray;
  background-color: white;
}
.payone-checkout select:focus {
  border: 1px solid #0969da;
}
.payone-checkout select:focus-visible {
  border-color: #0969da;
  outline: none;
}

/* Message container */
.message-container {
  text-align: center;
  margin-top: 7px;
}

/* Related to iframes */
iframe {
  width: 100%;
  max-height: 39px;
}

.payone-checkout__row-inner .payone-checkout__col section {
  width: 185px;
}

/* Loader */
.lds-ring {
  display: inline-block;
  position: relative;

  /* Commented with and height and added top and left for proper positioning */
  /*width: 80px;*/
  /*height: 80px;*/

  top: -28px;
  left: -26px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 30px;
  height: 30px;
  margin: 8px;
  border: 3px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>`
    )

    // Render the HTML
    this._container.innerHTML = `
      <div class="payone-checkout__row">
        <section class="payone-checkout__payment-methods-line">
          <button
            type="button"
            id="payonePaymentMethodCard"
            data-payment-method="card"
            class="payone-checkout__payment-method-card ${this.paymentMethod === 'card' ? 'payone-js-checkout__payment-method-card--chosen' : ''}"
          >Card</button>
          <button
            type="button"
            id="payonePaymentMethodCard"
            data-payment-method="paypal"
            class="payone-checkout__payment-method-card ${this.paymentMethod === 'paypal' ? 'payone-js-checkout__payment-method-card--chosen' : ''}"
          >PayPal</button>
          <button
            type="button"
            id="payonePaymentMethodCard"
            data-payment-method="paydirekt"
            class="payone-checkout__payment-method-card ${this.paymentMethod === 'paydirekt' ? 'payone-js-checkout__payment-method-card--chosen' : ''}"
          >Paydirekt</button>
        </section>
      </div>

      <div class="payone-checkout__row" id="payoneCheckoutRowCard">
        <label for="cardNumber">Card number</label>
        <section id="cardNumber"></section>
        <section id="checkoutCardTypesLine" class="payone-checkout__card-types-line"></section>
      </div>
  
      <div class="payone-checkout__row" id="payoneCheckoutRowCard">
        <div class="payone-checkout__row-inner">
          <div class="payone-checkout__col">
            <label for="cardExpiryMonth">Expire month</label>
            <section id="cardExpiryMonth"></section>
          </div>
  
          <div class="payone-checkout__col">
            <label for="cardExpiryYear">Expire year</label>
            <section id="cardExpiryYear"></section>
          </div>
        </div>
      </div>
  
      <div class="payone-checkout__row" id="payoneCheckoutRowCard">
        <div class="payone-checkout__row-inner">
          <div class="payone-checkout__col">
            <label for="cvc">CVC</label>
            <section id="cvc"></section>
          </div>
  
          <div class="payone-checkout__col">
            <label for="country">Country</label>
            <select name="country" id="country">
              <option value="DE">Germany</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="payone-checkout__row" id="payoneCheckoutRowCard">
        <label for="surname">Surname</label>
        <input required maxlength="50" name="surname">
      </div>
    `

    // Render supported card types
    const cardTypesLine = this._container.querySelector('#checkoutCardTypesLine')
    cardTypesLine.innerHTML = this._supportedCardTypes.reduce((acc, type) => (
      acc + `<img class="payone-checkout__card ${type === 'V' ? 'payone-checkout__card-visa' : ''}" data-card-type="${type}" src="https://cdn.pay1.de/cc/${type.toLowerCase()}/s/transparent.png" alt="${type} card icon">`
    ), '')

    // Use Payone's Client API hostted iFrames to receive inputted card's data
    this._checkout = new Payone.ClientApi.HostedIFrames(
      {
        fields: {
          cardpan: {
            selector: 'cardNumber',
            type: 'text',
            maxlength: '19'
          },
          cardexpiremonth: {
            selector: 'cardExpiryMonth',
            type: 'text',
            maxlength: '2',
          },
          cardexpireyear: {
            selector: 'cardExpiryYear',
            type: 'text',
            maxlength: '2'
          },
          cardcvc2: {
            selector: 'cvc',
            type: 'password',
            maxlength: '4',
            length: {'V': 3, 'M': 3}
          },
        },

        defaultStyle: {
          input: this._style?.default ?? 'border: 1px solid lightgray; border-radius: 5px; font-size: 18px; box-sizing: border-box; padding: 8px 10px; width: 99%; height: 99%',
          inputFocus: this._style?.focused ?? 'border: 1px solid #0969da; border-radius: 5px; font-size: 18px; box-sizing: border-box; padding: 8px 10px; width: 99%; height: 99%; outline: none;',
          iframe: {},
        },

        autoCardtypeDetection: {
          supportedCardtypes: this._supportedCardTypes,
          callback: (detectedCardType) => {
            document.querySelectorAll('[data-card-type]').forEach((cardTypeIcon) => {
              cardTypeIcon.classList.remove('payone-js-checkout__card--highlighted')
            })

            const detectedCardTypeIcon = document.querySelector(`[data-card-type=${detectedCardType}]`)
            detectedCardTypeIcon.classList.add('payone-js-checkout__card--highlighted')
          }
        },
      },
      {
        'mid': this._apiCredentials.merchantId,
        'portalid': this._apiCredentials.portalId,
        'aid': this._apiCredentials.subAccountId,
        'hash': this._apiCredentials.hash,
        'mode': this._apiMode,
        'responsetype': 'JSON',
        'encoding': 'UTF-8',
        'request': 'creditcardcheck',
        'storecarddata': 'yes'
      }
    )

    // Set listeners for paymentMethod change
    this._container.querySelectorAll('#payonePaymentMethodCard').forEach((card) => {
      card.addEventListener('click', () => {
        if (this.paymentMethod === card.dataset.paymentMethod) return

        this.paymentMethod = card.dataset.paymentMethod

        // Set last payment method in local storage
        localStorage.setItem('lastPaymentMethod', this.paymentMethod)

        this._container.querySelector('.payone-js-checkout__payment-method-card--chosen').classList.remove('payone-js-checkout__payment-method-card--chosen')
        card.classList.add('payone-js-checkout__payment-method-card--chosen')

        switch (this.paymentMethod) {
          case 'card':
            this._container.querySelectorAll('#payoneCheckoutRowCard').forEach(rowCard => rowCard.style.display = 'flex')
            this._container.querySelector('input[name=surname]').disabled = false
            this._container.querySelector('#containerForOtherPaymentMethods').remove()
            break

          case 'paypal':
            this._container.querySelectorAll('#payoneCheckoutRowCard').forEach(rowCard => rowCard.style.display = 'none')
            this._container.querySelector('input[name=surname]').disabled = true // Bypass browser's complaint about unfocusable surname form field

            // delete current paypal or paydirekt HTML container if previous paymentMethod was one of these
            this._container.querySelector('#containerForOtherPaymentMethods')?.remove()

            const paypalHtml = `
              <section id="containerForOtherPaymentMethods">
                <div class="payone-checkout__row">
                  <label for="surname">Surname</label>
                  <input required maxlength="50" name="surname">
                </div>
                
                <div class="payone-checkout__row">
                  <label for="country">Country</label>
                  <select name="country" id="country">
                    <option value="DE">Germany</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </section>
            `
            this._container.insertAdjacentHTML('beforeend', paypalHtml)
            break

          case 'paydirekt':
            this._container.querySelectorAll('#payoneCheckoutRowCard').forEach(rowCard => rowCard.style.display = 'none')
            this._container.querySelector('input[name=surname]').disabled = true // Bypass browser's complaint about unfocusable surname form field

            // delete current paypal or paydirekt HTML container if previous paymentMethod was one of these
            this._container.querySelector('#containerForOtherPaymentMethods')?.remove()

            const paydirektHtml = `
              <section id="containerForOtherPaymentMethods">
                <div class="payone-checkout__row">
                  <label for="firstname">First name</label>
                  <input required maxlength="50" name="firstname">
                </div>
              
                <div class="payone-checkout__row">
                  <label for="surname">Surname</label>
                  <input required maxlength="50" name="surname">
                </div>
                
                <div class="payone-checkout__row">
                  <label for="zip">Zip</label>
                  <input required pattern="[0-9]{5}" name="zip" maxlength="5">
                </div>
                
                <div class="payone-checkout__row">
                  <label for="city">City</label>
                  <input required maxlength="50" name="city">
                </div>
                
                <div class="payone-checkout__row">
                  <label for="country">Country</label>
                  <select name="country" id="country">
                    <option value="DE">Germany</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </section>
            `

            this._container.insertAdjacentHTML('beforeend', paydirektHtml)
            break
        }
      })
    })

    return this
  }

  async pay(endpointUrl, data) {
    if (endpointUrl === undefined) {
      throw new Error('No payment endpoint URL provided. Did you forget about it?')
    }

    switch (this.paymentMethod) {
      case 'card':
        return new Promise(async (resolve) => {
          if (!this._checkout.isComplete()) {
            // Naming status 'not_all_fields_filled_properly' instead of 'not_all_fields_complete' because if, for example, we have
            // only one digit in CCV, then .isComplete() is also run which is a little bit of a lie, i.e. it *is* Complete,
            // but not with proper values
            return resolve({
              status: 'error',
              type: 'not_all_fields_filled_properly',
              message: 'Not all the fields are filled properly.'
            })
          }

          const lastCreditCardCheckResponse = this._creditCardCheckResponse ?? {}
          this._checkout.creditCardCheck('storeCreditCardCheckResponse')
          // Stop execution until we get credit card check response from Payone's hosted JS
          await new Promise((resolve) => {
            setInterval(() => {
              if (this._creditCardCheckResponse === undefined) return;
              // If we still haven't received updated credit card check response, do nothing and continue waiting
              if (objectsAreEqual(this._creditCardCheckResponse, lastCreditCardCheckResponse)) return

              resolve()
            }, 50)
          })

          switch (this._creditCardCheckResponse.status) {
            case 'INVALID':
            case 'ERROR':
              return resolve({
                status: 'error',
                type: 'credit_card_check_error',
                message: this._creditCardCheckResponse.errormessage,
                _payone_creditCardCheckResponse: this._creditCardCheckResponse
              })
            default:
              return resolve({
                status: 'error',
                type: 'credit_card_check_error',
                message: `Critical error: undefined credit card check response status - ${this._creditCardCheckResponse.status}`,
                _payone_creditCardCheckResponse: this._creditCardCheckResponse
              })

            // Actually make request to user-specified endpoint that makes true payment request
            case 'VALID':
              const paymentMethod = this.paymentMethod
              const pseudoCardPan = this._creditCardCheckResponse.pseudocardpan
              const country = this._container.querySelector('#country').value
              const surname = this._container.querySelector('input[name=surname]').value

              const truncatedCardPAN = this._creditCardCheckResponse.truncatedcardpan
              const cardExpireDate = this._creditCardCheckResponse.cardexpiredate
              const cardType = this._creditCardCheckResponse.cardtype
              const _lastPaymentMethodSpecificData = { truncatedCardPAN, cardExpireDate, cardType, country, surname }
              localStorage.setItem('lastPaymentMethodSpecificData', JSON.stringify(_lastPaymentMethodSpecificData))

              fetch(endpointUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                  ...{paymentMethod, pseudoCardPan, country, surname},
                  ...data
                })
              })
                .then(response => response.json().catch(err => console.error('Unable to parse JSON. Details:', err)))
                .then((response) => {
                  switch (response.status) {
                    case 'APPROVED':
                      return resolve({
                        status: 'success',
                        type: 'payment_success',
                        message: 'Payment succeeded ✓',
                        txid: response.txid,
                        _payone_response: response
                      })

                    case 'REDIRECT':
                      return resolve({
                        status: 'needs_redirect',
                        type: 'payment_redirect',
                        redirectUrl: response.redirecturl,
                        message: 'Click the button inside "Payment response" to go to the payment page',
                        txid: response.txid,
                        _payone_response: response
                      })

                    case 'ERROR':
                      return resolve({
                        status: 'error',
                        type: 'payment_error',
                        // Not writing 'Error: ' here to not include English word 'Error' if server responds with non-english language
                        message: `${response.customermessage}`,
                        _payone_response: response
                      })

                    default:
                      return resolve({
                        status: 'error',
                        type: 'payment_error',
                        message: `Error: unknown response status - ${response.status}`,
                        _payone_response: response
                      })
                  }
                })
                .catch((err) => {
                  console.error(`Try checking if you provided a valid URL for your payment endpoint URL (${endpointUrl}) and that it exists`)
                  console.error(err)
                })
          }
        })
        break

      case 'paypal':
      case 'paydirekt':
        const paymentMethod = this.paymentMethod
        const country = this._container.querySelector('#containerForOtherPaymentMethods #country').value
        const surname = this._container.querySelector('#containerForOtherPaymentMethods input[name=surname]').value
        const firstName = this._container.querySelector('#containerForOtherPaymentMethods input[name=firstname]')?.value
        const zip = this._container.querySelector('#containerForOtherPaymentMethods input[name=zip]')?.value
        const city = this._container.querySelector('#containerForOtherPaymentMethods input[name=city]')?.value

        const _lastPaymentMethodSpecificData = { firstName, zip, city, country, surname }
        localStorage.setItem('lastPaymentMethodSpecificData', JSON.stringify(_lastPaymentMethodSpecificData))

        return new Promise((resolve) => {
          fetch(endpointUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
              ...{paymentMethod, country, surname, firstName, zip, city},
              ...data
            })
          })
            .then(response => response.json().catch(err => console.error('Unable to parse JSON. Details:', err)))
            .then((response) => {
              switch (response.status) {
                case 'REDIRECT':
                  return resolve({
                    status: 'needs_redirect',
                    type: 'payment_redirect',
                    redirectUrl: response.redirecturl,
                    message: 'Click the button inside "Payment response" to go to the payment page',
                    txid: response.txid,
                    _payone_response: response
                  })

                case 'ERROR':
                  return resolve({
                    status: 'error',
                    type: 'payment_error',
                    // Not writing 'Error: ' here to not include English word 'Error' if server responds with non-english language
                    message: `${response.customermessage}`,
                    _payone_response: response
                  })

                default:
                  return resolve({
                    status: 'error',
                    type: 'payment_error',
                    message: `Error: unknown response status - ${response.status}`,
                    _payone_response: response
                  })
              }
            })
            .catch((err) => {
              console.error(`Try checking if you provided a valid URL for your payment endpoint URL (${endpointUrl}) and that it exists`)
              console.error(err)
            })
        })
        break

      default:
        console.error(`Undefined payment method - ${this.paymentMethod}`)
    }
  }

  _storeCreditCardCheckResponse(creditCardCheckResponse) {
    this._creditCardCheckResponse = creditCardCheckResponse
  }
}

function objectsAreEqual(objOne, objTwo) {
  const objOneSize = Object.keys(objOne).length;
  const objTwoSize = Object.keys(objTwo).length;
  if (objOneSize !== objTwoSize) return false;

  let objectsAreEqual = true;
  for (const prop in objOne) {
    if (objOne[prop] !== objTwo[prop]) {
      objectsAreEqual = false;

      break;
    }
  }

  return objectsAreEqual;
}