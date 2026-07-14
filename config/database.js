const mongoose = require("mongoose");

require("dotenv").config();

<<<<<<< HEAD
const dbConnect = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
=======
const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })  
>>>>>>> 4ed39a7 (Deploying)
    .then(() => console.log("Connection successful"))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
};

module.exports = dbConnect;
