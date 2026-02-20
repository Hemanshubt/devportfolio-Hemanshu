import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (name.length > 100 || email.length > 100 || message.length > 5000) {
    return res.status(400).json({ error: 'Input too long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Run Telegram and Email in parallel for faster response
  const promises = [];

  // Telegram notification
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    promises.push(
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `🔔 New Contact\n\n👤 ${name}\n📧 ${email}\n\n💬 ${message}`,
        }),
      })
        .then(r => r.json())
        .then(d => ({ type: 'telegram', success: d.ok }))
        .catch(() => ({ type: 'telegram', success: false }))
    );
  }

  // Email notification
  const { EMAIL_ADDRESS, GMAIL_PASSKEY } = process.env;
  if (EMAIL_ADDRESS && GMAIL_PASSKEY) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_ADDRESS, pass: GMAIL_PASSKEY },
    });

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // Sanitize message to prevent HTML injection & preserve line breaks
    const sanitizedMessage = message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');

    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <style>
    /* Prevent Gmail from auto-linking */
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; font-size: inherit; font-weight: inherit; line-height: inherit; }
  </style>
</head>
<body id="body" style="margin:0;padding:0;background-color:#0a0e17;font-family:'Segoe UI',Roboto,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0e17;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-collapse:collapse;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#00d4ff 0%,#7c3aed 100%);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#0a0e17;letter-spacing:-0.5px;">&#x1F4EC; New Portfolio Message</h1>
          <p style="margin:10px 0 0;font-size:13px;color:rgba(10,14,23,0.7);font-family:'Courier New',monospace;">incoming transmission &#8212; portfolio contact form</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background-color:#111827;padding:0;">

          <!-- Timestamp Bar -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:14px 40px;background-color:#1a2332;border-bottom:1px solid #1e293b;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:'Courier New',monospace;font-size:12px;color:#94a3b8;">&#x23F0; ${timestamp}</td>
                  <td align="right"><span style="font-family:'Courier New',monospace;font-size:11px;color:#0a0e17;background-color:#22c55e;padding:3px 10px;border-radius:20px;font-weight:600;">RECEIVED</span></td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Sender Info Card -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:24px 40px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a2332;border-radius:12px;border:1px solid #2d3748;">
                <tr>
                  <!-- Avatar -->
                  <td width="68" style="padding:20px 0 20px 20px;vertical-align:middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#00d4ff,#7c3aed);text-align:center;vertical-align:middle;font-size:22px;font-weight:700;color:#0a0e17;">
                      ${name.charAt(0).toUpperCase()}
                    </td></tr></table>
                  </td>
                  <!-- Details -->
                  <td style="padding:20px 20px 20px 12px;vertical-align:middle;">
                    <p style="margin:0;font-size:18px;font-weight:700;color:#f1f5f9;letter-spacing:-0.3px;">${name}</p>
                    <p style="margin:5px 0 0;font-size:14px;color:#00d4ff;font-family:'Courier New',monospace;">
                      <a href="mailto:${email}" style="color:#00d4ff;text-decoration:none;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Message Section -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 40px 28px;">
              <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">
                &#x1F4AC; MESSAGE CONTENT
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a2332;border-radius:12px;border:1px solid #2d3748;border-left:4px solid #00d4ff;">
                <tr><td style="padding:20px 24px;">
                  <p style="margin:0;font-size:15px;line-height:1.75;color:#e2e8f0;">${sanitizedMessage}</p>
                </td></tr>
              </table>
            </td></tr>
          </table>

          <!-- Quick Reply Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:4px 40px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="border-radius:10px;background:linear-gradient(135deg,#00d4ff,#06b6d4);">
                  <a href="mailto:${email}?subject=Re: Portfolio Inquiry&body=Hi ${encodeURIComponent(name)},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A"
                     style="display:inline-block;color:#0a0e17;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
                    &#x21A9;&#xFE0F; Reply to ${name.split(' ')[0]}
                  </a>
                </td></tr>
              </table>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background-color:#0d1117;border-radius:0 0 16px 16px;padding:20px 40px;border-top:1px solid #1e293b;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:12px;color:#64748b;font-family:'Courier New',monospace;">
                Hemanshu Mahajan &#8226; DevOps Engineer
              </td>
              <td align="right" style="font-size:12px;">
                <a href="https://github.com/Hemanshubt" style="color:#94a3b8;text-decoration:none;margin-right:16px;">GitHub</a>
                <a href="https://www.linkedin.com/in/hemanshu-mahajan/" style="color:#94a3b8;text-decoration:none;">LinkedIn</a>
              </td>
            </tr>
          </table>
          <p style="margin:10px 0 0;font-size:11px;color:#475569;font-family:'Courier New',monospace;">
            &#x1F512; Sent via portfolio contact form &#8226; Secured
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    promises.push(
      transporter.sendMail({
        from: EMAIL_ADDRESS,
        to: EMAIL_ADDRESS,
        subject: `📬 Portfolio Contact: ${name}`,
        html: htmlEmail,
        replyTo: email,
      })
        .then(() => ({ type: 'email', success: true }))
        .catch(() => ({ type: 'email', success: false }))
    );
  }

  const results = await Promise.all(promises);
  const anySuccess = results.some(r => r.success);

  if (anySuccess) {
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  }
  return res.status(500).json({ error: 'Failed to send message' });
}
