
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UPGRADE_OPTIONS, formatTON, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';
import { Zap, Coins, TrendingUp, Users, Gift, ArrowDownToLine, Pickaxe } from 'lucide-react';

const MINING_PHRASES = [
  'ابدأ تعدين TON الآن',
  'اكتشف كنوز العملات الرقمية',
  'رحلتك في تعدين TON',
  'اجمع عملات TON كل ثانية',
  'استكشف مجرة المكافآت',
  'اربح TON بسهولة'
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

  // Check for first visit and give free mining package
  useEffect(() => {
    const firstVisit = localStorage.getItem('ton-mining-first-visit');
    if (!firstVisit) {
      setHasFreePackage(true);
      setMiningSpeed(2);
      setMiningActive(true);
      localStorage.setItem('ton-mining-first-visit', 'true');
      toast({
        title: "🎉 مرحباً بك!",
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
        title: "تم جمع TON!",
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
        title: "تم الترقية بنجاح!",
        description: `سرعة التعدين أصبحت ${upgrade.multiplier}x`,
      });
    } else {
      toast({
        title: "رصيد غير كافي",
        description: "تحتاج TON أكثر لهذه الترقية",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = () => {
    if (tonBalance < 1) {
      toast({
        title: "الحد الأدنى 1 TON",
        description: "تحتاج على الأقل 1 TON للسحب",
        variant: "destructive",
      });
      return;
    }

    if (friendsInvited < 3) {
      toast({
        title: "ادع المزيد من الأصدقاء",
        description: `تحتاج لدعوة ${3 - friendsInvited} أصدقاء لتفعيل السحب`,
        variant: "destructive",
      });
      return;
    }

    if (!hasDeposited) {
      toast({
        title: "مطلوب إيداع",
        description: "تحتاج لإيداع 0.1 TON لتفعيل السحب",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم طلب السحب",
      description: "سيتم معالجة طلب السحب قريباً",
    });
  };

  const canWithdraw = tonBalance >= 1 && friendsInvited >= 3 && hasDeposited;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
      {/* Header with Mining Animation */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 1 }} 
        className="text-center relative"
      >
        <div className={`w-32 h-32 mx-auto mb-6 rounded-full ton-gradient flex items-center justify-center ${miningActive ? 'ton-coin-pulse' : ''}`}>
          <Pickaxe className="w-16 h-16 text-white" />
        </div>
        
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={currentPhrase} 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: -20, opacity: 0 }} 
              transition={{ duration: 0.6 }} 
              className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600"
            >
              {MINING_PHRASES[currentPhrase]}
            </motion.h1>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mining Stats Cards */}
      <div className="w-full max-w-md space-y-4">
        {/* Main Balance Card */}
        <Card className="mining-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              <Coins className="w-6 h-6 text-blue-400" />
              رصيد TON
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div 
              key={tonBalance} 
              initial={{ scale: 1.1, color: '#3b82f6' }} 
              animate={{ scale: 1, color: '#ffffff' }} 
              className="text-3xl font-bold mb-2"
            >
              {tonBalance.toFixed(4)} TON
            </motion.div>
            {miningEarnings > 0 && (
              <div className="text-green-400 text-sm">
                +{miningEarnings.toFixed(4)} TON متاح للجمع
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mining Stats */}
        <Card className="mining-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-xl font-bold text-white">{miningSpeed}x</div>
                <div className="text-xs text-gray-400">سرعة التعدين</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-xl font-bold text-white">{friendsInvited}/3</div>
                <div className="text-xs text-gray-400">الأصدقاء</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">
                  {miningActive ? 'نشط' : 'متوقف'}
                </div>
                <div className="text-xs text-gray-400">حالة التعدين</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 w-full max-w-md">
        {/* Claim Button */}
        <Button 
          onClick={handleClaim} 
          disabled={miningEarnings <= 0}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-14 text-lg font-semibold rounded-2xl disabled:opacity-50" 
        >
          <Gift className="w-5 h-5 mr-2" />
          جمع المكافآت ({miningEarnings.toFixed(4)} TON)
        </Button>

        {/* Mining Toggle Button */}
        <Button 
          onClick={handleStartMining} 
          className={`w-full h-14 text-lg font-semibold rounded-2xl ${
            miningActive 
              ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
              : 'mining-button'
          }`}
        >
          <Pickaxe className="w-5 h-5 mr-2" />
          {miningActive ? 'إيقاف التعدين' : 'بدء التعدين'}
        </Button>

        {/* Upgrade Button */}
        <Button 
          onClick={handleUpgradeClick} 
          variant="outline" 
          className="w-full h-12 bg-blue-500/10 border-blue-500/50 text-blue-200 hover:bg-blue-500/20 rounded-2xl" 
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          ترقية سرعة التعدين
        </Button>

        {/* Withdraw Button */}
        <Button 
          onClick={handleWithdraw} 
          disabled={!canWithdraw}
          className={`w-full h-12 rounded-2xl ${
            canWithdraw 
              ? 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          <ArrowDownToLine className="w-5 h-5 mr-2" />
          {tonBalance < 1 ? `سحب (${tonBalance.toFixed(4)}/1.0 TON)` : 
           friendsInvited < 3 ? `سحب (${friendsInvited}/3 أصدقاء)` :
           !hasDeposited ? 'سحب (إيداع 0.1 TON)' : 'سحب TON'}
        </Button>
      </div>

      {/* Free Package Notification */}
      {hasFreePackage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/50 rounded-2xl text-center"
        >
          <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-200 font-semibold">حزمة ترحيبية مجانية نشطة!</p>
          <p className="text-green-300 text-sm">تعدين بسرعة 2x مفعل</p>
        </motion.div>
      )}

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="mining-card border-blue-500/40 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              ترقية سرعة التعدين
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {UPGRADE_OPTIONS.map(upgrade => (
              <motion.div key={upgrade.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => handlePurchaseUpgrade(upgrade)} 
                  disabled={tonBalance < upgrade.price}
                  className="w-full p-4 h-auto flex justify-between items-center bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl disabled:opacity-50" 
                  variant="ghost"
                >
                  <div className="text-right">
                    <div className="font-bold text-lg text-white">{upgrade.label}</div>
                    <div className="text-sm text-gray-300">
                      تعدين أسرع {upgrade.multiplier}x
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-blue-400">
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
