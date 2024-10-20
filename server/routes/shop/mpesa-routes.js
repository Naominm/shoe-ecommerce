const express = require('express');
const router = express.Router();
const { initiateSTKPush, stkPushCallback, confirmPayment } = require('../../controllers/shop/mpesa-controller');

// Route to initiate Mpesa payment (STK Push)
router.post('/stkpush', initiateSTKPush);

// Route to handle STK Push callback
router.post('/stkPushCallback/:Order_ID', stkPushCallback);

// Route to check payment status from Safaricom's server
router.get('/confirmPayment/:CheckoutRequestID', confirmPayment);

module.exports = router;
