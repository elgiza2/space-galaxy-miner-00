
import React, { useState } from 'react';
import { X, Percent, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 text-white py-6 px-4 shadow-xl z-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4">
          {/* Main heading */}
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white/25 p-3 rounded-full animate-pulse">
              <Percent className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-wide">
              🔥 MEGA SALE EVENT 🔥
            </h1>
            <div className="bg-white/25 p-3 rounded-full animate-pulse">
              <Star className="w-8 h-8" />
            </div>
          </div>

          {/* Discount info */}
          <div className="space-y-2">
            <div className="text-4xl md:text-6xl font-extrabold text-yellow-300 drop-shadow-lg animate-bounce">
              50% OFF
            </div>
            <p className="text-lg md:text-2xl font-bold">
              ALL Premium Features & Services
            </p>
          </div>

          {/* CTA text */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm md:text-lg">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">Limited Time Offer - Don't Miss Out!</span>
              <Zap className="w-5 h-5 text-yellow-300" />
            </div>
            <p className="text-xs md:text-sm opacity-90">
              Get instant access to premium mining features at half the price
            </p>
          </div>

          {/* Close button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse delay-500"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-2 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-float"></div>
      <div className="absolute top-6 right-20 w-3 h-3 bg-white/50 rounded-full animate-float delay-1000"></div>
      <div className="absolute bottom-4 left-20 w-2 h-2 bg-yellow-300 rounded-full animate-float delay-700"></div>
      <div className="absolute bottom-2 right-32 w-2 h-2 bg-white/50 rounded-full animate-float delay-300"></div>
    </div>
  );
};

export default PromoBanner;
