import React, { useState } from 'react';
import {
  AlertTriangle,
  Ambulance,
  Building2,
  Stethoscope,
  HeartHandshake,
  FileText,
  Bell,
  Sparkles,
  Phone,
  Shield,
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  Send,
  User,
  Heart,
  Activity,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { DEMO_HOSPITALS, DEMO_DOCTORS, DEMO_PATIENTS, DEMO_NOTIFICATIONS } from '../../../data/mockData';

export const PatientDashboard: React.FC = () => {
  const {
    setCurrentView,
    setIsEmergencyModalOpen,
    isSimulatedDispatchActive,
    smartDestinationHospital,
    smartEtaMinutes,
    preArrivalStatus,
    smartHospitalBay,
  } = useApp();
  const patient = DEMO_PATIENTS[0]; // Lakshmi Devi / Ananya Reddy

  // AI Healthcare Assistant State
  const [aiSymptom, setAiSymptom] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Simulated emergency contact call trigger
  const [simulatedCallStatus, setSimulatedCallStatus] = useState<string | null>(null);

  const quickSymptoms = [
    'Chest discomfort or pressure',
    'Sudden severe dizziness or fainting',
    'Shortness of breath / wheezing',
    'High fever with intense chills',
  ];

  const handleAskAi = (question: string) => {
    setIsAiLoading(true);
    setAiSymptom(question);
    setTimeout(() => {
      setIsAiLoading(false);
      if (question.toLowerCase().includes('chest') || question.toLowerCase().includes('breath')) {
        setAiResponse(
          'CRITICAL ALERT GUIDANCE: Symptoms such as chest discomfort or shortness of breath require immediate emergency evaluation. Please tap "Request Emergency Help (112)" or proceed to the nearest trauma hospital. Avoid exertion, sit comfortably, and inform family members.'
        );
      } else if (question.toLowerCase().includes('dizziness') || question.toLowerCase().includes('faint')) {
        setAiResponse(
          'URGENT PRE-TRIAGE: Sudden dizziness can indicate cardiovascular, neurological, or hydration imbalances. Lie down flat, elevate legs slightly, measure blood pressure if available, and contact your doctor or 112 if dizziness persists.'
        );
      } else {
        setAiResponse(
          'SYMPTOM SUMMARY: For acute fevers or discomfort, stay hydrated, monitor temperature every 2 hours, and review with an on-call physician. If fever exceeds 102°F or is accompanied by confusion, seek immediate hospital urgent care.'
        );
      }
    }, 600);
  };

  const handleSimulateCall = (name: string, phone: string) => {
    setSimulatedCallStatus(`Connecting simulated call to ${name} (${phone})...`);
    setTimeout(() => {
      setSimulatedCallStatus(`Call active with ${name}. Real emergency calls should dial 112 directly.`);
      setTimeout(() => setSimulatedCallStatus(null), 4500);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 5 Prominent Accessible Action Buttons for Patients & Elderly (60+) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info" size="sm">
                Patient & Senior Portal
              </Badge>
              <span className="text-xs text-slate-500 font-medium">Hyderabad Regional Node</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome back, Ananya
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Quick access to emergency dispatch, certified hospital ERs, your digital health passport, and family safety.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              112 Dispatch Ready
            </span>
          </div>
        </div>

        {/* The 5 Required Prominent Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Button 1: Request Emergency Help */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-center transition-all shadow-sm active:scale-98 cursor-pointer col-span-2 sm:col-span-1"
          >
            <AlertTriangle className="w-7 h-7 mb-1.5 animate-bounce" />
            <span className="text-sm sm:text-base leading-tight">Request Emergency Help</span>
            <span className="text-[11px] text-red-100 font-normal mt-0.5">1-Tap 112 SOS</span>
          </button>

          {/* Button 2: Find Hospital */}
          <button
            onClick={() => setCurrentView('hospitals')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold text-center transition-all cursor-pointer"
          >
            <Building2 className="w-6 h-6 text-sky-700 mb-1.5" />
            <span className="text-sm leading-tight">Find Hospital</span>
            <span className="text-[11px] text-sky-600 font-normal mt-0.5">Wait times & ER beds</span>
          </button>

          {/* Button 3: View Medical Profile */}
          <button
            onClick={() => setCurrentView('medical_profile')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-bold text-center transition-all cursor-pointer"
          >
            <FileText className="w-6 h-6 text-teal-700 mb-1.5" />
            <span className="text-sm leading-tight">View Medical Profile</span>
            <span className="text-[11px] text-teal-600 font-normal mt-0.5">Ayushman & Allergies</span>
          </button>

          {/* Button 4: Contact Family */}
          <button
            onClick={() => setCurrentView('family_tracking')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-bold text-center transition-all cursor-pointer"
          >
            <HeartHandshake className="w-6 h-6 text-rose-700 mb-1.5" />
            <span className="text-sm leading-tight">Contact Family</span>
            <span className="text-[11px] text-rose-600 font-normal mt-0.5">Live safety sharing</span>
          </button>

          {/* Button 5: View Alerts */}
          <button
            onClick={() => setCurrentView('notifications')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-center transition-all cursor-pointer"
          >
            <Bell className="w-6 h-6 text-amber-700 mb-1.5" />
            <span className="text-sm leading-tight">View Alerts</span>
            <span className="text-[11px] text-amber-700 font-normal mt-0.5">3 active alerts</span>
          </button>
        </div>
      </div>

      {/* Simulated Call Notification Bar if Active */}
      {simulatedCallStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-700 animate-pulse" />
            <span className="font-semibold">{simulatedCallStatus}</span>
          </div>
          <Badge variant="success" size="sm">Simulated</Badge>
        </div>
      )}

      {/* Live Ambulance Dispatch & Pre-Arrival Banner */}
      {(isSimulatedDispatchActive || preArrivalStatus !== 'Not Sent') && (
        <div className="bg-sky-950 text-white rounded-2xl p-5 shadow-md border-2 border-sky-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-800 border border-sky-700 flex items-center justify-center shrink-0">
              <Ambulance className="w-6 h-6 text-sky-300 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Active Emergency Transport
                </span>
                <Badge variant="warning" size="sm">Unit 108-Hyd-42</Badge>
                <Badge variant="info" size="sm">Status: {preArrivalStatus}</Badge>
              </div>
              <p className="text-sm font-medium text-slate-100 mt-1">
                Destination: <strong>{smartDestinationHospital} ({smartHospitalBay})</strong> &bull; Estimated Arrival: ~{smartEtaMinutes} mins
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => setCurrentView('smart_ambulance')}
            className="shrink-0 bg-white text-sky-900 hover:bg-slate-100 font-bold"
          >
            Track Ambulance Live
          </Button>
        </div>
      )}

      {/* Main Grid: AI Assistant & Healthcare Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Healthcare Assistant + Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Healthcare Assistant Card */}
          <Card variant="default" padding="lg" className="border-sky-200 bg-linear-to-b from-sky-50/40 to-white">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    AI Healthcare Assistant (Simulated Triage)
                  </h2>
                  <p className="text-xs text-slate-600">
                    Instant emergency pre-screening and medical guidance assistance.
                  </p>
                </div>
              </div>
              <Badge variant="info" size="sm">
                Prototype Assistant
              </Badge>
            </div>

            {/* Disclaimer */}
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Demo decision-support indicator — not a medical diagnosis.</strong> Always call 112/108 for life-threatening emergencies.
              </span>
            </div>

            {/* Quick symptom chips */}
            <div className="space-y-1.5 mb-3">
              <span className="text-xs font-bold text-slate-700 block">
                Select common emergency symptom or ask below:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickSymptoms.map((sym, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAi(sym)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-sky-500 hover:bg-sky-50 text-slate-700 font-medium transition-all text-left cursor-pointer"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Query Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Describe symptoms (e.g. sharp abdominal pain, palpitations)..."
                value={aiSymptom}
                onChange={(e) => setAiSymptom(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && aiSymptom && handleAskAi(aiSymptom)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
              />
              <Button
                variant="primary"
                onClick={() => aiSymptom && handleAskAi(aiSymptom)}
                disabled={isAiLoading || !aiSymptom}
                className="shrink-0"
              >
                {isAiLoading ? 'Evaluating...' : <Send className="w-4 h-4" />}
              </Button>
            </div>

            {/* AI Response Display */}
            {aiResponse && (
              <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed animate-fade-in">
                <div className="flex items-center gap-2 text-sky-900 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Assistant Triage Guidance:</span>
                </div>
                <p>{aiResponse}</p>
              </div>
            )}
          </Card>

          {/* Nearby Emergency Hospitals Preview */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Nearby Emergency Hospitals (Hyderabad)
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time bed availability and estimated drive times.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('hospitals')}
                className="text-xs"
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {DEMO_HOSPITALS.slice(0, 2).map((hosp) => (
                <div
                  key={hosp.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{hosp.name}</span>
                      <Badge variant="success" size="sm">{hosp.traumaLevel}</Badge>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {hosp.distanceKm} km ({hosp.estimatedDriveMin} min drive)
                      </span>
                      <span className="font-semibold text-emerald-700">
                        {hosp.availableBeds.er} ER beds open
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView('hospitals')}
                      className="text-xs"
                    >
                      ER Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsEmergencyModalOpen(true)}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      Dispatch Here
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Doctor Finder & Consultations Preview */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Doctor Consultations & Specialist Finder
                </h2>
                <p className="text-xs text-slate-500">
                  Verified emergency specialists, cardiologists, and geriatricians.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('doctors')}
                className="text-xs"
              >
                Find Specialists
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_DOCTORS.slice(0, 2).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{doc.name}</span>
                      <Badge variant="info" size="sm">{doc.availability}</Badge>
                    </div>
                    <div className="text-xs font-medium text-teal-800">{doc.specialty}</div>
                    <div className="text-xs text-slate-500 mt-1">{doc.hospitalAffiliation}</div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      ₹{doc.consultationFeeInr}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView('doctors')}
                      className="text-xs"
                    >
                      Book Consult
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Personal Health Profile, Family & Emergency Contacts */}
        <div className="space-y-6">
          {/* Digital Medical Profile Summary */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Digital Health Passport</span>
              </h2>
              <Badge variant="success" size="sm">Ayushman Linked</Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{patient.name} ({patient.age}y, {patient.bloodType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Known Allergies:</span>
                <span className="font-bold text-red-700">{patient.allergies.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Conditions:</span>
                <span className="font-semibold text-slate-800">{patient.chronicConditions.slice(0, 2).join(', ')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Insurance:</span>
                <span className="font-medium text-slate-800 text-[11px] truncate max-w-[160px]">
                  {patient.insuranceProvider}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('medical_profile')}
              className="w-full mt-3 text-xs"
            >
              Open Full Health Profile
            </Button>
          </Card>

          {/* Emergency Contacts & Family Sharing */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-rose-700" />
                <span>Emergency Contacts</span>
              </h2>
              <Badge variant="neutral" size="sm">Active Sharing</Badge>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {patient.emergencyContact.phone}
                  </div>
                </div>
                <button
                  onClick={() => handleSimulateCall(patient.emergencyContact.name, patient.emergencyContact.phone)}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                  title="Simulate Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    Dr. Santosh Deshmukh (Physician)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    +91 40 2452 1100
                  </div>
                </div>
                <button
                  onClick={() => handleSimulateCall('Dr. Santosh Deshmukh', '+91 40 2452 1100')}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                  title="Simulate Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('family_tracking')}
              className="w-full mt-3 text-xs"
            >
              Manage Family Permissions
            </Button>
          </Card>

          {/* Traveller Healthcare Shortcut */}
          <Card variant="default" padding="lg" className="bg-orange-50/40 border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-orange-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Traveller Healthcare Pass
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Generate multilingual emergency cards in Telugu, Hindi, Tamil, Kannada, and Marathi for transit.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('traveller')}
              className="w-full text-xs border-orange-300 text-orange-900 hover:bg-orange-100"
            >
              Open Traveller Cards
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
