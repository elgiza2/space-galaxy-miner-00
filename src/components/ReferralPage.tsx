
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink, Gift } from 'lucide-react';

const ReferralPage = () => {
  const openTelegramBotWithCommand = () => {
    const telegramUrl = 'https://t.me/Spongaibot?start=start';
    window.open(telegramUrl, '_blank');
    
    setTimeout(() => {
      const deepLink = 'tg://resolve?domain=Spongaibot&start=start';
      window.location.href = deepLink;
    }, 100);
  };

  return (
    <div className="min-h-screen p-3 pb-24">
      <div className="max-w-sm mx-auto space-y-3">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-1">
            Invite Friends
          </h1>
          <p className="text-gray-300 text-sm">Invite your friends and earn rewards</p>
        </div>

        {/* Main Invite Button */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/40 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-center text-lg font-bold flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-pink-400" />
              Invite Friends Now
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-gray-300 text-sm text-center">
              Click to get your referral link
            </p>
            
            <Button 
              onClick={openTelegramBotWithCommand}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-11 text-base rounded-lg"
            >
              <Users className="w-4 h-4 mr-2" />
              Invite Friends
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="text-gray-400 text-xs text-center">
              The command "/start" will be sent automatically
            </p>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/40 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-center text-base font-bold">
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  1
                </div>
                <p className="text-white text-sm">Click button to open bot</p>
              </div>

              <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  2
                </div>
                <p className="text-white text-sm">Get your referral link</p>
              </div>

              <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
                <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  3
                </div>
                <p className="text-white text-sm">Share link and earn rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-center text-base font-bold">
              Referral Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center space-y-2">
              <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-white">0.05 TON</h3>
                <p className="text-gray-300 text-sm">Per friend joined</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-black/30 rounded-lg text-center">
                  <p className="text-pink-400 font-bold text-sm">For You</p>
                  <p className="text-gray-300 text-xs">0.05 TON</p>
                </div>
                <div className="p-2 bg-black/30 rounded-lg text-center">
                  <p className="text-purple-400 font-bold text-sm">For Friend</p>
                  <p className="text-gray-300 text-xs">Welcome bonus</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
