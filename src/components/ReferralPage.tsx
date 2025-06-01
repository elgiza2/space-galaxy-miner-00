
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink, Gift, Sparkles, Zap } from 'lucide-react';

const ReferralPage = () => {
  const openTelegramBotWithCommand = () => {
    // Try to open Telegram with the command directly
    const telegramUrl = 'https://t.me/Spacelbot?start=toneel';
    window.open(telegramUrl, '_blank');
    
    // Also try the deep link for mobile
    setTimeout(() => {
      const deepLink = 'tg://resolve?domain=Spacelbot&start=toneel';
      window.location.href = deepLink;
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-3 pb-24">
      <div className="max-w-sm mx-auto space-y-4">
        {/* Compact Header */}
        <div className="text-center mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              دعوة الأصدقاء
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">ادع أصدقاءك واحصل على مكافآت مضاعفة</p>
          </div>
        </div>

        {/* Main Invite Button */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-purple-500/40 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
          <CardHeader className="pb-3 relative">
            <CardTitle className="text-white text-center text-xl font-bold flex items-center justify-center gap-2">
              <Gift className="w-6 h-6 text-pink-400" />
              ادع أصدقاءك الآن
              <Gift className="w-6 h-6 text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4 relative">
            <div className="text-center space-y-3">
              <p className="text-gray-300 text-base leading-relaxed">
                اضغط على الزر أدناه للحصول على رابط الإحالة الخاص بك فوراً
              </p>
              
              <Button 
                onClick={openTelegramBotWithCommand}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-12 text-base rounded-xl shadow-xl"
              >
                <Users className="w-5 h-5 mr-2" />
                دعوة الأصدقاء
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-gray-400 text-xs">
                سيتم إرسال الأمر "/toneel" تلقائياً إلى البوت
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border-2 border-blue-500/40 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5"></div>
          <CardHeader className="pb-3 relative">
            <CardTitle className="text-white text-center text-lg font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              كيف يعمل النظام
              <Sparkles className="w-5 h-5 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3 relative">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl border border-white/10">
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">اضغط على الزر</p>
                  <p className="text-gray-300 text-xs">
                    سيفتح البوت تلقائياً مع الأمر "/toneel"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl border border-white/10">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">احصل على الرابط</p>
                  <p className="text-gray-300 text-xs">
                    سيرسل لك البوت رابط الإحالة الخاص بك
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl border border-white/10">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">شارك واكسب</p>
                  <p className="text-gray-300 text-xs">
                    شارك الرابط مع أصدقائك واحصل على مكافآت
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Information */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-center text-lg font-bold flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-yellow-400" />
              مكافآت الإحالة
              <Gift className="w-5 h-5 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="text-center space-y-3">
              <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">0.05 TON</h3>
                <p className="text-gray-300 text-sm">
                  مكافأة لكل صديق ينضم عبر رابطك
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/30 rounded-xl border border-white/10 text-center">
                  <p className="text-pink-400 font-bold text-base">لك</p>
                  <p className="text-gray-300 text-xs">0.05 TON</p>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/10 text-center">
                  <p className="text-purple-400 font-bold text-base">لصديقك</p>
                  <p className="text-gray-300 text-xs">بونص ترحيبي</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
          <p className="text-center text-gray-300 text-xs leading-relaxed">
            <span className="text-green-400 font-semibold">مهم:</span>
            {" "}تحتاج إلى دعوة 3 أصدقاء على الأقل لتفعيل خاصية السحب من محفظتك
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
