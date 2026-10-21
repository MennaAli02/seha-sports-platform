import React from 'react';
import { CitizenHomeTab } from './CitizenHomeTab';
import { CitizenBookingsTab } from './CitizenBookingsTab';
import { CitizenCertificatesTab } from './CitizenCertificatesTab';
import { CitizenConsentsTab } from './CitizenConsentsTab';

export const CitizenPortalView = ({ activeRoute = 'citizen-home' }) => {
  switch (activeRoute) {
    case 'citizen-bookings':
      return <CitizenBookingsTab />;
    case 'citizen-certs':
      return <CitizenCertificatesTab />;
    case 'citizen-consents':
      return <CitizenConsentsTab />;
    case 'citizen-home':
    default:
      return <CitizenHomeTab />;
  }
};
