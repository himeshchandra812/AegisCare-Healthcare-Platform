import React, { useState } from 'react';
import {
  Sliders,
  Activity,
  AlertTriangle,
  Ambulance,
  Building2,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap,
  Square,
  FastForward,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from './Button';
import { Badge } from './Badge';
import {
  SmartAmbulanceTransportStatus,
  HospitalPreparationStatus,
  PreArrivalNotificationStatus,
} from '../../types';

export const SimulationControlPanel: React.FC = () => {
  const {
    isSimulationControlOpen,
    setIsSimulationControlOpen,
    smartVitals,
    updateSmartVitals,
    smartTransportStatus,
    setSmartTransportStatus,
    smartHospitalPrepStatus,
    setSmartHospitalPrepStatus,
    smartSeverity,
    toggleSmartCritical,
    smartSimulatedConsent,
    toggleSmartConsent,
    triggerSimulationPreset,

    // Pre-Arrival Coordination Simulation
    preArrivalStatus,
    setManualPreArrivalStatus,
    isDemoScenarioRunning,
    demoScenarioCurrentStep,
    demoScenarioMessage,
    runDemoScenario,
    cancelDemoScenario,
    rejectPreArrivalCase,
  } = useApp();

  const [customHr, setCustomHr] = useState(smartVitals.heartRate);
  const [customSpo2, setCustomSpo2] = useState(smartVitals.spO2);
  const [customBp, setCustomBp] = useState(smartVitals.bloodPressure);
  const [customTemp, setCustomTemp] = useState(smartVitals.temperature);
  const [customGlucose, setCustomGlucose] = useState(smartVitals.bloodGlucose);

  if (!isSimulationControlOpen) {
    return (
      <aside aria-label="Simulation Controls Floating Trigger">
        <button
          onClick={() => setIsSimulationControlOpen(true)}
          className="fixed bottom-4 right-4 z-40 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg border-2 border-emerald-400 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Open Demo Simulation Controller"
        >
          <Sliders className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <span>Demo Simulation Controls</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      </aside>
    );
  }

  const transportStages: SmartAmbulanceTransportStatus[] = [
    'Standby',
    'En Route to Scene',
    'At Scene - Patient Loaded',
    'Transport In Progress',
    'Transport Paused',
    'Arrived at Hospital',
  ];

  const preArrivalStatuses: PreArrivalNotificationStatus[] = [
    'Not Sent',
    'Sent',
    'Received',
    'Under Review',
    'Accepted',
    'Preparation in Progress',
    'Ready for Arrival',
    'Rejected',
  ];

  const handleApplyCustomVitals = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmartVitals({
      heartRate: Number(customHr),
      spO2: Number(customSpo2),
      bloodPressure: customBp,
      temperature: Number(customTemp),
      bloodGlucose: Number(customGlucose),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-scale-in">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Emergency Coordination Simulation Controller</h3>
                <Badge variant="warning" size="sm">Presenter Tool</Badge>
              </div>
              <p className="text-xs text-slate-300">
                Trigger real-time telemetry events, pre-arrival status transitions, and multi-role scenarios.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSimulationControlOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Simulation Controls"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Disclaimer */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo Controller: Generates simulated telemetry events. Not connected to real medical equipment or 108 GPS.</span>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Section 0: Automated 7-Stage Pre-Arrival Coordination Runner (Section 7 of Prompt) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 via-indigo-50 to-slate-50 border-2 border-sky-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FastForward className="w-4 h-4 text-sky-700" />
                <span className="text-xs font-black uppercase tracking-wider text-sky-950">
                  7-Stage Coordination Scenario Runner
                </span>
              </div>
              {isDemoScenarioRunning && (
                <Badge variant="info" size="sm">
                  Active Running (Stage {demoScenarioCurrentStep}/7)
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Automates the complete end-to-end lifecycle: Departure &rarr; Notification &rarr; Hospital Review &rarr; Acceptance &rarr; Resource Preparation &rarr; Ready &rarr; Ambulance Arrival.
            </p>

            {isDemoScenarioRunning && (
              <div className="p-2.5 bg-white rounded-lg border border-sky-200 text-xs font-bold text-sky-900 mb-3 animate-pulse">
                {demoScenarioMessage}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {!isDemoScenarioRunning ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={runDemoScenario}
                  className="bg-sky-700 hover:bg-sky-800 text-white font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run 7-Stage Coordination Scenario</span>
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={cancelDemoScenario}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Scenario</span>
                </Button>
              )}

              {/* Diversion testing scenario button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  rejectPreArrivalCase('Simulated Testing: Emergency Bay at 100% capacity; diverting.')
                }
                className="text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 text-xs font-bold"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Test Hospital Diversion / Rejection</span>
              </Button>
            </div>
          </div>

          {/* Section 1: Manual Override of Pre-Arrival Status (Section 7 Prompt requirement) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                1. Manual Override of Pre-Arrival Notification Status
              </span>
              <span className="text-xs font-bold text-sky-800">Current: {preArrivalStatus}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {preArrivalStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setManualPreArrivalStatus(status)}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all text-left cursor-pointer ${
                    preArrivalStatus === status
                      ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Quick Presets */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              2. Quick Clinical Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => triggerSimulationPreset('vital_spike')}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <Zap className="w-4 h-4 text-rose-600" />
                  <span>Spike Vitals (Tachycardia)</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  HR 118, SpO2 91%, BP 162/104. Triggers demo threshold alert.
                </div>
              </button>

              <button
                type="button"
                onClick={() => triggerSimulationPreset('vital_stabilize')}
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Stabilize Vitals (Normal)</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  HR 80, SpO2 98%, BP 124/80. Clears telemetry alerts.
                </div>
              </button>

              <button
                type="button"
                onClick={() => triggerSimulationPreset('critical_stemi')}
                className="p-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Acute STEMI Telemetry</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Elevates ST waves, pre-alerts Primary PCI team & Cath Lab.
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Transport Status Manual Controls */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              3. Ambulance Transport Lifecycle State
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {transportStages.map((stage) => {
                const isActive = smartTransportStatus === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setSmartTransportStatus(stage)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{stage}</span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Custom Vital Telemetry Editor */}
          <form onSubmit={handleApplyCustomVitals} className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              4. Custom Simulated Vital Telemetry Editor
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={customHr}
                  onChange={(e) => setCustomHr(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                  min={30}
                  max={220}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  value={customSpo2}
                  onChange={(e) => setCustomSpo2(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                  min={70}
                  max={100}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  value={customBp}
                  onChange={(e) => setCustomBp(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                  placeholder="120/80"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Temp (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customTemp}
                  onChange={(e) => setCustomTemp(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  value={customGlucose}
                  onChange={(e) => setCustomGlucose(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Values outside normal thresholds automatically generate demo telemetry alerts.
              </span>
              <Button type="submit" variant="primary" size="sm">
                Transmit Vitals Packet
              </Button>
            </div>
          </form>

          {/* Section 5: Simulated Consent Toggle */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Simulated Patient Emergency Consent (ABHA Data Sharing)
              </span>
              <span className="text-[11px] text-slate-600">
                {smartSimulatedConsent
                  ? 'Active: Doctor can see full medical history & allergies.'
                  : 'Restricted: Detailed medical profile is masked.'}
              </span>
            </div>
            <Button
              variant={smartSimulatedConsent ? 'outline' : 'secondary'}
              size="sm"
              onClick={toggleSmartConsent}
            >
              {smartSimulatedConsent ? 'Simulate Restrict Consent' : 'Simulate Grant Consent'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Prototype Simulation Console • Indian Healthcare EMS (108 Hyderabad)</span>
          <Button variant="secondary" size="sm" onClick={() => setIsSimulationControlOpen(false)}>
            Close Controls
          </Button>
        </div>
      </div>
    </div>
  );
};
