
const express= require('express');
const mongoose=require('mongoose');
const cookieParser = require('cookie-parser');
const cors=require('cors');

//create a database connection-> u  can also
//create this in a  separate file and import/use that file here.
mongoose.connect('mongodb+srv://nashnjeri717:m0kmNLXN9f6Z34q3@cluster0.fsal0.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

const app = express()

const  PORT =process.env.PORT || 5000;

app.use(
    cors({
       origin:' http://localhost:5173/',
       methods:['GET','POST','DELETE','PUT'],
       allowedHeaders:[
       "Content-Type", // Corrected capitalization
      "Authorization",
      "Cache-Control",
      "Expires", // Corrected spelling
       "Pragma"
       ],
       credentials:true
    })
)

app.use(cookieParser());
app.use(express.json());

app.listen(PORT,()=>console.log(`server is now running on ${PORT}`))