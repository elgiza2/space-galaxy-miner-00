
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Send, ArrowDownToLine, Copy, RefreshCw, LogIn, LogOut, Coins, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import TransactionItem from './TransactionItem';

const WalletPage = () => {
  const { toast } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const [tonBalance, setTonBalance] = useState(2.45);
  const [transactions, setTransactions] = useState<TONTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  
  const fallbackAddress = "UQAqPFXgVhDpXe-WbJgfwVd_ETkmPMqEjLaNKLtDTKxVAJgk";

  useEffect(() => {
    checkWalletConnection();
    loadWalletData(fallbackAddress);
    
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      if (wallet) {
        setConnectedAddress(wallet.account.address);
        loadWalletData(wallet.account.address);
      } else {
        setConnectedAddress(null);
        loadWalletData(fallbackAddress);
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
      loadWalletData(address);
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
      loadWalletData(fallbackAddress);
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
      const txData = await tonService.getTransactions(address, 6);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ Copied",
      description: "Wallet address copied successfully"
    });
  };

  const currentAddress = connectedAddress || fallbackAddress;
  const isWalletConnected = !!tonConnectUI.wallet;

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TON Wallet</h1>
          <p className="text-gray-300">Manage your digital assets securely</p>
        </div>

        {/* Wallet Connection Status */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-gray-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isWalletConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                  <span className="text-white font-semibold">
                    {isWalletConnected ? 'Connected' : 'Not Connected'}
                  </span>
                  <p className="text-gray-300 text-sm">
                    {isWalletConnected ? 'Wallet ready to use' : 'Connect your wallet to start'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={isWalletConnected ? disconnectWallet : connectWallet} 
                disabled={isConnecting} 
                variant="outline" 
                size="sm" 
                className={`${isWalletConnected ? 'bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30' : 'bg-green-500/20 border-green-500/50 text-green-200 hover:bg-green-500/30'} font-semibold text-xs`}
              >
                {isWalletConnected ? <LogOut className="w-3 h-3 mr-1" /> : <LogIn className="w-3 h-3 mr-1" />}
                {isConnecting ? 'Connecting...' : (isWalletConnected ? 'Disconnect' : 'Connect')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TON Balance */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">TON</span>
                  <span className="text-sm text-blue-300 block">Telegram Coin</span>
                </div>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => loadWalletData(currentAddress)} 
                disabled={isLoading} 
                className="text-blue-300 hover:text-white hover:bg-blue-500/20"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="font-bold text-white mb-3 text-3xl">
              {tonBalance.toFixed(4)} <span className="text-blue-400">TON</span>
            </p>
            <div className="flex items-center gap-2 text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">+2.5% Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setShowSendModal(true)}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 h-12 font-bold"
          >
            <Send className="w-4 h-4 mr-2" />
            Send TON
          </Button>
          <Button
            onClick={() => setShowReceiveModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 font-bold"
          >
            <ArrowDownToLine className="w-4 h-4 mr-2" />
            Receive TON
          </Button>
        </div>

        {/* Wallet Address */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 border border-gray-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-xs text-gray-400 mb-1 font-semibold">Wallet Address</p>
                <code className="text-xs text-gray-200 break-all font-mono bg-gray-900/50 p-2 rounded block">
                  {currentAddress}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(currentAddress)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-bold">Recent Transactions</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => loadWalletData(currentAddress)} 
                disabled={isLoading} 
                className="text-blue-300 hover:text-white hover:bg-blue-500/20"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-400 py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
                <p className="font-semibold">Loading transactions...</p>
                <p className="text-xs">Please wait</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-bold mb-2">No Transactions</p>
                <p className="text-sm">Start by sending or receiving TON</p>
              </div>
            ) : (
              transactions.map(tx => (
                <TransactionItem 
                  key={tx.hash} 
                  transaction={tx} 
                  onViewExplorer={() => {}}
                  language="en"
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <SendModal 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
        balance={tonBalance} 
        currency="TON" 
      />
      
      <ReceiveModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
        address={currentAddress} 
      />
    </div>
  );
};

export default WalletPage;
