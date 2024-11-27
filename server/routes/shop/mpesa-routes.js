
const express = require('express');
const { initiatePayment } = require('../../controllers/shop/mpesa-controller');
const router = express.Router();

router.post('/pay', initiatePayment);

module.exports = router;

// const express = require('express');
// const { stkPush } = require('../../controllers/shop/mpesa-stk-controller');
// const router = express.Router();

// router.post('/stkpush', stkPush);

// module.exports = router;

