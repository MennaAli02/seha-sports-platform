import React from 'react';
import { CitizenHomeTab } from './CitizenHomeTab';
import { CitizenFamilyTab } from './CitizenFamilyTab';
import { CitizenBookingsTab } from './CitizenBookingsTab';
import { CitizenCertificatesTab } from './CitizenCertificatesTab';
import { CitizenMedicalHistoryTab } from './CitizenMedicalHistoryTab';
import { CitizenConsentsTab } from './CitizenConsentsTab';
import { ActiveChildBanner } from './ActiveChildBanner';

export const CitizenPortalView = ({ activeRoute = 'citizen-home' }) => {
  const renderTab = () => {
    switch (activeRoute) {
      case 'citizen-family':
        return <CitizenFamilyTab />;
      case 'citizen-bookings':
        return <CitizenBookingsTab />;
      case 'citizen-certs':
        return <CitizenCertificatesTab />;
      case 'citizen-history':
        return <CitizenMedicalHistoryTab />;
      case 'citizen-consents':
        return <CitizenConsentsTab />;
      case 'citizen-home':
      default:
        return <CitizenHomeTab />;
    }
  };

  return (
    <div className="page-stack">
      {/* Persistent Active Child Banner for Guardian Account Context */}
      <ActiveChildBanner />
      {renderTab()}
    </div>
  );
};
