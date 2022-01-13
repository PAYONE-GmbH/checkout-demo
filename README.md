# PAYONE checkout demo app

This demo app shows example [use cases](#use-cases-overview) for an online-payment and serves as a demonstration of PAYONE's API usage and its concepts.
The app shows a usage scenario for an e-shop that allows card, PayPal, and Paydirekt payment methods.

## Use cases overview
1. [Pay via a card (with/without 3DSecure)](#pay-via-a-card-without-3dsecure)
2. [Pay via PayPal and Paydirekt](#pay-via-paydirekt)
3. [Receive an example transaction status notification from the PAYONE system](#receive-example-transaction-status-notification)

## How to read the Readme?
As for how to read this README for the first time, we recommend to
- first, check out ["Use cases' showcase" section](#use-cases-showcase)
- (then you can install the app to be able to play around with it yourself - follow section ["Running the app"](#running-the-app))
- secondly, read ["Let's do it" section](/_docs/detailed-readme.md#lets-do-it) in the more detailed doc - [Detailed Readme](/_docs/detailed-readme.md)
- and then, read ["Internals" section](/_docs/detailed-readme.md#internals) in the [more detailed Readme](/_docs/detailed-readme.md)

[Detailed Readme](/_docs/detailed-readme.md) elaborates more on tech details and PAYONE's API concepts.  
So, most probably, you _would_ want to check it out. The link to it, again: [the detailed Readme](/_docs/detailed-readme.md).

## Running the app
You have two options: you can play around with the app on [Gitpod](https://www.gitpod.io/), an online IDE, or you can
install the app locally.

### Gitpod
1. Click the link below to open the app inside Gitpod's online IDE:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#github.com/PAYONE-GmbH/checkout-demo)

2. Populate the pre-created `.env` file with your PAYONE credentials like in `.env.example`
3. Run `php -S 0.0.0.0:3000` command in terminal (``Ctrl + Shift + ` ``) to run the PHP built-in server
4. Then, in Gitpod, you should see a pop-up showing up on the right allowing you to go to a browser - just 
click 'Open browser' 🙂

Note: you will probably encounter problems accessing redirect payment methods like PayPal if viewing
the app in Gitpod's built-in preview browser, i.e. by clicking 'Open preview' in the 4th step, so you should go to a dedicated browser window to be able
to check how redirect payment methods work - so, just click 'Open browser', and you're good to go 🙂.


### Locally
Simply clone the repo and spin up a server.

You can do this by following these steps:

1. Clone the repository via this command - `git clone git@github.com:PAYONE-GmbH/checkout-demo.git`
2. Go the app folder via `cd checkout-demo/`
3. Create a new `.env` file and then populate it with your PAYONE credentials like in `.env.example`
4. Run `php -S localhost:3000` command to run the PHP built-in server
5. Go to `localhost:3000` in your browser 🙂

Prerequisites for the demo app to run are:
- PHP at least 7.1
- cURL installed on the server and `php-curl` extension

## Use cases' showcase
### Pay via a card without 3DSecure
![](_docs/gifs/card-without-3ds.gif)

### Pay via a card with 3DSecure
![](_docs/gifs/card-with-3ds.gif)

### Pay via Paydirekt
![](_docs/gifs/paydirekt.gif)

### Receive example transaction status notification
This is shown in the last seconds of 'Pay via a card with 3DSecure' and 'Pay via Paydirekt' showcases

For the test data - follow our more detailed Readme's section ["Use cases' test data"](/_docs/detailed-readme.md#use-cases-test-data)
