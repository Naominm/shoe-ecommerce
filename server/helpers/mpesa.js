const axios = require('axios');
require('dotenv').config(); // Ensure you have a .env file with required keys

// M-Pesa Configuration
const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox', // Choose 'sandbox' or 'production'
  baseURL: process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke', // Base URL based on environment
};

// Function to get access token from M-Pesa API
async function getAccessToken() {
  const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(`${mpesaConfig.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    console.log('Access Token:', response.data.access_token); // Log for debugging
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw new Error('Unable to get access token');
  }
}

// Function to initiate an STK Push (Lipa na M-Pesa)
async function stkPush(amount, phoneNumber) {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); // Format: YYYYMMDDHHMMSS
  const password = Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64');

  const requestData = {
    BusinessShortCode: mpesaConfig.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline', // Transaction type for PayBill payments
    Amount: amount,
    PartyA: phoneNumber, // Customer's phone number in international format (e.g., 2547XXXXXXXX)
    PartyB: mpesaConfig.shortcode, // Business shortcode receiving the payment
    PhoneNumber: phoneNumber, // Same as PartyA
    CallBackURL: 'https://your-ngrok-url.ngrok.io/mpesa/callback', // Replace with your callback URL
    AccountReference: 'Order1', // Optional: Use a unique order ID or reference
    TransactionDesc: 'Payment for Order 1', // Description of the transaction
  };

  try {
    const response = await axios.post(`${mpesaConfig.baseURL}/mpesa/stkpush/v1/processrequest`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('STK Push Response:', response.data); // Log the API response
    return response.data;
  } catch (error) {
    console.error('Error initiating STK Push:', error.response ? error.response.data : error.message);
    throw new Error('STK Push failed');
  }
}

// Test the STK Push function
(async () => {
  try {
    const amount = 1000; // Amount to be paid
    const phoneNumber = '2547XXXXXXXX'; // Customer's phone number in international format

    const response = await stkPush(amount, phoneNumber);
    console.log('STK Push Successful:', response);
  } catch (error) {
    console.error('STK Push Error:', error.message);
  }
})();

module.exports = { stkPush };
