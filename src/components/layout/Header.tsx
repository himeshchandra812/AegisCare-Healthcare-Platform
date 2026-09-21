import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bell,
  Menu,
  Type,
  ChevronDown,
  Globe2,
  PhoneCall,
  Check,
  Sliders,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { AppLanguage } from '../../data/translations';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const {
    currentRoleProfile,
    setIsRoleSelectorOpen,
    setIsEmergencyModalOpen,
    setIsNotificationsDrawerOpen,
    unreadNotificationsCount,
    isLargeText,
    toggleLargeText,
    setCurrentView,
    currentLanguage,
    setCurrentLanguage,
    supportedLanguages,
    t,
    setIsSimulationControlOpen,
    logout,
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const activeLang = supportedLanguages.find((l) => l.code === currentLanguage) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Left: Mobile menu toggle + Brand Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            aria-label="AegisCare India Home"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-sky-600/20 group-hover:bg-sky-800 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  India Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t.appSubtitle} (Hyderabad & Telangana)
              </p>
            </div>
          </button>
        </div>

        {/* Center/Right Action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Indian Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
              title="Select Language (భారతీయ భాషలు)"
              aria-label="Select application language"
              aria-expanded={isLangDropdownOpen}
            >
              <Globe2 className="w-4 h-4 text-sky-700" />
              <span className="font-semibold">{activeLang.nativeLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 py-2 overflow-hidden">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Language / భాషను ఎంచుకోండి
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {supportedLanguages.map((lang) => {
                      const isSelected = lang.code === currentLanguage;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLanguage(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-sky-50 text-sky-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700 font-medium'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-sm text-slate-900">
                              {lang.nativeLabel}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {lang.label} • {lang.region}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-sky-700" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Senior Accessibility 60+ Text Sizing Toggle */}
          <button
            onClick={toggleLargeText}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isLargeText
                ? 'bg-sky-50 text-sky-900 border-sky-300 ring-2 ring-sky-400'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Toggle larger typography for seniors (60+) and enhanced readability"
            aria-pressed={isLargeText}
          >
            <Type className="w-4 h-4 text-sky-700" />
            <span>{t.seniorMode}: {isLargeText ? 'On' : 'Off'}</span>
          </button>

          {/* Presenter Simulation Controls Trigger */}
          <button
            onClick={() => setIsSimulationControlOpen(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-colors cursor-pointer"
            title="Open Demo Telemetry Simulator & Presets"
            aria-label="Open Demo Telemetry Simulator"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sim Controls</span>
          </button>

          {/* Role Switcher Pill */}
          <button
            onClick={() => setIsRoleSelectorOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors cursor-pointer group text-left"
            title="Switch demo persona"
            aria-label={`Current role: ${currentRoleProfile.title}. Click to switch demo role.`}
          >
            <div className="w-7 h-7 rounded-lg bg-sky-800 text-white text-xs font-bold flex items-center justify-center">
              {currentRoleProfile.avatarInitials}
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Persona
              </div>
              <div className="text-xs font-bold text-slate-900 leading-none">
                {currentRoleProfile.title}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-800" />
          </button>

          {/* Sign Out / Log Out Button */}
          <button
            onClick={logout}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
            title="Sign out and return to role login portal"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 text-red-700" />
            <span>Log Out</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsDrawerOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            aria-label={`Notifications (${unreadNotificationsCount} unread)`}
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* VISUALLY PROMINENT EMERGENCY BUTTON (With 112 India Badge) */}
          <Button
            variant="emergency"
            size="md"
            icon={<AlertTriangle className="w-5 h-5 text-white animate-pulse" />}
            onClick={() => setIsEmergencyModalOpen(true)}
            className="shadow-sm"
            aria-label="Emergency Assistance Request (Simulated)"
          >
            <span className="hidden xs:inline">{t.emergencySOS}</span>
            <span className="xs:hidden">112 SOS</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
