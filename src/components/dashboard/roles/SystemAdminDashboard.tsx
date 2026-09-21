import React, { useState } from 'react';
import {
  Shield,
  Server,
  Lock,
  Users,
  Activity,
  Bell,
  Sliders,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  EyeOff,
  Terminal,
  Key,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { DEMO_ROLES, DEMO_SYSTEM_STATUS } from '../../../data/mockData';
import { UserRole, ROLE_PERMITTED_VIEWS } from '../../../types';

export const SystemAdminDashboard: React.FC = () => {
  const { setCurrentView, resetSimulatedEmergency, isLargeText, toggleLargeText } = useApp();

  // Broadcast message state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetBroadcastRole, setTargetBroadcastRole] = useState<'all' | UserRole>('all');
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  // Feature Toggles state
  const [featureToggles, setFeatureToggles] = useState({
    aiTriageAssistance: true,
    trafficPreemptionCorridor: true,
    seniorAccessibilityMode: isLargeText,
    abhaConsentEnforcement: true,
    endToEndTelemetryEncryption: true,
  });

  // Simulated Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-9941',
      time: '1 min ago',
      actor: 'Dr. Arjun Rao (Doctor)',
      action: 'Emergency Record Access',
      details: 'Accessed electronic medical profile for Case #EM-HYD-402 under ER Emergency Override protocol.',
      status: 'VERIFIED',
    },
    {
      id: 'AUD-9940',
      time: '4 mins ago',
      actor: 'Ravi Kumar (EMT)',
      action: 'Telemetry Stream Synchronized',
      details: 'Transmitted continuous ECG and SpO2 telemetry packet to receiving trauma ER bay.',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-9939',
      time: '12 mins ago',
      actor: 'Rajesh Reddy (Family Member)',
      action: 'Caregiver Consent Synced',
      details: 'Granted temporary ABHA health record disclosure to receiving trauma center.',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-9938',
      time: '28 mins ago',
      actor: 'Ananya Reddy (Patient)',
      action: '112 SOS Dispatch Initiated',
      details: 'Emergency beacon activated via 1-tap SOS from Jubilee Hills, Hyderabad.',
      status: 'SUCCESS',
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastStatus(`Broadcast alert dispatched to: [${targetBroadcastRole.toUpperCase()}]`);
    setTimeout(() => {
      setBroadcastMessage('');
      setBroadcastStatus(null);
    }, 4000);
  };

  const handleToggle = (key: keyof typeof featureToggles) => {
    setFeatureToggles({ ...featureToggles, [key]: !featureToggles[key] });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="neutral" size="md">
              System Administration
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Vikram Malhotra (SysAdmin)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            System Operations & Security Console
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            AegisCare Telangana Ingress Node: infrastructure health, RBAC permission matrix, audit logs, and demo controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSimulatedEmergency}
            className="text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Scenario</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentView('analytics')}
            className="text-xs"
          >
            System Analytics
          </Button>
        </div>
      </div>

      {broadcastStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-semibold text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{broadcastStatus}</span>
        </div>
      )}

      {/* Cluster Health Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Telemetry Ingress</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">Operational</div>
          <span className="text-[11px] font-semibold text-slate-500">18ms average latency</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Throughput</span>
          <div className="text-2xl font-black text-slate-900 mt-1">1,420 msgs/m</div>
          <span className="text-[11px] font-semibold text-slate-500">Live GPS & Vitals packets</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Active Demo Users</span>
          <div className="text-2xl font-black text-sky-700 mt-1">7 Stakeholders</div>
          <span className="text-[11px] font-semibold text-slate-500">Role-Based Access Active</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Privacy Redaction</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">100% Enforced</div>
          <span className="text-[11px] font-semibold text-slate-500">Zero Unauthorised Leaks</span>
        </div>
      </div>

      {/* Main Grid: Role Permissions Matrix & System Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: RBAC Matrix & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role and Permission Management (Interactive Matrix) */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-700" />
                <span>Role & Permission Structure (RBAC Matrix)</span>
              </h2>
              <Badge variant="info" size="sm">7 Evaluated Roles</Badge>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Granular frontend permission boundaries strictly isolating patient-facing, responder, clinical, and administrative interfaces.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Role</th>
                    <th className="p-3">Persona</th>
                    <th className="p-3">Permitted Modules</th>
                    <th className="p-3">Access Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-medium">
                  {Object.entries(DEMO_ROLES).map(([roleKey, profile]) => {
                    const views = ROLE_PERMITTED_VIEWS[roleKey as UserRole] || [];
                    return (
                      <tr key={roleKey} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{profile.title}</td>
                        <td className="p-3 text-slate-600">{profile.name}</td>
                        <td className="p-3 text-slate-700 font-mono text-[11px]">
                          {views.length} modules ({views.slice(0, 3).join(', ')}...)
                        </td>
                        <td className="p-3">
                          <Badge variant={profile.category === 'Administrative' ? 'neutral' : profile.category === 'Clinical / Hospital' ? 'info' : 'success'} size="sm">
                            {profile.category}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* System Security Audit Logs */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <span>Security & Privacy Audit Logs (Tamper-Resistant)</span>
              </h3>
              <Badge variant="neutral" size="sm">Real-time Stream</Badge>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">[{log.id}] {log.action}</span>
                    <span className="text-slate-500">{log.time}</span>
                  </div>
                  <div className="text-slate-300 font-sans text-xs">
                    Actor: <strong className="text-white">{log.actor}</strong>
                  </div>
                  <div className="text-slate-400 font-sans text-[11px] leading-relaxed">
                    {log.details}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Feature Toggles, Broadcast & Data Controls */}
        <div className="space-y-6">
          {/* Feature Configuration */}
          <Card variant="default" padding="lg">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-700" />
              <span>Feature Configuration</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">AI Triage Assistance</span>
                  <span className="text-slate-500 text-[11px]">Decision-support for patients</span>
                </div>
                <input
                  type="checkbox"
                  checked={featureToggles.aiTriageAssistance}
                  onChange={() => handleToggle('aiTriageAssistance')}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Traffic Pre-emption</span>
                  <span className="text-slate-500 text-[11px]">Hyderabad green corridor signal wave</span>
                </div>
                <input
                  type="checkbox"
                  checked={featureToggles.trafficPreemptionCorridor}
                  onChange={() => handleToggle('trafficPreemptionCorridor')}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">ABHA Consent Framework</span>
                  <span className="text-slate-500 text-[11px]">Enforce India digital health tokens</span>
                </div>
                <input
                  type="checkbox"
                  checked={featureToggles.abhaConsentEnforcement}
                  onChange={() => handleToggle('abhaConsentEnforcement')}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">AES-256 Telemetry Encryption</span>
                  <span className="text-slate-500 text-[11px]">End-to-end encrypted vitals payload</span>
                </div>
                <input
                  type="checkbox"
                  checked={featureToggles.endToEndTelemetryEncryption}
                  onChange={() => handleToggle('endToEndTelemetryEncryption')}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* System Notifications Broadcast */}
          <Card variant="default" padding="lg">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-700" />
              <span>Broadcast System Notification</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Transmit simulated high-priority notifications to specific or all roles.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Stakeholder</label>
                <select
                  value={targetBroadcastRole}
                  onChange={(e) => setTargetBroadcastRole(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="all">All Stakeholders (Broadcast)</option>
                  <option value="patient">Patients Only</option>
                  <option value="family_member">Family Members Only</option>
                  <option value="doctor">Doctors Only</option>
                  <option value="emt">EMT Crew Only</option>
                  <option value="ambulance_operator">Ambulance Operators Only</option>
                  <option value="hospital_admin">Hospital Admins Only</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Message Text</label>
                <input
                  type="text"
                  placeholder="e.g. Mass casualty readiness exercise starting..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full text-xs"
                disabled={!broadcastMessage.trim()}
              >
                Dispatch Broadcast Alert
              </Button>
            </form>
          </Card>

          {/* Demo Data Management */}
          <Card variant="default" padding="lg" className="border-slate-300 bg-slate-50/50">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" />
              <span>Demo Scenario Controls</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Reset or reload the simulated Hyderabad emergency incident for testing.
            </p>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSimulatedEmergency}
                className="w-full text-xs justify-center flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Case #EM-HYD-402 State</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
