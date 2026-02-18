'use client';
// =====================================================
// PRICE TICKER COMPONENT
// Features: Scrolling ticker with live prices, animations
// =====================================================

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Crypto } from './types';
import { formatCurrency } from './constants';

interface PriceTickerProps {
  cryptos: Crypto[];
}

const PriceTicker: React.FC<PriceTickerProps> = ({ cryptos }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate items for infinite scroll effect
  const tickerItems = [...cryptos, ...cryptos];

  return (
    <div className="w-full overflow-hidden bg-slate-900/80 border-y border-slate-700/50 py-2">
      <motion.div
        ref={containerRef}
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: [0, -50 * cryptos.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {tickerItems.map((crypto, index) => {
          const isPositive = crypto.changePercent24h >= 0;
          return (
            <motion.div
              key={`${crypto.id}-${index}`}
              className="flex items-center gap-3 px-4"
              whileHover={{ scale: 1.05 }}
            >
              {/* Crypto Icon */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${crypto.color}20`, color: crypto.color }}
              >
                {crypto.symbol.charAt(0)}
              </div>

              {/* Symbol and Name */}
              <span className="font-medium text-white text-sm">{crypto.symbol}</span>

              {/* Price */}
              <span className="text-slate-300 text-sm">
                {formatCurrency(crypto.price)}
              </span>

              {/* Change */}
              <span
                className={`flex items-center text-xs font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {isPositive ? '+' : ''}
                {crypto.changePercent24h.toFixed(2)}%
              </span>

              {/* Separator */}
              <span className="text-slate-600">|</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default PriceTicker;
