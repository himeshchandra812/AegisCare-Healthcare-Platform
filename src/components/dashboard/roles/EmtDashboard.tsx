import React, { useState } from 'react';
import {
  Ambulance,
  Activity,
  Heart,
  Radio,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Phone,
  Send,
  Sliders,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  FileText,
  User,
  CheckSquare,
  Square,
  Layers,
  Thermometer,
  Wind,
  Droplet,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { DemoAlertsBanner } from '../../common/DemoAlertsBanner';
import { SmartAmbulanceTransportStatus } from '../../../types';
import { DEMO_PATIENTS, DEMO_HOSPITALS, DEMO_ROLES } from '../../../data/mockData';

export const EmtDashboard: React.FC = () => {
  const {
    setCurrentView,
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
    smartHospitalBay,
    preArrivalStatus,
    sendPreArrivalNotification,
    contactHospitalFromAmbulance,
    smartSimulatedConsent,
    toggleSmartConsent,
    setIsSimulationControlOpen,
    logout,
  } = useApp();

  const emtProfile = DEMO_ROLES.emt;
  const patient = DEMO_PATIENTS[0];
  const hospital = DEMO_HOSPITALS[0];

  // EMT Radio message
  const [radioMsg, setRadioMsg] = useState('');
  const [radioFeedback, setRadioFeedback] = useState<string | null>(null);

  // Equipment Checklist State
  const [equipmentList, setEquipmentList] = useState([
    { id: 'eq-1', name: 'Zoll X-Series Defibrillator & 12-Lead ECG Cart', checked: true },
    { id: 'eq-2', name: 'Main Medical Oxygen Cylinder (96% reserve)', checked: true },
    { id: 'eq-3', name: 'Portable Suction Unit & Yankauer Tip', checked: true },
    { id: 'eq-4', name: 'Advanced Airway / Video Laryngoscope Kit', checked: true },
    { id: 'eq-5', name: 'Trauma Immobilization Kit & Cervical Collars', checked: true },
    { id: 'eq-6', name: 'IV Access Kit & Normal Saline 500mL', checked: true },
  ]);

  // Medical profile modal preview
  const [isMedicalProfileOpen, setIsMedicalProfileOpen] = useState(false);

  const handleSendRadio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!radioMsg.trim()) return;
    contactHospitalFromAmbulance(radioMsg.trim());
    setRadioFeedback(`Message transmitted to ${smartDestinationHospital} ER Desk.`);
    setRadioMsg('');
    setTimeout(() => setRadioFeedback(null), 4000);
  };

  const handleToggleEquipment = (id: string) => {
    setEquipmentList(
      equipmentList.map((eq) => (eq.id === id ? { ...eq, checked: !eq.checked } : eq))
    );
  };

  const transportStages: SmartAmbulanceTransportStatus[] = [
    'Dispatched',
    'En Route to Scene',
    'On Scene',
    'Transport In Progress',
    'Arrived at Hospital',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Demo Alerts Banner */}
      <DemoAlertsBanner />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="warning" size="md">
              108 First Responder Console
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Lead ALS Paramedic</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {smartAmbulanceId}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Crew Lead: <strong className="text-slate-900">{smartAssignedEmt}</strong> • Driver: {smartAssignedDriver} • Base: Gachibowli EMS Depot
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
            Simulation Presets
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentView('smart_ambulance')}
            className="text-xs"
          >
            Full Telemetry View
          </Button>
        </div>
      </div>

      {/* Transport Status Stepper */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-sm uppercase tracking-wider">Transport Mission Status</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Destination: {smartDestinationHospital}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {transportStages.map((stage) => {
            const isCurrent = smartTransportStatus === stage;
            return (
              <button
                key={stage}
                onClick={() => setSmartTransportStatus(stage)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Patient Vitals & Pre-Arrival Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Active Patient Case & Live Telemetry */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Case Card */}
          <Card variant="default" padding="lg" className="border-sky-200 bg-linear-to-br from-sky-50/40 via-white to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-red-700">
                    Active Emergency Case
                  </span>
                  <Badge variant="danger" size="sm">{smartSeverity}</Badge>
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {smartPatientName} ({smartPatientAge}y, {smartPatientGender})
                </h2>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  Case ID: #{smartCurrentCaseId} • Primary Indication: {smartRequiredCareCategory}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMedicalProfileOpen(true)}
                  className="text-xs"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Medical Profile
                </Button>
              </div>
            </div>

            {/* Live Vitals Grid */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-sky-700" />
                  <span>Real-Time Telemetry Monitor (Simulated)</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Stream Live
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Heart Rate */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold">Heart Rate</span>
                    <Heart className="w-3.5 h-3.5 text-red-600 fill-red-100" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {smartVitals.heartRate} <span className="text-xs font-semibold text-slate-400">BPM</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Sinus rhythm</span>
                </div>

                {/* SpO2 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold">Oxygen (SpO2)</span>
                    <Wind className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {smartVitals.spO2}%
                  </div>
                  <span className="text-[10px] text-slate-500">4L/min O2</span>
                </div>

                {/* Blood Pressure */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold">Blood Pressure</span>
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {smartVitals.bloodPressure}
                  </div>
                  <span className="text-[10px] text-slate-500">mmHg</span>
                </div>

                {/* Respiration */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold">Resp Rate</span>
                    <Droplet className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {smartVitals.respRate} <span className="text-xs font-semibold text-slate-400">/min</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Stable</span>
                </div>
              </div>

              {/* ECG Waveform Notice */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>ECG Telemetry: {smartVitals.ecgStatus}</span>
                </div>
                <span className="text-emerald-400">Transmitting to ER</span>
              </div>
            </div>
          </Card>

          {/* Navigation & Traffic Corridor Card */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900">Ambulance Navigation & Green Corridor</h3>
              </div>
              <Badge variant="success" size="sm">Pre-emption Active</Badge>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Current GPS Position</span>
                  <span className="font-bold text-slate-900 text-sm">{smartGpsLocation.address}</span>
                  <span className="text-slate-400 block mt-0.5">{smartGpsLocation.coordinates}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-slate-500 font-medium block">Receiving Destination</span>
                  <span className="font-bold text-sky-900 text-sm">{smartDestinationHospital}</span>
                  <span className="text-emerald-700 font-bold block mt-0.5">ETA: ~{smartEtaMinutes} mins ({smartHospitalBay})</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Hospital Radio & Equipment Checklist */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hospital Pre-Arrival Desk Communication */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-5 h-5 text-sky-700" />
              <h3 className="font-bold text-slate-900">Hospital ER Radio</h3>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Direct two-way tactical link with {smartDestinationHospital} Emergency Desk.
            </p>

            {radioFeedback && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{radioFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSendRadio} className="space-y-2.5">
              <textarea
                value={radioMsg}
                onChange={(e) => setRadioMsg(e.target.value)}
                placeholder="Type pre-arrival update (e.g., patient condition, IV meds, airway status)..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
              <Button variant="primary" size="sm" fullWidth type="submit">
                <Send className="w-3.5 h-3.5 mr-1" />
                Transmit to ER Desk
              </Button>
            </form>
          </Card>

          {/* Equipment Checklist */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Equipment Checklist</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700">100% Ready</span>
            </div>

            <div className="space-y-2">
              {equipmentList.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => handleToggleEquipment(eq.id)}
                  className="w-full flex items-start gap-2 text-left p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                >
                  {eq.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  )}
                  <span className={eq.checked ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    {eq.name}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Permission-Based Medical Profile Modal */}
      {isMedicalProfileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsMedicalProfileOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">ABHA Verified Record</Badge>
                  <span className="text-xs text-slate-500 font-semibold">Emergency Access</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {patient.name} • {patient.age}y {patient.gender}
                </h3>
              </div>
              <button
                onClick={() => setIsMedicalProfileOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block font-semibold">Blood Group:</span>
                  <span className="font-bold text-slate-900 text-sm">{patient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">ABHA ID:</span>
                  <span className="font-mono font-bold text-slate-900">{patient.abhaId}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Known Allergies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies.map((all, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-red-50 text-red-800 font-bold border border-red-200">
                      {all}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Chronic Conditions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {patient.chronicConditions.map((cond, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-medium border border-amber-200">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Active Medications:</span>
                <ul className="list-disc pl-5 text-slate-700 space-y-0.5">
                  {patient.currentMedications.map((med, i) => (
                    <li key={i}>{med}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsMedicalProfileOpen(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
