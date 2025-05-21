
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBanking } from '@/contexts/BankingContext';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { hasUnreadAlerts } = useBanking();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-bank-primary flex items-center justify-center">
          <span className="text-white font-semibold text-sm">SB</span>
        </div>
        <span className="font-semibold text-bank-dark">SecureBank</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {hasUnreadAlerts && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse-alert"></span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user.name}</p>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="text-xs text-gray-600"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
