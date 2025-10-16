import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectToDatabase } from './db/connect.js';
import plansRouter from './routes/plans.js';

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN, credentials: false }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'smart-task-planner' });
});

app.use('/api/plans', plansRouter);

// Global 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

const start = async () => {
  await connectToDatabase(config.MONGODB_URI);
  app.listen(config.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${config.PORT}`);
  });
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


