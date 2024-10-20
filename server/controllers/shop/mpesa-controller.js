import axios from "axios";
import 'dotenv/config';

// Define the getTimestamp function here
const getTimestamp = () => {
  const date = new Date();
  return date.toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
};

// @desc initiate stk push
// @method POST
// @route /stkpush
// @access public
export const initiateSTKPush = async (req, res) => {
  try {
    const { amount, phone, Order_ID } = req.body;

    // Get access token
    const token = await getAccessToken();

    const timestamp = getTimestamp();  // Use the getTimestamp function here
    const password = Buffer.from(`${process.env.BUSINESS_SHORT_CODE}${process.env.PASS_KEY}${timestamp}`).toString('base64');

    const callback_url = process.env.CALLBACK_URL || `${ngrok.getApi().listTunnels().public_url}/api/stkPushCallback/${Order_ID}`;

    const requestData = {
      BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.BUSINESS_SHORT_CODE,
      PhoneNumber: phone,
      CallBackURL: callback_url,
      AccountReference: "Wamaitha Online Shop",
      TransactionDesc: "Paid online",
    };

    const response = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error initiating STK Push:", error);
    res.status(503).json({
      message: "Error with the STK Push",
      error: error.message,
    });
  }
};

// @desc callback route for Safaricom transaction status
// @method POST
// @route /stkPushCallback/:Order_ID
// @access public
export const stkPushCallback = async (req, res) => {
  try {
    const { Order_ID } = req.params;

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = req.body.Body.stkCallback;

    const meta = Object.values(await CallbackMetadata.Item);
    const PhoneNumber = meta.find(o => o.Name === 'PhoneNumber').Value.toString();
    const Amount = meta.find(o => o.Name === 'Amount').Value.toString();
    const MpesaReceiptNumber = meta.find(o => o.Name === 'MpesaReceiptNumber').Value.toString();
    const TransactionDate = meta.find(o => o.Name === 'TransactionDate').Value.toString();

    console.log(`Order_ID: ${Order_ID}, MerchantRequestID: ${MerchantRequestID}, CheckoutRequestID: ${CheckoutRequestID}, ResultCode: ${ResultCode}, ResultDesc: ${ResultDesc}, PhoneNumber: ${PhoneNumber}, Amount: ${Amount}, MpesaReceiptNumber: ${MpesaReceiptNumber}, TransactionDate: ${TransactionDate}`);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling callback", error);
    res.status(503).json({
      message: "Error handling callback",
      error: error.message,
    });
  }
};

// @desc Check from Safaricom servers the status of a transaction
// @method GET
// @route /confirmPayment/:CheckoutRequestID
// @access public
export const confirmPayment = async (req, res) => {
  try {
    const { CheckoutRequestID } = req.params;

    const url = `${process.env.MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`;
    const token = await getAccessToken();
    const timestamp = getTimestamp();  // Use the getTimestamp function here
    const password = Buffer.from(`${process.env.BUSINESS_SHORT_CODE}${process.env.PASS_KEY}${timestamp}`).toString('base64');

    const requestData = {
      BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: CheckoutRequestID,
    };

    const response = await axios.post(url, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error checking payment status", error);
    res.status(503).json({
      message: "Error checking payment status",
      error: error.message,
    });
  }
};

// Helper function to get access token
const getAccessToken = async () => {
  const url = `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    throw new Error("Unable to get access token");
  }
};
