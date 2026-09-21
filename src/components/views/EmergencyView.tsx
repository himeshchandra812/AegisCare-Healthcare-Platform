import React, { useState } from 'react';
import {
  AlertTriangle,
  Ambulance,
  Phone,
  ShieldAlert,
  MapPin,
  Clock,
  HeartPulse,
  Hospital,
  User,
  Radio,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DEMO_HOSPITALS, DEMO_PATIENTS } from '../../data/mockData';

export const EmergencyView: React.FC = () => {
  const {
    activeCase,
    triggerSimulatedEmergency,
    resetSimulatedEmergency,
    isSimulatedDispatchActive,
    isSubmittingSOS,
    currentRoleProfile,
    setCurrentView,
    t,
  } = useApp();

  const [selectedHospital, setSelectedHospital] = useState(DEMO_HOSPITALS[0].id);
  const patient = DEMO_PATIENTS[0];

  const getSyncStatusBadge = (status?: string) => {
    switch (status) {
      case 'synced_server':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Prototype Server Synced
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            Transmitting SOS...
          </span>
        );
      case 'sync_error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Local Fallback (Sync Failed)
          </span>
        );
      case 'local_demo':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            Local Demo Mode
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Real Emergency Warning Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-red-100 border-2 border-red-400 text-red-950 flex items-start gap-3">
        <ShieldAlert className="w-7 h-7 text-red-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-lg font-black text-red-950">
            SAFETY NOTICE: PROTOTYPE SIMULATION ONLY — NOT CONNECTED TO 112 DISPATCH
          </h2>
          <p className="text-sm text-red-900 leading-relaxed font-medium">
            This module is an interactive demonstration for evaluating rapid response workflows in India. It is <strong>NOT</strong> linked to actual police, fire, or ambulance dispatchers. In an actual medical crisis in India, immediately dial <strong className="text-red-950 underline font-black text-base">112</strong> (National Unified Emergency) or <strong className="text-red-950 underline font-black text-base">108</strong> (Ambulance) on your telephone.
          </p>
        </div>
      </div>

      {/* Main SOS Trigger Card */}
      <Card variant="emergency" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-200/80 text-red-950 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-red-700 animate-pulse" />
              <span>Priority 1 - High Visibility Emergency Trigger (India 112 Relay)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Emergency Assistance & Smart Dispatch
            </h1>
            <p className="text-base text-slate-700 leading-relaxed max-w-2xl">
              1-touch trigger simulates automated cellular/GPS geo-location across Hyderabad, triage dispatch of an ALS Unit 108 ambulance, and instant pre-arrival chart delivery to receiving trauma physicians.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <Button
              variant="emergency"
              size="xl"
              icon={<AlertTriangle className="w-7 h-7 text-white" />}
              onClick={triggerSimulatedEmergency}
              disabled={isSubmittingSOS}
              className="shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isSubmittingSOS ? 'TRANSMITTING SOS...' : 'RUN SIMULATED 112 SOS DISPATCH'}
            </Button>
            {isSimulatedDispatchActive && (
              <button
                onClick={resetSimulatedEmergency}
                disabled={isSubmittingSOS}
                className="text-xs text-slate-600 hover:text-slate-900 text-center py-1 inline-flex items-center justify-center gap-1 cursor-pointer font-medium disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset simulated case</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Active Dispatch Status Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Simulated Emergency Case #{activeCase.caseId}
              </h2>
              <Badge variant={isSimulatedDispatchActive ? 'danger' : 'neutral'} size="md">
                {activeCase.status}
              </Badge>
              {getSyncStatusBadge(activeCase.dispatchSyncStatus)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active persona observing: {currentRoleProfile.name} ({currentRoleProfile.title})
              {activeCase.syncErrorMessage && (
                <span className="block text-amber-700 mt-0.5 font-medium">
                  Notice: {activeCase.syncErrorMessage}
                </span>
              )}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Ambulance className="w-4 h-4" />}
            onClick={() => setCurrentView('smart_ambulance')}
          >
            Track in Smart Ambulance View
          </Button>
        </div>

        {/* Status Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold uppercase">1. SOS Received (112)</span>
            </div>
            <p className="text-xs text-emerald-900 font-medium">GPS: Jubilee Hills, Hyderabad (17.4325° N)</p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold uppercase">2. Unit Dispatched</span>
            </div>
            <p className="text-xs text-emerald-900 font-medium">{activeCase.assignedAmbulance}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-950">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-sky-700" />
              <span className="text-xs font-bold uppercase">3. In Transit (Green Corridor)</span>
            </div>
            <p className="text-xs text-sky-900 font-medium">ETA: ~{activeCase.etaMinutes} minutes</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Hospital className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold uppercase">4. Receiving ER (Apex)</span>
            </div>
            <p className="text-xs text-slate-700 font-medium truncate">Trauma Bay 1 Mobilized</p>
          </div>
        </div>

        {/* Patient Emergency Information transmitted */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-sky-700" />
              <span>Transmitted Medical Passport Data</span>
            </h3>
            <div className="text-xs text-slate-700 space-y-1">
              <div><strong>Patient:</strong> {patient.name}, {patient.age} y/o ({patient.gender})</div>
              <div><strong>Blood Type:</strong> {patient.bloodType}</div>
              <div><strong>Allergies:</strong> {patient.allergies.join(', ')}</div>
              <div><strong>Chronic Conditions:</strong> {patient.chronicConditions.join(', ')}</div>
              <div><strong>Emergency Contact:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.phone})</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>Pre-Arrival Vitals Telemetry (Live Unit 108)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Heart Rate</span>
                <span className="font-bold text-slate-900 text-sm">{activeCase.vitals.heartRate} BPM</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Blood Pressure</span>
                <span className="font-bold text-slate-900 text-sm">{activeCase.vitals.bloodPressure}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Oxygen Sat (SpO2)</span>
                <span className="font-bold text-slate-900 text-sm">{activeCase.vitals.spO2}%</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Respiration Rate</span>
                <span className="font-bold text-slate-900 text-sm">{activeCase.vitals.respRate} /min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
