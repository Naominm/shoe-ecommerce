const axios = require('axios');
require('dotenv').config();

// MPesa Configuration
const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
  baseURL: process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke',
};

// Function to get access token from MPesa API
async function getAccessToken() {
  const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');
  try {
    const response = await axios.get(`${mpesaConfig.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Unable to get access token');
  }
}

// Function to initiate an STK Push (Lipa na M-Pesa)
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
    PartyA: phoneNumber, // Customer's phone number
    PartyB: mpesaConfig.shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    AccountReference: 'Order1234', // Can be a unique order ID
    TransactionDesc: 'Payment for Order 1234',
  };

  try {
    const response = await axios.post(`${mpesaConfig.baseURL}/mpesa/stkpush/v1/processrequest`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating STK Push:', error);
    throw new Error('STK Push failed');
  }
}

module.exports = { stkPush };
