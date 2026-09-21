import React, { useState } from 'react';
import {
  Building2,
  Ambulance,
  Bed,
  Users,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Stethoscope,
  BarChart3,
  Layers,
  ArrowRight,
  Heart,
  Wind,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { DemoAlertsBanner } from '../../common/DemoAlertsBanner';
import { IncomingAmbulanceQueue } from '../../common/IncomingAmbulanceQueue';
import { HospitalPreparationStatus } from '../../../types';
import { DEMO_HOSPITALS } from '../../../data/mockData';

export const HospitalAdminDashboard: React.FC = () => {
  const {
    setCurrentView,
    smartVitals,
    smartAmbulanceId,
    smartAssignedEmt,
    smartCurrentCaseId,
    smartPatientName,
    smartPatientAge,
    smartPatientGender,
    smartDestinationHospital,
    smartTransportStatus,
    smartEtaMinutes,
    smartGpsLocation,
    smartHospitalPrepStatus,
    setSmartHospitalPrepStatus,
    smartRequiredCareCategory,
    smartSeverity,
    smartHospitalBay,
    setIsSimulationControlOpen,
  } = useApp();

  const hospital = DEMO_HOSPITALS[0]; // Hyderabad Apex
  const [assignedBayMessage, setAssignedBayMessage] = useState<string | null>(null);

  const handleUpdatePrepStage = (stage: HospitalPreparationStatus) => {
    setSmartHospitalPrepStatus(stage);
    setAssignedBayMessage(`Hospital Preparation updated to: ${stage}`);
    setTimeout(() => setAssignedBayMessage(null), 4000);
  };

  const prepStages: HospitalPreparationStatus[] = [
    'Case Accepted',
    'Preparation in Progress',
    'Ready for Arrival',
    'Case Received',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Active Demo Alerts Banner */}
      <DemoAlertsBanner />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="md">
              Hospital Operations Console
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Medical Superintendent: Dr. K. Srinivasulu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {hospital.name}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time ER capacity, incoming ambulance pre-arrival triage, bed availability, and emergency doctor rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulationControlOpen(true)}
            className="text-xs"
          >
            <Sliders className="w-3.5 h-3.5 mr-1" />
            Simulation Controls
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentView('smart_ambulance')}
            className="text-xs"
          >
            View Live Telemetry
          </Button>
        </div>
      </div>

      {/* Mandatory Demo Data Notice - Required User Rule */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Simulated Demo Data:</strong> All hospital bed capacity, trauma bay readiness, and ambulance queue metrics are strictly simulated for prototype presentation.
          </span>
        </div>
        <Badge variant="warning" size="sm">Simulated Demo Data</Badge>
      </div>

      {assignedBayMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-semibold text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{assignedBayMessage}</span>
        </div>
      )}

      {/* Hospital Key Metrics - All labeled Simulated Demo Data */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Available ER Beds</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {hospital.availableBeds.er} Bays Open
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Simulated Demo Data</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Available ICU Beds</span>
          <div className="text-2xl font-black text-sky-700 mt-1">
            {hospital.availableBeds.icu} Beds Open
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Simulated Demo Data</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Avg Door-to-Doctor</span>
          <div className="text-2xl font-black text-slate-900 mt-1">11 mins</div>
          <span className="text-[11px] font-semibold text-emerald-700">Simulated Demo Data</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">On-Duty ER Doctors</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">4 Physicians</div>
          <span className="text-[11px] font-semibold text-slate-500">Simulated Demo Data</span>
        </div>
      </div>

      {/* HOSPITAL PRE-ARRIVAL COORDINATION: INCOMING QUEUE, RESOURCE PREPARATION & TIMELINE (Sections 2, 4, 5) */}
      <IncomingAmbulanceQueue />

      {/* SECTION 2: RESOURCE AVAILABILITY & STAFFING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="default" padding="lg">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-700" />
            <span>Critical Emergency Readiness</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Blood Bank O-Negative:</span>
              <span className="font-black text-slate-900">8 Units Reserved (Simulated Demo Data)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Emergency CT Scanner:</span>
              <Badge variant="success" size="sm">Operational (Simulated Demo Data)</Badge>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Cath Lab 1:</span>
              <Badge variant="success" size="sm">Pre-Alerted for STEMI</Badge>
            </div>
          </div>
        </Card>

        <Card variant="default" padding="lg">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-700" />
            <span>Staff & Doctor Roster (Current Shift)</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900">Dr. Arjun Rao, MD</div>
              <div className="text-slate-500 text-[11px]">Head of Emergency Medicine • On Floor (Simulated Demo Data)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900">Dr. K. Srinivasulu Reddy</div>
              <div className="text-slate-500 text-[11px]">Interventional Cardiologist • On Standby (Simulated Demo Data)</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
