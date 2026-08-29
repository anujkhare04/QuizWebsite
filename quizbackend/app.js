const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();

const routes = require('./src/router/createquiz.js');
const authroutes = require('./routes/route.js');

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://quiz-website-gules-seven.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean).map(url => url.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        /^https:\/\/quiz-website-.*\.vercel\.app$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(['/api/quiz', '/quiz'], routes);
app.use(['/api/auth', '/auth'], authroutes);

app.get(['/api/health', '/health'], (req, res) =>
  res.status(200).json({ status: 'ok', message: 'Backend is live' })
);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found', path: req.originalUrl });
});

module.exports = app;
