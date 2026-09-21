import { Router, Response } from 'express';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';

export const notificationRouter = Router();

/**
 * GET /api/notifications
 * Get notifications for current user and role
 */
notificationRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const notifs = db.getNotificationsForUser(user.userId, user.role);
  res.json({ success: true, data: { notifications: notifs } });
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
notificationRouter.put('/:id/read', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const success = await db.markNotificationRead(req.params.id);
  res.json({ success, data: { message: 'Notification updated' } });
});
