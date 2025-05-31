import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, RotateCcw, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { getTranslation } from '../utils/language';

const GamesPage = () => {
  const [language, setLanguage] = React.useState('ar');
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const t = (key: string) => getTranslation(key, language);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

  const openGame = (gameUrl: string) => {
    setActiveGame(gameUrl);
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  if (activeGame) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Game Header */}
        <div className="flex justify-between items-center p-4 bg-black/80 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-pink-400" />
            <h1 className="text-xl font-bold text-white">Slow Roads</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeGame}
            className="text-white hover:bg-white/10 h-10 px-3 rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Rotation Notice */}
        <div className="bg-yellow-500/20 border border-yellow-500/30 p-2 mx-4 rounded-xl">
          <div className="flex items-center gap-3 justify-center">
            <RotateCcw className="w-5 h-5 text-yellow-400" />
            <p className="text-white text-center font-medium text-sm">
              {t('rotatePhoneToPlay')}
            </p>
          </div>
        </div>

        {/* Game Frame - Full Screen */}
        <div className="flex-1 p-4">
          <div className="h-full w-full bg-black rounded-xl overflow-hidden">
            <iframe
              src={activeGame}
              className="w-full h-full border-0"
              title="Game"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-pink-400" />
          <h1 className="text-3xl font-bold text-white">{t('games')}</h1>
        </div>
        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      </div>

      {/* Games Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Slow Roads Game */}
          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-white text-4xl">🏎️</div>
              </div>
              <CardTitle className="text-white text-xl">Slow Roads</CardTitle>
              <CardDescription className="text-gray-300">
                {t('slowRoadsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => openGame('https://slowroads.io/')}
                className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                {t('playNow')}
              </Button>
            </CardContent>
          </Card>

          {/* Placeholder for more games */}
          <Card className="glass-card opacity-50">
            <CardHeader>
              <div className="aspect-video bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-white text-4xl">🎮</div>
              </div>
              <CardTitle className="text-white text-xl">{t('comingSoon')}</CardTitle>
              <CardDescription className="text-gray-300">
                {t('moreGamesComingSoon')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                disabled
                className="w-full bg-gray-600 text-gray-300 font-bold py-3 rounded-xl cursor-not-allowed"
              >
                {t('comingSoon')}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card opacity-50">
            <CardHeader>
              <div className="aspect-video bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-white text-4xl">🎯</div>
              </div>
              <CardTitle className="text-white text-xl">{t('comingSoon')}</CardTitle>
              <CardDescription className="text-gray-300">
                {t('moreGamesComingSoon')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                disabled
                className="w-full bg-gray-600 text-gray-300 font-bold py-3 rounded-xl cursor-not-allowed"
              >
                {t('comingSoon')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center">
          <Card className="glass-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">{t('gamesInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('gamesInfoDescription')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
