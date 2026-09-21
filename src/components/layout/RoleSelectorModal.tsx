import React from 'react';
import {
  User,
  HeartHandshake,
  Ambulance,
  Stethoscope,
  Building,
  Shield,
  Briefcase,
  Radio,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { DEMO_ROLES } from '../../data/mockData';
import { UserRole } from '../../types';
import { Badge } from '../common/Badge';

export const RoleSelectorModal: React.FC = () => {
  const { isRoleSelectorOpen, setIsRoleSelectorOpen, currentRole, setCurrentRole } = useApp();

  const getRoleIcon = (roleId: UserRole) => {
    switch (roleId) {
      case 'patient':
        return <User className="w-5 h-5 text-sky-700" />;
      case 'family_member':
        return <HeartHandshake className="w-5 h-5 text-rose-700" />;
      case 'doctor':
        return <Stethoscope className="w-5 h-5 text-teal-700" />;
      case 'emt':
        return <Ambulance className="w-5 h-5 text-emerald-700" />;
      case 'ambulance_operator':
        return <Radio className="w-5 h-5 text-amber-700" />;
      case 'hospital_admin':
        return <Building className="w-5 h-5 text-indigo-700" />;
      case 'system_admin':
        return <Shield className="w-5 h-5 text-slate-700" />;
      default:
        return <User className="w-5 h-5 text-slate-700" />;
    }
  };

  const handleSelect = (roleKey: UserRole) => {
    setCurrentRole(roleKey);
    setIsRoleSelectorOpen(false);
  };

  const roleEntries = Object.entries(DEMO_ROLES) as [UserRole, typeof DEMO_ROLES[UserRole]][];

  return (
    <Modal
      isOpen={isRoleSelectorOpen}
      onClose={() => setIsRoleSelectorOpen(false)}
      title="Demo Role Selector"
      subtitle="Select a role to test role-specific dashboards, navigation, and workflows."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Mandatory Demo Mode notice */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-black text-amber-900 flex items-center gap-1.5">
              <span>Demo Mode — Simulated User Access</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              This selector allows evaluators to preview role-based dashboards and navigation. This is a functional prototype with simulated data; it is not real identity verification.
            </p>
          </div>
        </div>

        {/* List of 7 Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {roleEntries.map(([key, role]) => {
            const isSelected = currentRole === key;

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[96px] relative ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50/90 ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {getRoleIcon(key)}
                </div>

                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-900 text-base">{role.title}</span>
                    <Badge variant={isSelected ? 'info' : 'neutral'} size="sm">
                      {role.category}
                    </Badge>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Fictional User: <span className="text-slate-900">{role.name}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {role.description}
                  </p>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-sky-700 absolute top-4 right-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
