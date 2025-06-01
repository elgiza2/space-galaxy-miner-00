
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw, LogIn, LogOut, Coins, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';

const WalletPage = () => {
  const { toast } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const [tonBalance, setTonBalance] = useState(2.45);
  const [transactions, setTransactions] = useState<TONTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  
  const targetAddress = "UQCiVNm22dMF9S3YsHPcgrmqXEQHt4MIdk_N7VJu88NrLr4R";

  useEffect(() => {
    checkWalletConnection();
    loadWalletData(targetAddress);
    
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      if (wallet) {
        setConnectedAddress(wallet.account.address);
        loadWalletData(targetAddress);
      } else {
        setConnectedAddress(null);
        loadWalletData(targetAddress);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  const checkWalletConnection = () => {
    const wallet = tonConnectUI.wallet;
    if (wallet) {
      const address = wallet.account.address;
      setConnectedAddress(address);
      loadWalletData(targetAddress);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      await tonConnectUI.openModal();
      toast({
        title: "🔗 Wallet Connection",
        description: "Please select your preferred wallet"
      });
    } catch (error) {
      toast({
        title: "❌ Connection Error",
        description: "Failed to open wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await tonConnectUI.disconnect();
      setConnectedAddress(null);
      loadWalletData(targetAddress);
      toast({
        title: "✅ Disconnected",
        description: "Wallet disconnected successfully"
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const loadWalletData = async (address: string) => {
    setIsLoading(true);
    try {
      const balanceData = await tonService.getBalance(address);
      setTonBalance(parseFloat(balanceData.balance));
      const txData = await tonService.getTransactions(address, 3);
      setTransactions(txData);
    } catch (error) {
      toast({
        title: "⚠️ Loading Error",
        description: "Failed to load wallet data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isWalletConnected = !!tonConnectUI.wallet;

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header with TON Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/c22ab63c-814a-4cae-8e3b-892adf617228.png" 
                alt="TON Logo" 
                className="w-16 h-16"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">TON Wallet</h1>
        </div>

        {/* Wallet Connection Status */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-gray-500/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isWalletConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                  <span className="text-white text-sm font-semibold">
                    {isWalletConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>
              <Button 
                onClick={isWalletConnected ? disconnectWallet : connectWallet} 
                disabled={isConnecting} 
                variant="outline" 
                size="sm" 
                className={`${isWalletConnected ? 'bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30' : 'bg-green-500/20 border-green-500/50 text-green-200 hover:bg-green-500/30'} text-xs h-8`}
              >
                {isWalletConnected ? <LogOut className="w-3 h-3 mr-1" /> : <LogIn className="w-3 h-3 mr-1" />}
                {isConnecting ? 'Connecting...' : (isWalletConnected ? 'Disconnect' : 'Connect')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TON Balance */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold">TON</span>
                </div>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => loadWalletData(targetAddress)} 
                disabled={isLoading} 
                className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-8 w-8 p-0"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="font-bold text-white mb-2 text-2xl">
              {tonBalance.toFixed(4)} <span className="text-blue-400">TON</span>
            </p>
            <div className="flex items-center gap-2 text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-semibold">+2.5% Today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
