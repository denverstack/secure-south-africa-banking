
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FacialVerification from '@/components/FacialVerification';
import KeystrokeAnalyzer from '@/components/KeystrokeAnalyzer';

const AuthScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'credentials' | 'facial'>('credentials');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'credentials') {
      const success = await login(email, password);
      if (success) {
        setStep('facial');
      }
    }
  };

  const handleKeystrokeSubmit = () => {
    // Keystroke pattern is being recorded in the KeystrokeAnalyzer component
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {step === 'credentials' ? (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-bank-primary flex items-center justify-center">
                  <span className="text-white font-semibold">SB</span>
                </div>
                <span className="font-bold text-2xl text-bank-dark">SecureBank</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-6">Secure Login</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <KeystrokeAnalyzer onSubmit={handleKeystrokeSubmit}>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </KeystrokeAnalyzer>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <KeystrokeAnalyzer onSubmit={handleKeystrokeSubmit}>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </KeystrokeAnalyzer>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-bank-primary hover:bg-bank-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Authenticating...</span>
                    </div>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-center text-xs text-gray-500">
                Your keystroke patterns are being analyzed for additional security
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <FacialVerification />
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by SecureBank AI Fraud Detection
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
