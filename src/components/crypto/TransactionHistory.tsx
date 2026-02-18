'use client';
// =====================================================
// TRANSACTION HISTORY COMPONENT
// Features: Filterable list, animated entries, status badges
// =====================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Filter, ChevronDown } from 'lucide-react';
import { Transaction } from './types';
import { formatCurrency, formatDate, formatTime } from './constants';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

type FilterType = 'all' | 'buy' | 'sell';

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((tx) => tx.type === filter);
  }, [transactions, filter]);

  // Status badge component
  const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const config = {
      completed: {
        icon: CheckCircle,
        text: 'Completed',
        className: 'bg-green-500/10 text-green-400 border-green-500/20',
      },
      pending: {
        icon: Clock,
        text: 'Pending',
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      },
      failed: {
        icon: XCircle,
        text: 'Failed',
        className: 'bg-red-500/10 text-red-400 border-red-500/20',
      },
    };

    const { icon: Icon, text, className } = config[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${className}`}>
        <Icon className="w-3 h-3" />
        {text}
      </span>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Transaction History</h3>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors"
          >
            <Filter className="w-3 h-3" />
            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden z-10"
              >
                {(['all', 'buy', 'sell'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setShowFilters(false);
                    }}
                    className={`w-full px-3 py-2 text-xs font-medium text-left transition-colors ${
                      filter === f
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {f === 'all' ? 'All Transactions' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Transaction List */}
      <div className="max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-slate-500"
            >
              <Clock className="w-8 h-8 mb-2" />
              <p className="text-sm">No transactions found</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-slate-700/30"
            >
              {filteredTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
                >
                  {/* Left side - Type and Crypto */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      {tx.type === 'buy' ? (
                        <ArrowDownRight className="w-5 h-5 text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            tx.type === 'buy' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {tx.type === 'buy' ? 'Bought' : 'Sold'}
                        </span>
                        <span className="text-sm font-medium text-white">{tx.symbol}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{formatDate(tx.timestamp)}</span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">{formatTime(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Amount and Status */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {tx.type === 'buy' ? '+' : '-'}
                      {tx.quantity.toFixed(6)} {tx.symbol}
                    </p>
                    <p className="text-xs text-slate-500">{formatCurrency(tx.total)}</p>
                    <div className="mt-1">
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {filteredTransactions.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTransactions.length} transactions</span>
          <span>Fee: {formatCurrency(filteredTransactions.reduce((sum, tx) => sum + tx.fee, 0))}</span>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionHistory;
