import React, { useState } from 'react';
import { useSeha } from './context/SehaContext';
import { TopNavBar } from './components/Navigation/TopNavBar';
import { SideNavBar } from './components/Navigation/SideNavBar';
import { Toast } from './components/Common/Toast';
import { QuickSearchModal } from './components/Modals/QuickSearchModal';
import { HelpModal } from './components/Modals/HelpModal';
import { ErrorBoundary } from './components/Common/ErrorBoundary';

// Views
import { DashboardView } from './components/Views/DashboardView';
import { CitizenMobileView } from './components/Views/CitizenMobileView';
import { ConsentGovernanceView } from './components/Views/ConsentGovernanceView';
import { CertificateRegistryView } from './components/Views/CertificateRegistryView';
import { PublicVerificationView } from './components/Views/PublicVerificationView';
import { ClubPortalView } from './components/Views/ClubPortalView';
import { HospitalPortalView } from './components/Views/HospitalPortalView';
import { PhysicianScreenView } from './components/Views/PhysicianScreenView';
import { ReportsCenterView } from './components/Views/ReportsCenterView';
import { ClubRegistrationView } from './components/Views/ClubRegistrationView';
import { HospitalRegistrationView } from './components/Views/HospitalRegistrationView';
import { PlatformSetupView } from './components/Views/PlatformSetupView';

export default function App() {
  const { currentRoute, navigate } = useSeha();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentRoute) {
      case 'dash':
        return <DashboardView />;
      case 'mobile':
        return <CitizenMobileView />;
      case 'consent':
        return <ConsentGovernanceView />;
      case 'cert':
        return <CertificateRegistryView />;
      case 'verify':
        return <PublicVerificationView />;
      case 'club':
        return <ClubPortalView />;
      case 'hosp':
        return <HospitalPortalView />;
      case 'doctor':
        return <PhysicianScreenView />;
      case 'reports':
        return <ReportsCenterView />;
      case 'clubs':
        return <ClubRegistrationView />;
      case 'hosps':
        return <HospitalRegistrationView />;
      case 'setup':
        return <PlatformSetupView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-shell-wrapper">
      <div className="app-floating-container">
        <TopNavBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
        <div id="shell">
          <SideNavBar />
          <main id="main">
            <ErrorBoundary onNavigateHome={() => navigate('dash')}>
              {renderActiveView()}
            </ErrorBoundary>
          </main>
        </div>
      </div>

      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
      <Toast />
    </div>
  );
}
