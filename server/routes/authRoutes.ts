import { Router, Response } from 'express';
import { db } from '../db/database';
import { verifyPassword, generateAuthToken } from '../auth/tokens';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { UserRole } from '../db/schema';

export const authRouter = Router();

/**
 * GET /api/auth/demo-accounts
 * Return list of demo accounts for testing in prototype mode
 */
authRouter.get('/demo-accounts', (req, res) => {
  const users = db.getAllUsers();
  const demoList = users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    name: u.name,
    title: u.title,
    avatarInitials: u.avatarInitials,
    phone: u.phone,
    departmentOrAffiliation: u.departmentOrAffiliation,
    plainPasswordHint: 'demo123',
  }));

  res.json({
    success: true,
    data: {
      accounts: demoList,
      notice: 'Demo accounts provided for prototype development and sandbox review.',
    },
  });
});

/**
 * POST /api/auth/login
 * Verify credentials and return signed JWT-compatible token with user profile
 */
authRouter.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required' },
    });
    return;
  }

  // Find user by email or by demo role if email not fully specified
  let user = db.findUserByEmail(String(email).trim());
  if (!user && role) {
    user = db.findUserByRole(String(role));
  }

  if (!user) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    });
    return;
  }

  // Validate password
  const isValid = verifyPassword(String(password), user.passwordHash, user.salt);
  if (!isValid) {
    // Audit failed login
    await db.logAuditEvent({
      actorId: user.id,
      actorRole: user.role,
      actorName: user.name,
      actionType: 'ACCESS_DENIED',
      resourceType: 'User',
      resourceId: user.id,
      reason: `Failed login attempt with invalid password for ${user.email}`,
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      status: 'DENIED',
    });

    res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    });
    return;
  }

  // Generate cryptographic auth token
  const token = generateAuthToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    associatedHospitalId: user.associatedHospitalId,
    associatedAmbulanceId: user.associatedAmbulanceId,
    associatedPatientId: user.associatedPatientId,
  });

  // Log successful login audit event
  await db.logAuditEvent({
    actorId: user.id,
    actorRole: user.role,
    actorName: user.name,
    actionType: 'LOGIN',
    resourceType: 'User',
    resourceId: user.id,
    reason: `Successful authentication for role ${user.role}`,
    ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
    status: 'SUCCESS',
  });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        title: user.title,
        avatarInitials: user.avatarInitials,
        phone: user.phone,
        departmentOrAffiliation: user.departmentOrAffiliation,
        associatedHospitalId: user.associatedHospitalId,
        associatedAmbulanceId: user.associatedAmbulanceId,
        associatedPatientId: user.associatedPatientId,
      },
    },
  });
});

/**
 * GET /api/auth/me
 * Validate current token and return authenticated user
 */
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
    return;
  }

  const user = db.findUserById(req.user.userId);
  if (!user) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        title: user.title,
        avatarInitials: user.avatarInitials,
        phone: user.phone,
        departmentOrAffiliation: user.departmentOrAffiliation,
        associatedHospitalId: user.associatedHospitalId,
        associatedAmbulanceId: user.associatedAmbulanceId,
        associatedPatientId: user.associatedPatientId,
      },
    },
  });
});

/**
 * POST /api/auth/logout
 * Terminate session and record audit event
 */
authRouter.post('/logout', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    await db.logAuditEvent({
      actorId: req.user.userId,
      actorRole: req.user.role,
      actorName: req.user.name,
      actionType: 'LOGOUT',
      resourceType: 'User',
      resourceId: req.user.userId,
      reason: 'User initiated explicit sign out',
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      status: 'SUCCESS',
    });
  }

  res.json({
    success: true,
    data: { message: 'Signed out successfully' },
  });
});
