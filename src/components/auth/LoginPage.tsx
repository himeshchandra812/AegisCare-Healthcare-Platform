import React, { useState } from 'react';
import {
  Activity,
  Shield,
  Lock,
  User,
  HeartHandshake,
  Stethoscope,
  Ambulance,
  Radio,
  Building2,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Server,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, DEMO_CREDENTIALS } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const LoginPage: React.FC = () => {
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.patient.email);
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.patient.passwordHint);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const currentCred = DEMO_CREDENTIALS[selectedRole];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].passwordHint);
    setLoginError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setLoginError('Please enter an email address.');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      await login(selectedRole, email.trim());
    } catch {
      setLoginError('Authentication failed. Please select a valid demo persona.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoSignIn = async (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].passwordHint);
    setIsLoading(true);
    setLoginError(null);

    try {
      await login(role, DEMO_CREDENTIALS[role].email);
    } catch {
      setLoginError('Quick sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'patient':
        return <User className="w-5 h-5" />;
      case 'family_member':
        return <HeartHandshake className="w-5 h-5" />;
      case 'doctor':
        return <Stethoscope className="w-5 h-5" />;
      case 'emt':
        return <Ambulance className="w-5 h-5" />;
      case 'ambulance_operator':
        return <Radio className="w-5 h-5" />;
      case 'hospital_admin':
        return <Building2 className="w-5 h-5" />;
      case 'system_admin':
        return <Server className="w-5 h-5" />;
    }
  };

  const roleList: UserRole[] = [
    'patient',
    'family_member',
    'doctor',
    'emt',
    'ambulance_operator',
    'hospital_admin',
    'system_admin',
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Top Banner - Mandatory Prototype & Authentication Notice */}
      <header className="bg-slate-950 border-b border-slate-800 py-3.5 px-4 sm:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">AegisCare India</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Hyderabad Node
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Emergency & Integrated Healthcare Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/80 text-amber-300 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Authentication — Prototype Only</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col items-center justify-center">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span>Strict Role-Based Access Control (RBAC) System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Role-Specific Portal Login
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Select a role to open its dedicated authentication screen. Each role provides an isolated dashboard, custom navigation, and strict data access.
          </p>
        </div>

        {/* 7-Role Selector Tabs / Cards */}
        <div className="w-full max-w-5xl mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center justify-between">
            <span>Select Demo Account Role (7 Roles Available)</span>
            <span className="text-sky-400">Fictional Demo Accounts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
            {roleList.map((role) => {
              const cred = DEMO_CREDENTIALS[role];
              const isSelected = selectedRole === role;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? 'bg-sky-950/80 border-sky-400 ring-2 ring-sky-500/50 shadow-lg scale-102'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                      }`}
                    >
                      {getRoleIcon(role)}
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-black text-white leading-tight line-clamp-1">
                      {cred.title.split(' ')[0]} {cred.title.split(' ')[1] || ''}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium line-clamp-1">
                      {cred.name}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono truncate">{cred.email.split('@')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Login Form Card */}
        <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-900/60 text-sky-300 border border-sky-700">
                  {currentCred.badge}
                </span>
                <span className="text-xs text-slate-400 font-medium">• {currentCred.category}</span>
              </div>

              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                {currentCred.title} Login
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentCred.roleDescription}
              </p>
            </div>

            {/* Error message */}
            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Demo Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-3.5 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Demo Password
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Hint: demo123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  <span>Demo Account: {currentCred.name}</span>
                </div>
                <p>
                  No real passwords required. Click below for instant authenticated access to the {currentCred.title} workspace.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Authenticating {currentCred.title}...</span>
                  ) : (
                    <>
                      <span>Sign In as {currentCred.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSignIn(selectedRole)}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Test Login ({currentCred.name})</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Permission Matrix Preview */}
          <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strict Security Boundary</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Authorized Features for {currentCred.title}
              </h3>
            </div>

            {/* Allowed Features */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {currentCred.allowedFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-300 py-1 border-b border-slate-800/60"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{feat}</span>
                </div>
              ))}
            </div>

            {/* Restricted Features */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1.5 flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-400" />
                <span>Isolated / Blocked in this Role</span>
              </span>
              <div className="space-y-1">
                {currentCred.restrictedFeatures.slice(0, 4).map((feat, i) => (
                  <div
                    key={i}
                    className="text-[11px] text-slate-400 flex items-center gap-1.5 line-clamp-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80"></span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Prototype Disclaimer:</strong> All data is fictional demo data based on Hyderabad, Telangana. No live hospital or 112 emergency calls are placed.
            </div>
          </div>
        </div>

        {/* Quick Demo Switcher Matrix */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 mb-3 font-semibold">
            Need to quickly test a specific persona? Click any role below:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            {roleList.map((role) => (
              <button
                key={role}
                onClick={() => handleQuickDemoSignIn(role)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                {getRoleIcon(role)}
                <span>{DEMO_CREDENTIALS[role].title.split(' ')[0]} ({DEMO_CREDENTIALS[role].name.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-400">
        <p>
          AegisCare Prototype • Fictional Demo Data (Hyderabad, Telangana) • Prototype Mode • Not for clinical use
        </p>
      </footer>
    </div>
  );
};
