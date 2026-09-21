import React from 'react';
import {
  Settings,
  Type,
  RotateCcw,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const SettingsView: React.FC = () => {
  const {
    isLargeText,
    toggleLargeText,
    resetSimulatedEmergency,
    setIsRoleSelectorOpen,
    currentRoleProfile,
  } = useApp();

  const PLANNED_CATEGORIES = [
    { name: 'Smart Ambulance', status: 'Foundation Built (Live Telemetry & Fleet)' },
    { name: 'Hospital Finder', status: 'Foundation Built (Wait Times & Bed Sync)' },
    { name: 'Hospital Pre-Arrival', status: 'Foundation Built (Vitals Telemetry Handover)' },
    { name: 'Navigation', status: 'Foundation Built (Corridor Routing Preview)' },
    { name: 'Traffic Awareness', status: 'Foundation Built (Pre-Emption Corridor)' },
    { name: 'Doctor Finder', status: 'Foundation Built (On-Call Specialist Directory)' },
    { name: 'Traveller Healthcare', status: 'Foundation Built (Multilingual Emergency Cards)' },
    { name: 'Digital Medical Profile', status: 'Foundation Built (Elderly Accessible Health Pass)' },
    { name: 'AI Features', status: 'Planned for Stage 2 (Triage & Triage Pre-screening)' },
    { name: 'Notifications', status: 'Foundation Built (Severity & Persona Alerts)' },
    { name: 'Family Tracking', status: 'Foundation Built (Consent-based Senior Safety)' },
    { name: 'Hospital Dashboard', status: 'Foundation Built (Coordinator & Admin Personas)' },
    { name: 'Ambulance Operator Dashboard', status: 'Foundation Built (Driver & EMT Personas)' },
    { name: 'Security & Privacy', status: 'Foundation Built (Role Access Architecture)' },
    { name: 'Analytics', status: 'Foundation Built (Stage 2 Blueprint & KPIs)' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="neutral" size="md">
              System Settings & Accessibility
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Prototype Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Settings & Platform Configuration
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Configure accessibility preferences, adjust typography for senior users aged 60+, and inspect the startup platform foundation roadmap.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accessibility & Senior 60+ Controls */}
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Type className="w-5 h-5 text-sky-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Senior & High-Readability Accessibility
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enhance font sizes, line heights, and button contrast across all views for users aged 60+ and those with vision impairment.
          </p>

          <div className="pt-2">
            <button
              onClick={toggleLargeText}
              className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isLargeText
                  ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  Enlarged Typography (60+ Mode)
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Currently: {isLargeText ? 'Enabled (Larger Body & Headers)' : 'Standard Healthcare Sizing'}
                </span>
              </div>
              <Badge variant={isLargeText ? 'info' : 'neutral'} size="sm">
                {isLargeText ? 'Active' : 'Off'}
              </Badge>
            </button>
          </div>
        </Card>

        {/* Demo Simulation Controls */}
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Simulation & Persona State
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Reset active mock emergency dispatch cases or switch the current demo evaluation persona.
          </p>

          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setIsRoleSelectorOpen(true)}
            >
              Switch Role (Current: {currentRoleProfile.title})
            </Button>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={resetSimulatedEmergency}
            >
              Reset Emergency Dispatch State
            </Button>
          </div>
        </Card>
      </div>

      {/* Startup Foundation 15-Feature Matrix */}
      <Card variant="default" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Platform Architecture: 15 Planned Feature Categories
            </h2>
          </div>
          <Badge variant="info" size="sm">
            Foundation Complete
          </Badge>
        </div>

        <p className="text-xs text-slate-600">
          This foundation architecture preserves the full startup vision while maintaining clean separation for upcoming development stages.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {PLANNED_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
            >
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>{cat.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <div className="text-[11px] text-slate-500 font-medium">{cat.status}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
