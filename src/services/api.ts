/**
 * AegisCare API Client Service
 * Strongly typed HTTP client with token injection & error handling
 */

export const TOKEN_STORAGE_KEY = 'aegiscare_session_token';
export const USER_STORAGE_KEY = 'aegiscare_session_user';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AuthSessionUser {
  id: string;
  email: string;
  role: string;
  name: string;
  title: string;
  avatarInitials: string;
  phone: string;
  departmentOrAffiliation?: string;
  associatedHospitalId?: string;
  associatedAmbulanceId?: string;
  associatedPatientId?: string;
}

export function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: AuthSessionUser): void {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save session to storage', e);
  }
}

export function clearStoredSession(): void {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear storage', e);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const json = (await response.json()) as ApiResponse<T>;
    return json;
  } catch (err: any) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err?.message || 'Network request failed',
      },
    };
  }
}

export const api = {
  // --- Auth ---
  getDemoAccounts: () => request<{ accounts: any[]; notice: string }>('/api/auth/demo-accounts'),

  login: (credentials: { email: string; password?: string; role?: string }) =>
    request<{ token: string; user: AuthSessionUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => request<{ user: AuthSessionUser }>('/api/auth/me'),

  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
    }),

  // --- Patients & Medical Profiles ---
  getPatients: () => request<{ patients: any[] }>('/api/patients'),

  getPatient: (patientId: string) => request<{ patient: any }>(`/api/patients/${patientId}`),

  getMedicalProfile: (patientId: string) =>
    request<{ medicalProfile: any }>(`/api/patients/${patientId}/medical-profile`),

  updateMedicalProfile: (patientId: string, updates: any) =>
    request<{ medicalProfile: any }>(`/api/patients/${patientId}/medical-profile`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // --- Emergency Cases ---
  getEmergencyCases: () => request<{ cases: any[] }>('/api/emergency/cases'),

  getEmergencyCase: (caseId: string) => request<{ case: any }>(`/api/emergency/cases/${caseId}`),

  triggerSOS: (data: {
    chiefComplaint?: string;
    severity?: string;
    pickupAddress?: string;
    lat?: number;
    lng?: number;
    clientRequestId?: string;
  }) =>
    request<{ case: any; message: string; isDuplicate?: boolean; dispatchSyncStatus?: string }>('/api/emergency/sos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEmergencyCaseStatus: (caseId: string, status: string, note?: string) =>
    request<{ case: any }>(`/api/emergency/cases/${caseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    }),

  // --- Ambulances & Vitals ---
  getAmbulances: () => request<{ ambulances: any[] }>('/api/ambulances'),

  getAmbulance: (id: string) => request<{ ambulance: any }>(`/api/ambulances/${id}`),

  streamVitals: (ambulanceId: string, vitals: any) =>
    request<{ vitalReading: any }>(`/api/ambulances/${ambulanceId}/vitals`, {
      method: 'POST',
      body: JSON.stringify(vitals),
    }),

  getVitalsHistory: (ambulanceId: string) =>
    request<{ vitals: any[] }>(`/api/ambulances/${ambulanceId}/vitals`),

  toggleGreenCorridor: (ambulanceId: string, active: boolean) =>
    request<{ ambulance: any; message: string }>(`/api/ambulances/${ambulanceId}/corridor`, {
      method: 'PUT',
      body: JSON.stringify({ active }),
    }),

  // --- Hospitals & Resources ---
  getHospitals: () => request<{ hospitals: any[] }>('/api/hospitals'),

  updateHospitalBeds: (hospitalId: string, availableBeds: number, availableIcuBeds: number) =>
    request<{ hospital: any }>(`/api/hospitals/${hospitalId}/beds`, {
      method: 'PUT',
      body: JSON.stringify({ availableBeds, availableIcuBeds }),
    }),

  getHospitalResourcePreps: (hospitalId: string) =>
    request<{ resourcePreps: any[] }>(`/api/hospitals/${hospitalId}/resource-preps`),

  updateHospitalResourcePrep: (caseId: string, prepData: any) =>
    request<{ resourcePrep: any }>(`/api/hospitals/resource-preps/${caseId}`, {
      method: 'PUT',
      body: JSON.stringify(prepData),
    }),

  // --- Doctors & Clinical Orders ---
  getDoctors: () => request<{ doctors: any[] }>('/api/doctors'),

  getClinicalOrders: (caseId: string) =>
    request<{ orders: any[] }>(`/api/doctors/orders/${caseId}`),

  createClinicalOrder: (order: { caseId: string; orderText: string; category?: string }) =>
    request<{ order: any }>('/api/doctors/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),

  updateOrderStatus: (orderId: string, status: string) =>
    request<{ order: any }>(`/api/doctors/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // --- Family & Consents ---
  getFamilyRelationships: () => request<{ relationships: any[] }>('/api/family/relationships'),

  getPatientConsents: (patientId: string) =>
    request<{ consents: any[] }>(`/api/family/consents/${patientId}`),

  toggleConsent: (patientId: string, authorizedUserId: string, active: boolean) =>
    request<{ consent: any }>('/api/family/consents/toggle', {
      method: 'POST',
      body: JSON.stringify({ patientId, authorizedUserId, active }),
    }),

  // --- Notifications ---
  getNotifications: () => request<{ notifications: any[] }>('/api/notifications'),

  markNotificationRead: (id: string) =>
    request(`/api/notifications/${id}/read`, {
      method: 'PUT',
    }),

  // --- Audit Logs ---
  getAuditLogs: (limit = 100) => request<{ logs: any[] }>(`/api/audit/logs?limit=${limit}`),

  // --- AI Pre-Triage ---
  requestTriageGuidance: (symptomQuery: string, language?: string) =>
    request<{ guidance: string; isEmergency: boolean; disclaimer: string }>('/api/triage/assist', {
      method: 'POST',
      body: JSON.stringify({ symptomQuery, language }),
    }),
};
