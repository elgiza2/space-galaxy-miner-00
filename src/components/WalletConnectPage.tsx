
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
      <div className="max-w-md w-full space-y-6">
        {/* Logo and Title */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1 }} 
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center glow-blue"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <img 
                src="/lovable-uploads/56e51793-4912-4a28-9c5b-611c28fb68d6.png" 
                alt="TON Logo" 
                className="w-12 h-12 rounded-full"
              />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
            TON Miner
          </h1>
          <p className="text-blue-300 text-lg font-semibold">Mining Platform</p>
        </motion.div>

        {/* Connection Card */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-gray-500/30 rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-white text-xl">Connect Your TON Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                To access the TON mining platform, you need to connect your TON wallet first. 
                This ensures secure transactions and earnings management.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Secure wallet connection</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Protected earnings</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Easy withdrawals</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-xl"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect TON Wallet'}
            </Button>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Don't have a TON wallet? Download one from the official TON website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectPage;
