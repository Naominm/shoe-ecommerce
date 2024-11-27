const express = require('express');
const { initiatePayment } = require('../../controllers/shop/mpesa-controller');
const router = express.Router();

router.post('/pay', initiatePayment);

module.exports = router;
