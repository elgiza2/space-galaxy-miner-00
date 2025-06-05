
import React from 'react';
import { useDiscountPricing } from '@/hooks/useDiscountPricing';

interface DiscountPriceProps {
  originalPrice: number;
  className?: string;
}

const DiscountPrice: React.FC<DiscountPriceProps> = ({ originalPrice, className = '' }) => {
  const { discountedPrice, discountPercentage, formatPrice } = useDiscountPricing(originalPrice);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-green-400">
          {formatPrice(discountedPrice)}
        </span>
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          -{discountPercentage}%
        </span>
      </div>
      <span className="text-sm text-gray-400 line-through">
        {formatPrice(originalPrice)}
      </span>
    </div>
  );
};

export default DiscountPrice;
