/**
 * AegisCare Authentication Service
 * Password verification, PBKDF2 hashing, and Token management
 */

import { db } from '../db/database';
import { hashPassword, verifyPassword, generateAuthToken } from '../auth/tokens';
import { DBUser, DBMockCredential, UserRole } from '../models';

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    title: string;
    avatarInitials: string;
    phone: string;
    associatedHospitalId?: string;
    associatedAmbulanceId?: string;
    associatedPatientId?: string;
  };
}

export class AuthService {
  /**
   * Authenticates user via email and password
   */
  public async login(email: string, passwordAttempt: string, ipAddress = '127.0.0.1'): Promise<LoginResult> {
    const user = db.findUserByEmail(email);

    if (!user) {
      await db.logAuditEvent({
        actorId: 'anonymous',
        actorRole: 'patient',
        actorName: 'Unknown',
        actionType: 'LOGIN',
        resourceType: 'User',
        resourceId: 'auth',
        reason: `Failed login attempt for non-existent email: ${email}`,
        ipAddress,
        status: 'DENIED',
      });
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new Error('ACCOUNT_INACTIVE');
    }

    const isMatch = verifyPassword(passwordAttempt, user.passwordHash, user.salt);
    if (!isMatch) {
      await db.logAuditEvent({
        actorId: user.id,
        actorRole: user.role,
        actorName: user.name,
        actionType: 'LOGIN',
        resourceType: 'User',
        resourceId: user.id,
        reason: `Failed login attempt for ${user.email} (incorrect password)`,
        ipAddress,
        status: 'DENIED',
      });
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate HMAC-SHA256 Token
    const token = generateAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      associatedHospitalId: user.associatedHospitalId,
      associatedAmbulanceId: user.associatedAmbulanceId,
      associatedPatientId: user.associatedPatientId,
    });

    // Log Successful Login Audit Event
    await db.logAuditEvent({
      actorId: user.id,
      actorRole: user.role,
      actorName: user.name,
      actionType: 'LOGIN',
      resourceType: 'User',
      resourceId: user.id,
      reason: `User authenticated successfully as ${user.role} (${user.name})`,
      ipAddress,
      status: 'SUCCESS',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        title: user.title,
        avatarInitials: user.avatarInitials,
        phone: user.phone,
        associatedHospitalId: user.associatedHospitalId,
        associatedAmbulanceId: user.associatedAmbulanceId,
        associatedPatientId: user.associatedPatientId,
      },
    };
  }

  /**
   * Returns list of demo accounts for the prototype environment
   */
  public getDemoAccounts() {
    return db.getDemoCredentials();
  }

  /**
   * Logs out user and writes an audit event
   */
  public async logout(user: { userId: string; role: UserRole; name: string }, ipAddress = '127.0.0.1'): Promise<void> {
    await db.logAuditEvent({
      actorId: user.userId,
      actorRole: user.role,
      actorName: user.name,
      actionType: 'LOGOUT',
      resourceType: 'User',
      resourceId: user.userId,
      reason: `User ${user.name} (${user.role}) signed out`,
      ipAddress,
      status: 'SUCCESS',
    });
  }
}

export const authService = new AuthService();
