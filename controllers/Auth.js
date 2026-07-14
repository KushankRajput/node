const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { findOneAndUpdate } = require("../models/posts");
<<<<<<< HEAD
const nodemailer = require("nodemailer");
const twilio = require("twilio");
=======
>>>>>>> 4ed39a7 (Deploying)

exports.signup = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      role,
      password,
      confirm_password,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
      });
    }

    if (password !== confirm_password) {
      return res.status(200).json({
        success: true,
        message: "Passwords do not match",
      });
    }

    let hashedPassword;
    let hashedConfirmPassword;
    try {
<<<<<<< HEAD
      hashedPassword = await bcrypt.hash(password, 10);
=======
      hashedPassword = await bcrypt.hash(password, 10); 
>>>>>>> 4ed39a7 (Deploying)
      hashedConfirmPassword = await bcrypt.hash(confirm_password, 10);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Unable to bcrypt",
        data: error.message,
      });
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
      role,
      password: hashedPassword,
      confirm_password: hashedConfirmPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error.message,
      message: "Internal server error",
    });
  }
};

<<<<<<< HEAD
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
// Login function
exports.login = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    let user;

    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email or Phone is required",
      });
    }
=======
// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

>>>>>>> 4ed39a7 (Deploying)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not fount, Please Signup first",
      });
    }
<<<<<<< HEAD
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatch) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Incorrect Password",
    //   });
    // }

    const otp = Math.floor(1000 + Math.random() * 1000).toString();
    user.otp = otp;
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Your login otp",
        html: `
          <h2>Login OTP</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        `,
      });
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email",
      });
    }

    if (phone) {
      await client.messages.create({
        body: `Your Login OTP is ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
       return res.status(200).json({
        success: true,
        message: "OTP sent to your phone",
      });
    }

=======

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
>>>>>>> 4ed39a7 (Deploying)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    // This may be optional
    user.token = token; //user ke andr token name ka field dal diya
    user.password = undefined; // for security purpose, jisse koi hmamara password na dekh ske
    user.confirm_password = undefined;

    // options ka mtlb cookie permission
    const options = {
      expires: new Date(Date.now() + 10 * 100000), // 1000000  miliseconds
      // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3  days (where 1000 is 1000 miliseconds = 1 second)
      httpOnly: true, //for securing from XSS
    };
    // Here we are creating the cookie and send that into the response
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

<<<<<<< HEAD
exports.verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    // Validation
    if ((!email && !phone) || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and OTP are required",
      });
    }

    // Find User
    let user;

    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check OTP
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check Expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    // Remove sensitive fields
    user.password = undefined;
    user.confirm_password = undefined;

    // Cookie Options
    const options = {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      message: "OTP verified successfully. Login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

=======
>>>>>>> 4ed39a7 (Deploying)
// Fetch All user
exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "No user",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Fetch login user details
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "No user",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
