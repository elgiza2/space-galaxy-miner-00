
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
  'Start mining TON easily',
  'Earn TON safely and securely',
  'Mine TON every second',
  'Collect TON coins effortlessly',
  'Best platform for TON mining',
  'Invest in the future of TON'
];

const MiningPage: React.FC = () => {
  const { toast } = useToast();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [miningActive, setMiningActive] = useState(true);
  const [tonBalance, setTonBalance] = useState(0.15);
  const [miningSpeed, setMiningSpeed] = useState(0.05); // Changed from 1 to 0.05
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
      setMiningSpeed(0.1); // Changed from 2 to 0.1 (2x of 0.05)
      setMiningActive(true);
      localStorage.setItem('toner-first-visit', 'true');
      toast({
        title: "🎉 Welcome to the Platform!",
        description: "You got a free 2x mining package!",
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

  // Mining logic - always active
  useEffect(() => {
    const interval = setInterval(() => {
      if (isWalletConnected) {
        const earnings = (miningSpeed / 86400) * 0.001; // Adjusted for daily rate
        setMiningEarnings(prev => prev + earnings);
        setTotalMined(prev => prev + earnings);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isWalletConnected, miningSpeed]);

  const handleClaim = () => {
    if (miningEarnings > 0) {
      setTonBalance(prev => prev + miningEarnings);
      setMiningEarnings(0);
      hapticFeedback('success');
      toast({
        title: "🎉 TON Claimed!",
        description: `You earned ${miningEarnings.toFixed(4)} TON`,
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
        title: "✅ Upgrade Successful!",
        description: `Mining speed is now ${upgrade.multiplier}x`,
      });
    } else {
      toast({
        title: "⚠️ Insufficient Balance",
        description: "You need more TON for this upgrade",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = () => {
    if (tonBalance < 1) {
      toast({
        title: "⚠️ Minimum 1 TON Required",
        description: "You need at least 1 TON to withdraw",
        variant: "destructive",
      });
      return;
    }

    if (!hasDeposited) {
      toast({
        title: "💰 Deposit Required",
        description: "You need to deposit 0.1 TON to activate withdrawals",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ Withdrawal Requested",
      description: "Your withdrawal will be processed soon",
    });
  };

  const canWithdraw = tonBalance >= 1 && hasDeposited;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 space-y-4 relative">
      {/* Header */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 1 }} 
        className="text-center relative mb-3"
      >
        <div className="flex items-center justify-center mb-3">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center glow-blue mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Pickaxe className="w-6 h-6 text-white" />
          </motion.div>
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              TON Miner
            </h1>
            <p className="text-blue-300 text-sm font-semibold">Mining Platform</p>
          </div>
        </div>
        
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentPhrase} 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: -20, opacity: 0 }} 
              transition={{ duration: 0.6 }} 
              className="text-lg font-semibold text-white"
            >
              {MINING_PHRASES[currentPhrase]}
            </motion.h2>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mining Stats Cards */}
      <div className="w-full max-w-sm space-y-3">
        {/* Main Balance Card */}
        <Card className="mining-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-white text-center flex items-center justify-center gap-2 text-lg">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Coins className="w-4 h-4 text-white" />
              </div>
              TON Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center relative z-10 pt-0 pb-4">
            <motion.div 
              key={tonBalance} 
              initial={{ scale: 1.1, color: '#3b82f6' }} 
              animate={{ scale: 1, color: '#ffffff' }} 
              className="text-2xl font-bold mb-2"
            >
              {tonBalance.toFixed(4)} <span className="text-blue-400">TON</span>
            </motion.div>
            {miningEarnings > 0 && (
              <div className="text-green-400 text-xs font-semibold">
                +{miningEarnings.toFixed(4)} TON ready to claim
              </div>
            )}
            <div className="text-gray-300 text-xs mt-1">
              Total mined: {totalMined.toFixed(4)} TON
            </div>
          </CardContent>
        </Card>

        {/* Compact Mining Stats */}
        <Card className="mining-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-yellow-500/10 rounded-xl p-2">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-lg font-bold text-white">{miningSpeed}x</div>
                <div className="text-xs text-yellow-200">Mining Speed</div>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-2">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-sm font-bold text-white">
                  Active
                </div>
                <div className="text-xs text-blue-200">Mining Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 w-full max-w-sm">
        {/* Claim Button */}
        <Button 
          onClick={handleClaim} 
          disabled={miningEarnings <= 0}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 text-base font-bold rounded-xl disabled:opacity-50 shadow-lg" 
        >
          <Gift className="w-5 h-5 mr-2" />
          Claim Rewards ({miningEarnings.toFixed(4)} TON)
        </Button>

        {/* Upgrade Button */}
        <Button 
          onClick={handleUpgradeClick} 
          variant="outline" 
          className="w-full h-10 bg-blue-500/10 border-blue-500/50 text-blue-200 hover:bg-blue-500/20 rounded-xl border-2 font-semibold text-sm" 
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Upgrade Mining
        </Button>

        {/* Withdraw Button */}
        <Button 
          onClick={handleWithdraw} 
          disabled={!canWithdraw}
          className={`w-full h-12 rounded-xl font-semibold ${
            canWithdraw 
              ? 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4 mr-2" />
          {tonBalance < 1 ? `Withdraw (${tonBalance.toFixed(4)}/1.0 TON)` : 
           !hasDeposited ? 'Withdraw (Deposit 0.1 TON)' : 'Withdraw TON'}
        </Button>
      </div>

      {/* Free Package Notification */}
      {hasFreePackage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/50 rounded-2xl text-center shadow-lg"
        >
          <div className="flex items-center justify-center mb-2">
            <Star className="w-6 h-6 text-yellow-400 mr-1" />
            <Gift className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-green-200 font-bold text-base mb-1">🎁 Welcome Package!</p>
          <p className="text-green-300 text-sm">2x mining speed activated</p>
        </motion.div>
      )}

      {/* Compact Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="mining-card border-blue-500/40 text-white max-w-xs bg-black/90 backdrop-blur-xl">
          <DialogHeader className="text-center mb-3">
            <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1">
              ⚡ Upgrade Mining
            </DialogTitle>
            <p className="text-gray-300 text-xs">Choose your package</p>
          </DialogHeader>
          
          <div className="space-y-2">
            {UPGRADE_OPTIONS.map(upgrade => (
              <motion.div key={upgrade.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => handlePurchaseUpgrade(upgrade)} 
                  disabled={tonBalance < upgrade.price}
                  className="w-full p-3 h-auto flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/30 rounded-lg disabled:opacity-50" 
                  variant="ghost"
                >
                  <div className="text-left">
                    <div className="font-bold text-sm text-white">{upgrade.label}</div>
                    <div className="text-xs text-blue-300">
                      ⚡ {upgrade.multiplier}x faster
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-400 text-sm">
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
