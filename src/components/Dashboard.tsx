
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBanking } from '@/contexts/BankingContext';
import Header from '@/components/Header';
import BankCard from '@/components/BankCard';
import TransactionList from '@/components/TransactionList';
import NotificationCenter from '@/components/NotificationCenter';
import PanicButton from '@/components/PanicButton';
import KeystrokeAnalyzer from '@/components/KeystrokeAnalyzer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { accounts, isLoading: bankingLoading } = useBanking();
  
  const isLoading = authLoading || bankingLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bank-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your secure banking data...</p>
        </div>
      </div>
    );
  }

  const handleCommandSubmit = (text: string) => {
    console.log('Command submitted:', text);
    // In a real app, this would process the command
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.name.split(' ')[0]}</h1>
        
        <BankCard />
        
        <div className="mt-8">
          <Tabs defaultValue="transactions">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="notifications">Alerts</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="animate-scale-in">
              <TransactionList />
            </TabsContent>
            
            <TabsContent value="notifications" className="animate-scale-in">
              <NotificationCenter />
            </TabsContent>
            
            <TabsContent value="security" className="animate-scale-in">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Security Features</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800">AI Fraud Detection</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Your typing patterns are being continuously analyzed to detect unauthorized access
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800">Proof of Life Authentication</h4>
                    <p className="text-sm text-green-600 mt-1">
                      Random movement challenges ensure your identity cannot be spoofed
                    </p>
                  </div>
                  
                  <PanicButton />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
          <KeystrokeAnalyzer onSubmit={handleCommandSubmit} />
          <p className="text-xs text-gray-500 mt-2">
            Type commands like "transfer", "balance", or "help" for assistance
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
