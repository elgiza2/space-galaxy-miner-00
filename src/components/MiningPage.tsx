
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import SpaceLogo3D from './SpaceLogo3D';
import { UPGRADE_OPTIONS, formatTON, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';

const MINING_PHRASES = ['Mine $SPACE Coin', 'Start Earning Now', 'Explore the Galaxy of Rewards', 'Begin Your Space Mining Journey', 'Collect Cosmic Treasures', 'Unlock Universal Wealth'];

const MiningPage: React.FC = () => {
  const { toast } = useToast();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [miningActive, setMiningActive] = useState(false);
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [tonBalance, setTonBalance] = useState(0.15); // Start with some TON
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  const [friendsInvited, setFriendsInvited] = useState(1); // Track invited friends
  const [hasDeposited, setHasDeposited] = useState(false); // Track 0.1 TON deposit
  const [hasFreePackage, setHasFreePackage] = useState(false);

  // Check for first visit and give free mining package
  useEffect(() => {
    const firstVisit = localStorage.getItem('ton-mining-first-visit');
    if (!firstVisit) {
      setHasFreePackage(true);
      setMiningSpeed(2);
      setMiningActive(true);
      localStorage.setItem('ton-mining-first-visit', 'true');
      toast({
        title: "🎉 Welcome Bonus!",
        description: "You've received a free 2x mining package!",
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

  // Mining logic - earn TON instead of SPACE
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (miningActive && isWalletConnected) {
      interval = setInterval(() => {
        setTonBalance(prev => prev + (miningSpeed * 0.001)); // Small TON amounts
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miningActive, isWalletConnected, miningSpeed]);

  const handleStartMining = () => {
    setMiningActive(!miningActive);
    hapticFeedback(miningActive ? 'light' : 'success');
  };

  const handleClaim = () => {
    const claimAmount = miningSpeed * 0.01;
    setTonBalance(prev => prev + claimAmount);
    hapticFeedback('success');
    toast({
      title: "TON Claimed!",
      description: `You've claimed ${claimAmount.toFixed(4)} TON`,
    });
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
        title: "Upgrade Successful!",
        description: `Mining speed upgraded to ${upgrade.multiplier}x`,
      });
    } else {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough TON for this upgrade",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = () => {
    if (tonBalance < 1) {
      toast({
        title: "Minimum 1 TON Required",
        description: "You need at least 1 TON to withdraw",
        variant: "destructive",
      });
      return;
    }

    if (friendsInvited < 3) {
      toast({
        title: "Invite More Friends",
        description: `You need to invite ${3 - friendsInvited} more friends to enable withdrawal`,
        variant: "destructive",
      });
      return;
    }

    if (!hasDeposited) {
      toast({
        title: "Deposit Required",
        description: "You need to deposit 0.1 TON to enable withdrawal",
        variant: "destructive",
      });
      return;
    }

    // If all conditions met
    toast({
      title: "Withdrawal Initiated",
      description: "Your withdrawal request has been processed",
    });
  };

  const canWithdraw = tonBalance >= 1 && friendsInvited >= 3 && hasDeposited;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      {/* 3D Logo */}
      <motion.div 
        initial={{ scale: 0, rotateY: -180 }} 
        animate={{ scale: 1, rotateY: 0 }} 
        transition={{ duration: 1, ease: "easeOut" }} 
        className="relative"
      >
        <SpaceLogo3D size={1.2} className="w-96 h-48" />
        {miningActive && (
          <motion.div 
            className="absolute inset-0 bg-mining-glow rounded-full" 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
          />
        )}
      </motion.div>

      {/* Dynamic Phrases */}
      <div className="text-center h-16 flex items-center">
        <AnimatePresence mode="wait">
          <motion.h1 
            key={currentPhrase} 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -50, opacity: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-space-gradient"
          >
            {MINING_PHRASES[currentPhrase]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Mining Stats */}
      <Card className="glass-card p-6 w-full max-w-md bg-blue-900">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80">TON Balance:</span>
            <motion.span 
              key={tonBalance} 
              initial={{ scale: 1.2, color: '#ec4899' }} 
              animate={{ scale: 1, color: '#ffffff' }} 
              className="text-xl font-bold"
            >
              {tonBalance.toFixed(4)} TON
            </motion.span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80">Mining Speed:</span>
            <span className="text-xl font-bold text-amber-200">
              {miningSpeed}x
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/80">Friends Invited:</span>
            <span className="text-xl font-bold text-green-400">
              {friendsInvited}/3
            </span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4 w-full max-w-md">
        <Button 
          onClick={handleClaim} 
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
          size="lg"
        >
          Claim TON
        </Button>

        <Button 
          onClick={handleStartMining} 
          className={`w-full space-button ${miningActive ? 'animate-pulse-glow' : ''}`} 
          size="lg"
        >
          {miningActive ? 'Stop Mining' : 'Start Mining'}
        </Button>

        <Button 
          onClick={handleUpgradeClick} 
          variant="outline" 
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20" 
          size="lg"
        >
          Upgrade Mining Speed
        </Button>

        <Button 
          onClick={handleWithdraw} 
          disabled={!canWithdraw}
          className={`w-full ${canWithdraw ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700' : 'bg-gray-600 cursor-not-allowed'}`}
          size="lg"
        >
          {tonBalance < 1 ? `Withdraw (${tonBalance.toFixed(4)}/1.0 TON)` : 
           friendsInvited < 3 ? `Withdraw (${friendsInvited}/3 friends)` :
           !hasDeposited ? 'Withdraw (Deposit 0.1 TON)' : 'Withdraw TON'}
        </Button>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="glass-card border-white/20 text-white max-w-md bg-indigo-700">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-clip-text bg-space-gradient text-gray-50">
              Upgrade Mining Speed
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {UPGRADE_OPTIONS.map(upgrade => (
              <motion.div key={upgrade.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => handlePurchaseUpgrade(upgrade)} 
                  disabled={tonBalance < upgrade.price}
                  className="w-full p-4 h-auto flex justify-between items-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl disabled:opacity-50" 
                  variant="ghost"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">{upgrade.label}</div>
                    <div className="text-sm text-white/70">
                      {upgrade.multiplier}x faster mining
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-space-pink bg-transparent">
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
