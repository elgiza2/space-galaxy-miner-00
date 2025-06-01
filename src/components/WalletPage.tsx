
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw, LogIn, LogOut, Coins, TrendingUp } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';

const WalletPage = () => {
  const [tonConnectUI] = useTonConnectUI();
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
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await tonConnectUI.disconnect();
      setConnectedAddress(null);
      loadWalletData(targetAddress);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const loadWalletData = async (address: string) => {
    setIsLoading(true);
    try {
      const txData = await tonService.getTransactions(address, 3);
      setTransactions(txData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
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
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Coins className="w-10 h-10 text-white" />
              </div>
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
      </div>
    </div>
  );
};

export default WalletPage;
