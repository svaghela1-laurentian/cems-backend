// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./utils/db");

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
