// const axios = require('axios');
// const { MPESA_SHORTCODE, MPESA_PASSKEY, CONSUMER_KEY, CONSUMER_SECRET, MPESA_CALLBACK_URL } = process.env;

// const generateToken = async () => {
//     const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
//     const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
//         headers: { Authorization: `Basic ${auth}` }
//     });
//     return response.data.access_token;
// };

// const stkPush = async (req, res) => {
//     const token = await generateToken();
//     const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
//     const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    
//     const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
//         BusinessShortCode: MPESA_SHORTCODE,
//         Password: password,
//         Timestamp: timestamp,
//         TransactionType: "CustomerPayBillOnline",
//         Amount: req.body.amount,
//         PartyA: req.body.phone,  // Customer's phone number
//         PartyB: MPESA_SHORTCODE,
//         PhoneNumber: req.body.phone,
//         CallBackURL: MPESA_CALLBACK_URL,
//         AccountReference: "Account",
//         TransactionDesc: "Payment"
//     }, { headers: { Authorization: `Bearer ${token}` } });
    
//     res.status(200).json(response.data);
// };

// module.exports = { stkPush };
