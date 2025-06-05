import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UPGRADE_OPTIONS, formatTON, sendTONPayment, createTonConnector, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Zap, TrendingUp, Users, Gift, ArrowDownToLine, Pickaxe, Star } from 'lucide-react';
import DiscountPrice from './DiscountPrice';

const MINING_PHRASES = [
  'Start mining TON easily',
  'Earn TON safely and securely',
  'Mine TON every second',
  'Collect TON coins effortlessly',
  'Best platform for TON mining',
  'Invest in the future of TON'
];

interface UserData {
  tonBalance: number;
  miningSpeed: number;
  miningEarnings: number;
  totalMined: number;
  hasDeposited: boolean;
  hasFreePackage: boolean;
  lastSaveTime: number;
  friendsInvited: number;
}

const MiningPage: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [miningActive, setMiningActive] = useState(true);
  const [tonBalance, setTonBalance] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(0.05);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  const [friendsInvited, setFriendsInvited] = useState(1);
  const [hasDeposited, setHasDeposited] = useState(false);
  const [hasFreePackage, setHasFreePackage] = useState(false);
  const [miningEarnings, setMiningEarnings] = useState(0);
  const [totalMined, setTotalMined] = useState(0);

  // Load user data from localStorage
  const loadUserData = (): UserData | null => {
    try {
      const savedData = localStorage.getItem('toner-user-data');
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  // Save user data to localStorage
  const saveUserData = (data: UserData) => {
    try {
      localStorage.setItem('toner-user-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Initialize user data on component mount
  useEffect(() => {
    const savedData = loadUserData();
    const now = Date.now();
    
    if (savedData) {
      // Calculate offline earnings based on time difference
      const timeDiff = (now - savedData.lastSaveTime) / 1000; // seconds
      const offlineEarnings = timeDiff * 0.000001 * savedData.miningSpeed;
      
      // Restore saved data
      setTonBalance(savedData.tonBalance);
      setMiningSpeed(savedData.miningSpeed);
      setMiningEarnings(savedData.miningEarnings + offlineEarnings);
      setTotalMined(savedData.totalMined + offlineEarnings);
      setHasDeposited(savedData.hasDeposited);
      setHasFreePackage(savedData.hasFreePackage);
      setFriendsInvited(savedData.friendsInvited);
    } else {
      // First visit - give free mining package
      setHasFreePackage(true);
      setMiningSpeed(0.1);
      setMiningActive(true);
      localStorage.setItem('toner-first-visit', 'true');
    }
  }, []);

  // Save user data periodically and on changes
  useEffect(() => {
    const userData: UserData = {
      tonBalance,
      miningSpeed,
      miningEarnings,
      totalMined,
      hasDeposited,
      hasFreePackage,
      lastSaveTime: Date.now(),
      friendsInvited
    };
    
    saveUserData(userData);
  }, [tonBalance, miningSpeed, miningEarnings, totalMined, hasDeposited, hasFreePackage, friendsInvited]);

  // Save data when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const userData: UserData = {
        tonBalance,
        miningSpeed,
        miningEarnings,
        totalMined,
        hasDeposited,
        hasFreePackage,
        lastSaveTime: Date.now(),
        friendsInvited
      };
      saveUserData(userData);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Save data on component unmount
    };
  }, [tonBalance, miningSpeed, miningEarnings, totalMined, hasDeposited, hasFreePackage, friendsInvited]);

  // Rotate phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % MINING_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mining logic - per second (0.000001 TON base rate)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isWalletConnected) {
        const baseRate = 0.000001; // Base rate per second
        const earnings = baseRate * miningSpeed; // Apply multiplier
        setMiningEarnings(prev => prev + earnings);
        setTotalMined(prev => prev + earnings);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isWalletConnected, miningSpeed]);

  const handleClaim = () => {
    if (miningEarnings >= 0.2) { // Minimum claim amount set to 0.2 TON
      setTonBalance(prev => prev + miningEarnings);
      setMiningEarnings(0);
      hapticFeedback('success');
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    hapticFeedback('light');
  };

  const handlePurchaseUpgrade = async (upgrade: UpgradeOption) => {
    if (!tonConnectUI.wallet) {
      return;
    }

    try {
      console.log('Sending TON payment for upgrade:', upgrade);
      
      // Calculate discounted price (50% off)
      const discountedPrice = upgrade.price * 0.5;
      
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: 'UQAqPFXgVhDpXe-WbJgfwVd_ETkmPMqEjLaNKLtDTKxVAJgk',
            amount: (discountedPrice * 1e9).toString(),
          },
        ],
      };

      await tonConnectUI.sendTransaction(transaction);
      
      setMiningSpeed(upgrade.multiplier);
      setShowUpgradeModal(false);
      hapticFeedback('success');
    } catch (error) {
      console.error('TON payment failed:', error);
    }
  };

  const handleWithdraw = () => {
    if (tonBalance < 1) {
      return;
    }

    if (!hasDeposited) {
      return;
    }
  };

  const canWithdraw = tonBalance >= 1 && hasDeposited;
  const canClaim = miningEarnings >= 0.2; // Updated minimum claim amount

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
            className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ 
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)' 
            }}
          >
            <img 
              src="/lovable-uploads/56e51793-4912-4a28-9c5b-611c28fb68d6.png" 
              alt="TON Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
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
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                <img 
                  src="/lovable-uploads/56e51793-4912-4a28-9c5b-611c28fb68d6.png" 
                  alt="TON Logo" 
                  className="w-4 h-4 rounded-full object-cover"
                />
              </div>
              TON Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center relative z-10 pt-0 pb-2">
            <motion.div 
              key={tonBalance} 
              initial={{ scale: 1.1, color: '#3b82f6' }} 
              animate={{ scale: 1, color: '#ffffff' }} 
              className="text-2xl font-bold mb-2"
            >
              {tonBalance.toFixed(6)} <span className="text-blue-400">TON</span>
            </motion.div>
            {miningEarnings > 0 && (
              <div className="text-green-400 text-xs font-semibold mb-2">
                +{miningEarnings.toFixed(6)} TON ready to claim
              </div>
            )}
            <div className="text-gray-300 text-xs mb-3">
              Total mined: {totalMined.toFixed(6)} TON
            </div>
            
            {/* Claim Button */}
            <Button 
              onClick={handleClaim} 
              disabled={!canClaim}
              className={`w-full h-8 text-xs font-bold rounded-lg ${
                canClaim
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              <Gift className="w-3 h-3 mr-1" />
              {canClaim 
                ? `Claim (${miningEarnings.toFixed(6)} TON)` 
                : `Claim (${miningEarnings.toFixed(6)}/0.2 TON)`
              }
            </Button>
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
          {tonBalance < 1 ? `Withdraw (${tonBalance.toFixed(6)}/1.0 TON)` : 
           !hasDeposited ? 'Withdraw (Deposit 0.1 TON)' : 'Withdraw TON'}
        </Button>
      </div>

      {/* Compact Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="mining-card border-blue-500/40 text-white max-w-xs bg-black/90 backdrop-blur-xl">
          <DialogHeader className="text-center mb-3">
            <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1">
              ⚡ Upgrade Mining
            </DialogTitle>
            <p className="text-gray-300 text-xs">Pay with TON to upgrade</p>
            <div className="text-center text-sm text-green-400 font-bold bg-green-500/10 rounded-lg p-2 border border-green-500/30">
              🔥 MEGA SALE: 50% OFF All Upgrades!
            </div>
          </DialogHeader>
          
          <div className="space-y-2">
            {UPGRADE_OPTIONS.map(upgrade => (
              <motion.div key={upgrade.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => handlePurchaseUpgrade(upgrade)} 
                  className="w-full p-3 h-auto flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/30 rounded-lg" 
                  variant="ghost"
                >
                  <div className="text-left">
                    <div className="font-bold text-sm text-white">{upgrade.label}</div>
                    <div className="text-xs text-blue-300">
                      ⚡ {upgrade.multiplier}x faster
                    </div>
                  </div>
                  <div className="text-right">
                    <DiscountPrice originalPrice={upgrade.price} className="text-right" />
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
