'use client';
// =====================================================
// CRYPTO CARD COMPONENT
// Features: Live price display, mini chart, buy/sell actions
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Crypto } from './types';
import { formatCurrency, SparklineChart } from './index';

interface CryptoCardProps {
  crypto: Crypto;
  isSelected: boolean;
  onSelect: () => void;
  onBuy: () => void;
  onSell: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  crypto,
  isSelected,
  onSelect,
  onBuy,
  onSell,
}) => {
  const isPositive = crypto.changePercent24h >= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-slate-800/80 border-blue-500/50 ring-2 ring-blue-500/20'
          : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
      }`}
    >
      {/* Glow effect for selected */}
      {isSelected && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at center, ${crypto.color}, transparent 70%)`,
          }}
        />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: `${crypto.color}20`, color: crypto.color }}
            >
              {crypto.symbol.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{crypto.symbol}</h3>
              <p className="text-xs text-slate-500">{crypto.name}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
          >
            <Star className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Chart */}
        <div className="h-16 -mx-2 mb-3">
          <SparklineChart
            data={crypto.priceHistory}
            color={crypto.color}
            isPositive={isPositive}
            height={64}
          />
        </div>

        {/* Price and Change */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xl font-bold text-white">{formatCurrency(crypto.price)}</p>
            <div className="flex items-center gap-1 mt-1">
              <span
                className={`flex items-center text-sm font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {isPositive ? '+' : ''}
                {crypto.changePercent24h.toFixed(2)}%
              </span>
              <span className="text-xs text-slate-500">24h</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">
              H: {formatCurrency(crypto.high24h)}
            </p>
            <p className="text-xs text-slate-500">
              L: {formatCurrency(crypto.low24h)}
            </p>
          </div>
        </div>

        {/* Volume and Market Cap */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div>
            <p className="text-slate-600">Vol 24h</p>
            <p className="text-slate-300">{formatCurrency(crypto.volume24h)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-600">Market Cap</p>
            <p className="text-slate-300">{formatCurrency(crypto.marketCap)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onBuy();
            }}
            className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all"
          >
            Buy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onSell();
            }}
            className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all"
          >
            Sell
          </motion.button>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          layoutId="selectionIndicator"
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.div>
  );
};

export default CryptoCard;
