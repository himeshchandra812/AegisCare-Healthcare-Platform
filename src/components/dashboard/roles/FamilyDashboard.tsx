import React, { useState } from 'react';
import {
  HeartHandshake,
  Ambulance,
  Building2,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  Bell,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { DemoAlertsBanner } from '../../common/DemoAlertsBanner';
import { DEMO_PATIENTS, DEMO_HOSPITALS } from '../../../data/mockData';

export const FamilyDashboard: React.FC = () => {
  const {
    setCurrentView,
    smartPatientName,
    smartPatientAge,
    smartPatientGender,
    smartTransportStatus,
    smartGpsLocation,
    smartDestinationHospital,
    smartEtaMinutes,
    smartHospitalPrepStatus,
    smartSeverity,
    smartSimulatedConsent,
    toggleSmartConsent,
    smartTimeline,
    smartAlerts,
    smartHospitalBay,
    preArrivalStatus,
  } = useApp();

  const patient = DEMO_PATIENTS[0];
  const hospital = DEMO_HOSPITALS[0];

  const [lastCheckinPing, setLastCheckinPing] = useState('Just now');
  const [pingMessage, setPingMessage] = useState<string | null>(null);

  const handleSendFamilyPing = () => {
    setPingMessage('Caregiver ping sent to Unit 108 ambulance crew...');
    setTimeout(() => {
      setLastCheckinPing('Just now');
      setPingMessage(
        `Crew response: Patient is in stable posture under active monitoring. ETA to ${smartDestinationHospital} is ~${smartEtaMinutes} minutes.`
      );
      setTimeout(() => setPingMessage(null), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Active Demo Alerts Banner */}
      <DemoAlertsBanner />

      {/* Header with Privacy & Consent Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="md">
              Caregiver & Family Portal
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Rajesh Reddy (Son)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Family Emergency Tracking
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Live status monitoring, verified hospital destination, and consent management for monitored family members.
          </p>
        </div>

        {/* Consent Status Badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl">
          {smartSimulatedConsent ? (
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          ) : (
            <Lock className="w-5 h-5 text-amber-700 shrink-0" />
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {smartSimulatedConsent ? 'Consent Granted' : 'Privacy Restricted'}
            </div>
            <div className="text-[11px] text-slate-600">
              {smartSimulatedConsent
                ? 'Permitted data sharing active'
                : 'Detailed medical data masked'}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Monitored Patient Card - Strictly Permitted Info */}
      <div className="bg-linear-to-r from-rose-50 via-white to-sky-50 rounded-2xl border-2 border-rose-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-rose-800">
                Monitored Family Member
              </span>
              <Badge variant="warning" size="sm">Case In Progress</Badge>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {smartPatientName}
              </h2>
              <span className="text-sm font-semibold text-slate-600">
                Mother, Age {smartPatientAge} • Blood: O+
              </span>
            </div>

            {/* Permitted Patient Status Description */}
            <p className="text-sm text-slate-700 max-w-xl">
              <strong className="text-slate-900">Patient Status:</strong> En route under professional care with certified 108 Emergency Medical Technicians. Pre-arrival alert transmitted to receiving hospital emergency room.
            </p>
          </div>

          {/* Permitted Status Snapshot */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-white/90 p-4 rounded-xl border border-rose-200 shadow-2xs">
            <div className="px-3 py-1.5 border-r border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ambulance Status</span>
              <span className="text-base font-black text-sky-800 block mt-0.5">
                {smartTransportStatus}
              </span>
            </div>

            <div className="px-3 py-1.5 border-r border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Arrival</span>
              <span className="text-lg font-black text-emerald-700 block mt-0.5">
                {smartTransportStatus === 'Arrived at Hospital' ? 'Arrived' : `~${smartEtaMinutes} mins`}
              </span>
            </div>

            <div className="px-3 py-1.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospital Prep</span>
              <span className="text-xs font-black text-slate-900 block mt-1">
                {smartHospitalPrepStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: 6 PERMITTED INFORMATION FIELDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ambulance Location, Destination Hospital, and Notifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Ambulance Status, Simulated Location, and Destination */}
          <Card variant="default" padding="lg" className="border-sky-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800">
                  <Ambulance className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Live Ambulance Tracking & Destination
                  </h3>
                  <p className="text-xs text-slate-500">
                    Permitted family tracking view • Hyderabad 108 Emergency Network
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
                  Estimated Arrival
                </span>
                <span className="text-2xl font-black text-slate-900 flex items-center justify-end gap-1">
                  <Clock className="w-5 h-5 text-sky-600" />
                  {smartTransportStatus === 'Arrived at Hospital' ? 'Arrived' : `~${smartEtaMinutes} mins`}
                </span>
              </div>
            </div>

            {/* Route Map Preview */}
            <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Simulated Ambulance Location
                </span>
                <span className="font-mono text-emerald-400">{smartGpsLocation.coordinates}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current Corridor</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {smartGpsLocation.address}
                  </div>
                </div>
                <Badge variant="success" size="sm">{smartGpsLocation.corridorStatus}</Badge>
              </div>

              {/* Destination Hospital */}
              <div className="p-3 rounded-lg bg-sky-950/80 border border-sky-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-sky-300 uppercase font-bold tracking-wider">Destination Hospital</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {smartDestinationHospital}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Assigned Bay: {smartHospitalBay}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Pre-Arrival Status</span>
                  <Badge variant="info" size="sm">{preArrivalStatus}</Badge>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Status checked: {lastCheckinPing}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendFamilyPing}
                  className="text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Send Caregiver Check-In</span>
                </Button>
              </div>
            </div>

            {pingMessage && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 animate-fade-in">
                {pingMessage}
              </div>
            )}
          </Card>

          {/* Important Notifications Section */}
          <Card variant="default" padding="lg">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-700" />
              <span>Important Notifications & Updates</span>
            </h3>

            <div className="space-y-3">
              {smartTimeline.slice(-3).reverse().map((event) => (
                <div key={event.id} className="flex gap-3 text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-2 rounded-full bg-sky-500 shrink-0 my-0.5"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{event.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Permission Status & Consent Boundary */}
        <div className="space-y-6">
          {/* Simulated Consent Control */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <span>Simulated Patient Consent</span>
              </h3>
              <Badge variant={smartSimulatedConsent ? 'success' : 'warning'} size="sm">
                {smartSimulatedConsent ? 'Granted' : 'Restricted'}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              In accordance with health privacy regulations, detailed medical records and raw diagnostic telemetry are not displayed to caregivers without explicit simulated patient consent.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Consent Setting</span>
                <span className="text-slate-500 text-[11px]">
                  {smartSimulatedConsent
                    ? 'Patient has granted emergency medical summary access to primary caregiver.'
                    : 'Medical history is restricted to prevent unauthorized disclosure.'}
                </span>
              </div>

              <Button
                variant={smartSimulatedConsent ? 'outline' : 'primary'}
                size="sm"
                onClick={toggleSmartConsent}
                className="w-full text-xs"
              >
                {smartSimulatedConsent ? 'Restrict Consent (Mask Details)' : 'Simulate Granting Consent'}
              </Button>
            </div>
          </Card>

          {/* Permitted Medical Information (Consent-Gated) */}
          <Card variant="default" padding="lg">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-700" />
              <span>Medical Summary Overview</span>
            </h3>

            {smartSimulatedConsent ? (
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-900 font-bold block text-[11px]">Permitted Health Overview:</span>
                  <span className="text-slate-800">
                    Patient is conscious and receiving supplemental oxygen. Vital signs are continuously monitored by the paramedic team.
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Recorded Allergies:</span>
                  <span className="font-bold text-rose-700">{patient.allergies.join(', ')}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Insurance Verification:</span>
                  <span className="font-medium text-slate-900">{patient.insuranceProvider}</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Medical Information Masked</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  Detailed medical history, specific clinical diagnostic telemetry, and medication charts are hidden. Only permitted tracking, hospital destination, and high-level notifications are visible.
                </p>
              </div>
            )}
          </Card>

          {/* Emergency Family Contacts */}
          <Card variant="default" padding="lg">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Emergency Contacts</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Rajesh Reddy (You)</div>
                  <div className="text-slate-500 text-[11px]">Primary Contact • Son</div>
                </div>
                <Badge variant="info" size="sm">Primary</Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Receiving ER Desk</div>
                  <div className="text-slate-500 text-[11px]">Hyderabad Apex Trauma Bay</div>
                </div>
                <span className="text-slate-700 font-mono text-[11px]">+91 40 2360 7777</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
