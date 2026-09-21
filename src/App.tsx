import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoDisclaimerBanner } from './components/common/DemoDisclaimerBanner';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RoleSelectorModal } from './components/layout/RoleSelectorModal';
import { EmergencyModal } from './components/layout/EmergencyModal';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { SimulationControlPanel } from './components/common/SimulationControlPanel';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { EmergencyView } from './components/views/EmergencyView';
import { SmartAmbulanceView } from './components/views/SmartAmbulanceView';
import { HospitalsView } from './components/views/HospitalsView';
import { DoctorsView } from './components/views/DoctorsView';
import { TravellerHealthcareView } from './components/views/TravellerHealthcareView';
import { MedicalProfileView } from './components/views/MedicalProfileView';
import { FamilyTrackingView } from './components/views/FamilyTrackingView';
import { NotificationsView } from './components/views/NotificationsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { AccessRestrictedView } from './components/common/AccessRestrictedView';
import { canRoleAccessView } from './types';

const MainShell: React.FC = () => {
  const { currentView, currentRole, isAuthenticated } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If user is not authenticated, render dedicated multi-role login portal
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    // Route protection: verify currentRole has permission for currentView
    if (currentView !== 'home' && !canRoleAccessView(currentRole, currentView)) {
      return <AccessRestrictedView attemptedView={currentView} />;
    }

    switch (currentView) {
      case 'home':
        return <DashboardHome />;
      case 'emergency':
        return <EmergencyView />;
      case 'smart_ambulance':
        return <SmartAmbulanceView />;
      case 'hospitals':
        return <HospitalsView />;
      case 'doctors':
        return <DoctorsView />;
      case 'traveller':
        return <TravellerHealthcareView />;
      case 'medical_profile':
        return <MedicalProfileView />;
      case 'family_tracking':
        return <FamilyTrackingView />;
      case 'notifications':
        return <NotificationsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-200">
      {/* Prototype Disclaimer Banner */}
      <DemoDisclaimerBanner />

      {/* Main Header */}
      <Header onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)} />

      {/* Body Layout: Sidebar + Main Stage */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Content View Stage */}
        <main
          id="main-content"
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
          role="main"
          tabIndex={-1}
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Global Accessibility & Flow Modals */}
      <RoleSelectorModal />
      <EmergencyModal />
      <NotificationsDrawer />
      <SimulationControlPanel />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}
