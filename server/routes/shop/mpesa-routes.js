const express = require('express');
const router = express.Router();

// M-Pesa Callback Route
router.post('/callback', (req, res) => {
  console.log('✅ M-Pesa STK Callback Received:');

  // Log the incoming callback data (for debugging purposes)
  console.dir(req.body, { depth: null });

  // Optional: Additional logic for verifying and handling the callback
  // Example: Check if the callback contains 'ResultCode' to confirm success
  if (req.body.ResultCode === 0) {
    console.log('Payment was successful!');
    // Optional: Save to DB or log to a file here if necessary
  } else {
    console.log('Payment failed or callback data invalid.');
  }

  // Let Safaricom know that we received the callback and processed it
  res.sendStatus(200); // Respond with a 200 status to indicate success
});

module.exports = router;
