import React from 'react';
import { ShieldAlert, ArrowLeft, Users, Lock, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { NavigationItemId, ROLE_PERMITTED_VIEWS } from '../../types';

interface AccessRestrictedViewProps {
  attemptedView: NavigationItemId;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({ attemptedView }) => {
  const { currentRole, currentRoleProfile, setCurrentView, setIsRoleSelectorOpen } = useApp();

  // Find roles that have access to this view
  const authorizedRoles = Object.entries(ROLE_PERMITTED_VIEWS)
    .filter(([_, allowedViews]) => allowedViews.includes(attemptedView))
    .map(([role]) => role);

  const getFormatRoleName = (r: string) => {
    switch (r) {
      case 'patient':
        return 'Patient';
      case 'family_member':
        return 'Family Member';
      case 'doctor':
        return 'Doctor';
      case 'emt':
        return 'EMT / Ambulance Staff';
      case 'ambulance_operator':
        return 'Ambulance Operator';
      case 'hospital_admin':
        return 'Hospital Administrator';
      case 'system_admin':
        return 'System Administrator';
      default:
        return r;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card variant="outline" padding="lg" className="border-amber-300 bg-white shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="warning" size="md">
                Role Permission Guard
              </Badge>
              <span className="text-xs text-slate-500 font-medium">RBAC Security Layer</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Access Denied — This feature is not available for your current account.
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              You do not have permission to access this feature in the current demo role.
            </p>
          </div>
        </div>

        {/* Current Role Info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Current Logged-in Persona
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-slate-900 text-base">
                {currentRoleProfile.title}
              </span>
              <span className="text-xs text-slate-600">
                ({currentRoleProfile.name})
              </span>
            </div>
          </div>

          <Badge variant="neutral" size="sm">
            {currentRoleProfile.category}
          </Badge>
        </div>

        {/* Permitted Roles Details */}
        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-sm mb-2">
            <Lock className="w-4 h-4 text-sky-700" />
            <span>Authorized Stakeholder Roles for this Feature:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {authorizedRoles.length > 0 ? (
              authorizedRoles.map((r) => (
                <span
                  key={r}
                  className="px-2.5 py-1 rounded-lg bg-white border border-sky-300 text-sky-900 text-xs font-semibold shadow-2xs"
                >
                  {getFormatRoleName(r)}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Restricted to administrative personnel.</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => setIsRoleSelectorOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Switch to an Authorized Demo Role</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {currentRoleProfile.title} Dashboard</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
