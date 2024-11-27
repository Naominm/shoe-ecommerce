const { sendSTKPush } = require('../../helpers/mpesa');
const Order = require('../../models/Order'); // Assuming you have a Mongoose order model

const initiatePayment = async (req, res) => {
    const { phone, amount, items } = req.body;

    if (!phone || !amount || !items) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create an order in the database
        const newOrder = new Order({
            phone,
            amount,
            items,
            status: 'Pending', // Default status
        });
        await newOrder.save();

        // Initiate STK Push
        const response = await sendSTKPush(phone, amount, newOrder._id);
        res.status(200).json({
            success: true,
            message: 'STK Push initiated. Check your phone.',
            data: response,
        });
    } catch (error) {
        res.status(500).json({ error: 'Order creation failed: ' + error.message });
    }
};

module.exports = { initiatePayment };
