import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  MapPin,
  Bell,
  Heart,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const FamilyTrackingView: React.FC = () => {
  const [notifyTransit, setNotifyTransit] = useState(true);
  const [notifyHospital, setNotifyHospital] = useState(true);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="md">
              Caregiver & Senior Safety (India)
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Consent-Verified Link</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Family Tracking & Caregiver Alerts
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Keep family members informed during emergency dispatches and hospital admissions with privacy-first consent controls across India.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Bi-directional Caregiver Consent Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tracked Family Member Card */}
        <div className="md:col-span-2 space-y-4">
          <Card variant="default" padding="lg">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center font-bold text-lg">
                  LD
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Lakshmi Devi (Mother)</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Age 71 • Senior Citizen Monitoring Active
                  </p>
                </div>
              </div>
              <Badge variant="success" size="sm">
                Safe / Monitored
              </Badge>
            </div>

            {/* Current Status */}
            <div className="py-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Simulated Current Location:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  Road No. 12, Banjara Hills, Hyderabad
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Emergency Assistance Trigger:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready (Auto-SMS configured to Arjun Reddy)
                </span>
              </div>
            </div>

            {/* Notification triggers */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Caregiver Notification Rules (SMS / WhatsApp)
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 block">
                      Ambulance Dispatch Alert
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Receive an instant push alert and SMS/WhatsApp if an ambulance is dispatched to Lakshmi Devi.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyTransit}
                    onChange={(e) => setNotifyTransit(e.target.checked)}
                    className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 block">
                      Hospital ER Arrival Confirmation
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Receive notification when ambulance reaches ER trauma bay with assigned attending doctor.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyHospital}
                    onChange={(e) => setNotifyHospital(e.target.checked)}
                    className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card variant="neutral" padding="md" className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Primary Caregiver Contact</h3>
            <div className="text-xs text-slate-700 space-y-1">
              <div><strong>Name:</strong> Arjun Reddy</div>
              <div><strong>Relationship:</strong> Son / Designated Healthcare Proxy</div>
              <div><strong>Phone:</strong> +91 98480 22334</div>
            </div>
          </Card>

          <Card variant="highlight" padding="md" className="space-y-2 text-xs text-sky-950">
            <div className="font-bold text-sm">Privacy & Security Promise</div>
            <p className="leading-relaxed text-sky-900">
              Location tracking operates only under active consent or during verified 112/108 emergency dispatch workflows. Constant background surveillance is strictly opt-in under Digital Personal Data Protection (DPDP) compliance.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
