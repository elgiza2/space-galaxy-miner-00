
import React, { useState } from 'react';
import { X, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-white/20 p-2 rounded-full">
            <Percent className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base font-bold text-center md:text-left">
              🔥 MEGA SALE: 50% OFF on ALL Premium Features! 
              <span className="hidden md:inline"> Limited time offer - Don't miss out!</span>
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full ml-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
    </div>
  );
};

export default PromoBanner;
