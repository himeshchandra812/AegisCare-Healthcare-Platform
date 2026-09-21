import React, { useState } from 'react';
import {
  FileText,
  Heart,
  AlertOctagon,
  Shield,
  Phone,
  User,
  Plus,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { DEMO_PATIENTS } from '../../data/mockData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const MedicalProfileView: React.FC = () => {
  const [patient, setPatient] = useState(DEMO_PATIENTS[0]);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success" size="md">
              Verified Emergency Health Passport
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Auto-transmitted during SOS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Digital Medical Profile
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Critical medical details formatted for instant reading by paramedics, first responders, and emergency room clinicians.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
          <Lock className="w-4 h-4 text-emerald-700" />
          <span>Patient Controlled Consent</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Emergency Health Card */}
        <Card variant="default" padding="lg" className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Primary Patient Information
            </h2>
            <span className="text-xs text-slate-400">ID: {patient.id}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={patient.name}
                onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Age & Gender
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={patient.age}
                  onChange={(e) => setPatient({ ...patient, age: Number(e.target.value) })}
                  className="w-24 px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
                <input
                  type="text"
                  value={patient.gender}
                  onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Blood Group Type
              </label>
              <input
                type="text"
                value={patient.bloodType}
                onChange={(e) => setPatient({ ...patient, bloodType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-red-300 text-base font-black text-red-900 focus:outline-none focus:ring-2 focus:ring-red-600 bg-red-50/50"
              />
            </div>
          </div>
        </Card>

        {/* Critical Allergies & Chronic Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="emergency" padding="md" className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-700" />
              <h3 className="font-bold text-base text-red-950">Severe Allergies</h3>
            </div>
            <p className="text-xs text-red-900 font-medium">
              Paramedics are alerted automatically prior to administering medication.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {patient.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-red-200 text-red-950 font-bold text-xs border border-red-300"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </Card>

          <Card variant="neutral" padding="md" className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-sky-700" />
              <h3 className="font-bold text-base text-slate-900">Chronic Conditions</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Reported to receiving emergency physicians for differential diagnosis.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {patient.chronicConditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300"
                >
                  {cond}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Emergency Contact & Insurance */}
        <Card variant="default" padding="lg" className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
            Emergency Contacts & Insurance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Primary Emergency Contact (Next of Kin)
              </span>
              <div className="font-bold text-slate-900 text-base">
                {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
              </div>
              <div className="text-sky-800 font-bold">{patient.emergencyContact.phone}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Medical Insurance Coverage
              </span>
              <div className="font-bold text-slate-900 text-base">{patient.insuranceProvider}</div>
              <div className="text-slate-600 font-mono text-xs">
                Policy: {patient.policyNumber}
              </div>
            </div>
          </div>
        </Card>

        {/* Save confirmation */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Medical profile changes updated in prototype memory.</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              Changes reflect in the emergency pre-arrival telemetry demo.
            </span>
          )}

          <Button type="submit" variant="primary" size="md">
            Save Medical Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
