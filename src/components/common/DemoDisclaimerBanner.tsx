import React from 'react';
import { ShieldAlert, PhoneCall, AlertCircle, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoDisclaimerBanner: React.FC = () => {
  const { currentRoleProfile, setIsRoleSelectorOpen, t } = useApp();

  return (
    <aside
      aria-label="Prototype demo mode disclaimer"
      className="bg-amber-50 border-b border-amber-200 text-amber-950 px-4 py-2 text-xs sm:text-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-extrabold uppercase text-amber-900 tracking-wider">
            FOUNDATION PROTOTYPE (INDIA DEMO):
          </span>
          <span className="font-medium text-amber-900">
            Fictional demo data. <strong>NOT</strong> connected to India’s 112/108 dispatch services. In a real medical emergency, dial <strong className="text-red-700 underline">112</strong> immediately.
          </span>
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          {/* Quick 112 reminder pill */}
          <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-950 rounded-lg font-bold border border-red-300 text-xs">
            <PhoneCall className="w-3.5 h-3.5 text-red-700" />
            <span>Emergency: 112</span>
          </div>

          <button
            onClick={() => setIsRoleSelectorOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg font-medium border border-amber-300 transition-colors cursor-pointer text-xs"
            title="Switch demo persona"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-800" />
            <span>Role: <strong>{currentRoleProfile.title}</strong> (Change)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
