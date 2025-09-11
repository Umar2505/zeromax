// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // for environment variables

const app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// === Moving Form Route ===
app.post("/send", async (req, res) => {
  const { name, email, phone, "move-type": moveType, from, to, date, size, notes, agree } = req.body;

  if (!agree) {
    return res.status(400).send("You must agree to receive a quote.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "zeromaxdubay@gmail.com", // A\-}eg9[dX-340qy
      pass: "jszwfqjuvatepbgf"
    }
  });

  const mailOptions = {
    from: email,
    to: "rustamovumar0@gmail.com",
    subject: `New Quote Request from ${name} - ${new Date().toLocaleString()}`,
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Move Type:</strong> ${moveType}</p>
      <p><strong>From:</strong> ${from}</p>
      <p><strong>To:</strong> ${to}</p>
      <p><strong>Moving Date:</strong> ${date}</p>
      <p><strong>Approx. Size:</strong> ${size}</p>
      <p><strong>Special Requirements:</strong> ${notes || "None"}</p>
    `,
    headers: { "Message-ID": `<${Date.now()}-${Math.random()}@gmail.com>` }
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Quote request sent successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send email.");
  }
});

// === Contact Form Route ===
app.post("/contact", async (req, res) => {
  const { "contact-name": name, "contact-email": email, "contact-phone": phone, "contact-subject": subject, "contact-message": message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "zeromaxdubay@gmail.com", // A\-}eg9[dX-340qy
      pass: "jszwfqjuvatepbgf"
    }
  });

  const mailOptions = {
    from: email,
    to: "rustamovumar0@gmail.com",
    subject: `${subject} from ${name} - ${new Date().toLocaleString()}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
    headers: { "Message-ID": `<${Date.now()}-${Math.random()}@gmail.com>` }
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Your message has been sent successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message. Please try again.");
  }
});

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));




