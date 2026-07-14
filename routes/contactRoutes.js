const express = require("express");
const router = express.Router();

const { contactUs } = require("../controllers/contactController");

router.post("/contact-us", contactUs);

module.exports = router;
