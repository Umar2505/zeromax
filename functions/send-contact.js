// functions/send-contact.js
import nodemailer from "nodemailer";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);
  const { "contact-name": name, "contact-email": email, "contact-phone": phone, "contact-subject": subject, "contact-message": message } = data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.PEMAIL,
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
    return { statusCode: 200, body: "Your message has been sent successfully!" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Failed to send message. Please try again." };
  }
}
