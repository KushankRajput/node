const mailSender = require("../config/mailSender");

exports.contactUs = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Email and Phone are required.",
      });
    }

    const html = `
      <h2>New Contact Us Request</h2>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th align="left">Full Name</th>
          <td>${fullName.trim()}</td>
        </tr>
        <tr>
          <th align="left">Email</th>
          <td>${email.trim()}</td>
        </tr>
        <tr>
          <th align="left">Phone</th>
          <td>${phone.trim()}</td>
        </tr>
      </table>
    `;

    await mailSender(
      process.env.CONTACT_RECEIVER,
      "New Contact Us Enquiry",
      html,
    );

    return res.status(200).json({
      success: true,
      message: "Enquiry sent successfully.",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
