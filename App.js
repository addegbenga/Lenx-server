
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const upload = multer();
const cors = require("cors");
const expressValidator = require("express-validator");
const passport = require("passport");
require("dotenv").config();
const path = require("path");

const connectToDB = require('./config/dbConnection');



// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");



//App
const App = express()

//debugger
connectToDB();


//middleware
App.use(morgan('dev'));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
App.use(upload.array("photo" || "avatar", 5)); 

App.use(express.static("public"));
App.use(cookieParser());
App.use(expressValidator());
App.use(cors());

// view engine setup
App.set('views', path.join(__dirname, 'views'));
App.set('view engine', 'jade');

//routes middleware
App.get("/", (req, res) => res.json({message: "Welcome to LenX! - By Victor Alvarez"}))
App.use("/api/auth", authRoutes);
App.use("/api/user", userRoutes);
App.use("/api/category", categoryRoutes);
App.use("/api/product", productRoutes);
App.use("/api/braintree", braintreeRoutes);
App.use("/api/order", orderRoutes);

// Initialise passport middleware
App.use(passport.initialize());
require("./middlewares/jwt")(passport);



const port = process.env.PORT || 5000

App.listen(port, () =>{
  console.log(`Server hosted on: http://localhost:${port}`)
})






