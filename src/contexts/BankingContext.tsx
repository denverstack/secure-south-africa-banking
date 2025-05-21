
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';

type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  suspicious: boolean;
  category: string;
};

type Account = {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  type: 'checking' | 'savings' | 'credit';
};

type Notification = {
  id: string;
  date: Date;
  title: string;
  message: string;
  read: boolean;
  type: 'alert' | 'info' | 'warning';
};

type BankingContextType = {
  accounts: Account[];
  transactions: Transaction[];
  notifications: Notification[];
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account) => void;
  isLoading: boolean;
  markNotificationAsRead: (id: string) => void;
  hasUnreadAlerts: boolean;
};

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Primary Checking',
    balance: 27540.75,
    accountNumber: '**** **** **** 5678',
    type: 'checking',
  },
  {
    id: 'acc-2',
    name: 'Savings',
    balance: 85309.32,
    accountNumber: '**** **** **** 9012',
    type: 'savings',
  },
  {
    id: 'acc-3',
    name: 'Credit Card',
    balance: -4298.45,
    accountNumber: '**** **** **** 3456',
    type: 'credit',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    date: new Date(2023, 4, 20),
    description: 'Salary Deposit',
    amount: 18500.00,
    type: 'credit',
    suspicious: false,
    category: 'income',
  },
  {
    id: 'txn-2',
    date: new Date(2023, 4, 19),
    description: 'Woolworths Sandton',
    amount: 752.85,
    type: 'debit',
    suspicious: false,
    category: 'shopping',
  },
  {
    id: 'txn-3',
    date: new Date(2023, 4, 18),
    description: 'Vodacom Airtime',
    amount: 499.00,
    type: 'debit',
    suspicious: false,
    category: 'utilities',
  },
  {
    id: 'txn-4',
    date: new Date(2023, 4, 15),
    description: 'ATM Withdrawal - JHB CBD',
    amount: 2000.00,
    type: 'debit',
    suspicious: true,
    category: 'cash',
  },
  {
    id: 'txn-5',
    date: new Date(2023, 4, 12),
    description: 'Uber Eats',
    amount: 245.50,
    type: 'debit',
    suspicious: false,
    category: 'food',
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    date: new Date(2023, 4, 15, 14, 32),
    title: 'Suspicious ATM Withdrawal',
    message: 'Unusual withdrawal detected at JHB CBD ATM. Was this you?',
    read: false,
    type: 'alert',
  },
  {
    id: 'notif-2',
    date: new Date(2023, 4, 10, 9, 15),
    title: 'New Device Login',
    message: 'Your account was accessed from a new device in Pretoria.',
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-3',
    date: new Date(2023, 4, 5, 16, 45),
    title: 'Low Balance Alert',
    message: 'Your account balance is below R5,000.',
    read: true,
    type: 'info',
  },
];

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isPanicMode } = useAuth();

  useEffect(() => {
    // Simulate API calls to fetch banking data
    const loadBankingData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setAccounts(mockAccounts);
        setTransactions(mockTransactions);
        setNotifications(mockNotifications);
        setSelectedAccount(mockAccounts[0]);
        
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast({
          title: "Error Loading Data",
          description: "Failed to load your banking information. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadBankingData();
  }, [toast]);

  // If panic mode is activated, don't show real data
  useEffect(() => {
    if (isPanicMode) {
      setAccounts(mockAccounts.map(acc => ({...acc, balance: acc.balance * 0.1})));
      setTransactions([]);
    } else {
      setAccounts(mockAccounts);
      setTransactions(mockTransactions);
    }
  }, [isPanicMode]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const hasUnreadAlerts = notifications.some(notif => !notif.read);

  return (
    <BankingContext.Provider
      value={{
        accounts,
        transactions,
        notifications,
        selectedAccount,
        setSelectedAccount,
        isLoading,
        markNotificationAsRead,
        hasUnreadAlerts,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (context === undefined) {
    throw new Error("useBanking must be used within a BankingProvider");
  }
  return context;
};
