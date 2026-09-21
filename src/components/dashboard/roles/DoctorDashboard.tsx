import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  Ambulance,
  Heart,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Video,
  User,
  ShieldCheck,
  Send,
  Building,
  Sparkles,
  PhoneCall,
  Lock,
  Unlock,
  Radio,
  Share2,
  BellRing,
  Wind,
  Droplet,
  Thermometer,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { DemoAlertsBanner } from '../../common/DemoAlertsBanner';
import { DoctorPreArrivalReview } from '../../common/DoctorPreArrivalReview';
import { HospitalPreparationStatus } from '../../../types';
import { DEMO_PATIENTS, DEMO_HOSPITALS, DEMO_ROLES } from '../../../data/mockData';

export const DoctorDashboard: React.FC = () => {
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
    smartSimulatedConsent,
    toggleSmartConsent,
    smartTimeline,
    smartDoctorOrders,
    addDoctorOrder,
    notifyHospitalTeam,
    requestDoctorInfo,
    smartHospitalBay,
  } = useApp();

  const doctorProfile = DEMO_ROLES.doctor;
  const patient = DEMO_PATIENTS[0];
  const hospital = DEMO_HOSPITALS[0];

  // Action status message toast
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Modals
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [requestInfoQuery, setRequestInfoQuery] = useState('');
  const [isPrepStatusModalOpen, setIsPrepStatusModalOpen] = useState(false);

  // New order field
  const [newOrderText, setNewOrderText] = useState('');
  const [isAvailableInER, setIsAvailableInER] = useState(true);

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleAcceptCase = () => {
    setSmartHospitalPrepStatus('Case Accepted');
    triggerFeedback(`Emergency Case #${smartCurrentCaseId} formally accepted by Dr. Arjun Rao. Trauma Bay 2 reserved.`);
  };

  const handleNotifyTeam = () => {
    notifyHospitalTeam('Cath Lab Interventional Team & Trauma Resuscitation Staff');
    triggerFeedback('Hospital resuscitation team, Cath Lab 1, and Blood Bank pre-alerted via emergency paging.');
  };

  const handleSendInfoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestInfoQuery.trim()) return;
    requestDoctorInfo(requestInfoQuery.trim());
    setIsRequestInfoOpen(false);
    setRequestInfoQuery('');
    triggerFeedback('Information request dispatched to Unit 108 EMT Paramedic.');
  };

  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderText.trim()) return;
    addDoctorOrder(newOrderText.trim());
    setNewOrderText('');
    triggerFeedback('Clinical pre-arrival order broadcast to in-transit ambulance crew.');
  };

  const prepStages: HospitalPreparationStatus[] = [
    'Pending Acceptance',
    'Case Accepted',
    'Preparation in Progress',
    'Ready for Arrival',
    'Case Received',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Active Demo Alerts Banner */}
      <DemoAlertsBanner />

      {/* Header with Professional Verification & Availability */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="md">
              Clinical Emergency Portal
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Attending Emergency Physician</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {doctorProfile.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 mt-1">
            <span className="font-semibold text-slate-800">Head of Emergency Medicine & Trauma</span>
            <span>•</span>
            <span className="text-sky-800 font-medium">{doctorProfile.departmentOrAffiliation}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              {doctorProfile.verificationStatus}
            </span>
          </div>
        </div>

        {/* Doctor Duty Availability Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Duty Status</span>
            <span className="text-xs font-bold text-slate-900">
              {isAvailableInER ? 'Active in Trauma Bay' : 'On-Call Mobile'}
            </span>
          </div>
          <button
            onClick={() => setIsAvailableInER(!isAvailableInER)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isAvailableInER ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
          </button>
        </div>
      </div>

      {/* Action feedback toast */}
      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-xs border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Mandatory Decision Support Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 text-xs sm:text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Clinical Advisory:</span> All AI triage risk scores and pre-arrival telemetry are strictly <strong>demo decision-support indicators — not a diagnosis</strong>. Final treatment protocols must follow attending physician clinical judgement.
        </div>
      </div>

      {/* DOCTOR / CLINICAL PRE-ARRIVAL CASE REVIEW (Prompt Section 3) */}
      <DoctorPreArrivalReview />

      {/* SECTION 1: INCOMING AMBULANCE TELEMETRY & CLINICAL ACTIONS */}
      <div className="bg-linear-to-r from-red-50 via-white to-sky-50 rounded-2xl border-2 border-red-300 p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              <Ambulance className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-700">
                  Inbound Ambulance: {smartAmbulanceId}
                </span>
                <Badge variant={smartSeverity === 'Critical (Red)' ? 'danger' : 'warning'} size="sm">
                  {smartSeverity}
                </Badge>
                <Badge variant="info" size="sm">
                  {smartTransportStatus === 'Arrived at Hospital' ? 'Arrived at ER Bay' : `ETA ~${smartEtaMinutes} mins`}
                </Badge>
                <Badge variant="success" size="sm">
                  ER Prep: {smartHospitalPrepStatus}
                </Badge>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Case #{smartCurrentCaseId}: {smartPatientName} ({smartPatientAge}y, {smartPatientGender})
              </h2>
              <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-2">
                <span>EMT: <strong>{smartAssignedEmt}</strong></span>
                <span>•</span>
                <span>Hospital: <strong>{smartDestinationHospital} ({smartHospitalBay})</strong></span>
                <span>•</span>
                <span>Location: <strong>{smartGpsLocation.address}</strong></span>
              </div>
            </div>
          </div>

          {/* 4 REQUIRED CLINICAL ACTIONS */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAcceptCase}
              className="text-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Accept Case
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRequestInfoOpen(true)}
              className="text-xs"
            >
              <Radio className="w-4 h-4 mr-1.5 text-sky-700" />
              Request Info
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNotifyTeam}
              className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
            >
              <BellRing className="w-4 h-4 mr-1.5 text-rose-600" />
              Notify Team
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPrepStatusModalOpen(true)}
              className="text-xs"
            >
              Update Prep Status
            </Button>
          </div>
        </div>

        {/* SIMULATED PATIENT CONSENT & MEDICAL PROFILE BANNER */}
        <div className="p-4 rounded-xl border bg-white shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              {smartSimulatedConsent ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span>Simulated Patient Consent: Active (ABHA Profile Authorized)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Simulated Consent: Restricted Mode (Masked History)</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleSmartConsent}
              className="text-xs self-start sm:self-auto"
            >
              {smartSimulatedConsent ? 'Simulate Restrict Records' : 'Emergency Override / Grant Consent'}
            </Button>
          </div>

          <div className="pt-3 text-xs space-y-2">
            {smartSimulatedConsent ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block">Critical Allergies:</span>
                  <span className="font-black text-rose-700 text-sm">
                    {patient.allergies.join(', ')}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block">Chronic Conditions:</span>
                  <span className="font-medium text-slate-900">
                    Type-2 Diabetes Mellitus, Essential Hypertension (8 yrs)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block">Active Medications:</span>
                  <span className="font-medium text-slate-900">
                    Telmisartan 40mg, Metformin 500mg, Atorvastatin 20mg
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-slate-600">
                <span className="font-bold text-amber-900 block mb-0.5">
                  Restricted Patient Medical History (Simulated Privacy Policy)
                </span>
                Detailed electronic health records, past allergies, and prescribed medications are protected under simulated patient consent. Emergency demographics and real-time telemetry remain visible. Use "Emergency Override" above for acute trauma resuscitation protocols.
              </div>
            )}
          </div>
        </div>

        {/* 7 SIMULATED VITAL SIGNS TILES FOR DOCTORS */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Incoming Telemetry Stream (All 7 Parameters)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {/* 1. Heart Rate */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Heart Rate</span>
              <div className="text-2xl font-black text-rose-600 flex items-center justify-center gap-1 mt-0.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                {smartVitals.heartRate}
              </div>
              <span className="text-[10px] font-semibold text-slate-500">bpm (Live)</span>
            </div>

            {/* 2. SpO2 */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">SpO2</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">
                {smartVitals.spO2}%
              </div>
              <span className="text-[10px] font-semibold text-slate-500">Cannula 4L</span>
            </div>

            {/* 3. Blood Pressure */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">BP (mmHg)</span>
              <div className="text-xl font-black text-slate-900 mt-1">
                {smartVitals.bloodPressure}
              </div>
              <span className="text-[10px] font-semibold text-amber-700">Stage 1 HTN</span>
            </div>

            {/* 4. Resp Rate */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Resp Rate</span>
              <div className="text-2xl font-black text-sky-600 mt-0.5">
                {smartVitals.respRate}
              </div>
              <span className="text-[10px] font-semibold text-slate-500">/min</span>
            </div>

            {/* 5. Temp */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Body Temp</span>
              <div className="text-2xl font-black text-amber-600 mt-0.5">
                {smartVitals.temperature}°F
              </div>
              <span className="text-[10px] font-semibold text-slate-500">Tympanic</span>
            </div>

            {/* 6. Glucose */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Glucose</span>
              <div className="text-2xl font-black text-purple-600 mt-0.5">
                {smartVitals.bloodGlucose}
              </div>
              <span className="text-[10px] font-semibold text-slate-500">mg/dL</span>
            </div>

            {/* 7. ECG Rhythm */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-3 rounded-xl bg-white border border-slate-200 text-center flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">ECG Lead II</span>
              <div className="text-xs font-black text-emerald-700 truncate mt-0.5" title={smartVitals.ecgStatus}>
                {smartVitals.ecgStatus}
              </div>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Telemetry Validated</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CASE TIMELINE & CLINICAL DIRECTIVES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Emergency Case Timeline & Pre-Arrival Directives */}
        <div className="lg:col-span-2 space-y-6">
          {/* Emergency Case Timeline */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Emergency Case Telemetry Timeline (Case #{smartCurrentCaseId})
                </h3>
              </div>
              <Badge variant="neutral" size="sm">{smartTimeline.length} Logs</Badge>
            </div>

            <div className="space-y-3">
              {smartTimeline.slice(-4).reverse().map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{event.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{event.description}</p>
                    <span className="text-[11px] font-semibold text-sky-800 mt-1 block">
                      Actor: {event.actor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pre-Arrival Orders & Directives */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Pre-Arrival Clinical Directives (Transmitted to In-Transit Ambulance)</span>
              </h3>
              <Badge variant="success" size="sm">Active Sync</Badge>
            </div>

            <div className="space-y-2 mb-4">
              {smartDoctorOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">{order}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">ORDER #{idx + 101}</span>
                </div>
              ))}
            </div>

            {/* Add new order */}
            <form onSubmit={handleAddOrderSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Authorize directive (e.g., Draw cardiac troponin STAT on bay arrival, hold nitrates if SBP < 100)..."
                value={newOrderText}
                onChange={(e) => setNewOrderText(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
              />
              <Button type="submit" variant="primary" size="sm" className="text-xs shrink-0">
                Authorize Order
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Col: ER & Resource Capacity */}
        <div className="space-y-6">
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-700" />
                <span>Hospital ER & Critical Resources</span>
              </h3>
              <Badge variant="info" size="sm">{hospital.traumaLevel}</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Assigned Bay:</span>
                <span className="font-black text-sky-800">{smartHospitalBay}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Available ER Bays:</span>
                <span className="font-bold text-slate-900">{hospital.availableBeds.er} Bays</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Cath Lab 1:</span>
                <span className="font-bold text-emerald-700">Pre-Alerted & Ready</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Blood Bank O-Neg:</span>
                <span className="font-bold text-slate-900">8 Units Reserved</span>
              </div>
            </div>
          </Card>

          {/* Teleconsultation Requests */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-700" />
                <span>Teleconsultation Requests</span>
              </h3>
              <Badge variant="warning" size="sm">2 Pending</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="font-bold text-slate-900">Medak Rural Health Centre</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Emergency ECG review request (45y Male)</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-amber-700 font-semibold">Waiting 8 mins</span>
                  <Button variant="outline" size="sm" className="text-[11px] py-1 px-2">
                    Review ECG
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL: REQUEST ADDITIONAL INFORMATION */}
      {isRequestInfoOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsRequestInfoOpen(false)}
          title="Request Information from Unit 108 EMT"
          size="md"
        >
          <form onSubmit={handleSendInfoRequest} className="space-y-4">
            <div className="text-xs text-slate-600">
              Transmit a specific inquiry to Lead Paramedic Ravi Kumar in Unit 108.
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Clinical Question or Diagnostic Request
              </label>
              <textarea
                value={requestInfoQuery}
                onChange={(e) => setRequestInfoQuery(e.target.value)}
                placeholder="e.g. Has patient received sublingual nitroglycerin? Any radiation to jaw or diaphoresis?"
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setIsRequestInfoOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Inquiry to EMT
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: UPDATE PREPARATION STATUS */}
      {isPrepStatusModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPrepStatusModalOpen(false)}
          title="Update Hospital Preparation Status"
          size="md"
        >
          <div className="space-y-4">
            <div className="text-xs text-slate-600">
              Update the current readiness stage of Hyderabad Apex Emergency Room.
            </div>

            <div className="grid grid-cols-1 gap-2">
              {prepStages.map((stage) => {
                const isSelected = smartHospitalPrepStatus === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => {
                      setSmartHospitalPrepStatus(stage);
                      setIsPrepStatusModalOpen(false);
                      triggerFeedback(`Hospital preparation status updated to: ${stage}`);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span>{stage}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setIsPrepStatusModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
