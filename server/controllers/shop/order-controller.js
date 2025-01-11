
const mpesa = require("../../helpers/mpesa"); // Helper for M-Pesa integration
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus = "pending",
      paymentMethod = "mpesa",
      paymentStatus = "pending",
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
      phoneNumber, // Customer's phone number for M-Pesa payment
    } = req.body;

    // Initiate M-Pesa STK Push (replace Paypal logic)
    const stkResponse = await mpesa.stkPush(totalAmount, phoneNumber);

    if (!stkResponse || stkResponse.errorCode) {
      return res.status(500).json({
        success: false,
        message: stkResponse.errorMessage || "Error initiating M-Pesa payment",
      });
    }

    // Create a new order in the database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      checkoutRequestId: stkResponse.CheckoutRequestID, // M-Pesa CheckoutRequestID
    });

    await newlyCreatedOrder.save();

    // Redirect user to M-Pesa payment link if needed, otherwise handle response accordingly
    const paymentLink = stkResponse.paymentUrl || ''; // Adjust according to your response structure

    res.status(201).json({
      success: true,
      paymentLink, // This is where the user is redirected for M-Pesa payment
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while creating the order",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId; // Payment ID from M-Pesa callback or response
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.title} not found`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // Delete cart after successful order payment
    await Cart.findByIdAndDelete(order.cartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while capturing payment",
    });
  }
};

// Get All Orders by User
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching orders",
    });
  }
};

// Get Order Details
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching order details",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
