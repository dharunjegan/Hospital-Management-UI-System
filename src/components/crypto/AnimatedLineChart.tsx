'use client';
// =====================================================
// ANIMATED LINE CHART COMPONENT
// Features: Live price updates, smooth animations, gradient fill
// =====================================================

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { PricePoint } from './types';
import { formatTime } from './constants';

interface AnimatedLineChartProps {
  data: PricePoint[];
  color: string;
  isPositive: boolean;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, color }: { active?: boolean; payload?: Array<{ value: number }>; color: string }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 shadow-xl"
      >
        <p className="text-white font-semibold" style={{ color }}>
          ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </motion.div>
    );
  }
  return null;
};

// Sparkline variant for compact display
export const SparklineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  color,
  isPositive,
  height = 40,
}) => {
  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      ...point,
      index,
      formattedTime: formatTime(point.time),
    }));
  }, [data]);

  const prices = useMemo(() => data.map(d => d.price), [data]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#gradient-${color.replace('#', '')})`}
            isAnimationActive={true}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Main animated chart component
const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  color,
  isPositive,
  height = 300,
  showGrid = true,
  showTooltip = true,
  animate = true,
}) => {
  // Transform data for chart
  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      ...point,
      index,
      formattedTime: formatTime(point.time),
    }));
  }, [data]);

  // Calculate price range
  const prices = useMemo(() => data.map(d => d.price), [data]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  // Animation variants
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Get gradient color based on trend
  const gradientColor = isPositive ? color : color;
  const strokeColor = isPositive ? color : color;

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full"
      style={{ height }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={data.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                {/* Main gradient fill */}
                <linearGradient
                  id={`mainGradient-${color.replace('#', '')}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={gradientColor}
                    stopOpacity={isPositive ? 0.5 : 0.3}
                  />
                  <stop
                    offset="50%"
                    stopColor={gradientColor}
                    stopOpacity={isPositive ? 0.2 : 0.1}
                  />
                  <stop
                    offset="100%"
                    stopColor={gradientColor}
                    stopOpacity={0}
                  />
                </linearGradient>
                {/* Glow effect */}
                <filter id={`glow-${color.replace('#', '')}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148, 163, 184, 0.1)"
                  vertical={false}
                />
              )}

              <XAxis
                dataKey="formattedTime"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={50}
              />

              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                width={70}
                tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              />

              {showTooltip && (
                <Tooltip
                  content={<CustomTooltip color={color} />}
                  cursor={{
                    stroke: 'rgba(148, 163, 184, 0.3)',
                    strokeWidth: 1,
                  }}
                />
              )}

              {/* Reference line for current price */}
              <ReferenceLine
                y={data[data.length - 1]?.price}
                stroke={color}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />

              {/* Area fill */}
              <Area
                type="monotone"
                dataKey="price"
                stroke="none"
                fill={`url(#mainGradient-${color.replace('#', '')})`}
                isAnimationActive={animate}
                animationDuration={500}
              />

              {/* Main line */}
              <Line
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: strokeColor,
                  stroke: '#0f172a',
                  strokeWidth: 2,
                }}
                isAnimationActive={animate}
                animationDuration={500}
                filter={`url(#glow-${color.replace('#', '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Price indicator badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium"
        style={{
          backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: isPositive ? '#22c55e' : '#ef4444',
        }}
      >
        {isPositive ? '↑' : '↓'} {Math.abs(data[data.length - 1]?.price - data[0]?.price).toFixed(2)}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLineChart;
