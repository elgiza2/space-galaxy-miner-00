
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TonerLogo3D from './TonerLogo3D';
import { detectLanguage, SUPPORTED_LANGUAGES, type Language } from '../utils/language';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(detectLanguage());
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % SUPPORTED_LANGUAGES.length);
    }, 800);

    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(onComplete, 500);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          {/* Enhanced Animated Background Stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* 3D Toner Logo */}
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <TonerLogo3D size={0.8} className="w-80 h-40" />
          </motion.div>

          {/* Toner Title */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-4">
              Toner
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-4">
              منصة تعدين TON الأفضل
            </h2>
          </motion.div>

          {/* Animated Greetings */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              <motion.h3
                key={greetingIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-blue-300 mb-2"
              >
                {SUPPORTED_LANGUAGES[greetingIndex].greeting}
              </motion.h3>
            </AnimatePresence>
            <p className="text-xl text-white/80">
              {SUPPORTED_LANGUAGES[greetingIndex].flag} {SUPPORTED_LANGUAGES[greetingIndex].name}
            </p>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg text-blue-200 text-center max-w-md px-4 mb-6"
          >
            🚀 ابدأ رحلتك في تعدين TON مع أفضل منصة
          </motion.p>

          {/* Enhanced Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-8 flex space-x-3"
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Toner Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="absolute bottom-8 text-center"
          >
            <p className="text-blue-300 text-sm">
              ⚡ مدعوم من تقنية Toner المتقدمة
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
