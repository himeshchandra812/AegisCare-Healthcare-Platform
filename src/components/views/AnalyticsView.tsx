import React, { useState } from 'react';
import {
  BarChart3,
  Clock,
  TrendingUp,
  Activity,
  Layers,
  Calendar,
  AlertCircle,
  Sparkles,
  Ambulance,
  Building2,
  Users,
  Shield,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'ambulance' | 'hospital' | 'system'>('emergency');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="warning" size="md">
              Simulated Analytics Console
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Hyderabad Operational Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Platform Operations & Clinical Analytics
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Operational KPIs, turnaround metrics, fleet availability, and regional hospital response telemetry for Cyberabad & Hyderabad emergency networks.
          </p>
        </div>

        <Badge variant="neutral" size="md" className="self-start md:self-auto">
          Simulated Demo Data
        </Badge>
      </div>

      {/* Analytics Category Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-1">
        {[
          { id: 'emergency', label: 'Emergency Analytics', icon: Activity },
          { id: 'ambulance', label: 'Ambulance Analytics', icon: Ambulance },
          { id: 'hospital', label: 'Hospital Analytics', icon: Building2 },
          { id: 'system', label: 'System Analytics', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'border-sky-700 text-sky-800 bg-sky-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EMERGENCY ANALYTICS */}
      {activeTab === 'emergency' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Avg Response Time
              </span>
              <div className="text-2xl font-black text-slate-900">5.8 mins</div>
              <span className="text-xs text-emerald-700 font-semibold block mt-1">
                ↓ 1.4 min faster with Green Corridor
              </span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Dispatch Time
              </span>
              <div className="text-2xl font-black text-sky-800">1.2 mins</div>
              <span className="text-xs text-slate-500 block mt-1">112 Dispatch Call Center Sync</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Hospital Acceptance Time
              </span>
              <div className="text-2xl font-black text-indigo-800">2.1 mins</div>
              <span className="text-xs text-emerald-700 font-semibold block mt-1">Pre-arrival digital review</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Hospital Prep Time
              </span>
              <div className="text-2xl font-black text-emerald-800">4.5 mins</div>
              <span className="text-xs text-slate-500 block mt-1">Trauma Bay primed before arrival</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default" padding="lg" className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
                <span>Emergency Priority Distribution</span>
                <Badge variant="info" size="sm">Last 30 Days (Demo)</Badge>
              </h2>
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-rose-700">Priority 1 (Critical Red Alert)</span>
                    <span>32% (148 cases)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-amber-700">Priority 2 (Urgent Yellow)</span>
                    <span>48% (222 cases)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-sky-700">Priority 3 (Standard Green)</span>
                    <span>20% (92 cases)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="lg" className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Turnaround Time Breakdown (Simulated)
              </h2>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">On-Scene Stabilization:</span>
                  <span className="font-bold text-slate-900">8.4 mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transit Duration (Average):</span>
                  <span className="font-bold text-slate-900">11.2 mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Gurney-to-ER Wall Offload:</span>
                  <span className="font-bold text-emerald-700">3.8 mins (Pre-arrival optimized)</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: AMBULANCE ANALYTICS */}
      {activeTab === 'ambulance' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Fleet Utilization
              </span>
              <div className="text-2xl font-black text-slate-900">82.4%</div>
              <span className="text-xs text-slate-500 block mt-1">4 Active Regional Units</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Dispatches
              </span>
              <div className="text-2xl font-black text-sky-800">3 Units In Duty</div>
              <span className="text-xs text-emerald-700 font-semibold block mt-1">Unit 108-Hyd-42 In Transit</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Avg Trip Duration
              </span>
              <div className="text-2xl font-black text-indigo-800">18.6 mins</div>
              <span className="text-xs text-slate-500 block mt-1">Dispatch to Handover</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Simulated Delay Reduction
              </span>
              <div className="text-2xl font-black text-emerald-800">3.8 mins Saved</div>
              <span className="text-xs text-slate-500 block mt-1">Siren & Traffic pre-emption</span>
            </Card>
          </div>

          <Card variant="default" padding="lg" className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              Vehicle Maintenance & Availability Status (Hyderabad Fleet)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2 pr-4">Unit ID</th>
                    <th className="py-2 px-4">Vehicle Type</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Oxygen Reserve</th>
                    <th className="py-2 px-4">Next Maintenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 pr-4 font-black text-slate-900">Unit 108-Hyd-42</td>
                    <td className="py-2.5 px-4 font-medium">Advanced Life Support (ALS)</td>
                    <td className="py-2.5 px-4"><Badge variant="warning" size="sm">In Transit</Badge></td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700">96%</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">2026-10-15</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-black text-slate-900">Unit 108-Hyd-15</td>
                    <td className="py-2.5 px-4 font-medium">Basic Life Support (BLS)</td>
                    <td className="py-2.5 px-4"><Badge variant="success" size="sm">Available</Badge></td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700">98%</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">2026-11-01</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-black text-slate-900">Unit 108-Hyd-88</td>
                    <td className="py-2.5 px-4 font-medium">Critical Care Transport</td>
                    <td className="py-2.5 px-4"><Badge variant="info" size="sm">Dispatched</Badge></td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700">90%</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">2026-09-30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: HOSPITAL ANALYTICS */}
      {activeTab === 'hospital' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Incoming ER Cases
              </span>
              <div className="text-2xl font-black text-slate-900">14 Today</div>
              <span className="text-xs text-sky-800 font-semibold block mt-1">1 In-Transit Telemetry</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                ER Bed Utilization
              </span>
              <div className="text-2xl font-black text-indigo-800">78% Occupied</div>
              <span className="text-xs text-slate-500 block mt-1">Trauma Bay 2 Reserved</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                ICU Capacity
              </span>
              <div className="text-2xl font-black text-amber-800">4 Available Beds</div>
              <span className="text-xs text-slate-500 block mt-1">12 Total Cardiac ICU Beds</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Acceptance Rate
              </span>
              <div className="text-2xl font-black text-emerald-800">98.2%</div>
              <span className="text-xs text-slate-500 block mt-1">Zero Emergency Diversions</span>
            </Card>
          </div>

          <Card variant="default" padding="lg" className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              Regional Hospital Triage & Bed Status Summary
            </h2>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 mb-2">
              <strong>Simulated Demo Data:</strong> All bed and ICU capacity numbers are generated for prototype presentation.
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Hyderabad Apex Trauma & Multi-Speciality</span>
                  <span className="text-slate-500">Madhapur, Jubilee Hills Road No. 36</span>
                </div>
                <div className="text-right">
                  <Badge variant="success" size="sm">Trauma Beds: 4 Free</Badge>
                  <span className="text-slate-500 block text-[11px] mt-0.5">ICU: 3 Available</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Telangana Institute of Cardiac Sciences</span>
                  <span className="text-slate-500">Banjara Hills Road No. 12</span>
                </div>
                <div className="text-right">
                  <Badge variant="info" size="sm">Cath Lab: Ready</Badge>
                  <span className="text-slate-500 block text-[11px] mt-0.5">ICU: 2 Available</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: SYSTEM ANALYTICS */}
      {activeTab === 'system' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Demo Sessions
              </span>
              <div className="text-2xl font-black text-slate-900">7 User Roles</div>
              <span className="text-xs text-slate-500 block mt-1">Multi-Persona Switcher Active</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Notification Dispatches
              </span>
              <div className="text-2xl font-black text-sky-800">42 Triggered</div>
              <span className="text-xs text-slate-500 block mt-1">Simulated Push & Role Alerts</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Audit Trail Logs
              </span>
              <div className="text-2xl font-black text-indigo-800">12 Audit Records</div>
              <span className="text-xs text-emerald-700 font-semibold block mt-1">Consent Verified</span>
            </Card>

            <Card variant="default" padding="md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                System Uptime (Demo)
              </span>
              <div className="text-2xl font-black text-emerald-800">99.9%</div>
              <span className="text-xs text-slate-500 block mt-1">Client State Managed</span>
            </Card>
          </div>

          <Card variant="default" padding="lg" className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              Prototype Security Audit & Consent Logs
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center font-mono">
                <div>
                  <span className="font-bold text-slate-900 block">Dr. Arjun Rao accessed Medical Profile (ID: PAT-HYD-9042)</span>
                  <span className="text-slate-500">Reason: Emergency Pre-Arrival Triage Triage</span>
                </div>
                <Badge variant="success" size="sm">Consent: Active</Badge>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center font-mono">
                <div>
                  <span className="font-bold text-slate-900 block">Unit 108 Paramedic transmitted Live Vitals Telemetry</span>
                  <span className="text-slate-500">Destination: Hyderabad Apex Trauma Bay 2</span>
                </div>
                <Badge variant="info" size="sm">Encrypted Demo</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

