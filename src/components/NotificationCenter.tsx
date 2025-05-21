
import React from 'react';
import { useBanking } from '@/contexts/BankingContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationAsRead } = useBanking();

  if (notifications.length === 0) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-ZA', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ShieldAlert className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Notifications</h3>
      
      {unreadNotifications.length > 0 && (
        <div className="space-y-3 mb-4">
          {unreadNotifications.map((notification) => (
            <Alert 
              key={notification.id} 
              className={cn(
                "border-l-4 animate-scale-in",
                notification.type === 'alert' ? "border-l-red-500 bg-red-50" :
                notification.type === 'warning' ? "border-l-amber-500 bg-amber-50" :
                "border-l-blue-500 bg-blue-50"
              )}
            >
              <div className="flex items-start">
                <div className="mr-2">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <AlertTitle className="text-sm font-semibold">
                    {notification.title}
                  </AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                    {notification.message}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.date)}
                    </div>
                  </AlertDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="text-xs"
                >
                  Mark as read
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      )}
      
      {readNotifications.length > 0 && (
        <div className="space-y-2 opacity-70">
          <p className="text-xs text-gray-500 font-medium">Read Notifications</p>
          {readNotifications.map((notification) => (
            <Alert 
              key={notification.id} 
              className="bg-gray-50 border-gray-200"
            >
              <div className="flex items-start">
                <div className="mr-2">{getIcon(notification.type)}</div>
                <div>
                  <AlertTitle className="text-sm font-semibold">{notification.title}</AlertTitle>
                  <AlertDescription className="text-xs mt-1">{notification.message}</AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
