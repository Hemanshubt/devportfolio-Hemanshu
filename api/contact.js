import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://hemanshudev.cloud',
  'https://www.hemanshudev.cloud',
  'http://localhost:8080',
  'http://localhost:5173',
];

function getCorsOrigin(req) {
  const origin = req.headers?.origin || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

// In-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max 5 contact requests per 15 min per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

// Sanitize input to prevent XSS in email HTML
function sanitizeInput(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export default async function handler(req, res) {
  const origin = getCorsOrigin(req);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { name, email, message, website } = req.body;

  // Honeypot field — if "website" is filled, it's a bot
  if (website) {
    // Silently accept to not tip off bots, but don't actually send
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  }

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

  // Sanitize all inputs for safe use in HTML email
  const safeName = sanitizeInput(name);
  const safeEmail = sanitizeInput(email);

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
          text: `🔔 New Contact\n\n👤 ${safeName}\n📧 ${safeEmail}\n\n💬 ${message}`,
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

    // Sanitize message and preserve line breaks for HTML email
    const sanitizedMessage = sanitizeInput(message).replace(/\n/g, '<br/>');

    const htmlEmail = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="dark only" />
  <meta name="supported-color-schemes" content="dark only" />
  <title>New Portfolio Message</title>
  <style>
    /* Force dark mode on all clients */
    :root { color-scheme: dark only; supported-color-schemes: dark only; }
    body, .body-bg { background-color: #0a0e17 !important; }
    /* Prevent Gmail from auto-linking */
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; font-size: inherit; font-weight: inherit; line-height: inherit; }
    /* Dark mode overrides for clients that support it */
    [data-ogsc] body, [data-ogsb] body { background-color: #0a0e17 !important; }

    /* ===== MOBILE RESPONSIVE STYLES ===== */
    @media only screen and (max-width: 480px) {
      .email-container { width: 100% !important; min-width: 100% !important; }
      .mobile-pad { padding-left: 16px !important; padding-right: 16px !important; }
      .mobile-pad-header { padding: 28px 20px 22px !important; }
      .header-title { font-size: 22px !important; }
      .header-sub { font-size: 11px !important; }
      .timestamp-text { font-size: 11px !important; }
      .sender-card-cell { padding: 16px 16px 12px !important; }
      .avatar-cell { padding: 16px 0 16px 14px !important; }
      .avatar-box { width: 40px !important; height: 40px !important; font-size: 18px !important; }
      .sender-details { padding: 16px 14px 16px 10px !important; }
      .sender-name { font-size: 16px !important; }
      .sender-email { font-size: 12px !important; word-break: break-all !important; }
      .msg-section { padding: 8px 16px 22px !important; }
      .msg-content { padding: 16px 16px !important; }
      .msg-text { font-size: 14px !important; }
      .btn-cell { padding: 4px 16px 28px !important; }
      .reply-btn { padding: 12px 28px !important; font-size: 13px !important; }
      .footer-cell { padding: 16px !important; }
      .footer-info { display: block !important; width: 100% !important; text-align: center !important; padding-bottom: 10px !important; }
      .footer-links { display: block !important; width: 100% !important; text-align: center !important; }
      .footer-secured { text-align: center !important; }
    }
  </style>
</head>
<body id="body" class="body-bg" style="margin:0;padding:0;background-color:#0a0e17;font-family:'Segoe UI',Roboto,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <!-- Wrapper with dark background -->
  <div class="body-bg" style="background-color:#0a0e17;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="body-bg" style="background-color:#0a0e17;padding:32px 12px;">
    <tr><td align="center" class="body-bg" style="background-color:#0a0e17;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="max-width:600px;width:100%;border-collapse:collapse;">

        <!-- Header -->
        <tr><td class="mobile-pad-header" style="background:linear-gradient(135deg,#00d4ff 0%,#7c3aed 100%);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
          <h1 class="header-title" style="margin:0;font-size:26px;font-weight:700;color:#0a0e17;letter-spacing:-0.5px;">&#x1F4EC; New Portfolio Message</h1>
          <p class="header-sub" style="margin:10px 0 0;font-size:13px;color:rgba(10,14,23,0.7);font-family:'Courier New',monospace;">incoming transmission &#8212; portfolio contact form</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background-color:#111827;padding:0;">

          <!-- Timestamp Bar -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td class="mobile-pad" style="padding:14px 40px;background-color:#1a2332;border-bottom:1px solid #1e293b;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="timestamp-text" style="font-family:'Courier New',monospace;font-size:12px;color:#94a3b8;">&#x23F0; ${timestamp}</td>
                  <td align="right"><span style="font-family:'Courier New',monospace;font-size:11px;color:#0a0e17;background-color:#22c55e;padding:3px 10px;border-radius:20px;font-weight:600;">RECEIVED</span></td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Sender Info Card -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td class="sender-card-cell" style="padding:24px 40px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a2332;border-radius:12px;border:1px solid #2d3748;">
                <tr>
                  <!-- Avatar -->
                  <td width="60" class="avatar-cell" style="padding:20px 0 20px 20px;vertical-align:middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td class="avatar-box" style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#00d4ff,#7c3aed);text-align:center;vertical-align:middle;font-size:22px;font-weight:700;color:#0a0e17;">
                      ${safeName.charAt(0).toUpperCase()}
                    </td></tr></table>
                  </td>
                  <!-- Details -->
                  <td class="sender-details" style="padding:20px 20px 20px 12px;vertical-align:middle;">
                    <p class="sender-name" style="margin:0;font-size:18px;font-weight:700;color:#f1f5f9;letter-spacing:-0.3px;">${safeName}</p>
                    <p style="margin:5px 0 0;">
                      <a href="mailto:${safeEmail}" class="sender-email" style="color:#00d4ff;text-decoration:none;font-size:14px;font-family:'Courier New',monospace;">${safeEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Message Section -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td class="msg-section" style="padding:8px 40px 28px;">
              <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">
                &#x1F4AC; MESSAGE CONTENT
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a2332;border-radius:12px;border:1px solid #2d3748;border-left:4px solid #00d4ff;">
                <tr><td class="msg-content" style="padding:20px 24px;">
                  <p class="msg-text" style="margin:0;font-size:15px;line-height:1.75;color:#e2e8f0;">${sanitizedMessage}</p>
                </td></tr>
              </table>
            </td></tr>
          </table>

          <!-- Quick Reply Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" class="btn-cell" style="padding:4px 40px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="border-radius:10px;background:linear-gradient(135deg,#00d4ff,#06b6d4);">
                  <a href="mailto:${safeEmail}?subject=Re: Portfolio Inquiry&body=Hi ${encodeURIComponent(name)},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A"
                     class="reply-btn" style="display:inline-block;color:#0a0e17;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
                    &#x21A9;&#xFE0F; Reply to ${safeName.split(' ')[0]}
                  </a>
                </td></tr>
              </table>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td class="footer-cell" style="background-color:#0d1117;border-radius:0 0 16px 16px;padding:20px 40px;border-top:1px solid #1e293b;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="footer-info" style="font-size:12px;color:#64748b;font-family:'Courier New',monospace;">
                Hemanshu Mahajan &#8226; DevOps Engineer
              </td>
              <td class="footer-links" align="right" style="font-size:12px;">
                <a href="https://github.com/Hemanshubt" style="color:#94a3b8;text-decoration:none;margin-right:16px;">GitHub</a>
                <a href="https://www.linkedin.com/in/hemanshu-mahajan/" style="color:#94a3b8;text-decoration:none;">LinkedIn</a>
              </td>
            </tr>
          </table>
          <p class="footer-secured" style="margin:10px 0 0;font-size:11px;color:#475569;font-family:'Courier New',monospace;">
            &#x1F512; Sent via portfolio contact form &#8226; Secured
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
  </div>
</body>
</html>`;

    promises.push(
      transporter.sendMail({
        from: EMAIL_ADDRESS,
        to: EMAIL_ADDRESS,
        subject: `📬 Portfolio Contact: ${safeName}`,
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
