const express = require("express");
var cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const dotenv = require("dotenv");
try {
  dotenv.config();
  mongoose.connect(process.env.DB_CONNECT);

  app.use(cors());
  app.use(express.json());
  app.use("/api/admin", authRoute);

  app.listen(8080, () => {
    console.log("Server started");
  });
} catch (err) {
  console.log(err);
}
