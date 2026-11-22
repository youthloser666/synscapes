import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import eventRoutes from './routes/eventRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import archiveRoutes from './routes/archiveRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (such as banner.png and logo.svg) directly if needed
app.use('/assets', express.static('../client/public'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'synscape-backend',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API domain routers
app.use('/api/events', eventRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/newsletter', subscriberRoutes);
app.use('/api/media', mediaRoutes);

// Centralized error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚡ Synscape Server running on http://localhost:${PORT}`);
  });
}

export default app;
