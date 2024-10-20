const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const mpesaRoutes = require("./routes/shop/mpesa-routes"); // Import Mpesa routes

// Load environment variables
require('dotenv').config();

// Create a database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Register routes
app.use("/api/auth", authRouter);
app.use("/api/mpesa", mpesaRoutes);  // Register the Mpesa route

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
