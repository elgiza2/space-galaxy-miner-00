
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import SplashScreen from './components/SplashScreen';
import OnboardingTutorial from './components/OnboardingTutorial';
import MiningPage from './components/MiningPage';
import TasksPage from './components/TasksPage';
import WalletPage from './components/WalletPage';
import ReferralPage from './components/ReferralPage';
import { Button } from '@/components/ui/button';
import { Home, CheckSquare, Wallet, Users } from 'lucide-react';

const queryClient = new QueryClient();

type AppState = 'splash' | 'onboarding' | 'main';
type Page = 'mining' | 'tasks' | 'wallet' | 'referral';

const App = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentPage, setCurrentPage] = useState<Page>('mining');

  const handleSplashComplete = () => {
    const onboardingCompleted = localStorage.getItem('onboarding-completed');
    setAppState(onboardingCompleted ? 'main' : 'onboarding');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setAppState('main');
  };

  const navigationItems = [
    { id: 'mining', label: 'Mining', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'referral', label: 'Friends', icon: Users },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'mining':
        return <MiningPage />;
      case 'tasks':
        return <TasksPage />;
      case 'wallet':
        return <WalletPage />;
      case 'referral':
        return <ReferralPage />;
      default:
        return <MiningPage />;
    }
  };

  return (
    <TonConnectUIProvider manifestUrl={window.location.origin + '/tonconnect-manifest.json'}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {appState === 'splash' && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}
          
          {appState === 'onboarding' && (
            <OnboardingTutorial onComplete={handleOnboardingComplete} />
          )}
          
          {appState === 'main' && (
            <div className="min-h-screen flex flex-col">
              <div className="flex-1 pb-20">
                {renderCurrentPage()}
              </div>

              <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t-2 border-blue-500/30 p-3 z-50">
                <div className="max-w-md mx-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          onClick={() => setCurrentPage(item.id as Page)}
                          className={`flex flex-col items-center gap-1 h-auto py-2 px-2 text-xs rounded-xl transition-all duration-200 ${
                            currentPage === item.id
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
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

export default App;
