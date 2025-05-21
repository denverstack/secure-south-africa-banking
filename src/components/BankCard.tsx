
import React from 'react';
import { useBanking } from '@/contexts/BankingContext';

const BankCard: React.FC = () => {
  const { selectedAccount } = useBanking();

  if (!selectedAccount) return null;

  return (
    <div className="relative w-full h-48 bg-gradient-to-r from-bank-primary to-bank-secondary rounded-xl p-5 text-white shadow-lg overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-bank-accent opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-bank-accent opacity-10 rounded-full transform -translate-x-8 translate-y-10"></div>
      
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-bank-light opacity-80">Account</p>
            <h3 className="font-semibold">{selectedAccount.name}</h3>
          </div>
          <div className="flex items-center justify-center h-10 w-10 bg-white bg-opacity-20 rounded-full">
            <span className="font-bold text-xl">SB</span>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-xs text-bank-light opacity-80">Card Number</p>
          <p className="text-lg tracking-wider mt-1">{selectedAccount.accountNumber}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-xs text-bank-light opacity-80">Available Balance</p>
            <p className="text-xl font-semibold">
              {selectedAccount.type === 'credit' ? 
                `R ${Math.abs(selectedAccount.balance).toFixed(2)}` :
                `R ${selectedAccount.balance.toFixed(2)}`}
            </p>
          </div>
          
          {selectedAccount.type === 'credit' && (
            <div className="text-right">
              <p className="text-xs text-bank-light opacity-80">Credit Used</p>
              <p className="text-sm text-white">Owing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankCard;
