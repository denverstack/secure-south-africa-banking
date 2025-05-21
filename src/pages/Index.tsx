
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { BankingProvider } from '@/contexts/BankingContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';

// Inner component that uses the auth context
const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  
  return isAuthenticated && user?.isVerified ? <Dashboard /> : <AuthScreen />;
};

// Main container that provides all contexts
const Index = () => {
  return (
    <AuthProvider>
      <BankingProvider>
        <AppContent />
      </BankingProvider>
    </AuthProvider>
  );
};

export default Index;
