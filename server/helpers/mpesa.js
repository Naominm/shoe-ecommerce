const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

// M-Pesa Configuration
const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox', // 'sandbox' or 'production'
  baseURL: process.env.MPESA_BASE_URL?.trim()|| 'https://sandbox.safaricom.co.ke', // Base URL based on environment
};

// Function to get access token from M-Pesa API
async function getAccessToken() {
  const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');

  try {
    console.log('Requesting access token...');
    const response = await axios.get(`${mpesaConfig.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw new Error('Unable to get access token');
  }
}


async function stkPush(amount, phoneNumber) {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); 
  const password = Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64');

  const requestData = {
    BusinessShortCode: mpesaConfig.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: mpesaConfig.shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: 'https://4b77-154-158-158-247.ngrok-free.app/mpesa/callback',
    AccountReference: 'Order1',
    TransactionDesc: 'Payment for Order 1',
  };

  try {
    const response = await axios.post(`${mpesaConfig.baseURL}/mpesa/stkpush/v1/processrequest`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    console.log('STK Push Response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error initiating STK Push:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.log('Full Error Response:', error.response);
    }
    throw new Error('STK Push failed');
  }
  
}


(async () => {
  try {
    const amount = 10; 
    const phoneNumber = '254708374149'; 

    const response = await stkPush(amount, phoneNumber);
    console.log('STK Push Successful:', response);
  } catch (error) {
    console.error('STK Push Error:', error.message);
  }
})();

module.exports = { stkPush };
