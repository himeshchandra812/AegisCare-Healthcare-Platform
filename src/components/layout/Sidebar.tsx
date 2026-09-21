import React from 'react';
import {
  Home,
  AlertTriangle,
  Ambulance,
  Building2,
  Stethoscope,
  Globe2,
  FileText,
  Users,
  Bell,
  BarChart3,
  Settings,
  X,
  ChevronRight,
  ShieldCheck,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAVIGATION_ITEMS } from '../../data/mockData';
import { NavigationItemId, canRoleAccessView } from '../../types';
import { Badge } from '../common/Badge';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    currentView,
    setCurrentView,
    currentRole,
    currentRoleProfile,
    unreadNotificationsCount,
    setIsEmergencyModalOpen,
    setIsRoleSelectorOpen,
    logout,
  } = useApp();

  const getIcon = (id: NavigationItemId) => {
    switch (id) {
      case 'home':
        return <Home className="w-5 h-5 shrink-0" />;
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />;
      case 'smart_ambulance':
        return <Ambulance className="w-5 h-5 shrink-0" />;
      case 'hospitals':
        return <Building2 className="w-5 h-5 shrink-0" />;
      case 'doctors':
        return <Stethoscope className="w-5 h-5 shrink-0" />;
      case 'traveller':
        return <Globe2 className="w-5 h-5 shrink-0" />;
      case 'medical_profile':
        return <FileText className="w-5 h-5 shrink-0" />;
      case 'family_tracking':
        return <Users className="w-5 h-5 shrink-0" />;
      case 'notifications':
        return <Bell className="w-5 h-5 shrink-0" />;
      case 'analytics':
        return <BarChart3 className="w-5 h-5 shrink-0" />;
      case 'settings':
        return <Settings className="w-5 h-5 shrink-0" />;
      default:
        return <Home className="w-5 h-5 shrink-0" />;
    }
  };

  const handleNavClick = (id: NavigationItemId, isEmergency?: boolean) => {
    if (isEmergency) {
      setIsEmergencyModalOpen(true);
    }
    setCurrentView(id);
    onCloseMobile();
  };

  // Filter items accessible to the current role and group by category
  const allowedItems = NAVIGATION_ITEMS.filter((i) => canRoleAccessView(currentRole, i.id));
  const coreServices = allowedItems.filter((i) => i.category === 'Core Services');
  const clinicalCare = allowedItems.filter((i) => i.category === 'Clinical & Care');
  const systemPersonal = allowedItems.filter((i) => i.category === 'System & Personal');

  const renderNavGroup = (title: string, items: typeof NAVIGATION_ITEMS) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentView === item.id;
          const isEmergency = item.isEmergency;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, isEmergency)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer min-h-[48px] ${
                isEmergency
                  ? 'bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 font-bold'
                  : isActive
                  ? 'bg-sky-800 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-3">
                <span className={isActive && !isEmergency ? 'text-white' : ''}>
                  {getIcon(item.id)}
                </span>
                <span className="text-base tracking-tight">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.id === 'notifications' && unreadNotificationsCount > 0 && !isActive && (
                  <Badge variant="danger" size="sm">
                    {unreadNotificationsCount}
                  </Badge>
                )}
                {item.badge && item.id !== 'notifications' && (
                  <Badge
                    variant={isEmergency ? 'danger' : isActive ? 'neutral' : 'info'}
                    size="sm"
                  >
                    {item.badge}
                  </Badge>
                )}
                {item.comingSoon && (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                    Stage 2
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white/80 translate-x-0.5' : 'text-slate-400 opacity-60'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
      <div>
        {/* Active persona banner for situational awareness */}
        <div className="p-3 mb-5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>ACTIVE PERSONA</span>
            <span className="text-sky-700 font-bold">{currentRoleProfile.category}</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">{currentRoleProfile.name}</div>
          <div className="text-xs text-slate-600 font-medium">{currentRoleProfile.title}</div>
        </div>

        {coreServices.length > 0 && renderNavGroup('Emergency & Core', coreServices)}
        {clinicalCare.length > 0 && renderNavGroup('Clinical & Care Services', clinicalCare)}
        {systemPersonal.length > 0 && renderNavGroup('Personal & System', systemPersonal)}
      </div>

      {/* Session Controls & Safety footer */}
      <div className="pt-4 border-t border-slate-200 mt-4 text-xs text-slate-500 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsRoleSelectorOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-200"
            title="Switch Demo Role"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-700" />
            <span>Switch Role</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 font-semibold text-xs transition-colors cursor-pointer border border-red-200"
            title="Sign out of current role"
          >
            <LogOut className="w-3.5 h-3.5 text-red-700" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>RBAC Protected Session</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 mt-0.5">
            Role-isolated environment for {currentRoleProfile.title}.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-80px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex"
          onClick={onCloseMobile}
        >
          <div
            className="w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-lg text-slate-900">Platform Navigation</span>
              <button
                onClick={onCloseMobile}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
