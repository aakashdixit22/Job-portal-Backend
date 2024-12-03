import Subscriber from '../models/Subscriber.js';
import express from 'express';
import transporter from '../service/transporter.js';

const router = express.Router();


router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  // Basic email validation (optional since you have schema validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address." });
  }

  try {
    // Check if the email is already subscribed using Mongoose
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ success: false, message: "Email is already subscribed." });
    }

    // Create a new subscriber document
    const newSubscriber = new Subscriber({ email });

    // Save the new subscriber
    const result = await newSubscriber.save();

    if (result) {
      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Subscription Confirmation",
        html: `<h1>Welcome!</h1><p>Thank you for subscribing to our daily jobs and news updates!</p>`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${email}`);

      return res.status(200).json({ success: true, message: "Subscribed successfully!" });
    } else {
      return res.status(500).json({ success: false, message: "Failed to subscribe." });
    }
  } catch (error) {
    console.error("Error subscribing email:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
});

export default router;