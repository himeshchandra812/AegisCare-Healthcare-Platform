import React, { useState } from 'react';
import {
  Building2,
  Ambulance,
  User,
  HeartPulse,
  AlertTriangle,
  Clock,
  Radio,
  Send,
  Edit,
  PhoneCall,
  XCircle,
  CheckCircle2,
  Activity,
  ShieldAlert,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import { PreArrivalTimeline } from './PreArrivalTimeline';
import { PreArrivalNotificationStatus } from '../../types';

const DEMO_HOSPITALS_LIST = [
  {
    name: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
    eta: 4,
    type: 'Level 1 Comprehensive Trauma & Cath Lab',
    address: 'Road No. 2, Banjara Hills, Hyderabad',
  },
  {
    name: "Osmania General Emergency & Trauma Block (Demo)",
    eta: 9,
    type: 'Govt. Tertiary Emergency Resuscitation Center',
    address: 'Afzal Gunj, Hyderabad',
  },
  {
    name: "Nizam's Institute of Medical Sciences (NIMS) Emergency (Demo)",
    eta: 12,
    type: 'Autonomous State Trauma & Acute Neuro Center',
    address: 'Punjagutta, Hyderabad',
  },
  {
    name: 'Care Hospital Banjara Emergency (Demo)',
    eta: 6,
    type: 'Advanced Cardiac Care & Critical Care',
    address: 'Road No. 1, Banjara Hills, Hyderabad',
  },
  {
    name: 'Apollo Hospital Jubilee Hills Emergency (Demo)',
    eta: 7,
    type: 'Quaternary Trauma & Acute Stroke Unit',
    address: 'Jubilee Hills Road No. 72, Hyderabad',
  },
];

export const HospitalPreArrivalSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    preArrivalStatus,
    smartAmbulanceId,
    smartPatientName,
    smartPatientAge,
    smartPatientGender,
    smartDestinationHospital,
    smartEtaMinutes,
    smartSeverity,
    smartRequiredCareCategory,
    smartVitals,
    sendPreArrivalNotification,
    updatePatientPreArrivalInfo,
    changeDestinationHospital,
    contactHospitalPreArrival,
    cancelPreArrivalNotification,
    activePreArrivalCase,
  } = useApp();

  // Modals
  const [isUpdateInfoOpen, setIsUpdateInfoOpen] = useState(false);
  const [isChangeHospitalOpen, setIsChangeHospitalOpen] = useState(false);
  const [isContactHospitalOpen, setIsContactHospitalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  // Form states
  const [editName, setEditName] = useState(smartPatientName);
  const [editAge, setEditAge] = useState(smartPatientAge);
  const [editGender, setEditGender] = useState(smartPatientGender);
  const [editComplaint, setEditComplaint] = useState(
    activePreArrivalCase.chiefComplaint || 'Acute retrosternal chest pain radiating to jaw & diaphoresis'
  );
  const [editSeverity, setEditSeverity] = useState(smartSeverity);
  const [editCategory, setEditCategory] = useState(smartRequiredCareCategory);

  const [contactMsg, setContactMsg] = useState('');
  const [cancelReason, setCancelReason] = useState('Patient stabilized; rerouted to alternate center');

  // Status Styling Badge
  const getStatusBadge = (status: PreArrivalNotificationStatus) => {
    switch (status) {
      case 'Not Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Not Sent</span>
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span>Sent (Broadcasting...)</span>
          </span>
        );
      case 'Received':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Received by Triage</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Under Review (Physician)</span>
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accepted ({activePreArrivalCase.hospitalBay})</span>
          </span>
        );
      case 'Preparation in Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300">
            <Activity className="w-3.5 h-3.5 text-purple-600 animate-spin-slow" />
            <span>Preparation in Progress</span>
          </span>
        );
      case 'Ready for Arrival':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Ready for Arrival (Bay Clear)</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected / Diverted</span>
          </span>
        );
    }
  };

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientPreArrivalInfo({
      patientName: editName,
      patientAge: Number(editAge),
      patientGender: editGender,
      chiefComplaint: editComplaint,
      severity: editSeverity,
      requiredCareCategory: editCategory,
    });
    setIsUpdateInfoOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    contactHospitalPreArrival(contactMsg.trim());
    setContactMsg('');
    setIsContactHospitalOpen(false);
  };

  const handleConfirmCancel = () => {
    cancelPreArrivalNotification(cancelReason);
    setIsCancelConfirmOpen(false);
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Main Pre-Arrival Card */}
      <div className="bg-white rounded-2xl border-2 border-sky-200 shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 text-sky-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Hospital Pre-Arrival Coordination
                </h2>
                <Badge variant="warning" size="sm">
                  Prototype
                </Badge>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Real-time simulated telemetry sync with Hyderabad ER receiving desks & trauma bays.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-sky-200 block">Notification Status</span>
              <div className="mt-0.5">{getStatusBadge(preArrivalStatus)}</div>
            </div>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/50 border-b border-slate-200">
          {/* Col 1: Destination & Ambulance */}
          <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              1. Destination Hospital
            </span>
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {smartDestinationHospital}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Assigned Bay: <strong className="text-sky-900">{activePreArrivalCase.hospitalBay}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Ambulance:</span>
              <span className="font-bold text-slate-800">{smartAmbulanceId}</span>
            </div>
          </div>

          {/* Col 2: Patient Summary */}
          <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              2. Patient Summary (Fictional)
            </span>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {smartPatientName}, {smartPatientAge}y &bull; {smartPatientGender}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                  {activePreArrivalCase.chiefComplaint}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Priority:</span>
              <Badge
                variant={
                  smartSeverity === 'Critical (Red)'
                    ? 'danger'
                    : smartSeverity === 'Urgent (Yellow)'
                    ? 'warning'
                    : 'success'
                }
                size="sm"
              >
                {smartSeverity}
              </Badge>
            </div>
          </div>

          {/* Col 3: Care Category & ETA */}
          <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              3. Category & Arrival
            </span>
            <div className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {smartRequiredCareCategory}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-sky-800 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ETA: ~{smartEtaMinutes} mins</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Corridor:</span>
              <span className="font-bold text-emerald-700 text-[11px]">Green Wave Pre-empted</span>
            </div>
          </div>

          {/* Col 4: Hospital Contact Status */}
          <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              4. Hospital Contact Link
            </span>
            <div className="flex items-start gap-2">
              <Radio className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  Hyderabad Apex ER Operations
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                  Telemetry Channel Open &bull; Connected
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Messages:</span>
              <span className="font-bold text-sky-700">
                {activePreArrivalCase.contactMessages.length} exchanged
              </span>
            </div>
          </div>
        </div>

        {/* Live Vitals Ribbon (Simulated) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Simulated Telemetry Stream:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs">
            <div>
              <span className="text-slate-400">HR:</span>{' '}
              <strong className="text-emerald-400">{smartVitals.heartRate} bpm</strong>
            </div>
            <div>
              <span className="text-slate-400">SpO2:</span>{' '}
              <strong className="text-sky-300">{smartVitals.spO2}%</strong>
            </div>
            <div>
              <span className="text-slate-400">BP:</span>{' '}
              <strong className="text-slate-100">{smartVitals.bloodPressure}</strong>
            </div>
            <div>
              <span className="text-slate-400">RR:</span>{' '}
              <strong className="text-slate-200">{smartVitals.respRate} /min</strong>
            </div>
            <div>
              <span className="text-slate-400">Glucose:</span>{' '}
              <strong className="text-amber-300">{smartVitals.bloodGlucose} mg/dL</strong>
            </div>
            <div>
              <span className="text-slate-400">ECG:</span>{' '}
              <strong className="text-rose-300">{smartVitals.ecgStatus}</strong>
            </div>
          </div>

          <Badge variant="warning" size="sm">
            Simulated Vitals
          </Badge>
        </div>

        {/* Rejection notice banner if active */}
        {preArrivalStatus === 'Rejected' && activePreArrivalCase.rejectionReason && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong className="font-bold">Hospital Diversion Reason:</strong>{' '}
                <span>{activePreArrivalCase.rejectionReason}</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsChangeHospitalOpen(true)}
              className="shrink-0 bg-white border-rose-300 text-rose-900 font-bold"
            >
              Select Alternative Hospital
            </Button>
          </div>
        )}

        {/* EMT Action Buttons Bar */}
        <div className="p-4 sm:p-5 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Action 1: Send Notification */}
            <Button
              variant="primary"
              size="sm"
              onClick={sendPreArrivalNotification}
              disabled={preArrivalStatus === 'Sent' || preArrivalStatus === 'Under Review'}
              className="flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>
                {preArrivalStatus === 'Not Sent'
                  ? 'Send Pre-Arrival Notification'
                  : 'Re-Broadcast Telemetry Notification'}
              </span>
            </Button>

            {/* Action 2: Update Patient Info */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsUpdateInfoOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>Update Patient Information</span>
            </Button>

            {/* Action 3: Change Destination Hospital */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsChangeHospitalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Change Destination Hospital</span>
            </Button>

            {/* Action 4: Contact Hospital */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsContactHospitalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Contact Hospital (ER Desk)</span>
            </Button>
          </div>

          <div>
            {/* Action 5: Cancel Notification */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCancelConfirmOpen(true)}
              disabled={preArrivalStatus === 'Not Sent'}
              className="text-rose-700 hover:bg-rose-50 hover:text-rose-800 flex items-center gap-1.5 font-bold"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Notification</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Embedded 10-Step Timeline */}
      <PreArrivalTimeline compact={true} />

      {/* ============================================================ */}
      {/* MODAL 1: Update Patient Information */}
      {/* ============================================================ */}
      <Modal
        isOpen={isUpdateInfoOpen}
        onClose={() => setIsUpdateInfoOpen(false)}
        title="Update Patient Pre-Arrival Information"
        size="lg"
      >
        <form onSubmit={handleUpdateInfo} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Simulated patient data: All edits update telemetry sent to the receiving hospital.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
              <input
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
              <select
                value={editGender}
                onChange={(e) => setEditGender(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Chief Clinical Complaint / Symptoms
            </label>
            <textarea
              value={editComplaint}
              onChange={(e) => setEditComplaint(e.target.value)}
              rows={2}
              className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Triage Priority</label>
              <select
                value={editSeverity}
                onChange={(e) => setEditSeverity(e.target.value as any)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
              >
                <option value="Critical (Red)">Critical (Red) - Immediate Resuscitation</option>
                <option value="Urgent (Yellow)">Urgent (Yellow) - Emergent Triage</option>
                <option value="Standard (Green)">Standard (Green) - Stable Intake</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Required Care Category</label>
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsUpdateInfoOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Apply & Sync with Hospital
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 2: Change Destination Hospital */}
      {/* ============================================================ */}
      <Modal
        isOpen={isChangeHospitalOpen}
        onClose={() => setIsChangeHospitalOpen(false)}
        title="Select Destination Hospital (Hyderabad Healthcare Network)"
        size="lg"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Reroute ambulance Unit 108-Hyd-42 to another regional emergency department. Estimated arrival and pre-arrival notification packet will update automatically.
          </p>

          <div className="space-y-2.5">
            {DEMO_HOSPITALS_LIST.map((hosp) => {
              const isSelected = hosp.name === smartDestinationHospital;

              return (
                <div
                  key={hosp.name}
                  onClick={() => {
                    changeDestinationHospital(hosp.name, hosp.eta);
                    setIsChangeHospitalOpen(false);
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{hosp.name}</span>
                      {isSelected && <Badge variant="info" size="sm">Current Destination</Badge>}
                    </div>
                    <div className="text-[11px] font-medium text-slate-600">{hosp.type}</div>
                    <div className="text-[10px] text-slate-400">{hosp.address}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-sky-800 bg-sky-100 px-2.5 py-1 rounded-lg">
                      ETA ~{hosp.eta} mins
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Click to select</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setIsChangeHospitalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 3: Contact Hospital (ER Desk) */}
      {/* ============================================================ */}
      <Modal
        isOpen={isContactHospitalOpen}
        onClose={() => setIsContactHospitalOpen(false)}
        title="Direct Line: Hospital ER Operations Desk"
        size="md"
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-600 shrink-0 animate-pulse" />
            <span>Encrypted telemetry communication channel with Hyderabad Apex Emergency Room.</span>
          </div>

          {/* Previous Messages History */}
          <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {activePreArrivalCase.contactMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-lg text-xs ${
                  msg.sender === 'EMT'
                    ? 'bg-sky-100 text-sky-950 ml-4 border border-sky-200'
                    : 'bg-white text-slate-800 mr-4 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                  <span>{msg.senderName}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="leading-snug">{msg.text}</div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Transmit Priority Radio / Digital Message
            </label>
            <textarea
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              placeholder="e.g. Patient experiencing worsening retrosternal pain, repeat sublingual NTG given..."
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsContactHospitalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Send Message to ER Desk
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 4: Cancel Notification Confirmation */}
      {/* ============================================================ */}
      <Modal
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        title="Confirm Cancellation of Pre-Arrival Notification"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              Retracting this notification will notify Hyderabad Apex ER to release reserved Trauma Bay 2 and clear on-call specialists.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Reason for Cancellation
            </label>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsCancelConfirmOpen(false)}>
              Keep Active
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmCancel}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Confirm Cancel Notification
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
