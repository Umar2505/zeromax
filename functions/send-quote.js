// functions/send-quote.js
import nodemailer from "nodemailer";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);
  const { name, email, phone, "move-type": moveType, from, to, date, size, notes, agree } = data;

  if (!agree) {
    return { statusCode: 400, body: "You must agree to receive a quote." };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // set in Netlify env
      pass: process.env.EMAIL_PASS    // set in Netlify env
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.DEST_EMAIL,      // set in Netlify env
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
    return { statusCode: 200, body: "Quote request sent successfully!" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Failed to send email." };
  }
}
