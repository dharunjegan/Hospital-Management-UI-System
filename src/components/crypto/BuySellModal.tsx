'use client';
// =====================================================
// BUY/SELL MODAL COMPONENT
// Features: Form validation, real-time calculations, animations
// =====================================================

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { Crypto } from './types';
import { formatCurrency } from './constants';

interface BuySellModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
  crypto: Crypto | null;
  balance: number;
  currentHolding?: {
    quantity: number;
    averageBuyPrice: number;
  };
  onConfirm: (cryptoId: string, quantity: number, price: number) => void;
  error: string | null;
}

const BuySellModal: React.FC<BuySellModalProps> = ({
  isOpen,
  onClose,
  type,
  crypto,
  balance,
  currentHolding,
  onConfirm,
  error,
}) => {
  const [quantity, setQuantity] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Use ref to track previous isOpen state
  const prevIsOpenRef = useRef(isOpen);

  // Reset state when modal opens (transitioning from closed to open)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // Use timeout to defer state updates
      const timer = setTimeout(() => {
        setQuantity('');
        setLocalError(null);
        setIsProcessing(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  // Calculate totals
  const numericQuantity = parseFloat(quantity) || 0;
  const price = crypto?.price || 0;
  const total = useMemo(() => numericQuantity * price, [numericQuantity, price]);
  const fee = total * 0.001; // 0.1% fee
  const grandTotal = type === 'buy' ? total + fee : total - fee;

  // Validation
  const validateTransaction = (): boolean => {
    if (!crypto) return false;
    if (numericQuantity <= 0) {
      setLocalError('Please enter a valid quantity');
      return false;
    }
    if (type === 'buy' && grandTotal > balance) {
      setLocalError('Insufficient balance');
      return false;
    }
    if (type === 'sell' && currentHolding && numericQuantity > currentHolding.quantity) {
      setLocalError(`You only have ${currentHolding.quantity.toFixed(8)} ${crypto.symbol} available`);
      return false;
    }
    setLocalError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateTransaction() || !crypto) return;

    setIsProcessing(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    onConfirm(crypto.id, numericQuantity, price);
    setIsProcessing(false);
  };

  // Quick amount buttons
  const quickAmounts = type === 'buy'
    ? [100, 500, 1000, 5000]
    : [25, 50, 75, 100];

  const handleQuickAmount = (percentageOrAmount: number) => {
    if (!crypto) return;

    if (type === 'buy') {
      const maxQuantity = balance / crypto.price;
      const quantity = Math.min(percentageOrAmount / crypto.price, maxQuantity);
      setQuantity(quantity.toFixed(8));
    } else if (currentHolding) {
      const quantity = (percentageOrAmount / 100) * currentHolding.quantity;
      setQuantity(quantity.toFixed(8));
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (!crypto) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div
              className={`relative px-6 py-4 border-b border-slate-700 ${
                type === 'buy'
                  ? 'bg-gradient-to-r from-green-500/10 to-transparent'
                  : 'bg-gradient-to-r from-red-500/10 to-transparent'
              }`}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: `${crypto.color}20`, color: crypto.color }}
                >
                  {crypto.symbol.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {type === 'buy' ? 'Buy' : 'Sell'} {crypto.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">{crypto.symbol}</span>
                    <span className="text-sm text-white font-medium">
                      {formatCurrency(crypto.price)}
                    </span>
                    <span
                      className={`flex items-center text-xs ${
                        crypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {crypto.changePercent24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                      )}
                      {crypto.changePercent24h >= 0 ? '+' : ''}
                      {crypto.changePercent24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-5">
              {/* Balance Info */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Available Balance</span>
                <span className="text-white font-medium">{formatCurrency(balance)}</span>
              </div>
              {type === 'sell' && currentHolding && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Current Holdings</span>
                  <span className="text-white font-medium">
                    {currentHolding.quantity.toFixed(6)} {crypto.symbol}
                  </span>
                </div>
              )}

              {/* Quantity Input */}
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Quantity</label>
                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="any"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-slate-400 text-sm">{crypto.symbol}</span>
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAmount(amount)}
                    className="flex-1 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors"
                  >
                    {type === 'buy' ? `$${amount}` : `${amount}%`}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Price</span>
                  <span className="text-white">{formatCurrency(price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Quantity</span>
                  <span className="text-white">
                    {numericQuantity.toFixed(6)} {crypto.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fee (0.1%)</span>
                  <span className="text-white">{formatCurrency(fee)}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t border-slate-700">
                  <span className="text-slate-300">Total</span>
                  <span className="text-white">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Error Message */}
              {(localError || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-400">{localError || error}</span>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isProcessing || numericQuantity <= 0}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    type === 'buy'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `${type === 'buy' ? 'Buy' : 'Sell'} ${crypto.symbol}`
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuySellModal;
