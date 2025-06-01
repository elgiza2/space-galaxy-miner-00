
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Send, ArrowDownToLine, Copy, RefreshCw, LogIn, LogOut, Coins, TrendingUp, Star } from 'lucide-react';
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
        title: "🔗 فتح نافذة الاتصال",
        description: "يرجى اختيار محفظتك المفضلة"
      });
    } catch (error) {
      toast({
        title: "❌ خطأ في الاتصال",
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
        title: "✅ تم قطع الاتصال",
        description: "تم قطع الاتصال بمحفظة TON بنجاح"
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
        title: "⚠️ خطأ في تحميل البيانات",
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
      title: "✅ تم النسخ",
      description: "تم نسخ عنوان المحفظة بنجاح"
    });
  };

  const currentAddress = connectedAddress || fallbackAddress;
  const isWalletConnected = !!tonConnectUI.wallet;

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Toner Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center glow-blue">
              <Wallet className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
            Toner
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-3">محفظة TON الذكية</h2>
          <p className="text-gray-300 text-base">إدارة عملاتك الرقمية بأمان تام</p>
        </div>

        {/* Enhanced Wallet Connection Status */}
        <Card className="wallet-card border-2 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${isWalletConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                  <span className="text-white font-bold text-lg">
                    {isWalletConnected ? '🟢 متصل بالمحفظة' : '🔴 غير متصل'}
                  </span>
                  <p className="text-gray-300 text-sm">
                    {isWalletConnected ? 'المحفظة جاهزة للاستخدام' : 'اربط محفظتك للبدء'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={isWalletConnected ? disconnectWallet : connectWallet} 
                disabled={isConnecting} 
                variant="outline" 
                size="sm" 
                className={`${isWalletConnected ? 'bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30' : 'bg-green-500/20 border-green-500/50 text-green-200 hover:bg-green-500/30'} font-semibold`}
              >
                {isWalletConnected ? <LogOut className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                {isConnecting ? 'جاري الاتصال...' : (isWalletConnected ? 'قطع الاتصال' : 'ربط المحفظة')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced TON Balance Card */}
        <Card className="mining-card border-2 border-blue-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-4 text-2xl">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Coins className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="block text-2xl font-bold">TON</span>
                  <span className="text-base text-blue-300 font-normal">عملة التليجرام</span>
                </div>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => loadWalletData(currentAddress)} 
                disabled={isLoading} 
                className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-12 w-12 p-0 rounded-xl"
              >
                <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <p className="font-bold text-white mb-4 text-4xl">
              {tonBalance.toFixed(4)} <span className="text-blue-400">TON</span>
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-base font-semibold">+2.5% اليوم</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm">Toner</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setShowSendModal(true)}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 h-16 text-lg font-bold rounded-2xl shadow-lg"
          >
            <Send className="w-6 h-6 mr-3" />
            إرسال TON
          </Button>
          <Button
            onClick={() => setShowReceiveModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-16 text-lg font-bold rounded-2xl shadow-lg"
          >
            <ArrowDownToLine className="w-6 h-6 mr-3" />
            استقبال TON
          </Button>
        </div>

        {/* Enhanced Wallet Address */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border-2 border-gray-500/30 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm text-gray-400 mb-2 font-semibold">🏠 عنوان المحفظة</p>
                <code className="text-sm text-gray-200 break-all font-mono leading-relaxed bg-gray-900/50 p-2 rounded-lg block">
                  {currentAddress}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(currentAddress)}
                className="text-gray-400 hover:text-white hover:bg-white/10 h-12 w-12 p-0 rounded-xl flex-shrink-0"
              >
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Transaction History */}
        <Card className="mining-card border-2 border-blue-500/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-2xl font-bold">📊 آخر المعاملات</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => loadWalletData(currentAddress)} 
                disabled={isLoading} 
                className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-12 w-12 p-0 rounded-xl"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-400 py-12">
                <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p className="text-lg font-semibold">جاري تحميل المعاملات...</p>
                <p className="text-sm">يرجى الانتظار</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <Wallet className="w-20 h-20 mx-auto mb-6 opacity-50" />
                <p className="text-xl font-bold mb-2">📭 لا توجد معاملات</p>
                <p className="text-base mb-4">ابدأ بإرسال أو استقبال عملات TON</p>
                <div className="flex items-center justify-center gap-2 text-blue-300">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">مدعوم من Toner</span>
                </div>
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
