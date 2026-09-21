import React, { useState } from 'react';
import {
  AlertTriangle,
  Ambulance,
  PhoneCall,
  CheckCircle,
  Clock,
  Building2,
  HeartPulse,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const EmergencyModal: React.FC = () => {
  const {
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    triggerSimulatedEmergency,
    activeCase,
    isSimulatedDispatchActive,
    isSubmittingSOS,
    resetSimulatedEmergency,
    setCurrentView,
    t,
  } = useApp();

  const [step, setStep] = useState<'prompt' | 'dispatched'>(
    isSimulatedDispatchActive ? 'dispatched' : 'prompt'
  );

  const handleTrigger = async () => {
    await triggerSimulatedEmergency();
    setStep('dispatched');
  };

  const handleViewLiveDispatch = () => {
    setIsEmergencyModalOpen(false);
    setCurrentView('smart_ambulance');
  };

  const handleReset = () => {
    resetSimulatedEmergency();
    setStep('prompt');
  };

  return (
    <Modal
      isOpen={isEmergencyModalOpen}
      onClose={() => setIsEmergencyModalOpen(false)}
      title="Emergency Assistance Portal (India 112)"
      subtitle="Rapid Response Dispatch and Pre-Arrival Notification (Simulation)"
      maxWidth="lg"
    >
      {/* Real Emergency Warning Banner */}
      <div className="p-4 rounded-xl bg-red-100 border-2 border-red-300 text-red-950 flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-red-700 shrink-0 mt-0.5" />
        <div>
          <div className="font-extrabold text-red-900 text-base">
            REAL-WORLD EMERGENCY WARNING (INDIA)
          </div>
          <p className="text-sm text-red-900 mt-0.5 leading-relaxed font-medium">
            This application is a <strong>software prototype for system demonstration</strong>. It is <strong>NOT</strong> connected to India's 112 or 108 emergency dispatch control rooms. If you or someone near you is experiencing a medical emergency, dial <strong className="text-red-950 font-black underline text-base">112</strong> or <strong className="text-red-950 font-black underline text-base">108</strong> on your phone immediately.
          </p>
        </div>
      </div>

      {step === 'prompt' ? (
        <div className="space-y-5 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Simulate 1-Tap Emergency Assistance (India)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In the fully deployed platform, pressing this triggers immediate GPS triangulation across Hyderabad/Telangana, dispatches the closest Unit 108 Smart Ambulance equipped with telemetry, and transmits the patient’s digital medical profile directly to the receiving trauma center.
            </p>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-950 text-sm space-y-2">
            <div className="font-bold flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-sky-700" />
              <span>Pre-Configured Emergency Profile for Lakshmi Devi (71, Hyderabad)</span>
            </div>
            <ul className="text-xs text-sky-900 space-y-1 list-disc pl-5">
              <li>Blood Type: B+ | Severe Allergies: Penicillin, Sulfa Drugs</li>
              <li>Primary Emergency Contact: Arjun Reddy (Son - +91 98480 22334)</li>
              <li>Receiving Facility Default: Hyderabad Apex Trauma & Multi-Speciality (Demo)</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="emergency"
              size="lg"
              fullWidth
              icon={<AlertTriangle className="w-6 h-6 text-white" />}
              onClick={handleTrigger}
              disabled={isSubmittingSOS}
            >
              {isSubmittingSOS ? 'TRANSMITTING SOS...' : 'RUN SIMULATED 112 SOS TEST'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => setIsEmergencyModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          {/* Active Simulation Status Card */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
                <span className="font-bold text-lg text-emerald-950">
                  Simulated Unit 108 Dispatched
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="danger" size="md">
                  Case #{activeCase.caseId}
                </Badge>
                {activeCase.dispatchSyncStatus === 'synced_server' ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                    Server Synced
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm">
              <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                <span className="text-xs text-slate-500 font-bold block">Assigned Unit</span>
                <span className="font-bold text-slate-900">{activeCase.assignedAmbulance}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                <span className="text-xs text-slate-500 font-bold block">Estimated Arrival</span>
                <span className="font-bold text-emerald-800 text-base">{activeCase.etaMinutes} Minutes</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                <span className="text-xs text-slate-500 font-bold block">Receiving Hospital</span>
                <span className="font-bold text-slate-900 truncate block">{activeCase.destinationHospital}</span>
              </div>
            </div>
          </div>

          {/* Stepper demonstration */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Simulated Dispatch Sequence
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-slate-800 font-medium">
                  GPS location acquired in Hyderabad (Jubilee Hills) & prioritized
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-slate-800 font-medium">
                  Unit 108-Hyd-42 en route with traffic pre-emption along Road No. 36
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                  ●
                </div>
                <span className="text-slate-900 font-semibold">
                  Pre-arrival clinical telemetry syncing with Hyderabad Apex Trauma Bay
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              icon={<Ambulance className="w-5 h-5 text-white" />}
              onClick={handleViewLiveDispatch}
            >
              Track in Smart Ambulance
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={handleReset}
            >
              Reset Simulation
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
