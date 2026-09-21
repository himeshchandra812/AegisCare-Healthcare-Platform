import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

// Security and Protection Middleware
import { securityHeaders, rateLimiter, sanitizeInputs } from './server/middleware/securityMiddleware';

// Route handlers
import { authRouter } from './server/routes/authRoutes';
import { patientRouter } from './server/routes/patientRoutes';
import { emergencyRouter } from './server/routes/emergencyRoutes';
import { ambulanceRouter } from './server/routes/ambulanceRoutes';
import { hospitalRouter } from './server/routes/hospitalRoutes';
import { doctorRouter } from './server/routes/doctorRoutes';
import { familyRouter } from './server/routes/familyRoutes';
import { notificationRouter } from './server/routes/notificationRoutes';
import { auditRouter } from './server/routes/auditRoutes';
import { aiTriageRouter } from './server/routes/aiTriageRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers & Rate Limiting
  app.use(securityHeaders);
  app.use('/api', rateLimiter);

  // Request Size Limiting and JSON / URL-encoded body parsers
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(sanitizeInputs);

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AegisCare Emergency Platform API',
      version: '1.0.0-phase1a',
      node: 'Hyderabad-Node-01',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/patients', patientRouter);
  app.use('/api/emergency', emergencyRouter);
  app.use('/api/ambulances', ambulanceRouter);
  app.use('/api/hospitals', hospitalRouter);
  app.use('/api/doctors', doctorRouter);
  app.use('/api/family', familyRouter);
  app.use('/api/notifications', notificationRouter);
  app.use('/api/audit', auditRouter);
  app.use('/api/triage', aiTriageRouter);

  // Global API 404 Handler
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `API endpoint ${req.method} ${req.originalUrl} does not exist`,
      },
    });
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AegisCare] Server running on http://0.0.0.0:${PORT} [Node: Hyderabad]`);
  });
}

startServer();
