const nodemailer = require('nodemailer');

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Use Gmail SMTP via environment variables set in Vercel dashboard:
  //   GMAIL_USER = your Gmail address (e.g. yourname@gmail.com)
  //   GMAIL_PASS = your Gmail App Password (16-character, not your normal password)
  //   CONTACT_EMAIL = where to receive messages (can be same as GMAIL_USER)
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;
  const contactEmail = process.env.CONTACT_EMAIL || gmailUser;

  if (!gmailUser || !gmailPass) {
    // Graceful degradation — log but don't crash
    console.warn('Email env vars not set. Logging contact submission:', { name, email, message });
    return res.status(200).json({ status: 'ok', note: 'logged (email not configured)' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Email to portfolio owner
    await transporter.sendMail({
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: contactEmail,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f7f7fb;border-radius:12px;">
          <h2 style="color:#7c5cff;margin-top:0;">New Portfolio Contact ✉️</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#555;font-weight:600;width:80px;">Name</td><td style="padding:8px 0;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#555;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:16px 0;">
          <p style="color:#333;line-height:1.6;white-space:pre-wrap;">${message}</p>
          <p style="color:#aaa;font-size:12px;margin-top:24px;">Sent via your portfolio contact form.</p>
        </div>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Buddhika Darshan" <${gmailUser}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f7f7fb;border-radius:12px;">
          <h2 style="color:#7c5cff;margin-top:0;">Thanks for your message! 👋</h2>
          <p style="color:#333;line-height:1.6;">Hi <strong>${name}</strong>,</p>
          <p style="color:#333;line-height:1.6;">I've received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
          <p style="color:#333;line-height:1.6;">Best regards,<br><strong>Buddhika Darshan</strong></p>
          <p style="color:#aaa;font-size:12px;margin-top:24px;">This is an automated reply from my portfolio contact form.</p>
        </div>
      `,
    });

    return res.status(200).json({ status: 'ok', message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
};

module.exports = allowCors(handler);
