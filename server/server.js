const express = require('express');
const cors = require('cors');

const app = express();
const corsOriginEnv = process.env.CORS_ORIGIN;
const corsOrigins = corsOriginEnv
  ? corsOriginEnv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : '*';

app.use(
  cors({
    origin: corsOrigins,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the portfolio backend!' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  console.log('Contact submission:', { name, email, message });
  // In a real app you'd send an email or save the message. Here we just acknowledge.
  res.json({ status: 'ok', received: { name, email, message } });
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
