const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Database connection successful"))
    .catch((error) => {
      console.error("❌ Database connection failed:", error.message);
      process.exit(1);
    });
};

module.exports = dbConnect;
