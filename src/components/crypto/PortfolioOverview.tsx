'use client';
// =====================================================
// PORTFOLIO OVERVIEW COMPONENT
// Features: Total value, profit/loss, asset distribution
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PortfolioAsset } from './types';
import { formatCurrency, formatQuantity } from './constants';

interface PortfolioOverviewProps {
  portfolio: PortfolioAsset[];
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  balance: number;
}

// Animated counter component
const AnimatedCounter: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number }> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={value}
    >
      {prefix}{value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </motion.span>
  );
};

// Progress bar for asset distribution
const AssetProgressBar: React.FC<{ assets: PortfolioAsset[] }> = ({ assets }) => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0);

  return (
    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
      {assets.map((asset, index) => {
        const percentage = (asset.totalValue / totalValue) * 100;
        return (
          <motion.div
            key={asset.cryptoId}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="h-full"
            style={{ backgroundColor: asset.color }}
          />
        );
      })}
    </div>
  );
};

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  portfolio,
  totalValue,
  totalProfitLoss,
  totalProfitLossPercent,
  balance,
}) => {
  const isPositive = totalProfitLoss >= 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 border border-slate-700/50"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs text-slate-500 font-medium">PORTFOLIO VALUE</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              <AnimatedCounter value={totalValue} prefix="$" />
            </h3>
            <div className="flex items-center gap-2">
              <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {isPositive ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
              </span>
              <span className="text-xs text-slate-500">24h</span>
            </div>
          </div>
        </motion.div>

        {/* Total Profit/Loss */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 border border-slate-700/50"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-full -mr-10 -mt-10`} />
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <span className="text-xs text-slate-500 font-medium">TOTAL P/L</span>
          </div>
          <div className="space-y-1">
            <h3 className={`text-2xl md:text-3xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}<AnimatedCounter value={totalProfitLoss} prefix="$" />
            </h3>
            <p className="text-xs text-slate-500">All time returns</p>
          </div>
        </motion.div>

        {/* Available Balance */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 border border-slate-700/50"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <PieChart className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs text-slate-500 font-medium">AVAILABLE</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              <AnimatedCounter value={balance} prefix="$" />
            </h3>
            <p className="text-xs text-slate-500">Trading balance</p>
          </div>
        </motion.div>

        {/* Assets Count */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 border border-slate-700/50"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <PieChart className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs text-slate-500 font-medium">ASSETS</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {portfolio.length}
            </h3>
            <p className="text-xs text-slate-500">Different cryptos</p>
          </div>
        </motion.div>
      </div>

      {/* Asset Distribution Bar */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50"
      >
        <h4 className="text-sm font-medium text-slate-400 mb-3">Portfolio Distribution</h4>
        <AssetProgressBar assets={portfolio} />
        <div className="flex flex-wrap gap-3 mt-3">
          {portfolio.map((asset) => {
            const percentage = (asset.totalValue / totalValue) * 100;
            return (
              <div key={asset.cryptoId} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="text-xs text-slate-400">{asset.symbol}</span>
                <span className="text-xs text-slate-500">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Holdings List */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-slate-700/50">
          <h4 className="text-sm font-medium text-slate-300">Your Holdings</h4>
        </div>
        <div className="divide-y divide-slate-700/30">
          {portfolio.map((asset, index) => {
            const isAssetPositive = asset.profitLoss >= 0;
            return (
              <motion.div
                key={asset.cryptoId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: `${asset.color}20`, color: asset.color }}
                  >
                    {asset.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{asset.name}</p>
                    <p className="text-xs text-slate-500">{formatQuantity(asset.quantity, asset.symbol)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-white">{formatCurrency(asset.totalValue)}</p>
                  <p className={`text-xs ${isAssetPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isAssetPositive ? '+' : ''}{formatCurrency(asset.profitLoss)} ({isAssetPositive ? '+' : ''}{asset.profitLossPercent.toFixed(2)}%)
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PortfolioOverview;
