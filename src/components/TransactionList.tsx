
import React from 'react';
import { useBanking } from '@/contexts/BankingContext';
import { cn } from '@/lib/utils';

const TransactionList: React.FC = () => {
  const { transactions } = useBanking();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-ZA', { 
      day: 'numeric', 
      month: 'short' 
    }).format(date);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'income':
        return <div className="bg-green-100 p-2 rounded-full">💼</div>;
      case 'shopping':
        return <div className="bg-blue-100 p-2 rounded-full">🛒</div>;
      case 'food':
        return <div className="bg-yellow-100 p-2 rounded-full">🍽️</div>;
      case 'utilities':
        return <div className="bg-purple-100 p-2 rounded-full">📱</div>;
      case 'cash':
        return <div className="bg-gray-100 p-2 rounded-full">💰</div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full">💳</div>;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No transactions to display</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-3">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className={cn(
              "flex items-center justify-between bg-white p-3 rounded-lg border",
              transaction.suspicious ? "border-red-300 bg-red-50" : "border-gray-200"
            )}
          >
            <div className="flex items-center space-x-3">
              {getCategoryIcon(transaction.category)}
              <div>
                <p className="font-medium text-sm">{transaction.description}</p>
                <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                {transaction.suspicious && (
                  <span className="text-xs text-red-500 font-medium">Unusual activity</span>
                )}
              </div>
            </div>
            <div className={cn(
              "font-semibold",
              transaction.type === 'credit' ? "text-green-600" : "text-gray-800"
            )}>
              {transaction.type === 'credit' ? '+' : '-'} R {transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
