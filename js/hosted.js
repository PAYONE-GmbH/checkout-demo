(function () {

  "use strict";

  if (typeof window.Payone === typeof undefined) {
    window.Payone = {};
  } else {
    throw new Error("Namespace 'Payone' is not available.");
  }

  if (typeof PayoneGlobals === typeof undefined) {
    window.PayoneGlobals = {
      options: {},

      /**
       * This function is called from the script which is responded to the payone request.
       * It calls the user's own callback function.
       */
      callback: function (response) {
        document.getElementsByTagName("body")[0].removeChild(window.PayoneGlobals.options.payoneScript);

        var callback = window.PayoneGlobals.options.callbackFunctionName,
          obj;

        switch (window.PayoneGlobals.options.returnType) {
          case "object":
            obj = response;
            window[callback]({
              get: function (index) {
                return obj[index];
              }
            });
            break;
          case "handler":
            window.PayoneGlobals.options.callbackHandler(response);
            break;
          default:
            window[callback](response);
            break;
        }
      }
    };
  } else {
    throw new Error("Namespace 'PayoneGlobals' is not available.");
  }

  Payone.ClientApi = {};

  Payone.ClientApi.Origin = 'Payone';

  Payone.ClientApi.MessageEvents = {
    ready: "READY",
    value: "VALUE",
    render: "RENDER",
    rendered: "RENDERED",
    setRequestData: "SET_REQUEST_DATA",
    creditcardcheck: "CREDITCARDCHECK",
    isComplete: "IS_COMPLETE",
    focus: "FOCUS",
    cardtypeChanged: "CARD_TYPE_CHANGED",
    cardtypeDetection: "CARD_TYPE_DETECTION"
  };

  Payone.ClientApi.InputTypes = {
    cardpan: "cardpan",
    cardcvc2: "cardcvc2",
    cardexpiremonth: "cardexpiremonth",
    cardexpireyear: "cardexpireyear",
    cardtype: "cardtype"
  };

  Payone.ClientApi.CardTypes = {
    "#": "",
    "V": "Visa",
    "M": "Mastercard",
    "A": "Amex",
    "O": "Maestro (Int)",
    "U": "UATP/Airplus",
    "D": "Diners",
    "B": "Carte Bleue",
    "C": "Discover",
    "J": "JCB",
    "P": "China Union Pay"
  };

  Payone.ClientApi.Defaults = {
    iFrameUrl: "https://secure.pay1.de/client-api/js/v1/payone_iframe.html",
    secureDomain: "https://secure.pay1.de",
    clientApiUrl: "https://secure.pay1.de/client-api/",
    cardcvc2MaxLength: 4,
    cardtypeDetectionMinLength: 6,
    cardtypeUnknown: '?',
    cardtypeNotConfigured: '-',
    cardtypePleaseSelectKey: '#'
  };

  Payone.ClientApi.Language = {
    de: {
      months: {
        month1: "1",
        month2: "2",
        month3: "3",
        month4: "4",
        month5: "5",
        month6: "6",
        month7: "7",
        month8: "8",
        month9: "9",
        month10: "10",
        month11: "11",
        month12: "12"
      },
      invalidCardpan: "UngÃ¼ltige Kartennummer. Bitte Ã¼berprÃ¼fen Sie die Angaben auf der Karte.", //878
      invalidCvc: "UngÃ¼ltige KartenprÃ¼fnummer. Bitte Ã¼berprÃ¼fen Sie die Angaben auf der Karte.", //879
      invalidPanForCardtype: "Kartentyp stimmt nicht mit der Kartennummer Ã¼berein. Bitte Ã¼berprÃ¼fen Sie die Angaben auf der Karte.", //880
      invalidCardtype: "UngÃ¼ltiger Kartentyp. Bitte Ã¼berprÃ¼fen Sie die Angaben auf der Karte.", //31
      invalidExpireDate: "Verfallsdatum ungÃ¼ltig. Bitte Ã¼berprÃ¼fen Sie die Angaben auf der Karte.", //1077
      invalidIssueNumber: "UngÃ¼ltige Kartenfolgenummer (Issue-Number). Bitte Ã¼berprÃ¼fen Sie die Angaben auf der Karte.", //1075
      transactionRejected: "Die Transaktion wurde abgelehnt. ÃœberprÃ¼fen Sie ggf. Ihre eingegebenen Daten.",
      pleaseSelectCardType: "Kartentyp auswÃ¤hlen",
      placeholders: {
        cardpan: '',
        cvc: '',
        expireMonth: '',
        expireYear: '',
        issueNumber: ''
      }
    },
    en: {
      months: {
        month1: "1",
        month2: "2",
        month3: "3",
        month4: "4",
        month5: "5",
        month6: "6",
        month7: "7",
        month8: "8",
        month9: "9",
        month10: "10",
        month11: "11",
        month12: "12"
      },
      invalidCardpan: "Invalid card number. Please verify your card data.",
      invalidCvc: "Invalid Card Verification Value. Please verify your card data.",
      invalidPanForCardtype: "Card type does not match card number. Please verify your card data.",
      invalidCardtype: "Card type invalid. Please verify your card data.",
      invalidExpireDate: "Expiry date invalid. Please verify your card data.",
      invalidIssueNumber: "Invalid Issue-Number (card sequence number). Please verify your card data.",
      transactionRejected: "Transaction has been rejected. Please verify your data.",
      pleaseSelectCardType: "Select cardtype",
      placeholders: {
        cardpan: '',
        cvc: '',
        expireMonth: '',
        expireYear: '',
        issueNumber: ''
      }
    },
    fr: {
      months: {
        month1: "1",
        month2: "2",
        month3: "3",
        month4: "4",
        month5: "5",
        month6: "6",
        month7: "7",
        month8: "8",
        month9: "9",
        month10: "10",
        month11: "11",
        month12: "12"
      },
      invalidCardpan: "NumÃ©ro de carte invalide. Veuillez vÃ©rifier les donnÃ©es sur la carte.",
      invalidCvc: "NumÃ©ro de contrÃ´le de carte invalide. Veuillez vÃ©rifier les donnÃ©es sur la carte.",
      invalidPanForCardtype: "Le type de carte ne correspond pas au numÃ©ro de carte. Veuillez vÃ©rifier les donnÃ©es sur la carte.",
      invalidCardtype: "Type de carte invalide. Veuillez vÃ©rifier les donnÃ©es sur la carte.",
      invalidExpireDate: "Date d'expiration invalide. Veuillez vÃ©rifier les donnÃ©es sur la carte.",
      invalidIssueNumber: "NumÃ©ro d'Ã©mission (Issue Number) incorrect. Veuillez vÃ©rifier les donnÃ©es sur la carte.",
      transactionRejected: "La transaction a Ã©tÃ© refusÃ©e. Veuillez le cas Ã©chÃ©ant vÃ©rifier vos donnÃ©es.",
      pleaseSelectCardType: "SÃ©lectionnez le type de carte",
      placeholders: {
        cardpan: '',
        cvc: '',
        expireMonth: '',
        expireYear: '',
        issueNumber: ''
      }
    },
    it: {
      months: {
        month1: "1",
        month2: "2",
        month3: "3",
        month4: "4",
        month5: "5",
        month6: "6",
        month7: "7",
        month8: "8",
        month9: "9",
        month10: "10",
        month11: "11",
        month12: "12"
      },
      invalidCardpan: "Numero della carta non valido. Verificare i dati della carta.",
      invalidCvc: "Numero di controllo della carta non valido. Verificare i dati della carta.",
      invalidPanForCardtype: "Il tipo di carta non coincide con il numero della stessa. Verificare i dati della carta.",
      invalidCardtype: "Tipo di carta non valido. Verificare i dati della carta.",
      invalidExpireDate: "Data di scadenza non valida. Verificare i dati della carta.",
      invalidIssueNumber: "Cifre carta non valide (Issue-Number). Verificare i dati sulla carta.",
      transactionRejected: "La transazione Ã¨ stata rifiutata. Verificare i dati inseriti.",
      pleaseSelectCardType: "Scegliere il tipo di carta",
      placeholders: {
        cardpan: '',
        cvc: '',
        expireMonth: '',
        expireYear: '',
        issueNumber: ''
      }
    },
    es: {
      months: {
        month1: "1",
        month2: "2",
        month3: "3",
        month4: "4",
        month5: "5",
        month6: "6",
        month7: "7",
        month8: "8",
        month9: "9",
        month10: "10",
        month11: "11",
        month12: "12"
      },
      invalidCardpan: "NÃºmero de tarjeta invÃ¡lido. SÃ­rvase verificar las indicaciones en la tarjeta.",
      invalidCvc: "NÃºmero de verificaciÃ³n invÃ¡lido de tarjeta. SÃ­rvase verificar las indicaciones en la tarjeta.",
      invalidPanForCardtype: "Tipo de tarjeta no coincide con nÃºmero de tarjeta. SÃ­rvase verificar las indicaciones en la tarjeta.",
      invalidCardtype: "Tipo invÃ¡lido de tarjeta. SÃ­rvase verificar las indicaciones en la tarjeta.",
      invalidExpireDate: "Fecha de expiraciÃ³n invÃ¡lida. SÃ­rvase verificar las indicaciones en la tarjeta.",
      invalidIssueNumber: "NÃºmero de tarjeta no vÃ¡lido (nÃºmero de emisiÃ³n). Por favor, compruebe los datos de la tarjeta.",
      transactionRejected: "La transacciÃ³n fue rechazada. SÃ­rvase revisar sus datos ingresados.",
      pleaseSelectCardType: "Seleccione el tipo de tarjeta",
      placeholders: {
        cardpan: '',
        cvc: '',
        expireMonth: '',
        expireYear: '',
        issueNumber: ''
      }
    },
    pt: {
      months: {
        month1: "1",
        month2: "2",
        month3: "3",
        month4: "4",
        month5: "5",
        month6: "6",
        month7: "7",
        month8: "8",
        month9: "9",
        month10: "10",
        month11: "11",
        month12: "12"
      },
      invalidCardpan: "NÃºmero invÃ¡lido do cartÃ£o de crÃ©dito. Favor verificar os dados do cartÃ£o.",
      invalidCvc: "NÃºmero invÃ¡lido de seguranÃ§a do cartÃ£o. Favor verificar os dados do cartÃ£o.",
      invalidPanForCardtype: "O tipo do cartÃ£o nÃ£o combina com o nÃºmero do cartÃ£o. Favor verificar os dados do cartÃ£o.",
      invalidCardtype: "Tipo de cartÃ£o invÃ¡lido. Favor verificar os dados do cartÃ£o.",
      invalidExpireDate: "Data de expiraÃ§Ã£o invÃ¡lida. Favor verificar os dados do cartÃ£o.",
      invalidIssueNumber: "SequÃªncia de nÃºmeros do cartÃ£o invÃ¡lida (Issue-Number). Por favor verifique os dados no cartÃ£o.",
      transactionRejected: "A transacÃ§Ã£o foi recusada. Favor verificar os dados entrados.",
      pleaseSelectCardType: "Selecione o tipo de cartÃ£o",
      placeholders: {
        cardpan: '',
        cvc: '',
        expireMonth: '',
        expireYear: '',
        issueNumber: ''
      }
    },
    nl: {
      months: {
        month1: "1",
        month2: "2",
        month3: "3",
        month4: "4",
        month5: "5",
        month6: "6",
        month7: "7",
        month8: "8",
        month9: "9",
        month10: "10",
        month11: "11",
        month12: "12"
      },
      invalidCardpan: "Ongeldig creditcardnummer. Controleer s.v.p. de gegevens op de card.",
      invalidCvc: "Ongeldig cardcontolenummer. Controleer s.v.p. de gegevens op de card.",
      invalidPanForCardtype: "Cardtype past niet bij cardnummer. Controleer s.v.p. de gegevens op de card.",
      invalidCardtype: "Ongeldig cardtype. Controleer s.v.p. de gegevens op de card.",
      invalidExpireDate: "Afloopdatum ongeldig. Controleer s.v.p. de gegevens op de card.",
      invalidIssueNumber: "Ongeldig kaartvolgnummer (issue number). Controleer de gegevens op de kaart a.u.b.",
      transactionRejected: "De transactie is geweigerd. Controleer s.v.p. uw gegevens.",
      pleaseSelectCardType: "Select kaarttype",
      placeholders: {
        cardpan: '',
        cvc: '',
        expireMonth: '',
        expireYear: '',
        issueNumber: ''
      }
    }
  };

  /**
   * @param {Object} data
   * @param {Object} options
   * @constructor
   */
  Payone.ClientApi.Request = function (data, options) {
    if (!(typeof data === "object")) {
      throw new Error("Property 'data' must be of type 'object'");
    }

    if (!(typeof options === "object")) {
      throw new Error("Property 'options' must be of type 'object'");
    }

    if (options.callbackFunctionName && !(typeof options.callbackFunctionName === "string")) {
      throw new Error("Property 'options.callbackFunctionName' must be of type 'string'");
    }

    if (options.callbackHandler && !(typeof options.callbackHandler === "function")) {
      throw new Error("Property 'options.callbackHandler' must be of type 'function'");
    }

    // Do not change to camel case!!
    data.callback_method = "PayoneGlobals.callback";

    /**
     * Make the http-request
     */
    var send = function () {

      var params = "?",
        url,
        payoneScript;

      Object.keys(data).forEach(function (key) {
        if (typeof key === "string" && !(typeof data[key] === typeof undefined)) {
          params = params + encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
        }
      });

      params = params.substring(0, params.length - 1);

      // Send request
      url = Payone.ClientApi.Defaults.clientApiUrl + params;
      payoneScript = document.createElement("script");
      payoneScript.setAttribute("type", "text/javascript");
      payoneScript.setAttribute("src", url);

      options.payoneScript = payoneScript;
      window.PayoneGlobals.options = options;

      document.getElementsByTagName("body")[0].appendChild(payoneScript);
    };

    this.send = send;
    this.checkAndStore = send;
  };

  Payone.ClientApi.HostedIFrames = function (config, requestData) {

    var cardpanDiv,
      cardpanFrame,
      cardcvc2Div,
      cardcvc2Frame,
      cardexpiremonthDiv,
      cardexpiremonthFrame,
      cardexpireyearDiv,
      cardexpireyearFrame,
      cardtypeDiv,
      cardtypeFrame,
      pseudocardpan,
      truncatedcardpan,
      errorDiv,
      callback,
      cardtype = '',
      cardpanLoaded = false,
      language,
      // Fields are required to be initialized with null, because they could be used with setCardType() method
      // initially.
      cvcConfigObj = {
        value: null,
        maxlength: null,
        length: null,
        applyToInput: null
      },
      isComplete = false,
      isCardTypeComplete = false,
      isCardpanComplete = false,
      isCvcComplete = false,
      isExpireMonthComplete = false,
      isExpireYearComplete = false,
      cardtypeDetectionIsActive = (typeof config.autoCardtypeDetection === 'object' && !(typeof config.autoCardtypeDetection.deactivate === 'boolean' && config.autoCardtypeDetection.deactivate === true)),
      cardTypeDetectionSender = 'cardtypeDetection',
      cardTypeSetManually = typeof config.fields.cardtype === 'object' ? null : false, // If cardtype is present we have to skip one initial event.
      fieldCount = 0,
      renderedFieldCount = 0,

      addIframe = function (type) {
        var iframe;
        var randomNumber = Date.now() + Math.floor((Math.random() * 999) + 1);

        iframe = document.createElement('iframe');
        iframe.frameBorder = 0;
        iframe.setAttribute('scrolling', 'no');
        iframe.allowtransparency = "true";
        iframe.height = determineFrameHeight(type);
        iframe.width = determineFrameWidth(type);
        iframe.src = Payone.ClientApi.Defaults.iFrameUrl + '?' + randomNumber;

        switch (type) {
          case Payone.ClientApi.InputTypes.cardpan:
            cardpanFrame = iframe;
            cardpanDiv.appendChild(iframe);
            ++fieldCount;
            break;
          case Payone.ClientApi.InputTypes.cardcvc2:
            cardcvc2Frame = iframe;
            cardcvc2Div.appendChild(iframe);
            ++fieldCount;
            break;
          case Payone.ClientApi.InputTypes.cardexpiremonth:
            cardexpiremonthFrame = iframe;
            cardexpiremonthDiv.appendChild(iframe);
            ++fieldCount;
            break;
          case Payone.ClientApi.InputTypes.cardexpireyear:
            cardexpireyearFrame = iframe;
            cardexpireyearDiv.appendChild(iframe);
            ++fieldCount;
            break;
          case Payone.ClientApi.InputTypes.cardtype:
            cardtypeFrame = iframe;
            cardtypeDiv.appendChild(iframe);
            ++fieldCount;
            break;

        }
      },

      sendMessage = function (frame, event, message) {
        var m = JSON.stringify({event: event, message: message, origin: Payone.ClientApi.Origin});
        frame.postMessage(m, Payone.ClientApi.Defaults.secureDomain);
      },

      determineFrameHeight = function (type) {
        switch (type) {
          case Payone.ClientApi.InputTypes.cardpan:
            if (config.fields.cardpan.iframe && config.fields.cardpan.iframe.height) {
              return config.fields.cardpan.iframe.height;
            }
            break;
          case Payone.ClientApi.InputTypes.cardcvc2:
            if (config.fields.cardcvc2.iframe && config.fields.cardcvc2.iframe.height) {
              return config.fields.cardcvc2.iframe.height;
            }
            break;
          case Payone.ClientApi.InputTypes.cardexpiremonth:
            if (config.fields.cardexpiremonth.iframe && config.fields.cardexpiremonth.iframe.height) {
              return config.fields.cardexpiremonth.iframe.height;
            }
            break;
          case Payone.ClientApi.InputTypes.cardexpireyear:
            if (config.fields.cardexpireyear.iframe && config.fields.cardexpireyear.iframe.height) {
              return config.fields.cardexpireyear.iframe.height;
            }
            break;
          case Payone.ClientApi.InputTypes.cardtype:
            if (config.fields.cardtype.iframe && config.fields.cardtype.iframe.height) {
              return config.fields.cardtype.iframe.height;
            }
            break;
        }
        return (config.defaultStyle.iframe.height || "auto");
      },

      determineFrameWidth = function (type) {
        switch (type) {
          case Payone.ClientApi.InputTypes.cardpan:
            if (config.fields.cardpan.iframe && config.fields.cardpan.iframe.width) {
              return config.fields.cardpan.iframe.width;
            }
            break;
          case Payone.ClientApi.InputTypes.cardcvc2:
            if (config.fields.cardcvc2.iframe && config.fields.cardcvc2.iframe.width) {
              return config.fields.cardcvc2.iframe.width;
            }
            break;
          case Payone.ClientApi.InputTypes.cardexpiremonth:
            if (config.fields.cardexpiremonth.iframe && config.fields.cardexpiremonth.iframe.width) {
              return config.fields.cardexpiremonth.iframe.width;
            }
            break;
          case Payone.ClientApi.InputTypes.cardexpireyear:
            if (config.fields.cardexpireyear.iframe && config.fields.cardexpireyear.iframe.width) {
              return config.fields.cardexpireyear.iframe.width;
            }
            break;
          case Payone.ClientApi.InputTypes.cardtype:
            if (config.fields.cardtype.iframe && config.fields.cardtype.iframe.width) {
              return config.fields.cardtype.iframe.width;
            }
            break;
        }
        return (config.defaultStyle.iframe.width || "auto");
      },

      /**
       * @param response
       */
      handleResponse = function (response) {
        if (response.status === 'VALID') {
          response.errorcode = null;
          response.errormessage = null;
        } else {
          response.pseudocardpan = null;
          response.truncatedcardpan = null;
          response.cardtype = null;
          response.cardexpiredate = null;
          switch (response.errorcode) {
            case '31':
            case '1076':
            case '880':
              response.errormessage = language.invalidCardtype || Payone.ClientApi.Language.en.invalidCardtype;
              break;

            case '33':
            case '1077':
              response.errormessage = language.invalidExpireDate || Payone.ClientApi.Language.en.invalidExpireDate;
              break;

            case '877':
            case '878':
            case '1078':
              response.errormessage = language.invalidCardpan || Payone.ClientApi.Language.en.invalidCardpan;
              break;

            case '879':
            case '1079':
              response.errormessage = language.invalidCvc || Payone.ClientApi.Language.en.invalidCvc;
              break;

            case '1075':
              response.errormessage = language.invalidIssueNumber || Payone.ClientApi.Language.en.invalidIssueNumber;
              break;

            default:
              response.errormessage = language.transactionRejected || Payone.ClientApi.Language.en.transactionRejected;
              break;
          }
          showErrorMessage(response.errormessage);
        }

        var callbackData = {
          status          : response.status,
          pseudocardpan   : response.pseudocardpan,
          truncatedcardpan: response.truncatedcardpan,
          cardtype        : response.cardtype,
          cardexpiredate  : response.cardexpiredate,
          errorcode       : response.errorcode,
          errormessage    : response.errormessage
        };
        if(response.hasOwnProperty('tcdata')) {
          callbackData.tcdata = response.tcdata;
        }
        if(response.hasOwnProperty('tcprovider')) {
          callbackData.tcprovider = response.tcprovider;
        }
        if(response.hasOwnProperty('tcinvoice')) {
          callbackData.tcinvoice = response.tcinvoice;
        }
        window[callback](callbackData);
      },

      showErrorMessage = function (text) {
        if (errorDiv) {
          errorDiv.appendChild(document.createTextNode(text));
        }
      },

      removeErrorMessage = function () {
        if (errorDiv) {
          errorDiv.innerHTML = "";
        }
      },

      reset = function () {
        pseudocardpan = "";
        if (truncatedcardpan) {
          truncatedcardpan = "";
        }

        removeErrorMessage();
      },

      handlePostMessage = function (message) {

        var json;

        try {

          if (message && message.data) {

            json = JSON.parse(message.data);

            // Attention: message.origin !== json.origin. message.origin is from JavaScript itself. The JSON-part
            // is our own flag.
            if (json && json.event) {
              switch (json.event) {

                case Payone.ClientApi.MessageEvents.ready:
                  if (message.source == cardpanFrame.contentWindow) {
                    cardpanLoaded = true;
                    renderInFrame(cardpanFrame.contentWindow, Payone.ClientApi.InputTypes.cardpan);
                    sendMessage(message.source, Payone.ClientApi.MessageEvents.value, {type: Payone.ClientApi.InputTypes.cardtype, value: cardtype});
                    sendMessage(message.source, Payone.ClientApi.MessageEvents.setRequestData, {'requestData': requestData, 'clientApiUrl': Payone.ClientApi.Defaults.clientApiUrl});
                  } else if (message.source == cardexpiremonthFrame.contentWindow) {
                    renderInFrame(cardexpiremonthFrame.contentWindow, Payone.ClientApi.InputTypes.cardexpiremonth);
                  } else if (message.source == cardexpireyearFrame.contentWindow) {
                    renderInFrame(cardexpireyearFrame.contentWindow, Payone.ClientApi.InputTypes.cardexpireyear);
                  } else if (cardcvc2Frame && message.source == cardcvc2Frame.contentWindow) {
                    renderInFrame(cardcvc2Frame.contentWindow, Payone.ClientApi.InputTypes.cardcvc2);
                  } else if (cardtypeFrame && message.source == cardtypeFrame.contentWindow) {
                    renderInFrame(cardtypeFrame.contentWindow, Payone.ClientApi.InputTypes.cardtype);
                  }
                  break;

                case Payone.ClientApi.MessageEvents.value:
                  if (message.source && message.source == cardpanFrame.contentWindow) {
                    reset();
                    handleResponse(json.message);
                  } else {
                    reset();
                    sendMessage(cardpanFrame.contentWindow, Payone.ClientApi.MessageEvents.value, json.message);

                    if (message.source && message.source == cardtypeFrame.contentWindow) {
                      cardTypeSetManually = cardTypeSetManually !== null;
                    }

                    // In case that the credit card type has been changed and the length is configured
                    // as the flexible object, the CVC-iFrame has to be informed.
                    if (config.fields && config.fields.cardcvc2 && (typeof config.fields.cardcvc2.length === 'object' || config.fields.cardcvc2.maxlength)) {

                      if (json.message && json.message.type && json.message.type === 'cardtype') {

                        cvcConfigObj = {
                          value: json.message.value,
                          maxlength: config.fields.cardcvc2.maxlength,
                          length: config.fields.cardcvc2.length,
                          // the cvcConfigObj must be sent to the cardpan iframe as well,
                          // because this is where the isComplete() will be handled.
                          // However, the input must not be adjusted there. So within the
                          // adjustCvc() function we have to deal with a lot of if (applyToInput)
                          // to distinguish between the cardpan and the cvc input.
                          applyToInput: false
                        };

                        sendMessage(cardpanFrame.contentWindow, Payone.ClientApi.MessageEvents.cardtypeChanged, cvcConfigObj);

                        cvcConfigObj.applyToInput = true;
                        sendMessage(cardcvc2Frame.contentWindow, Payone.ClientApi.MessageEvents.cardtypeChanged, cvcConfigObj);
                      }
                    }
                  }
                  break;

                case Payone.ClientApi.MessageEvents.isComplete:
                  if (message.source === cardpanFrame.contentWindow) {
                    isComplete = json.message.isComplete;
                    isCardTypeComplete = json.message.isCardTypeComplete;
                    isCardpanComplete = json.message.isCardpanComplete;
                    isCvcComplete = json.message.isCvcComplete;
                    isExpireMonthComplete = json.message.isExpireMonthComplete;
                    isExpireYearComplete = json.message.isExpireYearComplete;
                  }

                  break;

                case Payone.ClientApi.MessageEvents.cardtypeDetection:

                  var detectedCardtype = Payone.ClientApi.Defaults.cardtypeUnknown,

                    transformDetectedCardtypeIfNotConfigured = function (detectedCardtype) {
                      // If supportedCardtypes is configured, we can detect, if the automatical detection
                      // found a cardtype that is not supported by the merchant.
                      if (detectedCardtype !== Payone.ClientApi.Defaults.cardtypeUnknown && config.autoCardtypeDetection.supportedCardtypes.length && config.autoCardtypeDetection.supportedCardtypes.indexOf(detectedCardtype) === -1) {
                        detectedCardtype = Payone.ClientApi.Defaults.cardtypeNotConfigured;
                      }

                      return detectedCardtype;
                    },

                    preventOverrideByAutoCardtypeDetection = function () {
                      return cardTypeSetManually && (detectedCardtype === Payone.ClientApi.Defaults.cardtypeUnknown || detectedCardtype === Payone.ClientApi.Defaults.cardtypeNotConfigured);
                    };

                  if (cardtypeDetectionIsActive) {

                    if (json.message) {

                      detectedCardtype = json.message;
                      detectedCardtype = transformDetectedCardtypeIfNotConfigured(detectedCardtype);

                      if (!preventOverrideByAutoCardtypeDetection()) {
                        if (typeof config.autoCardtypeDetection.callback === 'function') {
                          config.autoCardtypeDetection.callback(detectedCardtype);
                        }

                        setCardType(detectedCardtype, cardTypeDetectionSender);
                      }
                    }
                  }
                  break;

                case Payone.ClientApi.MessageEvents.rendered:
                  renderedFieldCount++;

                  // check for all fields are rendered and callback defined
                  if(fieldCount === renderedFieldCount && config.events.rendered) {
                    config.events.rendered();
                  }
                  break;
              }
            }
          }

        } catch (e) {
          // Ignorable. Most certainly we have no Payone event here.
        }
      },

      renderInFrame = function (frame, type) {

        var inputRenderParams = [],
          inputType,
          style,
          size,
          maxlength,
          cvcLengthConfig,
          frameLanguage = {},
          frameCardtypes = [];

        switch (type) {

          case Payone.ClientApi.InputTypes.cardpan:
            style = {
              'default': config.fields.cardpan.style || config.defaultStyle.input || "",
              'focus': config.fields.cardpan.styleFocus || config.defaultStyle.inputFocus || null
            };
            inputType = config.fields.cardpan.type || "number";
            size = config.fields.cardpan.size || null;
            maxlength = config.fields.cardpan.maxlength || null;
            break;

          case Payone.ClientApi.InputTypes.cardcvc2:
            style = {
              'default': config.fields.cardcvc2.style || config.defaultStyle.input || "",
              'focus': config.fields.cardcvc2.styleFocus || config.defaultStyle.inputFocus || null
            };
            inputType = config.fields.cardcvc2.type || "text";
            size = config.fields.cardcvc2.size || null;
            maxlength = config.fields.cardcvc2.maxlength || null;
            cvcLengthConfig = config.fields.cardcvc2.length || null;
            break;

          case Payone.ClientApi.InputTypes.cardexpiremonth:
            inputType = config.fields.cardexpiremonth.type || "select";
            if (inputType === "select") {
              style = {
                'default': config.fields.cardexpiremonth.style || config.defaultStyle.select || "",
                'focus': config.fields.cardexpiremonth.styleFocus || config.defaultStyle.selectFocus || null
              };
            } else {
              style = {
                'default': config.fields.cardexpiremonth.style || config.defaultStyle.input || "",
                'focus': config.fields.cardexpiremonth.styleFocus || config.defaultStyle.inputFocus || null
              };
            }
            size = config.fields.cardexpiremonth.size || null;
            maxlength = config.fields.cardexpiremonth.maxlength || null;
            frameLanguage = language.months;
            break;

          case Payone.ClientApi.InputTypes.cardexpireyear:
            inputType = config.fields.cardexpireyear.type || "select";
            if (inputType === "select") {
              style = {
                'default': config.fields.cardexpireyear.style || config.defaultStyle.select || "",
                'focus': config.fields.cardexpireyear.styleFocus || config.defaultStyle.selectFocus || null
              };
            } else {
              style = {
                'default': config.fields.cardexpireyear.style || config.defaultStyle.input || "",
                'focus': config.fields.cardexpireyear.styleFocus || config.defaultStyle.inputFocus || null
              };
            }
            size = config.fields.cardexpireyear.size || null;
            maxlength = config.fields.cardexpireyear.maxlength || null;
            break;

          case Payone.ClientApi.InputTypes.cardtype:
            inputType = "select";
            style = {
              'default': config.fields.cardtype.style || config.defaultStyle.select || "",
              'focus': config.fields.cardtype.styleFocus || config.defaultStyle.selectFocus || null
            };
            size = config.fields.cardtype.size || null;
            maxlength = config.fields.cardtype.maxlength || null;
            frameCardtypes = config.fields.cardtype.cardtypes || [];
            frameLanguage = language.pleaseSelectCardType; // Only for "please select" option.
            break;
        }

        // These params will be passed to Payone.ClientApi.Input.render() within payone_iframe(_min).js and
        // unpacked by their indexes. So do not mess up the order of those following pushes.
        inputRenderParams.push(style); // [0]
        inputRenderParams.push(inputType); // [1]
        inputRenderParams.push(size); // [2]
        inputRenderParams.push(maxlength); // [3]
        inputRenderParams.push(frameLanguage); // [4]
        inputRenderParams.push(type); // [5]
        inputRenderParams.push(frameCardtypes); // [6]
        inputRenderParams.push(language.placeholders); // [7]
        inputRenderParams.push(cvcLengthConfig); // [8]

        sendMessage(frame, Payone.ClientApi.MessageEvents.render, inputRenderParams);
      },

      /**
       * Broad check on mobile browsers.
       *
       * @returns {boolean}
       */
      isMobileBrowser = function () {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
          || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      },


      checkFocus = function () {

        switch (document.activeElement) {
          case cardtypeFrame:
          case cardpanFrame:
          case cardcvc2Frame:
          case cardexpiremonthFrame:
          case cardexpireyearFrame:
            sendMessage(document.activeElement.contentWindow, Payone.ClientApi.MessageEvents.focus);
            break;
        }

      },

      initListener = function () {
        window.addEventListener("message", handlePostMessage);
      },

      /**
       * This is the constructor after all API methods of HostedIframes are defined.
       */
      init = function () {
        if (config.error && document.getElementById(config.error)) {
          errorDiv = document.getElementById(config.error);
        }

        // Normalize supportedCardtypes if they are configured.
        if (typeof config.autoCardtypeDetection === 'object' && typeof config.autoCardtypeDetection.supportedCardtypes === 'object' && typeof config.autoCardtypeDetection.supportedCardtypes.length === 'number') {
          for (var index in config.autoCardtypeDetection.supportedCardtypes) {
            if (config.autoCardtypeDetection.supportedCardtypes.hasOwnProperty(index)) {
              config.autoCardtypeDetection.supportedCardtypes[index] = config.autoCardtypeDetection.supportedCardtypes[index].toUpperCase();
            }
          }
        } else {
          config.autoCardtypeDetection = {};
          config.autoCardtypeDetection.supportedCardtypes = [];
        }

        if(typeof config.events !== 'object') {
          config.events = {};
        }

        initListener();

        if (config.fields.cardpan && config.fields.cardpan.selector && document.getElementById(config.fields.cardpan.selector)) {
          cardpanDiv = document.getElementById(config.fields.cardpan.selector);
          addIframe(Payone.ClientApi.InputTypes.cardpan);
        } else if (config.fields.cardpan && config.fields.cardpan.element) {
          cardpanDiv = config.fields.cardpan.element;
          addIframe(Payone.ClientApi.InputTypes.cardpan);
        } else {
          throw new Error("Configuration Problem: Property 'fields.cardpan.selector' or 'fields.cardpan.element' is mandatory");
        }

        if (config.fields.cardexpiremonth && config.fields.cardexpiremonth.selector && document.getElementById(config.fields.cardexpiremonth.selector)) {
          cardexpiremonthDiv = document.getElementById(config.fields.cardexpiremonth.selector);
          addIframe(Payone.ClientApi.InputTypes.cardexpiremonth);
        } else if (config.fields.cardexpiremonth && config.fields.cardexpiremonth.element) {
          cardexpiremonthDiv = config.fields.cardexpiremonth.element;
          addIframe(Payone.ClientApi.InputTypes.cardexpiremonth);
        } else {
          throw new Error("Configuration Problem: Property 'fields.cardexpiremonth.selector' or 'fields.cardexpiremonth.element' is mandatory");
        }

        if (config.fields.cardexpireyear && config.fields.cardexpireyear.selector && document.getElementById(config.fields.cardexpireyear.selector)) {
          cardexpireyearDiv = document.getElementById(config.fields.cardexpireyear.selector);
          addIframe(Payone.ClientApi.InputTypes.cardexpireyear);
        } else if (config.fields.cardexpireyear && config.fields.cardexpireyear.element) {
          cardexpireyearDiv = config.fields.cardexpireyear.element;
          addIframe(Payone.ClientApi.InputTypes.cardexpireyear);
        } else {
          throw new Error("Configuration Problem: Property 'fields.cardexpireyear.selector' or 'fields.cardexpireyear.element' is mandatory");
        }

        if (config.fields.cardcvc2 && config.fields.cardcvc2.selector && document.getElementById(config.fields.cardcvc2.selector)) {

          // Normalize possible configuration of maxlength
          if (config.fields.cardcvc2.length) {
            if (typeof config.fields.cardcvc2.length === 'object') {
              // Normalize cases of credit card shortcut chars.
              for (var key in config.fields.cardcvc2.length) {
                if (typeof key === 'string' && config.fields.cardcvc2.length.hasOwnProperty(key)) {
                  config.fields.cardcvc2.length[key.toUpperCase()] = config.fields.cardcvc2.length[key];
                }
              }
            }
          }

          cardcvc2Div = document.getElementById(config.fields.cardcvc2.selector);
          addIframe(Payone.ClientApi.InputTypes.cardcvc2);
        } else if (config.fields.cardcvc2 && config.fields.cardcvc2.element) {
          cardcvc2Div = config.fields.cardcvc2.element;
          addIframe(Payone.ClientApi.InputTypes.cardcvc2);
        }

        if (config.fields.cardtype && config.fields.cardtype.selector && document.getElementById(config.fields.cardtype.selector)) {
          cardtypeDiv = document.getElementById(config.fields.cardtype.selector);
          addIframe(Payone.ClientApi.InputTypes.cardtype);
        } else if (config.fields.cardtype && config.fields.cardtype.element) {
          cardtypeDiv = config.fields.cardtype.element;
          addIframe(Payone.ClientApi.InputTypes.cardtype);
        }

        language = config.language || Payone.ClientApi.Language.en;
      },

      creditCardCheck = function (callbackMethod) {
        reset();
        callback = callbackMethod;
        sendMessage(cardpanFrame.contentWindow, Payone.ClientApi.MessageEvents.creditcardcheck);
      },

      enableCardTypeDetection = function () {
        cardtypeDetectionIsActive = true;
      },

      disableCardTypeDetection = function () {
        cardtypeDetectionIsActive = false;
      },

      setCardType = function (type, sender) {

        if (typeof sender === 'undefined') {
          cardTypeSetManually = true; // Will be left in this status for the whole runtime.
        }

        cardtype = type;

        if (cardpanLoaded) {
          reset();
          sendMessage(cardpanFrame.contentWindow, Payone.ClientApi.MessageEvents.value, {type: Payone.ClientApi.InputTypes.cardtype, value: cardtype});

          cvcConfigObj.value = cardtype;

          // Initial setCardType() call without using card type selector.
          if (cvcConfigObj.length === null && cvcConfigObj.maxlength === null) {
            cvcConfigObj.maxlength = config.fields.cardcvc2.maxlength || null;
            cvcConfigObj.length = config.fields.cardcvc2.length || null;
          }

          cvcConfigObj.applyToInput = false;
          sendMessage(cardpanFrame.contentWindow, Payone.ClientApi.MessageEvents.cardtypeChanged, cvcConfigObj);

          cvcConfigObj.applyToInput = true;
          sendMessage(cardcvc2Frame.contentWindow, Payone.ClientApi.MessageEvents.cardtypeChanged, cvcConfigObj);

          // Change cardtype within selector if cardtypeFrame is present.
          if (cardtypeFrame && cardtypeFrame.contentWindow) {
            sendMessage(cardtypeFrame.contentWindow, Payone.ClientApi.MessageEvents.cardtypeChanged, cardtype);
          }
        }
      };

    init();

    /**
     * Sets the cardtype for the creditcardcheck
     *
     * Valid cardtypes are:
     *    "V": Visa
     *    "M": Mastercard
     *    "A": Amex
     *    "O": Maestro (Int)
     *    "U": UATP /Airplus
     *    "D": Diners
     *    "B": Carte Bleue
     *    "C": Discover
     *    "P": China Union Pay
     *
     * @param {string} type
     */
    this.setCardType = function (type) {
      setCardType(type);
    };

    /**
     * Enables the automatic card type detection.
     */
    this.enableCardTypeDetection = function () {
      enableCardTypeDetection();
    };

    /**
     * Disables the automatic card type detection.
     */
    this.disableCardTypeDetection = function () {
      disableCardTypeDetection();
    };

    /**
     * Returns true if all the necessary inputs are complete and a creditcardcheck
     * can be done.
     *
     * @returns {boolean}
     */
    this.isComplete = function () {
      return cardpanLoaded && isComplete;
    };

    /**
     * Returns true if the cardtype is correctly set.
     *
     * @returns {boolean}
     */
    this.isCardTypeComplete = function () {
      return isCardTypeComplete;
    };

    /**
     * Returns true if CVC input is potentially filled out correctly. This regards the
     * current CVC configuration. Notice: This method ALWAYS returns false if no card type has
     * been selected.
     *
     * @returns {boolean}
     */
    this.isCvcComplete = function () {
      return isCvcComplete;
    };

    /**
     * Returns true if cardpan input is potentially filled out correctly. This regards the
     * current CVC configuration.
     *
     * @return {boolean}
     */
    this.isCardpanComplete = function () {
      return isCardpanComplete;
    };

    /**
     * Returns true if the expire month is potentially filled out correctly.
     *
     * @returns {boolean}
     */
    this.isExpireMonthComplete = function () {
      return isExpireMonthComplete;
    };

    /**
     * Returns true if the expire year is potentially filled out correctly.
     *
     * @returns {boolean}
     */
    this.isExpireYearComplete = function () {
      return isExpireYearComplete;
    };

    /**
     * Triggers the creditcardcheck
     *
     * After the creditcardcheck is done a response object is returned to the given
     * callback function
     *
     * @param callback
     */
    this.creditCardCheck = function (callback) {
      creditCardCheck(callback);
    };

    /**
     * Do not activate tabulator key support on touch devices.
     */
    if (!isMobileBrowser()) {
      window.setInterval(checkFocus, 100);
    }
  };
}());