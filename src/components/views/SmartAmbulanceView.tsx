import React, { useState } from 'react';
import {
  Ambulance,
  Heart,
  Activity,
  PhoneCall,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Clock,
  Battery,
  Wind,
  Navigation,
  ShieldCheck,
  Hospital,
  AlertCircle,
  Thermometer,
  Droplet,
  Zap,
  Volume2,
  Sliders,
  Send,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { DemoAlertsBanner } from '../common/DemoAlertsBanner';
import { HospitalPreArrivalSection } from '../common/HospitalPreArrivalSection';
import { SmartAmbulanceTransportStatus } from '../../types';

export const SmartAmbulanceView: React.FC = () => {
  const {
    smartVitals,
    updateSmartVitals,
    smartAmbulanceId,
    smartAssignedEmt,
    smartAssignedDriver,
    smartCurrentCaseId,
    smartPatientName,
    smartPatientAge,
    smartPatientGender,
    smartDestinationHospital,
    smartTransportStatus,
    setSmartTransportStatus,
    smartEtaMinutes,
    smartGpsLocation,
    smartHospitalPrepStatus,
    smartRequiredCareCategory,
    smartSeverity,
    toggleSmartCritical,
    smartAlerts,
    smartTimeline,
    smartDoctorOrders,
    smartHospitalBay,
    contactHospitalFromAmbulance,
    shareAmbulanceLocation,
    confirmHospitalArrival,
    setIsSimulationControlOpen,
  } = useApp();

  // Modals state
  const [activeModal, setActiveModal] = useState<'vitals' | 'radio' | 'critical' | 'arrival' | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Vitals edit form buffer
  const [editHr, setEditHr] = useState(smartVitals.heartRate);
  const [editSpo2, setEditSpo2] = useState(smartVitals.spO2);
  const [editBp, setEditBp] = useState(smartVitals.bloodPressure);
  const [editResp, setEditResp] = useState(smartVitals.respRate);
  const [editTemp, setEditTemp] = useState(smartVitals.temperature);
  const [editGlucose, setEditGlucose] = useState(smartVitals.bloodGlucose);
  const [editEcg, setEditEcg] = useState(smartVitals.ecgStatus);

  // Push-to-talk voice radio simulation state
  const [isRadioTransmitting, setIsRadioTransmitting] = useState(false);
  const [radioMessage, setRadioMessage] = useState('');

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4500);
  };

  const handleOpenVitalsModal = () => {
    setEditHr(smartVitals.heartRate);
    setEditSpo2(smartVitals.spO2);
    setEditBp(smartVitals.bloodPressure);
    setEditResp(smartVitals.respRate);
    setEditTemp(smartVitals.temperature);
    setEditGlucose(smartVitals.bloodGlucose);
    setEditEcg(smartVitals.ecgStatus);
    setActiveModal('vitals');
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmartVitals({
      heartRate: Number(editHr),
      spO2: Number(editSpo2),
      bloodPressure: editBp,
      respRate: Number(editResp),
      temperature: Number(editTemp),
      bloodGlucose: Number(editGlucose),
      ecgStatus: editEcg,
    });
    setActiveModal(null);
    triggerFeedback('Simulated Vitals updated and transmitted to receiving Trauma Bay.');
  };

  const handleTransmitRadio = () => {
    if (!radioMessage.trim()) return;
    contactHospitalFromAmbulance(radioMessage.trim());
    setRadioMessage('');
    setActiveModal(null);
    triggerFeedback('Radio transmission relayed to Dr. Arjun Rao & Hyderabad Apex ER Trauma Bay 2.');
  };

  const handleToggleTransport = () => {
    if (smartTransportStatus === 'Transport In Progress') {
      setSmartTransportStatus('Transport Paused');
      triggerFeedback('Ambulance transport paused for roadside clinical stabilization.');
    } else {
      setSmartTransportStatus('Transport In Progress');
      triggerFeedback('Ambulance transport active under Hyderabad Green Corridor clearance.');
    }
  };

  const handleShareLocationAction = () => {
    shareAmbulanceLocation();
    triggerFeedback(`GPS Location (${smartGpsLocation.coordinates} - ${smartGpsLocation.address}) broadcast to Hyderabad Traffic Police & Apex ER.`);
  };

  const handleConfirmArrivalAction = () => {
    confirmHospitalArrival();
    setActiveModal(null);
    triggerFeedback('Hospital arrival confirmed. Gurney handover initiated at Hyderabad Apex Trauma Bay 2.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Active Demo Alerts Banner */}
      <DemoAlertsBanner />

      {/* Main Header / Status Banner */}
      <div className="bg-slate-900 text-white rounded-2xl border-2 border-slate-800 p-5 sm:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              108
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {smartAmbulanceId}
                </span>
                <Badge
                  variant={
                    smartTransportStatus === 'Arrived at Hospital'
                      ? 'success'
                      : smartTransportStatus === 'Transport Paused'
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                >
                  {smartTransportStatus}
                </Badge>
                <Badge variant={smartSeverity === 'Critical (Red)' ? 'danger' : 'warning'} size="sm">
                  {smartSeverity}
                </Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Smart Ambulance Telemetry & First-Responder Console
              </h1>
              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
                <span>EMT: <strong>{smartAssignedEmt}</strong></span>
                <span>•</span>
                <span>Driver: <strong>{smartAssignedDriver}</strong></span>
                <span>•</span>
                <span>Case: <strong className="text-amber-300">#{smartCurrentCaseId}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Simulation Link & Handover Status */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setIsSimulationControlOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulation Controls</span>
            </button>
          </div>
        </div>

        {/* Action feedback toast */}
        {actionFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm animate-fade-in border border-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}
      </div>

      {/* Mandatory Prototype Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5 text-xs sm:text-sm">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Prototype Simulation Notice:</strong> This Smart Ambulance workspace demonstrates simulated telemetry, vitals monitoring, corridor clearance, and pre-arrival hospital coordination for Hyderabad. <em>Not connected to real medical devices, GPS satellites, hospital networks, or 108 emergency dispatch systems.</em>
        </div>
      </div>

      {/* CORE INFO CARDS: Patient & Transport Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fictional Patient */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Patient Information (Fictional)
          </span>
          <div className="text-lg font-black text-slate-900 mt-1">
            {smartPatientName}
          </div>
          <div className="text-xs font-medium text-slate-600">
            {smartPatientAge}y • {smartPatientGender} • Blood O+
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">
            Chief Complaint: Acute Chest Tightness
          </div>
        </div>

        {/* Card 2: Destination Hospital */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Destination Hospital
          </span>
          <div className="text-base font-black text-slate-900 mt-1 truncate" title={smartDestinationHospital}>
            {smartDestinationHospital}
          </div>
          <div className="text-xs font-semibold text-emerald-700 mt-0.5">
            ER Assigned: {smartHospitalBay}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Care: {smartRequiredCareCategory}
          </div>
        </div>

        {/* Card 3: Simulated GPS Location */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Simulated GPS Location
          </span>
          <div className="text-sm font-black text-slate-900 mt-1 truncate" title={smartGpsLocation.address}>
            {smartGpsLocation.address}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            {smartGpsLocation.coordinates}
          </div>
          <div className="text-[11px] text-sky-800 font-semibold mt-0.5 truncate">
            {smartGpsLocation.corridorStatus}
          </div>
        </div>

        {/* Card 4: Estimated Arrival & Prep Status */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Estimated Arrival & ER Status
          </span>
          <div className="text-2xl font-black text-sky-700 mt-1">
            {smartTransportStatus === 'Arrived at Hospital' ? 'Arrived' : `~${smartEtaMinutes} mins`}
          </div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">
            Hospital: <span className="text-emerald-700">{smartHospitalPrepStatus}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            High Bandwidth Telemetry Active
          </div>
        </div>
      </div>

      {/* SECTION 1: LIVE MONITORING PANEL WITH 7 SIMULATED VITAL SIGNS */}
      <Card variant="default" padding="lg" className="border-2 border-slate-800 bg-slate-950 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  Live Patient Monitoring Telemetry
                </h2>
                <Badge variant="warning" size="sm">Realistic Simulated Values</Badge>
              </div>
              <p className="text-xs text-slate-400">
                Streaming continuous vitals to Hyderabad Apex Emergency Trauma Bay 2 (14ms latency).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenVitalsModal}
              className="text-xs border-slate-700 text-white hover:bg-slate-800"
            >
              <Activity className="w-3.5 h-3.5 mr-1" />
              Update Vitals
            </Button>
          </div>
        </div>

        {/* 7 VITAL SIGNS TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Heart Rate */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-slate-400 mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Heart Rate</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-rose-400">
              {smartVitals.heartRate}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">BPM (Simulated)</div>
            {smartVitals.heartRate > 110 && (
              <span className="text-[10px] font-bold text-rose-300 block mt-1">High Flag</span>
            )}
          </div>

          {/* 2. SpO2 Oxygen */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>SpO2 Oxygen</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">
              {smartVitals.spO2}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Cannula 4L/min</div>
            {smartVitals.spO2 < 93 && (
              <span className="text-[10px] font-bold text-amber-300 block mt-1">Low O2 Flag</span>
            )}
          </div>

          {/* 3. Blood Pressure */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
              Blood Pressure
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {smartVitals.bloodPressure}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">mmHg (NIBP)</div>
          </div>

          {/* 4. Respiratory Rate */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
              Resp Rate
            </div>
            <div className="text-3xl sm:text-4xl font-black text-sky-400">
              {smartVitals.respRate}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">breaths / min</div>
          </div>

          {/* 5. Body Temperature */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-slate-400 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Body Temp</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
              {smartVitals.temperature}°F
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Tympanic Sensor</div>
          </div>

          {/* 6. Blood Glucose */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-slate-400 mb-1">
              <Droplet className="w-3.5 h-3.5 text-purple-400" />
              <span>Blood Glucose</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">
              {smartVitals.bloodGlucose}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">mg/dL (Capillary)</div>
          </div>

          {/* 7. ECG Status */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col justify-center">
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
              12-Lead ECG
            </div>
            <div className="text-xs font-black text-emerald-400 leading-snug">
              {smartVitals.ecgStatus}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Lead II Continuous</div>
          </div>
        </div>

        {/* Animated ECG Wave Graphic (SVG Simulation) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-emerald-400">Live Waveform Monitor (Lead II):</span>
            <span className="font-mono text-slate-300">Sweep 25 mm/s • 10 mm/mV</span>
          </div>
          <span className="text-[11px] text-slate-500">Not for diagnostic usage</span>
        </div>
      </Card>

      {/* SECTION 2: 7 OPERATIONAL EMT CONTROLS */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">
              EMT Operational Controls (Touch-Optimized)
            </h2>
            <p className="text-xs text-slate-500">
              High-contrast controls with confirmation prompts for in-transit workflow.
            </p>
          </div>
          <Badge variant="neutral" size="sm">7 Actions Configured</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* 1. Update Vitals */}
          <button
            onClick={handleOpenVitalsModal}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center transition-all active:scale-98 cursor-pointer shadow-xs min-h-[96px]"
          >
            <Activity className="w-6 h-6 mb-1.5" />
            <span className="text-xs leading-tight">Update Vitals</span>
            <span className="text-[10px] text-emerald-200 mt-0.5">7 Parameters</span>
          </button>

          {/* 2. Start Transport */}
          <button
            onClick={() => {
              setSmartTransportStatus('Transport In Progress');
              triggerFeedback('Transport initiated. Traffic corridor green wave requested.');
            }}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl font-bold text-center transition-all active:scale-98 cursor-pointer shadow-xs min-h-[96px] ${
              smartTransportStatus === 'Transport In Progress'
                ? 'bg-sky-900 text-sky-200 ring-2 ring-sky-400'
                : 'bg-sky-700 hover:bg-sky-800 text-white'
            }`}
          >
            <Play className="w-6 h-6 mb-1.5" />
            <span className="text-xs leading-tight">Start Transport</span>
            <span className="text-[10px] text-sky-200 mt-0.5">Active Transit</span>
          </button>

          {/* 3. Pause Transport */}
          <button
            onClick={() => {
              setSmartTransportStatus('Transport Paused');
              triggerFeedback('Transport paused for roadside patient stabilization.');
            }}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl font-bold text-center transition-all active:scale-98 cursor-pointer shadow-xs min-h-[96px] ${
              smartTransportStatus === 'Transport Paused'
                ? 'bg-amber-800 text-amber-100 ring-2 ring-amber-300'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Pause className="w-6 h-6 mb-1.5" />
            <span className="text-xs leading-tight">Pause Transport</span>
            <span className="text-[10px] text-amber-100 mt-0.5">Stabilization</span>
          </button>

          {/* 4. Contact Hospital */}
          <button
            onClick={() => setActiveModal('radio')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-center transition-all active:scale-98 cursor-pointer shadow-xs min-h-[96px]"
          >
            <Radio className="w-6 h-6 mb-1.5" />
            <span className="text-xs leading-tight">Contact Hospital</span>
            <span className="text-[10px] text-indigo-200 mt-0.5">Voice / Dispatch</span>
          </button>

          {/* 5. Share Location */}
          <button
            onClick={handleShareLocationAction}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-center transition-all active:scale-98 cursor-pointer shadow-xs min-h-[96px]"
          >
            <MapPin className="w-6 h-6 mb-1.5" />
            <span className="text-xs leading-tight">Share Location</span>
            <span className="text-[10px] text-teal-200 mt-0.5">Traffic Police</span>
          </button>

          {/* 6. Mark Critical */}
          <button
            onClick={() => setActiveModal('critical')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl font-bold text-center transition-all active:scale-98 cursor-pointer shadow-xs min-h-[96px] ${
              smartSeverity === 'Critical (Red)'
                ? 'bg-rose-900 text-white ring-4 ring-rose-400'
                : 'bg-red-700 hover:bg-red-800 text-white'
            }`}
          >
            <AlertTriangle className="w-6 h-6 mb-1.5 animate-pulse" />
            <span className="text-xs leading-tight">
              {smartSeverity === 'Critical (Red)' ? 'Clear Red Alert' : 'Mark Critical'}
            </span>
            <span className="text-[10px] text-red-200 mt-0.5">Trauma Mobilize</span>
          </button>

          {/* 7. Confirm Hospital Arrival */}
          <button
            onClick={() => setActiveModal('arrival')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl font-bold text-center transition-all active:scale-98 cursor-pointer shadow-xs min-h-[96px] ${
              smartTransportStatus === 'Arrived at Hospital'
                ? 'bg-emerald-900 text-emerald-200 ring-2 ring-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-6 h-6 mb-1.5" />
            <span className="text-xs leading-tight">Confirm Arrival</span>
            <span className="text-[10px] text-emerald-200 mt-0.5">Bay Handover</span>
          </button>
        </div>
      </div>

      {/* EMT HOSPITAL PRE-ARRIVAL COORDINATION MODULE (Prompt Section 1) */}
      <HospitalPreArrivalSection />

      {/* SECTION 3: EMERGENCY CASE TIMELINE & HOSPITAL PREPARATION STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-700" />
              <h2 className="text-base font-black text-slate-900">
                Emergency Case Timeline (Case #{smartCurrentCaseId})
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {smartTimeline.length} Chronological Events
            </span>
          </div>

          <div className="space-y-4">
            {smartTimeline.map((item, index) => (
              <div key={item.id} className="flex items-start gap-3 relative">
                {index < smartTimeline.length - 1 && (
                  <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-200"></div>
                )}
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 border-2 border-sky-300 flex items-center justify-center shrink-0 z-10 font-bold text-xs">
                  {index + 1}
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="font-mono text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="mt-1 text-[11px] font-semibold text-sky-800">
                    Source: {item.actor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Preparation & Doctor Orders Sidebar */}
        <div className="space-y-5">
          {/* Hospital Preparation Status Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Hospital className="w-5 h-5 text-emerald-700" />
              <h2 className="text-sm font-black text-slate-900">
                Receiving Hospital Status
              </h2>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] font-bold uppercase text-emerald-800 block">Current Stage</span>
              <div className="text-base font-black text-emerald-950 mt-0.5">
                {smartHospitalPrepStatus}
              </div>
              <div className="text-xs text-emerald-800 mt-1">
                Hyderabad Apex ER • {smartHospitalBay} Reserved
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Cath Lab:</span>
                <strong className="text-slate-900">Team Pre-Alerted</strong>
              </div>
              <div className="flex justify-between">
                <span>Attending Physician:</span>
                <strong className="text-slate-900">Dr. Arjun Rao</strong>
              </div>
              <div className="flex justify-between">
                <span>Door-to-Balloon Goal:</span>
                <strong className="text-emerald-700">&lt; 60 mins</strong>
              </div>
            </div>
          </div>

          {/* Pre-Arrival Orders from Doctor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900">
                Doctor Pre-Arrival Directives
              </h2>
              <Badge variant="info" size="sm">Dr. Arjun Rao</Badge>
            </div>

            <div className="space-y-2">
              {smartDoctorOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{order}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: UPDATE VITALS (ALL 7 PARAMETERS) */}
      {activeModal === 'vitals' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Update Simulated Patient Vitals"
          size="md"
        >
          <form onSubmit={handleSaveVitals} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              Demo values entered here are transmitted in real-time to the attending physician and hospital dashboards.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={editHr}
                  onChange={(e) => setEditHr(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                  min={30}
                  max={220}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  SpO2 Oxygen (%)
                </label>
                <input
                  type="number"
                  value={editSpo2}
                  onChange={(e) => setEditSpo2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                  min={60}
                  max={100}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  value={editBp}
                  onChange={(e) => setEditBp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                  placeholder="120/80"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Respiratory Rate (/min)
                </label>
                <input
                  type="number"
                  value={editResp}
                  onChange={(e) => setEditResp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                  min={6}
                  max={60}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Body Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editTemp}
                  onChange={(e) => setEditTemp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Blood Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  value={editGlucose}
                  onChange={(e) => setEditGlucose(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  12-Lead ECG Status
                </label>
                <select
                  value={editEcg}
                  onChange={(e) => setEditEcg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold bg-white"
                >
                  <option value="Normal Sinus Rhythm (Telemetry Live)">Normal Sinus Rhythm</option>
                  <option value="Sinus Tachycardia (HR > 100 bpm)">Sinus Tachycardia</option>
                  <option value="ST-Segment Elevation in V2-V4 (STEMI Alert)">ST-Segment Elevation (STEMI)</option>
                  <option value="Sinus Bradycardia (HR < 55 bpm)">Sinus Bradycardia</option>
                  <option value="Atrial Fibrillation with Rapid Ventricular Response">Atrial Fibrillation</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button type="button" variant="secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update & Broadcast Vitals
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: CONTACT HOSPITAL (RADIO / DISPATCH) */}
      {activeModal === 'radio' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Direct Radio Intercom: Hyderabad Apex ER Trauma Bay"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Channel 108-HYD-APEX (Secure Relay)</span>
              </div>
              <Badge variant="success" size="sm">Connected</Badge>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div><strong>Receiving Physician:</strong> Dr. Arjun Rao (Emergency Medicine)</div>
              <div><strong>Trauma Bay Station:</strong> Bay 2 Console Active</div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Dispatch Message or Voice Transcript
              </label>
              <textarea
                value={radioMessage}
                onChange={(e) => setRadioMessage(e.target.value)}
                placeholder="e.g., Patient administered 325mg chewable Aspirin. Chest tightness stabilizing. ETA 3 minutes."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onMouseDown={() => setIsRadioTransmitting(true)}
                onMouseUp={() => setIsRadioTransmitting(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isRadioTransmitting
                    ? 'bg-rose-600 text-white ring-4 ring-rose-300'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isRadioTransmitting ? 'Transmitting Audio...' : 'Hold Push-To-Talk'}</span>
              </button>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleTransmitRadio}>
                  Transmit Packet
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: MARK CRITICAL ALERT */}
      {activeModal === 'critical' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Emergency Escalation: Critical Red Alert"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-sm">
                <span className="font-bold block text-base text-rose-900">
                  {smartSeverity === 'Critical (Red)'
                    ? 'Clear Critical Red Alert'
                    : 'Mobilize Hospital Resuscitation Team?'}
                </span>
                {smartSeverity === 'Critical (Red)'
                  ? 'This will de-escalate the case severity back to Urgent (Yellow) across Doctor and Hospital dashboards.'
                  : 'This broadcasts an immediate Priority 1 Red Alert to Dr. Arjun Rao, primes Trauma Bay 2 defibrillators, and requests urgent green corridor priority.'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <strong>Prototype Disclaimer:</strong> Demo Alert — Not connected to real emergency medical systems.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button
                variant={smartSeverity === 'Critical (Red)' ? 'secondary' : 'danger'}
                onClick={() => {
                  toggleSmartCritical();
                  setActiveModal(null);
                  triggerFeedback(
                    smartSeverity === 'Critical (Red)'
                      ? 'Critical alert cleared. System returned to Urgent protocol.'
                      : 'CRITICAL RED ALERT BROADCAST: Hospital Trauma Bay notified!'
                  );
                }}
              >
                {smartSeverity === 'Critical (Red)' ? 'Confirm Clear Red Alert' : 'Confirm Critical Red Alert'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: CONFIRM HOSPITAL ARRIVAL */}
      {activeModal === 'arrival' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Confirm Arrival at Receiving ER"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-teal-950 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold block text-teal-900">
                  Arrived at {smartDestinationHospital}?
                </span>
                This formalizes the arrival at Trauma Bay 2, marks transport status as "Arrived at Hospital", and prompts clinical handover to Dr. Arjun Rao.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmArrivalAction}>
                Confirm Arrival & Handover
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
