const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_URL;

const conn = async () => {
  mongoose
    .connect(
      url
    )
    .then(() => {
      console.log("Connected to childern");
    })
    .catch((error) => console.log("Error in DB " + error));
};

module.exports = conn;
