import React, { type ReactNode } from 'react';
import { AuthProvider } from './auth';
import { HospitalProvider } from '../contexts/HospitalContext';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <HospitalProvider>{children}</HospitalProvider>
    </AuthProvider>
  );
};

export default AppProvider;
