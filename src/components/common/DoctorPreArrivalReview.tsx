import React, { useState } from 'react';
import {
  Stethoscope,
  HeartPulse,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wind,
  Plus,
  Users,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';

export const DoctorPreArrivalReview: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    activePreArrivalCase,
    reviewPreArrivalCase,
    requestDoctorSpecialist,
    requestDoctorEquipment,
    addDoctorPreparationNote,
    acceptPreArrivalCase,
    smartVitals,
    preArrivalStatus,
  } = useApp();

  const [isSpecialistModalOpen, setIsSpecialistModalOpen] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState('Interventional Cardiologist');

  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState('Biphasic Defibrillator');

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('Patient has high suspicion of Acute Anterior STEMI. Cath lab activated.');

  // Simulated 6-point vital sign trends
  const vitalsHistory = [
    { time: '-15m', hr: 104, bp: '150/95', spo2: 93 },
    { time: '-12m', hr: 108, bp: '148/92', spo2: 94 },
    { time: '-9m', hr: 105, bp: '145/90', spo2: 95 },
    { time: '-6m', hr: 101, bp: '142/90', spo2: 95 },
    { time: '-3m', hr: 99, bp: '140/90', spo2: 96 },
    { time: 'Now', hr: smartVitals.heartRate, bp: smartVitals.bloodPressure, spo2: smartVitals.spO2 },
  ];

  const handleAddSpecialist = () => {
    requestDoctorSpecialist(selectedSpecialist, activePreArrivalCase.id);
    setIsSpecialistModalOpen(false);
  };

  const handleAddEquipment = () => {
    requestDoctorEquipment(selectedEquipment, activePreArrivalCase.id);
    setIsEquipmentModalOpen(false);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addDoctorPreparationNote(noteText.trim(), activePreArrivalCase.id);
    setNoteText('');
    setIsNoteModalOpen(false);
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Stethoscope className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                Clinical Pre-Arrival Triage & Case Review
              </h3>
              <Badge variant="warning" size="sm">
                Prototype
              </Badge>
            </div>
            <p className="text-xs text-indigo-200">
              Dr. Arjun Rao, MD (Lead Emergency Physician) &bull; Case #{activePreArrivalCase.id.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              activePreArrivalCase.emergencyPriority === 'Critical (Red)'
                ? 'danger'
                : activePreArrivalCase.emergencyPriority === 'Urgent (Yellow)'
                ? 'warning'
                : 'success'
            }
          >
            {activePreArrivalCase.emergencyPriority}
          </Badge>
          <span className="text-xs font-semibold text-indigo-200 bg-white/10 px-2.5 py-1 rounded-lg">
            ETA ~{activePreArrivalCase.estimatedArrivalMin} mins
          </span>
        </div>
      </div>

      {/* Mandatory Simulated Telemetry Banner */}
      <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 font-medium flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Simulated Telemetry:</strong> For demonstration purposes only. Not connected to physical medical monitors or hospital EHR.
          </span>
        </div>
        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0 hidden md:inline-block">
          Non-Diagnostic
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Top Split: Patient Clinical Summary & ECG Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Patient Summary */}
          <div className="lg:col-span-2 p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Patient Clinical Presentation
              </span>
              <span className="text-xs font-bold text-slate-800">
                {activePreArrivalCase.patientName} &bull; {activePreArrivalCase.patientAge}y, {activePreArrivalCase.patientGender}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {activePreArrivalCase.chiefComplaint}. 108 Paramedic administered supplemental oxygen (4L/min via NC), chewable Aspirin 300mg, and sublingual Nitroglycerin 0.4mg with mild pain relief. Green wave corridor pre-emption active.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Triage Priority</span>
                <span className="font-bold text-rose-700">{activePreArrivalCase.emergencyPriority}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Care Category</span>
                <span className="font-bold text-slate-800">{activePreArrivalCase.requiredDepartment}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Receiving Bay</span>
                <span className="font-bold text-sky-800">{activePreArrivalCase.hospitalBay}</span>
              </div>
            </div>
          </div>

          {/* Pre-Hospital ECG Strip Preview */}
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 text-white space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  Pre-Hospital ECG
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">12-LEAD ALS</span>
              </div>

              <div className="font-mono text-xs font-bold text-rose-300 mt-2">
                {smartVitals.ecgStatus}
              </div>

              {/* Graphic ECG Waveform simulator line */}
              <div className="h-10 mt-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-center px-2 overflow-hidden">
                <div className="w-full flex items-center justify-between text-emerald-400 font-mono text-[10px] opacity-80 tracking-widest">
                  ^--v---/\_--^--v---/\_--^--v---/\_
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
              <span>PR: 160ms &bull; QRS: 92ms</span>
              <span className="text-amber-400 font-bold">ST-Elevated (V1-V4)</span>
            </div>
          </div>
        </div>

        {/* Vital Signs Trend Matrix */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              Simulated Vital Signs Trends (En Route Telemetry)
            </span>
            <span className="text-[11px] text-slate-400">Captured every 3 minutes by Unit 108</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {vitalsHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-center text-xs ${
                  item.time === 'Now'
                    ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-500 mb-1">{item.time}</div>
                <div className="font-black text-slate-900">{item.hr} <span className="text-[10px] text-slate-400 font-normal">bpm</span></div>
                <div className="text-[11px] font-semibold text-slate-600">{item.bp}</div>
                <div className="text-[11px] font-bold text-sky-700">{item.spo2}% SpO2</div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Doctor Directives & Specialist Requests */}
        {(activePreArrivalCase.requestedSpecialists.length > 0 ||
          activePreArrivalCase.requestedEquipment.length > 0 ||
          activePreArrivalCase.preparationNotes.length > 0) && (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
            <span className="font-black text-slate-700 uppercase tracking-wider text-[11px]">
              Active Physician Orders for Case:
            </span>
            <div className="flex flex-wrap gap-2">
              {activePreArrivalCase.requestedSpecialists.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 bg-purple-100 text-purple-900 border border-purple-200 rounded-md font-semibold text-xs"
                >
                  Specialist: {s.specialist} ({s.status})
                </span>
              ))}
              {activePreArrivalCase.requestedEquipment.map((eq) => (
                <span
                  key={eq.id}
                  className="px-2.5 py-1 bg-teal-100 text-teal-900 border border-teal-200 rounded-md font-semibold text-xs"
                >
                  Equipment: {eq.equipment} ({eq.status})
                </span>
              ))}
            </div>

            {activePreArrivalCase.preparationNotes.map((n) => (
              <div key={n.id} className="text-slate-700 text-xs italic bg-white p-2 rounded border border-slate-200">
                "{n.text}" — <span className="font-bold">{n.author}</span> ({n.timestamp})
              </div>
            ))}
          </div>
        )}

        {/* Doctor Clinical Actions (Section 3 of Prompt) */}
        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Action 1: Review Case */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => reviewPreArrivalCase(activePreArrivalCase.id)}
              className="bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 font-bold flex items-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4 text-indigo-700" />
              <span>Mark Case Under Review</span>
            </Button>

            {/* Action 2: Request Specialist */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSpecialistModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Request Specialist</span>
            </Button>

            {/* Action 3: Request Equipment */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEquipmentModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Wind className="w-4 h-4 text-teal-600" />
              <span>Request Equipment</span>
            </Button>

            {/* Action 4: Add Preparation Note */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNoteModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Add Preparation Note</span>
            </Button>
          </div>

          <div>
            {/* Action 5: Accept Patient */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => acceptPreArrivalCase(activePreArrivalCase.id)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Patient Intake (Direct Bay Transfer)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Specialist Modal */}
      <Modal
        isOpen={isSpecialistModalOpen}
        onClose={() => setIsSpecialistModalOpen(false)}
        title="Summon On-Call Specialist"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Request on-call specialist attendance at emergency trauma dock prior to arrival.
          </p>
          <select
            value={selectedSpecialist}
            onChange={(e) => setSelectedSpecialist(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:outline-none bg-white"
          >
            <option value="Interventional Cardiologist">Interventional Cardiologist (Primary PCI)</option>
            <option value="Stroke Neurologist">Stroke Neurologist (Endovascular Thrombectomy)</option>
            <option value="Trauma & Critical Care Surgeon">Trauma & Critical Care Surgeon</option>
            <option value="Interventional Radiologist">Interventional Radiologist</option>
          </select>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsSpecialistModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddSpecialist}>
              Summon Specialist
            </Button>
          </div>
        </div>
      </Modal>

      {/* Equipment Modal */}
      <Modal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        title="Order Bedside Emergency Equipment"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Stage critical life-support apparatus at designated trauma bay.
          </p>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:outline-none bg-white"
          >
            <option value="Biphasic Defibrillator">Biphasic Defibrillator</option>
            <option value="ICU Ventilator">ICU Ventilator</option>
            <option value="Rapid Infuser & Blood Line">Rapid Infuser & Blood Line</option>
            <option value="Video Laryngoscope">Video Laryngoscope</option>
          </select>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsEquipmentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddEquipment}>
              Stage Equipment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Physician Preparation Note"
        size="md"
      >
        <div className="space-y-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none"
            placeholder="Enter clinical instructions..."
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddNote}>
              Save Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
