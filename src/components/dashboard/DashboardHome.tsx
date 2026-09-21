import React from 'react';
import { UserCheck, Shield, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { PatientDashboard } from './roles/PatientDashboard';
import { FamilyDashboard } from './roles/FamilyDashboard';
import { DoctorDashboard } from './roles/DoctorDashboard';
import { EmtDashboard } from './roles/EmtDashboard';
import { AmbulanceOperatorDashboard } from './roles/AmbulanceOperatorDashboard';
import { HospitalAdminDashboard } from './roles/HospitalAdminDashboard';
import { SystemAdminDashboard } from './roles/SystemAdminDashboard';

export const DashboardHome: React.FC = () => {
  const { currentRole, currentRoleProfile, setIsRoleSelectorOpen, logout } = useApp();

  const renderRoleDashboard = () => {
    switch (currentRole) {
      case 'patient':
        return <PatientDashboard />;
      case 'family_member':
        return <FamilyDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'emt':
        return <EmtDashboard />;
      case 'ambulance_operator':
        return <AmbulanceOperatorDashboard />;
      case 'hospital_admin':
        return <HospitalAdminDashboard />;
      case 'system_admin':
        return <SystemAdminDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Universal Demo Persona Bar at top of Dashboard */}
      <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 sm:px-6 sm:py-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Session:
              </span>
              <Badge variant="info" size="sm">
                {currentRoleProfile.title}
              </Badge>
              <span className="text-xs text-slate-400 hidden md:inline">• {currentRoleProfile.category}</span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Logged in as <strong className="text-slate-900">{currentRoleProfile.name}</strong> ({currentRoleProfile.departmentOrAffiliation})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRoleSelectorOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer border border-slate-300"
            title="Switch Demo Role"
          >
            <UserCheck className="w-4 h-4 text-sky-700" />
            <span>Switch Role</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer border border-red-200"
            title="Sign out of this role and return to login page"
          >
            <LogOut className="w-4 h-4 text-red-700" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Custom Dashboard */}
      {renderRoleDashboard()}
    </div>
  );
};
