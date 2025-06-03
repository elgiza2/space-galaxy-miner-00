
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, LogIn } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { motion } from 'framer-motion';

const WalletConnectPage = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnecting, setIsConnecting] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-4">
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.8 }} 
          className="text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <img 
                src="/lovable-uploads/56e51793-4912-4a28-9c5b-611c28fb68d6.png" 
                alt="TON Logo" 
                className="w-8 h-8 rounded-full object-cover"
              />
            </motion.div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            TON Miner
          </h1>
        </motion.div>

        {/* Connection Card */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-gray-500/30 rounded-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-white text-base">Connect TON Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300 text-xs text-center">
              Connect your wallet to start mining
            </p>
            
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full h-10 text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletConnectPage;
