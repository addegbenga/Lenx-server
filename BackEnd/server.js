const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();


//DB Config
const CONNECTDB = require("./config/db");

//Connect to MongoDB ATLAS
CONNECTDB();

//view engine
app.set("view engine", "pug");

//bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//public add
app.use(express.static("public"));


//setup cors
app.use(cors("*"));

//logger
app.use(morgan("tiny"));

//setup api
app.use("/api/auth", require("./routes/auth"));
app.use("/api/2fa", require("./routes/2fa"));

app.use("/product", require("./routes/products"));

const port = process.env.PORT || 5000; //port setting

app.listen(port, () => console.log(`Server hosted on: http://localhost:${port}`));
