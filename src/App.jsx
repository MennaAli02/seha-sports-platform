import React, { useState } from 'react';
import { useSeha } from './context/SehaContext';
import { TopNavBar } from './components/Navigation/TopNavBar';
import { SideNavBar } from './components/Navigation/SideNavBar';
import { Toast } from './components/Common/Toast';
import { QuickSearchModal } from './components/Modals/QuickSearchModal';
import { HelpModal } from './components/Modals/HelpModal';
import { ErrorBoundary } from './components/Common/ErrorBoundary';

// Auth Views
import { RoleSelectionView } from './components/Views/Auth/RoleSelectionView';
import { LoginView } from './components/Views/Auth/LoginView';

// Platform Views
import { DashboardView } from './components/Views/DashboardView';
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
import { CitizenPortalView } from './components/Views/Citizen/CitizenPortalView';

export default function App() {
  const {
    currentRoute,
    navigate,
    isAuthenticated,
    userRole,
    setUserRole,
    login,
    logout
  } = useSeha();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  React.useEffect(() => {
    if (currentRoute === 'mobile') {
      navigate('citizen-home');
    }
  }, [currentRoute, navigate]);

  // Auth routing: If not authenticated or explicitly on auth views, render immersive view
  if (!isAuthenticated || currentRoute === 'role_select' || currentRoute === 'login') {
    if (currentRoute === 'login') {
      return (
        <div className="min-h-screen w-full overflow-y-auto">
          <LoginView
            initialRole={userRole || 'athlete'}
            onLogin={(role, creds) => {
              login(role, creds);
            }}
            onBackToRoleSelect={() => {
              navigate('role_select');
            }}
          />
          <Toast />
        </div>
      );
    }

    // Default: RoleSelectionView
    return (
      <div className="min-h-screen w-full overflow-y-auto">
        <RoleSelectionView
          selectedRole={userRole || null}
          onSelectRole={(role) => {
            setUserRole(role);
          }}
          onConfirmRole={(role) => {
            setUserRole(role);
            navigate('login');
          }}
        />
        <Toast />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (currentRoute) {
      case 'dash':
        return <DashboardView />;
      case 'citizen-home':
      case 'citizen-family':
      case 'citizen-bookings':
      case 'citizen-certs':
      case 'citizen-history':
      case 'citizen-consents':
        return <CitizenPortalView activeRoute={currentRoute} />;
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
        return (userRole === 'citizen' || userRole === 'athlete' || userRole === 'guardian') ? (
          <CitizenPortalView activeRoute="citizen-home" />
        ) : (
          <DashboardView />
        );
    }
  };

  const isCitizenRole = userRole === 'citizen' || userRole === 'athlete' || userRole === 'guardian';

  return (
    <div className="app-shell-wrapper">
      <SideNavBar />
      <div className="app-main-column">
        <TopNavBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
        <main id="main">
          <ErrorBoundary onNavigateHome={() => navigate(isCitizenRole ? 'citizen-home' : 'dash')}>
            <div className="page-container">
              {renderActiveView()}
            </div>
          </ErrorBoundary>
        </main>
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
