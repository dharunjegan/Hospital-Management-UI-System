'use client';
// =====================================================
// STATS CARD COMPONENT
// Dashboard statistics with animated counters
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBgColor,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 p-6"
    >
      {/* Background decoration */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10`}
        style={{ backgroundColor: iconBgColor }}
      />

      <div className="relative">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-lg`}
            style={{ backgroundColor: iconBgColor }}
          >
            <Icon className={`w-6 h-6`} style={{ color: iconColor }} />
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                change.isPositive
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              <span>{change.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-1">
          <motion.h3
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.1 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.h3>
          <p className="text-sm text-slate-400">{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
