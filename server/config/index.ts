/**
 * AegisCare Server Configuration & Environment Declarations
 * Hyderabad Node Emergency Healthcare Platform
 */

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'aegiscare-hyderabad-emergency-secure-token-secret-2026',
  jwtExpiresInHours: 24,
  corsOrigins: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'],
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 120, // 120 requests per minute per IP
  },
  systemNode: 'Hyderabad-Node-01',
  version: '1.0.0-phase1a',
  demoMode: true,
  isPrototype: true,
};

export const ROLES = {
  PATIENT: 'patient',
  FAMILY_MEMBER: 'family_member',
  DOCTOR: 'doctor',
  EMT: 'emt',
  AMBULANCE_OPERATOR: 'ambulance_operator',
  HOSPITAL_ADMIN: 'hospital_admin',
  SYSTEM_ADMIN: 'system_admin',
} as const;

export type AppRole = typeof ROLES[keyof typeof ROLES];
