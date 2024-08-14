const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const { db } = require("./db");
const userRouter = require("./routes/userRoutes");

//env config
dotenv.config({ path: path.join(__dirname, ".", ".env") });

//cors
app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));

// connect database
db();

// Routes
app.use("/", userRouter);

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
