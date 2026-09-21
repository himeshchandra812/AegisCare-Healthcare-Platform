import React, { useState } from 'react';
import {
  Ambulance,
  Clock,
  HeartPulse,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  PhoneCall,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  Stethoscope,
  Send,
  MessageSquare,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import {
  PreArrivalAmbulanceCase,
  PreArrivalNotificationStatus,
} from '../../types';

interface IncomingAmbulanceQueueProps {
  className?: string;
  roleMode?: 'hospital' | 'doctor';
}

export const IncomingAmbulanceQueue: React.FC<IncomingAmbulanceQueueProps> = ({
  className = '',
  roleMode = 'hospital',
}) => {
  const {
    incomingAmbulanceQueue,
    acceptPreArrivalCase,
    rejectPreArrivalCase,
    requestMoreInfoFromEmt,
    startHospitalPreparation,
    markHospitalReady,
    contactEmtFromHospital,
    reviewPreArrivalCase,
    requestDoctorSpecialist,
    requestDoctorEquipment,
    addDoctorPreparationNote,
    currentRole,
  } = useApp();

  // Filters & Search
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Critical (Red)' | 'Urgent (Yellow)' | 'Standard (Green)'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | PreArrivalNotificationStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'eta' | 'priority' | 'timestamp'>('eta');

  // Expanded case details
  const [expandedCaseId, setExpandedCaseId] = useState<string>('case-hyd-402');

  // Action Modals State
  const [rejectModalCaseId, setRejectModalCaseId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Critical bed capacity reached; diverting to Osmania General');

  const [moreInfoCaseId, setMoreInfoCaseId] = useState<string | null>(null);
  const [moreInfoText, setMoreInfoText] = useState('Please confirm pupils react to light & exact time of onset');

  const [contactCaseId, setContactCaseId] = useState<string | null>(null);
  const [contactText, setContactText] = useState('Trauma Bay 2 ready with interventional cardiology on standby');

  // Doctor Action Modals
  const [specialistModalCaseId, setSpecialistModalCaseId] = useState<string | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState('Interventional Cardiologist');

  const [equipmentModalCaseId, setEquipmentModalCaseId] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState('Biphasic Defibrillator');

  const [prepNoteModalCaseId, setPrepNoteModalCaseId] = useState<string | null>(null);
  const [doctorPrepNote, setDoctorPrepNote] = useState('Pre-warm bay to 24°C, prime rapid infuser with blood line');

  // Filter and sort the queue
  const filteredCases = incomingAmbulanceQueue
    .filter((c) => {
      if (priorityFilter !== 'All' && c.emergencyPriority !== priorityFilter) return false;
      if (statusFilter !== 'All' && c.notificationStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.patientName.toLowerCase().includes(q);
        const matchesAmb = c.ambulanceId.toLowerCase().includes(q);
        const matchesDept = c.requiredDepartment.toLowerCase().includes(q);
        if (!matchesName && !matchesAmb && !matchesDept) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'eta') {
        return a.estimatedArrivalMin - b.estimatedArrivalMin;
      }
      if (sortBy === 'priority') {
        const prioScore: Record<string, number> = {
          'Critical (Red)': 1,
          'Urgent (Yellow)': 2,
          'Standard (Green)': 3,
        };
        return (prioScore[a.emergencyPriority] || 99) - (prioScore[b.emergencyPriority] || 99);
      }
      return b.notificationTimestamp.localeCompare(a.notificationTimestamp);
    });

  const getStatusBadge = (status: PreArrivalNotificationStatus) => {
    switch (status) {
      case 'Not Sent':
        return <Badge variant="secondary">Not Sent</Badge>;
      case 'Sent':
        return <Badge variant="info">Broadcast Sent</Badge>;
      case 'Received':
        return <Badge variant="info">Received</Badge>;
      case 'Under Review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'Accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'Preparation in Progress':
        return <Badge variant="secondary">Preparing Bay</Badge>;
      case 'Ready for Arrival':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-white" />
            <span>Ready for Arrival</span>
          </span>
        );
      case 'Rejected':
        return <Badge variant="danger">Rejected / Diverted</Badge>;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Title and Filtering */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-sky-800">
                Live Emergency Intake Queue
              </span>
              <Badge variant="warning" size="sm">
                Simulated Demo Queue
              </Badge>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Incoming Ambulances & Pre-Arrival Coordination
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hyderabad Apex Trauma Center &bull; {filteredCases.length} active inbound ambulances monitored
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Sort by:</span>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs bg-slate-50">
              <button
                onClick={() => setSortBy('eta')}
                className={`px-2.5 py-1.5 font-bold transition-colors cursor-pointer ${
                  sortBy === 'eta' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                ETA
              </button>
              <button
                onClick={() => setSortBy('priority')}
                className={`px-2.5 py-1.5 font-bold transition-colors cursor-pointer ${
                  sortBy === 'priority' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Priority
              </button>
              <button
                onClick={() => setSortBy('timestamp')}
                className={`px-2.5 py-1.5 font-bold transition-colors cursor-pointer ${
                  sortBy === 'timestamp' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Time
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by patient, ambulance, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </div>

          {/* Priority filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="All">All Triage Priorities</option>
              <option value="Critical (Red)">Critical (Red)</option>
              <option value="Urgent (Yellow)">Urgent (Yellow)</option>
              <option value="Standard (Green)">Standard (Green)</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="All">All Notification Statuses</option>
              <option value="Not Sent">Not Sent</option>
              <option value="Sent">Sent</option>
              <option value="Received">Received</option>
              <option value="Under Review">Under Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Preparation in Progress">Preparation in Progress</option>
              <option value="Ready for Arrival">Ready for Arrival</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ambulance Case Cards */}
      <div className="space-y-3.5">
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No incoming ambulance cases match the current filter.
          </div>
        ) : (
          filteredCases.map((ambulanceCase) => {
            const isExpanded = expandedCaseId === ambulanceCase.id;

            return (
              <div
                key={ambulanceCase.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  ambulanceCase.notificationStatus === 'Rejected'
                    ? 'border-rose-200 bg-rose-50/20'
                    : ambulanceCase.emergencyPriority === 'Critical (Red)'
                    ? 'border-rose-300 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Main Row Summary */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Case Lead Info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        ambulanceCase.emergencyPriority === 'Critical (Red)'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : ambulanceCase.emergencyPriority === 'Urgent (Yellow)'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      <Ambulance className="w-6 h-6 animate-pulse" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          {ambulanceCase.patientName}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({ambulanceCase.patientAge}y, {ambulanceCase.patientGender})
                        </span>
                        <Badge
                          variant={
                            ambulanceCase.emergencyPriority === 'Critical (Red)'
                              ? 'danger'
                              : ambulanceCase.emergencyPriority === 'Urgent (Yellow)'
                              ? 'warning'
                              : 'success'
                          }
                          size="sm"
                        >
                          {ambulanceCase.emergencyPriority}
                        </Badge>
                        {getStatusBadge(ambulanceCase.notificationStatus)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                        <span className="font-bold text-sky-800">{ambulanceCase.ambulanceId}</span>
                        <span>&bull;</span>
                        <span className="font-semibold">{ambulanceCase.requiredDepartment}</span>
                        <span>&bull;</span>
                        <span className="text-slate-500">
                          Packet Sent: {ambulanceCase.notificationTimestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ETA and Primary Quick Actions */}
                  <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
                    <div className="text-left lg:text-right">
                      <div className="flex items-center gap-1.5 text-xs font-black text-sky-900 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
                        <Clock className="w-3.5 h-3.5 text-sky-700" />
                        <span>ETA: ~{ambulanceCase.estimatedArrivalMin} mins</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Assigned: {ambulanceCase.hospitalBay}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedCaseId(isExpanded ? '' : ambulanceCase.id)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'Review & Manage'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Actions Panel */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 space-y-4">
                    {/* Clinical Summary & Vitals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Complaint & Required Resources */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[11px] font-black uppercase text-slate-500 block">
                          Patient Clinical Presentation
                        </span>
                        <p className="text-xs font-medium text-slate-800 leading-snug">
                          {ambulanceCase.chiefComplaint}
                        </p>
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-600 block mb-1">
                            Required Resources & Staging:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ambulanceCase.requiredResources.map((res) => (
                              <span
                                key={res}
                                className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[11px] font-semibold"
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Live Simulated Vitals */}
                      <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between font-sans">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                            Live Telemetry Telecast
                          </span>
                          <Badge variant="warning" size="sm">Simulated Data</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="p-2 bg-white/5 rounded border border-white/10">
                            <span className="text-[10px] text-slate-400 block font-sans">Heart Rate</span>
                            <span className="text-sm font-bold text-emerald-400">
                              {ambulanceCase.vitals.heartRate} bpm
                            </span>
                          </div>
                          <div className="p-2 bg-white/5 rounded border border-white/10">
                            <span className="text-[10px] text-slate-400 block font-sans">SpO2</span>
                            <span className="text-sm font-bold text-sky-300">
                              {ambulanceCase.vitals.spO2}%
                            </span>
                          </div>
                          <div className="p-2 bg-white/5 rounded border border-white/10">
                            <span className="text-[10px] text-slate-400 block font-sans">BP</span>
                            <span className="text-sm font-bold text-slate-200">
                              {ambulanceCase.vitals.bloodPressure}
                            </span>
                          </div>
                        </div>

                        <div className="pt-1 text-[11px] text-rose-300 flex items-center justify-between">
                          <span>ECG: {ambulanceCase.vitals.ecgStatus}</span>
                          <span className="text-slate-400">Resp: {ambulanceCase.vitals.respRate}/min</span>
                        </div>
                      </div>
                    </div>

                    {/* Doctor Consultation & Equipment Orders List if any */}
                    {(ambulanceCase.requestedSpecialists.length > 0 ||
                      ambulanceCase.requestedEquipment.length > 0 ||
                      ambulanceCase.preparationNotes.length > 0) && (
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                        <span className="font-black text-slate-700 block text-[11px] uppercase tracking-wider">
                          Doctor Intake Orders & Specialist Requests:
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {ambulanceCase.requestedSpecialists.map((s) => (
                            <span
                              key={s.id}
                              className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold"
                            >
                              Specialist: <strong>{s.specialist}</strong> ({s.status})
                            </span>
                          ))}
                          {ambulanceCase.requestedEquipment.map((eq) => (
                            <span
                              key={eq.id}
                              className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold"
                            >
                              Equipment: <strong>{eq.equipment}</strong> ({eq.status})
                            </span>
                          ))}
                        </div>

                        {ambulanceCase.preparationNotes.map((note) => (
                          <div
                            key={note.id}
                            className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium"
                          >
                            <span className="font-bold text-slate-900">{note.author} ({note.role}): </span>
                            <span>{note.text}</span>
                            <span className="text-[10px] text-slate-400 ml-2">({note.timestamp})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Operational Action Buttons (Labeled 'Simulated Demo Decision') */}
                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      {/* Section 2: Hospital Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {ambulanceCase.notificationStatus !== 'Accepted' &&
                          ambulanceCase.notificationStatus !== 'Preparation in Progress' &&
                          ambulanceCase.notificationStatus !== 'Ready for Arrival' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => acceptPreArrivalCase(ambulanceCase.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Case (Demo Decision)</span>
                            </Button>
                          )}

                        {ambulanceCase.notificationStatus !== 'Preparation in Progress' &&
                          ambulanceCase.notificationStatus !== 'Ready for Arrival' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => startHospitalPreparation(ambulanceCase.id)}
                              className="flex items-center gap-1"
                            >
                              <Activity className="w-3.5 h-3.5 text-purple-600" />
                              <span>Start Preparation</span>
                            </Button>
                          )}

                        {ambulanceCase.notificationStatus !== 'Ready for Arrival' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => markHospitalReady(ambulanceCase.id)}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1 font-bold"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark Ready for Arrival</span>
                          </Button>
                        )}

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setMoreInfoCaseId(ambulanceCase.id)}
                          className="flex items-center gap-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                          <span>Request More Info</span>
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setContactCaseId(ambulanceCase.id)}
                          className="flex items-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Contact Ambulance</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRejectModalCaseId(ambulanceCase.id)}
                          className="text-rose-700 hover:bg-rose-50 font-bold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Reject / Divert</span>
                        </Button>
                      </div>

                      {/* Section 3: Clinical Doctor Actions Trigger Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => reviewPreArrivalCase(ambulanceCase.id)}
                          className="bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1 font-bold"
                        >
                          <Stethoscope className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Doctor Review</span>
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSpecialistModalCaseId(ambulanceCase.id)}
                          className="text-xs"
                        >
                          + Request Specialist
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEquipmentModalCaseId(ambulanceCase.id)}
                          className="text-xs"
                        >
                          + Request Equipment
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPrepNoteModalCaseId(ambulanceCase.id)}
                          className="text-xs"
                        >
                          + Prep Note
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: Reject Case Reason */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!rejectModalCaseId}
        onClose={() => setRejectModalCaseId(null)}
        title="Divert / Reject Incoming Ambulance Case (Simulated Decision)"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              Simulated intake diversion: The ambulance telemetry module will notify the crew to redirect the patient to an alternate facility.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Diversion Reason
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
            >
              <option value="Critical bed capacity reached; diverting to Osmania General">
                Critical bed capacity reached; diverting to Osmania General
              </option>
              <option value="Cardiac Cath Lab occupied with ongoing emergency PCI">
                Cardiac Cath Lab occupied with ongoing emergency PCI
              </option>
              <option value="CT Scanner under emergency calibration for 45 minutes">
                CT Scanner under emergency calibration for 45 minutes
              </option>
              <option value="Mass casualty incident triage underway in trauma bay">
                Mass casualty incident triage underway in trauma bay
              </option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setRejectModalCaseId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (rejectModalCaseId) {
                  rejectPreArrivalCase(rejectReason, rejectModalCaseId);
                  setRejectModalCaseId(null);
                }
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Confirm Diversion (Simulated)
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL: Request More Info */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!moreInfoCaseId}
        onClose={() => setMoreInfoCaseId(null)}
        title="Request Clinical Telemetry from Inbound Ambulance"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Dispatch a high-priority clinical query directly to the 108 ALS paramedic tablet.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Details</label>
            <textarea
              value={moreInfoText}
              onChange={(e) => setMoreInfoText(e.target.value)}
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setMoreInfoCaseId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (moreInfoCaseId) {
                  requestMoreInfoFromEmt(moreInfoText, moreInfoCaseId);
                  setMoreInfoCaseId(null);
                }
              }}
            >
              Transmit Inquiry
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL: Contact Ambulance */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!contactCaseId}
        onClose={() => setContactCaseId(null)}
        title="Direct Line to Ambulance Crew"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Message to EMT Crew</label>
            <textarea
              value={contactText}
              onChange={(e) => setContactText(e.target.value)}
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setContactCaseId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (contactCaseId) {
                  contactEmtFromHospital(contactText, contactCaseId);
                  setContactCaseId(null);
                }
              }}
            >
              Send Priority Radio Dispatch
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL: Request Specialist */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!specialistModalCaseId}
        onClose={() => setSpecialistModalCaseId(null)}
        title="Mobilize Hospital Specialist (Simulated)"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Alert and summon on-call physician specialists for immediate bedside attendance upon ambulance docking.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Specialty</label>
            <select
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
            >
              <option value="Interventional Cardiologist">Interventional Cardiologist (Dr. Suresh Reddy)</option>
              <option value="Stroke Neurologist">Stroke Neurologist (Dr. Sneha Pillai)</option>
              <option value="Trauma Surgeon">Trauma Surgeon (Dr. Vikram Prasad)</option>
              <option value="Pediatric Critical Care">Pediatric Critical Care Specialist</option>
              <option value="Orthopedic On-Call">Orthopedic Trauma Surgeon</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setSpecialistModalCaseId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (specialistModalCaseId) {
                  requestDoctorSpecialist(selectedSpecialist, specialistModalCaseId);
                  setSpecialistModalCaseId(null);
                }
              }}
            >
              Summon Specialist
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL: Request Equipment */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!equipmentModalCaseId}
        onClose={() => setEquipmentModalCaseId(null)}
        title="Order Bedside Equipment Staging (Simulated)"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
            >
              <option value="Biphasic Defibrillator">Biphasic Defibrillator & Pacing Pads</option>
              <option value="Mechanical Ventilator">Mechanical ICU Ventilator (Pre-calibrated)</option>
              <option value="Rapid Infuser & Blood Warmer">Rapid Infuser & Blood Warmer</option>
              <option value="Video Laryngoscope & Difficult Airway Cart">Video Laryngoscope & Difficult Airway Cart</option>
              <option value="Point-of-Care Ultrasound (POCUS)">Point-of-Care Ultrasound (POCUS)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setEquipmentModalCaseId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (equipmentModalCaseId) {
                  requestDoctorEquipment(selectedEquipment, equipmentModalCaseId);
                  setEquipmentModalCaseId(null);
                }
              }}
            >
              Stage Equipment at Bay
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL: Add Preparation Note */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!prepNoteModalCaseId}
        onClose={() => setPrepNoteModalCaseId(null)}
        title="Add Clinical Preparation Note"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Physician Instructions for Receiving Team
            </label>
            <textarea
              value={doctorPrepNote}
              onChange={(e) => setDoctorPrepNote(e.target.value)}
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setPrepNoteModalCaseId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (prepNoteModalCaseId) {
                  addDoctorPreparationNote(doctorPrepNote, prepNoteModalCaseId);
                  setPrepNoteModalCaseId(null);
                }
              }}
            >
              Log Preparation Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
