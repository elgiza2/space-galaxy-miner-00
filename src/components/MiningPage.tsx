
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UPGRADE_OPTIONS, formatTON, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';
import { Zap, Coins, TrendingUp, Users, Gift, ArrowDownToLine, Pickaxe, Star } from 'lucide-react';

const MINING_PHRASES = [
  'ابدأ تعدين TON مع Toner',
  'اكسب TON بسهولة وأمان',
  'منصة Toner لتعدين TON',
  'اجمع عملات TON كل ثانية',
  'Toner - الأفضل في تعدين TON',
  'استثمر في مستقبل TON'
];

const MiningPage: React.FC = () => {
  const { toast } = useToast();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [miningActive, setMiningActive] = useState(false);
  const [tonBalance, setTonBalance] = useState(0.15);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  const [friendsInvited, setFriendsInvited] = useState(1);
  const [hasDeposited, setHasDeposited] = useState(false);
  const [hasFreePackage, setHasFreePackage] = useState(false);
  const [miningEarnings, setMiningEarnings] = useState(0);
  const [totalMined, setTotalMined] = useState(0);

  // Check for first visit and give free mining package
  useEffect(() => {
    const firstVisit = localStorage.getItem('toner-first-visit');
    if (!firstVisit) {
      setHasFreePackage(true);
      setMiningSpeed(2);
      setMiningActive(true);
      localStorage.setItem('toner-first-visit', 'true');
      toast({
        title: "🎉 مرحباً بك في Toner!",
        description: "حصلت على حزمة تعدين مجانية 2x!",
      });
    }
  }, [toast]);

  // Rotate phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % MINING_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mining logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (miningActive && isWalletConnected) {
      interval = setInterval(() => {
        const earnings = miningSpeed * 0.001;
        setMiningEarnings(prev => prev + earnings);
        setTotalMined(prev => prev + earnings);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miningActive, isWalletConnected, miningSpeed]);

  const handleStartMining = () => {
    setMiningActive(!miningActive);
    hapticFeedback(miningActive ? 'light' : 'success');
  };

  const handleClaim = () => {
    if (miningEarnings > 0) {
      setTonBalance(prev => prev + miningEarnings);
      setMiningEarnings(0);
      hapticFeedback('success');
      toast({
        title: "🎉 تم جمع TON!",
        description: `حصلت على ${miningEarnings.toFixed(4)} TON`,
      });
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    hapticFeedback('light');
  };

  const handlePurchaseUpgrade = (upgrade: UpgradeOption) => {
    if (tonBalance >= upgrade.price) {
      setTonBalance(prev => prev - upgrade.price);
      setMiningSpeed(upgrade.multiplier);
      setShowUpgradeModal(false);
      hapticFeedback('success');
      toast({
        title: "✅ تم الترقية بنجاح!",
        description: `سرعة التعدين أصبحت ${upgrade.multiplier}x`,
      });
    } else {
      toast({
        title: "⚠️ رصيد غير كافي",
        description: "تحتاج TON أكثر لهذه الترقية",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = () => {
    if (tonBalance < 1) {
      toast({
        title: "⚠️ الحد الأدنى 1 TON",
        description: "تحتاج على الأقل 1 TON للسحب",
        variant: "destructive",
      });
      return;
    }

    if (friendsInvited < 3) {
      toast({
        title: "👥 ادع المزيد من الأصدقاء",
        description: `تحتاج لدعوة ${3 - friendsInvited} أصدقاء لتفعيل السحب`,
        variant: "destructive",
      });
      return;
    }

    if (!hasDeposited) {
      toast({
        title: "💰 مطلوب إيداع",
        description: "تحتاج لإيداع 0.1 TON لتفعيل السحب",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ تم طلب السحب",
      description: "سيتم معالجة طلب السحب في أقرب وقت",
    });
  };

  const canWithdraw = tonBalance >= 1 && friendsInvited >= 3 && hasDeposited;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6 relative">
      {/* Toner Header */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 1 }} 
        className="text-center relative mb-4"
      >
        {/* Toner Logo */}
        <div className="flex items-center justify-center mb-4">
          <motion.div 
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center glow-blue mr-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Pickaxe className="w-10 h-10 text-white" />
          </motion.div>
          <div className="text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Toner
            </h1>
            <p className="text-blue-300 text-lg font-semibold">منصة تعدين TON</p>
          </div>
        </div>
        
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentPhrase} 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: -20, opacity: 0 }} 
              transition={{ duration: 0.6 }} 
              className="text-xl md:text-2xl font-semibold text-white"
            >
              {MINING_PHRASES[currentPhrase]}
            </motion.h2>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Enhanced Mining Stats Cards */}
      <div className="w-full max-w-md space-y-4">
        {/* Main Balance Card */}
        <Card className="mining-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-white text-center flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              رصيد TON
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center relative z-10">
            <motion.div 
              key={tonBalance} 
              initial={{ scale: 1.1, color: '#3b82f6' }} 
              animate={{ scale: 1, color: '#ffffff' }} 
              className="text-4xl font-bold mb-3"
            >
              {tonBalance.toFixed(4)} <span className="text-blue-400">TON</span>
            </motion.div>
            {miningEarnings > 0 && (
              <div className="text-green-400 text-sm font-semibold">
                +{miningEarnings.toFixed(4)} TON متاح للجمع
              </div>
            )}
            <div className="text-gray-300 text-sm mt-2">
              إجمالي المعدن: {totalMined.toFixed(4)} TON
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Mining Stats */}
        <Card className="mining-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-500/10 rounded-xl p-3">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">{miningSpeed}x</div>
                <div className="text-xs text-yellow-200">سرعة التعدين</div>
              </div>
              <div className="bg-green-500/10 rounded-xl p-3">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{friendsInvited}/3</div>
                <div className="text-xs text-green-200">الأصدقاء</div>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-3">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">
                  {miningActive ? 'نشط' : 'متوقف'}
                </div>
                <div className="text-xs text-blue-200">حالة التعدين</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="space-y-4 w-full max-w-md">
        {/* Claim Button */}
        <Button 
          onClick={handleClaim} 
          disabled={miningEarnings <= 0}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-16 text-lg font-bold rounded-2xl disabled:opacity-50 shadow-lg" 
        >
          <Gift className="w-6 h-6 mr-3" />
          جمع المكافآت ({miningEarnings.toFixed(4)} TON)
        </Button>

        {/* Mining Toggle Button */}
        <Button 
          onClick={handleStartMining} 
          className={`w-full h-16 text-lg font-bold rounded-2xl shadow-lg ${
            miningActive 
              ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
              : 'mining-button bg-gradient-to-r from-blue-500 to-blue-700'
          }`}
        >
          <Pickaxe className="w-6 h-6 mr-3" />
          {miningActive ? 'إيقاف التعدين' : 'بدء التعدين'}
        </Button>

        {/* Upgrade Button */}
        <Button 
          onClick={handleUpgradeClick} 
          variant="outline" 
          className="w-full h-14 bg-blue-500/10 border-blue-500/50 text-blue-200 hover:bg-blue-500/20 rounded-2xl border-2 font-semibold" 
        >
          <TrendingUp className="w-5 h-5 mr-3" />
          ترقية سرعة التعدين
        </Button>

        {/* Withdraw Button */}
        <Button 
          onClick={handleWithdraw} 
          disabled={!canWithdraw}
          className={`w-full h-14 rounded-2xl font-semibold ${
            canWithdraw 
              ? 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          <ArrowDownToLine className="w-5 h-5 mr-3" />
          {tonBalance < 1 ? `سحب (${tonBalance.toFixed(4)}/1.0 TON)` : 
           friendsInvited < 3 ? `سحب (${friendsInvited}/3 أصدقاء)` :
           !hasDeposited ? 'سحب (إيداع 0.1 TON)' : 'سحب TON'}
        </Button>
      </div>

      {/* Enhanced Free Package Notification */}
      {hasFreePackage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/50 rounded-3xl text-center shadow-lg"
        >
          <div className="flex items-center justify-center mb-3">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            <Gift className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-green-200 font-bold text-lg mb-1">🎁 حزمة ترحيبية من Toner!</p>
          <p className="text-green-300 text-sm">تعدين بسرعة 2x مفعل الآن</p>
        </motion.div>
      )}

      {/* Enhanced Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="mining-card border-blue-500/40 text-white max-w-md bg-black/90 backdrop-blur-xl">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
              ⚡ ترقية سرعة التعدين
            </DialogTitle>
            <p className="text-gray-300">اختر الحزمة المناسبة لك</p>
          </DialogHeader>
          
          <div className="space-y-4">
            {UPGRADE_OPTIONS.map(upgrade => (
              <motion.div key={upgrade.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => handlePurchaseUpgrade(upgrade)} 
                  disabled={tonBalance < upgrade.price}
                  className="w-full p-6 h-auto flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border-2 border-blue-500/30 rounded-2xl disabled:opacity-50 text-right" 
                  variant="ghost"
                >
                  <div className="text-right">
                    <div className="font-bold text-xl text-white mb-1">{upgrade.label}</div>
                    <div className="text-sm text-blue-300">
                      ⚡ تعدين أسرع {upgrade.multiplier}x
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-blue-400 text-lg">
                      {formatTON(upgrade.price)}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiningPage;
