import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Input validation
  if (name.length > 100 || email.length > 100 || message.length > 5000) {
    return res.status(400).json({ error: 'Input too long' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  let telegramSuccess = false;
  let emailSuccess = false;

  try {
    // Send Telegram Notification (secure - token on server only)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramMessage = `🔔 New Contact Form Submission

👤 Name: ${name}
📧 Email: ${email}

💬 Message:
${message}`;

      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
        }),
      });
      
      const telegramData = await telegramResponse.json();
      telegramSuccess = telegramData.ok;
    }

    // Send Email (if Gmail configured)
    if (process.env.EMAIL_ADDRESS && process.env.GMAIL_PASSKEY) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.GMAIL_PASSKEY,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        subject: `Portfolio Contact: ${name}`,
        html: `
          <h2>🔔 New Contact Form Submission</h2>
          <p><strong>👤 Name:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>💬 Message:</strong></p>
          <p>${message}</p>
        `,
        replyTo: email,
      };

      await transporter.sendMail(mailOptions);
      emailSuccess = true;
    }

    if (telegramSuccess || emailSuccess) {
      return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to send message' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
