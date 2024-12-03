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
      // const mailOptions = {
      //   from: process.env.EMAIL_USER,
      //   to: email,
      //   subject: "Subscription Confirmation",
      //   html: `<h1>Welcome!</h1><p>Thank you for subscribing to our daily jobs and news updates!</p>`,
      // };
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Subscription Confirmation",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Subscription Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background-color: #007bff;
              color: #ffffff;
              text-align: center;
              padding: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
              color: #333333;
              line-height: 1.6;
            }
            .content h2 {
              color: #007bff;
            }
            .footer {
              background-color: #f1f1f1;
              text-align: center;
              padding: 15px;
              font-size: 14px;
              color: #666666;
            }
            .button {
              display: inline-block;
              margin: 20px 0;
              padding: 10px 20px;
              color: #ffffff;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 4px;
              font-size: 16px;
            }
            .button:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Talx Daily Updates!</h1>
            </div>
            <div class="content">
              <h2>Thank You for Subscribing</h2>
              <p>
                We're thrilled to have you on board! You'll now receive our curated daily
                jobs and news updates straight to your inbox.
              </p>
              <p>
                Stay tuned for the latest opportunities and news tailored just for you.
              </p>
              <a href="#" class="button">Visit Our Website</a>
            </div>
            <div class="footer">
              <p>&copy; 2024 Daily Updates. All rights reserved.</p>
              <p>
                If you have any questions, feel free to 
                <a href="mailto:support@example.com" style="color: #007bff; text-decoration: none;">contact us</a>.
              </p>
            </div>
          </div>
        </body>
        </html>
        `,
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