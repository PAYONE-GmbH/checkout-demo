<?php

namespace Payone;

use Exception;
use Payone\Exceptions\BadCurlResponseException;
use Payone\Exceptions\InvalidCartItemDataException;

class Payone
{
    const PAYONE_SERVICE_URL = 'https://api.pay1.de/post-gateway/';

    protected $generalStandardData = [
        'api_version' => '3.11',
        'mode' => 'test',
        'encoding' => 'UTF-8',
        'integrator_name' => ''
    ];

    protected $credentialsIntrinsicKey = '';
    protected $credentials = [
        'mid' => '',
        'portalid' => '',
        'aid' => '',
        'key' => ''
    ];

    public function __construct(array $settings)
    {
        // Set credentials
        $credentials = ['mid' => $mid, 'portalid' => $portalid, 'aid' => $aid, 'key' => $key] = $settings;
        $this->credentialsIntrinsicKey = $key;
        $this->setCredentials($credentials);

        // Set some settings' values or defaults if no values have been passed
        $mode = $settings['mode'] ?? $this->generalStandardData['mode'];
        $this->generalStandardData['mode'] = $mode;

        $integratorName = $settings['integrator_name'] ?? null;
        $this->generalStandardData['integrator_name'] = $integratorName;
    }

    public function generateJsHash(): string
    {
        $credentialsWoKey = [
          'mid' => $this->credentials['mid'],
          'portalid' => $this->credentials['portalid'],
          'aid' => $this->credentials['aid']
        ];
        $dataToBuildHash = array_merge(
          [
            'mode' => $this->generalStandardData['mode'],
            'encoding' => $this->generalStandardData['encoding'],
            'request' => 'creditcardcheck',
            'responsetype' => 'JSON',
            'storecarddata' => 'yes'
          ],
          $credentialsWoKey
        );

        ksort($dataToBuildHash);
        $neededDataStringified = join('', $dataToBuildHash);

        return hash_hmac('sha384', $neededDataStringified, $this->credentialsIntrinsicKey);
    }

  /**
   * Send request to PAYONE service and get response data in array
   *
   * Note on cart items: if you want to use this PAYONE wrapper class's more convenient cart items interface,
   * you need your cart items to follow this structure:
   * [
   *   [
   *     'id' => 42,
   *     'type' => 'goods',
   *     'SKU' => 'QL-NBB-477-48',
   *     'price' => 840,
   *     'description' => 'Cool joggers',
   *   ],
   *   ...
   * ]
   *
   * i.e. you need every cart items to have 'type', 'SKU', 'price', 'quantity', and 'description' keys
   *
   * @param array $requestData
   * @return array
   */
    public function sendRequest(array $requestData): array
    {
        try {
            $response = $this->sendCurlPostRequest($requestData);
        } catch (Exception $exception) {
            $response = [
                'status' => 'internal_error',
                'message' => $exception->getMessage(),
                'customermessage' => 'Sorry, a problem occurred in our service. Please, try again later.'
            ];

            return $response;
        }

        $responseData = $this->parseServiceResponse($response);

        return $responseData;
    }

  /**
   * Send cURL POST request with request data
   *
   * @param array $requestData
   * @return string
   * @throws InvalidCartItemDataException
   * @throws BadCurlResponseException
   */
    protected function sendCurlPostRequest(array $requestData): string
    {
        $ch = curl_init(self::PAYONE_SERVICE_URL);

        $finalRequestData = $requestData;

        if (isset($finalRequestData['items'])) {
            $cartItems = $finalRequestData['items'];
            unset($finalRequestData['items']);

            $CART_ITEM_REQUIRED_KEYS = ['type', 'SKU', 'price', 'quantity', 'description'];
            foreach ($cartItems as $cartItem) {
                if (!hasArrayAllSpecifiedKeys($cartItem, $CART_ITEM_REQUIRED_KEYS)) {
                    $cartItemsRequiredKeysStringified = json_encode($CART_ITEM_REQUIRED_KEYS);
                    throw new InvalidCartItemDataException("Invalid cart item data provided: Every cart item must have $cartItemsRequiredKeysStringified keys");
                }
            }

            $requestCartData = [];
            foreach ($cartItems as $index => $cartItem) {
                $requestCartDatum = [];
                $cartItemIndex = $index + 1;
                $requestCartDatum["it[$cartItemIndex]"] = $cartItem['type'];
                $requestCartDatum["id[$cartItemIndex]"] = $cartItem['SKU'];
                $requestCartDatum["pr[$cartItemIndex]"] = $cartItem['price'];
                $requestCartDatum["no[$cartItemIndex]"] = $cartItem['quantity'];
                $requestCartDatum["de[$cartItemIndex]"] = $cartItem['description'];

                $requestCartData[] = $requestCartDatum;
            }
            $requestCartDataFlattened = array_merge(...$requestCartData);

            $finalRequestData = array_merge($requestCartDataFlattened, $finalRequestData);
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // return response instead of outputting it directly
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array_merge($this->generalStandardData, $this->credentials, $finalRequestData)));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded; charset=UTF-8']);

        $response = curl_exec($ch);
        curl_close($ch);
        if (!$response) {
            // see https://www.php.net/manual/en/function.curl-exec.php - section "Return values"
            throw new BadCurlResponseException('cURL returned false response');
        }

        return $response;
    }

    /**
     * Parse response from Payone service and get parsed response data
     *
     * @param string $response
     * @return array
     */
    protected function parseServiceResponse(string $response): array
    {
        $explodedItems = explode("\n", $response);
        array_pop($explodedItems); // remove last unnecessary '\n' value that came from 'explode()'

        $parsedResponseData = [];
        foreach ($explodedItems as $explodedItem) {
            // Using $limit = 2 to prevent further exploding of redirect URLs that contain '=' signs in their GET-params
            [$explodedItemKey, $explodedItemValue] = explode('=', $explodedItem, 2);

            $parsedResponseData[$explodedItemKey] = $explodedItemValue;
        }

        return $parsedResponseData;
    }

    protected function setCredentials(array $credentials): void
    {
        $credentials['key'] = md5($credentials['key']); // hash merchant's key
        $this->credentials = $credentials;
    }
}

// ---- Helper functions ----

/**
 * Checks if array has all specified keys
 *
 * Returns false if some keys are missing and true if all keys are present
 *
 * @param $array
 * @param $keys
 * @return bool
 */
function hasArrayAllSpecifiedKeys($array, $keys): bool {
  $checks = [];
  foreach ($keys as $key) {
    $checks[] = array_key_exists($key, $array);
  }

  return !in_array(false, $checks);
}