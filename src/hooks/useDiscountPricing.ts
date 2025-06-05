
import { useMemo } from 'react';

interface DiscountPricingHook {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  formatPrice: (price: number) => string;
}

export const useDiscountPricing = (originalPrice: number): DiscountPricingHook => {
  const discountPercentage = 50; // 50% discount
  
  const discountedPrice = useMemo(() => {
    return originalPrice * (1 - discountPercentage / 100);
  }, [originalPrice, discountPercentage]);

  const formatPrice = (price: number): string => {
    return `${price.toFixed(4)} TON`;
  };

  return {
    originalPrice,
    discountedPrice,
    discountPercentage,
    formatPrice,
  };
};
