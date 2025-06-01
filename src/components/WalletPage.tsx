
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Send, ArrowDownToLine, Copy, RefreshCw, LogIn, LogOut, Coins, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';
import { getStoredLanguage, getTranslation } from '../utils/language';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import TransactionItem from './TransactionItem';
import LanguageSwitcher from './LanguageSwitcher';

const WalletPage = () => {
  const { toast } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [showBalance, setShowBalance] = useState(true);
  const [spaceBalance] = useState(15420.5);
  const [tonBalance, setTonBalance] = useState(2.45);
  const [transactions, setTransactions] = useState<TONTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  
  const fallbackAddress = "UQAqPFXgVhDpXe-WbJgfwVd_ETkmPMqEjLaNKLtDTKxVAJgk";
  
  const t = (key: string) => getTranslation(key, currentLanguage.code);

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
        title: "فتح نافذة الاتصال",
        description: "يرجى اختيار محفظتك"
      });
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في فتح المحفظة",
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
        title: "تم قطع الاتصال",
        description: "تم قطع الاتصال بمحفظة TON"
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
        title: "خطأ في تحميل البيانات",
        description: "فشل في تحميل بيانات المحفظة",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ عنوان المحفظة"
    });
  };

  const currentAddress = connectedAddress || fallbackAddress;
  const isWalletConnected = !!tonConnectUI.wallet;

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center glow-blue">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent mb-3">
            محفظة TON الذكية
          </h1>
          <p className="text-gray-300 text-base">إدارة عملاتك الرقمية بأمان</p>
        </div>

        {/* Wallet Connection Status */}
        <Card className="wallet-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isWalletConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-white font-medium">
                  {isWalletConnected ? 'متصل' : 'غير متصل'}
                </span>
              </div>
              <Button 
                onClick={isWalletConnected ? disconnectWallet : connectWallet} 
                disabled={isConnecting} 
                variant="outline" 
                size="sm" 
                className={`${isWalletConnected ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-green-500/20 border-green-500/50 text-green-200'}`}
              >
                {isWalletConnected ? <LogOut className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                {isConnecting ? 'جاري الاتصال...' : (isWalletConnected ? 'قطع الاتصال' : 'ربط المحفظة')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Balance Cards */}
        <div className="space-y-4">
          {/* TON Balance */}
          <Card className="mining-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <Coins className="w-6 h-6 text-blue-400" />
                  <div>
                    <span className="block">TON</span>
                    <span className="text-sm text-blue-300 font-normal">عملة TON</span>
                  </div>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => loadWalletData(currentAddress)} 
                  disabled={isLoading} 
                  className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-10 w-10 p-0 rounded-xl"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-bold text-white mb-3 text-3xl">
                {tonBalance.toFixed(4)}
              </p>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+2.5% اليوم</span>
              </div>
            </CardContent>
          </Card>

          {/* $SPACE Balance */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/30 rounded-3xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <div>
                  <span className="block">$SPACE</span>
                  <span className="text-sm text-purple-300 font-normal">عملة المنصة</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-bold text-white mb-3 text-2xl">
                {spaceBalance.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setShowSendModal(true)}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 h-14 text-base font-semibold rounded-2xl"
          >
            <Send className="w-5 h-5 mr-2" />
            إرسال
          </Button>
          <Button
            onClick={() => setShowReceiveModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-14 text-base font-semibold rounded-2xl"
          >
            <ArrowDownToLine className="w-5 h-5 mr-2" />
            استقبال
          </Button>
        </div>

        {/* Wallet Address */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-gray-500/30 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm text-gray-400 mb-1">عنوان المحفظة</p>
                <code className="text-xs text-gray-200 break-all font-mono leading-relaxed">
                  {currentAddress}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(currentAddress)}
                className="text-gray-400 hover:text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="mining-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl">آخر المعاملات</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => loadWalletData(currentAddress)} 
                disabled={isLoading} 
                className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-10 w-10 p-0 rounded-xl"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-400 py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>جاري تحميل المعاملات...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold mb-2">لا توجد معاملات</p>
                <p className="text-sm">ابدأ بإرسال أو استقبال العملات</p>
              </div>
            ) : (
              transactions.map(tx => (
                <TransactionItem 
                  key={tx.hash} 
                  transaction={tx} 
                  onViewExplorer={() => {}}
                  language={currentLanguage.code}
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
