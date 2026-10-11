import fetch from 'node-fetch';

// Allowed origins for CORS
const ALLOWED_ORIGINS = new Set([
  'https://hemanshudev.cloud',
  'https://www.hemanshudev.cloud',
  'http://localhost:8080',
  'http://localhost:5173',
]);

function getAllowedOrigin(req) {
  const origin = req.headers?.origin || '';
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
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
  const allowedOrigin = getAllowedOrigin(req);
  if (!allowedOrigin) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const clientIp = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || 'unknown';
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

  // Resend API notification (replaces Google SMTP)
  const { RESEND_API_KEY, RESEND_FROM, RESEND_TO, EMAIL_ADDRESS } = process.env;
  if (RESEND_API_KEY) {
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Sanitize message and preserve line breaks for HTML email
    const sanitizedMessage = sanitizeInput(message).replace(/\n/g, '<br/>');
    const firstName = safeName.split(' ')[0] || 'Sender';

    const htmlEmail = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>New Portfolio Inquiry</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    p { text-align: justify; }
    a { color: #38bdf8; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 8px !important; }
      .header-cell { padding: 22px 20px 18px !important; }
      .content-cell { padding: 22px 18px !important; }
      .footer-cell { padding: 20px 18px !important; }
      .footer-right { text-align: left !important; margin-top: 10px !important; display: block !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0b0f19;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="background-color:#0b0f19;padding:36px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" align="center">
      <tr>
        <td align="center">
          <table role="presentation" width="580" class="container" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;margin:0 auto;background-color:#111827;border:1px solid #1e293b;border-radius:12px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.45);">
            
            <!-- Top Gradient Line -->
            <tr>
              <td style="height:3px;background:linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #818cf8 100%);"></td>
            </tr>

            <!-- Header -->
            <tr>
              <td class="header-cell" style="padding:24px 36px 20px;border-bottom:1px solid #1e293b;background-color:#0f172a;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:40px;vertical-align:middle;padding-right:12px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);text-align:center;vertical-align:middle;color:#ffffff;font-weight:800;font-size:15px;box-shadow:0 4px 12px rgba(2,132,199,0.35);">
                                  HM
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="vertical-align:middle;">
                            <div style="font-size:15px;font-weight:700;color:#f8fafc;letter-spacing:0.6px;text-transform:uppercase;">HEMANSHU MAHAJAN</div>
                            <div style="font-size:12px;color:#94a3b8;margin-top:2px;">DevOps &amp; Cloud Engineering</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="display:inline-block;padding:5px 12px;font-size:11px;font-weight:600;color:#38bdf8;background-color:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);border-radius:9999px;letter-spacing:0.5px;text-transform:uppercase;">
                        &#x26A1; New Inquiry
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td class="content-cell" style="padding:28px 36px;">
                
                <!-- Sender Info Card -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border:1px solid #334155;border-radius:10px;margin-bottom:24px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:44px;vertical-align:middle;padding-right:14px;">
                            <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg, #0284c7, #2563eb);color:#ffffff;font-size:18px;font-weight:700;text-align:center;line-height:44px;">
                              ${safeName.charAt(0).toUpperCase()}
                            </div>
                          </td>
                          <td style="vertical-align:middle;">
                            <div style="font-size:16px;font-weight:600;color:#f8fafc;">
                              &#x1F464; ${safeName}
                            </div>
                            <div style="margin-top:4px;">
                              <a href="mailto:${safeEmail}" style="font-size:13px;color:#38bdf8;text-decoration:none;">
                                &#x2709;&#xFE0F; ${safeEmail}
                              </a>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <div style="margin-top:14px;padding-top:12px;border-top:1px solid #334155;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="font-size:12px;color:#94a3b8;">
                              &#x1F552; Received: <span style="color:#cbd5e1;font-weight:500;">${timestamp}</span>
                            </td>
                            <td align="right" style="font-size:12px;color:#94a3b8;">
                              &#x1F310; Origin: <span style="color:#cbd5e1;font-weight:500;">hemanshudev.cloud</span>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Message Section -->
                <div style="margin-bottom:8px;">
                  <span style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">
                    &#x1F4AC; Message Details
                  </span>
                </div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border:1px solid #1e293b;border-left:3px solid #38bdf8;border-radius:6px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 22px;font-size:14px;line-height:1.65;color:#e2e8f0;word-break:break-word;text-align:justify;">
                      <p style="margin:0;padding:0;text-align:justify;line-height:1.65;font-size:14px;color:#e2e8f0;">
                        ${sanitizedMessage}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Quick Action Reply Button -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="border-radius:8px;background:linear-gradient(135deg, #0284c7, #0369a1);box-shadow:0 4px 14px rgba(2,132,199,0.3);">
                            <a href="mailto:${safeEmail}?subject=Re:%20Portfolio%20Inquiry&body=Hi%20${encodeURIComponent(firstName)},%0D%0A%0D%0AThank%20you%20for%20reaching%20out!%0D%0A%0D%0A"
                               style="display:inline-block;padding:12px 32px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.3px;border-radius:8px;">
                              &#x21A9;&#xFE0F; Reply to ${firstName}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer-cell" style="padding:22px 36px;background-color:#0f172a;border-top:1px solid #1e293b;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:12px;color:#64748b;line-height:1.6;">
                      <span style="color:#94a3b8;font-weight:600;">Hemanshu Mahajan</span> &bull; DevOps &amp; Cloud Portfolio<br />
                      Sent securely via Resend from <a href="https://hemanshudev.cloud" style="color:#38bdf8;text-decoration:none;">hemanshudev.cloud</a>
                    </td>
                    <td class="footer-right" align="right" style="vertical-align:middle;font-size:12px;">
                      <a href="https://hemanshudev.cloud" style="color:#94a3b8;text-decoration:none;margin-left:14px;display:inline-block;vertical-align:middle;">
                        &#x1F310; Portfolio
                      </a>
                      <a href="https://github.com/Hemanshubt" style="color:#94a3b8;text-decoration:none;margin-left:14px;display:inline-block;vertical-align:middle;">
                        <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/github-badge/default.svg" width="16" height="16" alt="GitHub" style="vertical-align:middle;margin-right:4px;display:inline-block;border-radius:50%;border:0;" /> GitHub
                      </a>
                      <a href="https://www.linkedin.com/in/hemanshu-mahajan/" style="color:#94a3b8;text-decoration:none;margin-left:14px;display:inline-block;vertical-align:middle;">
                        <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/linkedin-badge/default.svg" width="16" height="16" alt="LinkedIn" style="vertical-align:middle;margin-right:4px;display:inline-block;border-radius:50%;border:0;" /> LinkedIn
                      </a>
                    </td>
                  </tr>
                </table>
                <div style="margin-top:12px;padding-top:10px;border-top:1px solid #1e293b;font-size:11px;color:#475569;text-align:center;">
                  &#x1F512; TLS Encrypted Transmission &bull; SPF &amp; DKIM Authenticated
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;

    const fromAddress = RESEND_FROM || 'Hemanshu Mahajan <contact@hemanshudev.cloud>';
    const toAddress = RESEND_TO || EMAIL_ADDRESS || 'hemanshumahajan55@gmail.com';

    promises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [toAddress],
          reply_to: email,
          subject: `Portfolio Inquiry: ${safeName}`,
          html: htmlEmail,
        }),
      })
        .then(async (r) => {
          const data = await r.json().catch(() => ({}));
          if (!r.ok) {
            console.error('Resend API Error:', r.status, data);
            return { type: 'resend', success: false, error: data?.message || `Resend Error HTTP ${r.status}` };
          }
          console.log('Resend email sent successfully, ID:', data?.id);
          return { type: 'resend', success: true, id: data?.id };
        })
        .catch((err) => {
          console.error('Resend request failed:', err);
          return { type: 'resend', success: false, error: err.message };
        })
    );
  } else {
    console.warn('RESEND_API_KEY not configured in environment.');
  }

  if (promises.length === 0) {
    return res.status(500).json({ error: 'Email service not configured. Please set RESEND_API_KEY in .env.' });
  }

  const results = await Promise.all(promises);
  const anySuccess = results.some(r => r.success);

  if (anySuccess) {
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  }

  const failedErrors = results.map(r => r.error).filter(Boolean).join(', ');
  return res.status(500).json({ error: failedErrors || 'Failed to send message via Resend API' });
}
