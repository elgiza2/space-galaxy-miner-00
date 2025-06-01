
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';
import MiningPage from './components/MiningPage';
import TasksPage from './components/TasksPage';
import ReferralPage from './components/ReferralPage';
import TaskManagementPage from './components/TaskManagementPage';
import WalletConnectPage from './components/WalletConnectPage';
import { Button } from '@/components/ui/button';
import { Home, CheckSquare, Users } from 'lucide-react';

const queryClient = new QueryClient();

type Page = 'mining' | 'tasks' | 'referral' | 'taskManagement';

const MainApp = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [currentPage, setCurrentPage] = useState<Page>('mining');
  const [tasksClickCount, setTasksClickCount] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const checkWalletConnection = () => {
      const wallet = tonConnectUI.wallet;
      setIsWalletConnected(!!wallet);
    };

    checkWalletConnection();
    
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      setIsWalletConnected(!!wallet);
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  const handleTasksClick = () => {
    const newCount = tasksClickCount + 1;
    setTasksClickCount(newCount);
    
    if (newCount === 5) {
      setCurrentPage('taskManagement');
      setTasksClickCount(0);
    } else {
      setCurrentPage('tasks');
    }
    
    setTimeout(() => {
      if (tasksClickCount < 5) {
        setTasksClickCount(0);
      }
    }, 3000);
  };

  const navigationItems = [
    { id: 'mining', label: 'Mining', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, onClick: handleTasksClick },
    { id: 'referral', label: 'Friends', icon: Users },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'mining':
        return <MiningPage />;
      case 'tasks':
        return <TasksPage />;
      case 'referral':
        return <ReferralPage />;
      case 'taskManagement':
        return <TaskManagementPage />;
      default:
        return <MiningPage />;
    }
  };

  if (!isWalletConnected) {
    return <WalletConnectPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pb-20">
        {renderCurrentPage()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t-2 border-blue-500/30 p-3 z-50">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={item.onClick || (() => setCurrentPage(item.id as Page))}
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-2 text-xs rounded-xl transition-all duration-200 ${
                    (currentPage === item.id || (item.id === 'tasks' && currentPage === 'taskManagement'))
                      ? 'text-blue-400 bg-blue-500/20 border border-blue-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <TonConnectUIProvider manifestUrl={window.location.origin + '/tonconnect-manifest.json'}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <MainApp />
        </TooltipProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

export default App;
