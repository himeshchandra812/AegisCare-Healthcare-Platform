import { Router, Response } from 'express';
import { ambulanceService } from '../services/ambulanceService';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';
import { validateVitalReadings } from '../validation';

export const ambulanceRouter = Router();

/**
 * GET /api/ambulances
 * List all fleet units and status
 */
ambulanceRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const ambulances = ambulanceService.getAllAmbulances();
  res.json({ success: true, data: { ambulances } });
});

/**
 * GET /api/ambulances/:id
 * Get details for a specific ambulance
 */
ambulanceRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const ambulance = ambulanceService.getAmbulanceById(req.params.id);
  if (!ambulance) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ambulance not found' } });
    return;
  }
  res.json({ success: true, data: { ambulance } });
});

/**
 * POST /api/ambulances/:id/vitals
 * Record/stream a new vital telemetry packet from EMT monitor
 */
ambulanceRouter.post(
  '/:id/vitals',
  requireAuth,
  requireRole(['emt', 'doctor', 'ambulance_operator', 'system_admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const ambulance = ambulanceService.getAmbulanceById(req.params.id);
    if (!ambulance) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ambulance not found' } });
      return;
    }

    // Strict validation of vital reading
    const validation = validateVitalReadings(req.body);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid vital signs parameters',
          details: validation.errors,
        },
      });
      return;
    }

    try {
      const reading = await ambulanceService.recordVitalReading(
        {
          ...req.body,
          ambulanceId: ambulance.id,
          caseId: req.body.caseId || ambulance.currentCaseId || 'case-1',
        },
        {
          id: req.user!.userId,
          role: req.user!.role,
          name: req.user!.name,
        },
        req.ip || req.socket.remoteAddress || '127.0.0.1'
      );

      res.status(201).json({ success: true, data: { vitalReading: reading } });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'RECORD_VITALS_FAILED',
          message: err.message || 'Failed to record vital reading',
        },
      });
    }
  }
);

/**
 * GET /api/ambulances/:id/vitals
 * Get history of vitals for the ambulance's active case
 */
ambulanceRouter.get('/:id/vitals', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const ambulance = ambulanceService.getAmbulanceById(req.params.id);
  if (!ambulance) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ambulance not found' } });
    return;
  }

  const caseId = ambulance.currentCaseId || 'case-1';
  const vitals = ambulanceService.getVitalReadings(caseId, ambulance.id);
  res.json({ success: true, data: { vitals } });
});

/**
 * PUT /api/ambulances/:id/corridor
 * Toggle Green Corridor Traffic Signal Pre-emption
 */
ambulanceRouter.put(
  '/:id/corridor',
  requireAuth,
  requireRole(['ambulance_operator', 'emt', 'system_admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { active } = req.body;
    const ambulance = await ambulanceService.toggleGreenCorridor(
      req.params.id,
      Boolean(active),
      {
        id: req.user!.userId,
        role: req.user!.role,
        name: req.user!.name,
      },
      req.ip || req.socket.remoteAddress || '127.0.0.1'
    );

    if (!ambulance) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ambulance not found' } });
      return;
    }

    res.json({
      success: true,
      data: {
        ambulance,
        message: active
          ? 'Green Corridor active. Cyberabad Traffic Police signal pre-emption engaged.'
          : 'Green Corridor deactivated. Normal traffic signal priority restored.',
      },
    });
  }
);
