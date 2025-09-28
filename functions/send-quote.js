// functions/send-quote.js
import nodemailer from "nodemailer";

export async function handler(event, context) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone, "move-type": moveType, from, to, date, size, notes, agree } = data;

    if (!agree) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: "You must agree to receive a quote." })
      };
    }

    // Use environment variables for credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Use your authenticated email as sender
      to: process.env.RECIPIENT_EMAIL,
      replyTo: email, // Set user's email as reply-to
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

    await transporter.sendMail(mailOptions);
    
    return { 
      statusCode: 200, 
      headers,
      body: JSON.stringify({ message: "Quote request sent successfully!" })
    };
  } catch (err) {
    console.error('Error:', err);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: "Failed to send email. Please try again." })
    };
  }
}