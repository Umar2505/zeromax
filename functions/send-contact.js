// functions/send-contact.js
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
    const { 
      "contact-name": name, 
      "contact-email": email, 
      "contact-phone": phone, 
      "contact-subject": subject, 
      "contact-message": message 
    } = data;

    // Use environment variables for credentials
    const transporter = nodemailer.createTransporter({
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

    await transporter.sendMail(mailOptions);
    
    return { 
      statusCode: 200, 
      headers,
      body: JSON.stringify({ message: "Your message has been sent successfully!" })
    };
  } catch (err) {
    console.error('Error:', err);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: "Failed to send message. Please try again." })
    };
  }
}