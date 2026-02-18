'use client';
// =====================================================
// MAIN DASHBOARD COMPONENT
// Features: Responsive layout, live updates, state management
// =====================================================

import React, { useReducer, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Moon, Sun, Bell, Settings, Search, Menu, X } from 'lucide-react';
import { cryptoReducer, INITIAL_STATE } from './cryptoReducer';
import { Crypto } from './types';
import { formatCurrency } from './constants';

// Components
import PriceTicker from './PriceTicker';
import CryptoCard from './CryptoCard';
import PortfolioOverview from './PortfolioOverview';
import AnimatedLineChart from './AnimatedLineChart';
import TransactionHistory from './TransactionHistory';
import BuySellModal from './BuySellModal';

const Dashboard: React.FC = () => {
  // State management with useReducer
  const [state, dispatch] = useReducer(cryptoReducer, INITIAL_STATE);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'SIMULATE_PRICE_UPDATE' });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle crypto selection
  const handleSelectCrypto = useCallback((crypto: Crypto | null) => {
    dispatch({ type: 'SET_SELECTED_CRYPTO', payload: crypto });
  }, []);

  // Handle opening buy/sell modal
  const handleOpenModal = useCallback((type: 'buy' | 'sell', crypto: Crypto) => {
    dispatch({ type: 'SET_SELECTED_CRYPTO', payload: crypto });
    dispatch({ type: 'OPEN_MODAL', payload: type });
  }, []);

  // Handle closing modal
  const handleCloseModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  // Handle transaction confirmation
  const handleConfirmTransaction = useCallback(
    (cryptoId: string, quantity: number, price: number) => {
      if (state.modalType === 'buy') {
        dispatch({ type: 'EXECUTE_BUY', payload: { cryptoId, quantity, price } });
      } else if (state.modalType === 'sell') {
        dispatch({ type: 'EXECUTE_SELL', payload: { cryptoId, quantity, price } });
      }
    },
    [state.modalType]
  );

  // Filter cryptos based on search
  const filteredCryptos = React.useMemo(() => {
    if (!searchQuery) return state.cryptos;
    return state.cryptos.filter(
      (crypto) =>
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [state.cryptos, searchQuery]);

  // Get current holding for selected crypto
  const currentHolding = React.useMemo(() => {
    if (!state.selectedCrypto) return undefined;
    return state.portfolio.find((asset) => asset.cryptoId === state.selectedCrypto?.id);
  }, [state.selectedCrypto, state.portfolio]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
              >
                <span className="text-xl font-bold">₿</span>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CryptoVault
                </h1>
                <p className="text-xs text-slate-500">Trading Dashboard</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'SIMULATE_PRICE_UPDATE' })}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
              >
                <Settings className="w-5 h-5" />
              </motion.button>

              {/* Balance */}
              <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-500">Balance:</span>
                <span className="text-sm font-semibold text-white">
                  {formatCurrency(state.balance)}
                </span>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-700/50 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-slate-500">Balance:</span>
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(state.balance)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Price Ticker */}
      <PriceTicker cryptos={state.cryptos} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Portfolio Overview */}
          <motion.section variants={itemVariants}>
            <PortfolioOverview
              portfolio={state.portfolio}
              totalValue={state.totalPortfolioValue}
              totalProfitLoss={state.totalProfitLoss}
              totalProfitLossPercent={state.totalProfitLossPercent}
              balance={state.balance}
            />
          </motion.section>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart and Crypto List */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              {/* Main Chart */}
              {state.selectedCrypto && (
                <motion.div
                  layoutId="mainChart"
                  className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: `${state.selectedCrypto.color}20`,
                          color: state.selectedCrypto.color,
                        }}
                      >
                        {state.selectedCrypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {state.selectedCrypto.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {state.selectedCrypto.symbol}/USD
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        {formatCurrency(state.selectedCrypto.price)}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          state.selectedCrypto.changePercent24h >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {state.selectedCrypto.changePercent24h >= 0 ? '+' : ''}
                        {state.selectedCrypto.changePercent24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <AnimatedLineChart
                    data={state.selectedCrypto.priceHistory}
                    color={state.selectedCrypto.color}
                    isPositive={state.selectedCrypto.changePercent24h >= 0}
                    height={250}
                  />
                </motion.div>
              )}

              {/* Crypto Cards Grid */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Market Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredCryptos.map((crypto) => (
                      <CryptoCard
                        key={crypto.id}
                        crypto={crypto}
                        isSelected={state.selectedCrypto?.id === crypto.id}
                        onSelect={() => handleSelectCrypto(crypto)}
                        onBuy={() => handleOpenModal('buy', crypto)}
                        onSell={() => handleOpenModal('sell', crypto)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Transaction History */}
            <motion.div variants={itemVariants}>
              <TransactionHistory transactions={state.transactions} />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Buy/Sell Modal */}
      <BuySellModal
        isOpen={state.isModalOpen}
        onClose={handleCloseModal}
        type={state.modalType!}
        crypto={state.selectedCrypto}
        balance={state.balance}
        currentHolding={
          currentHolding
            ? {
                quantity: currentHolding.quantity,
                averageBuyPrice: currentHolding.averageBuyPrice,
              }
            : undefined
        }
        onConfirm={handleConfirmTransaction}
        error={state.error}
      />

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2024 CryptoVault. All rights reserved. Prices are simulated for demo purposes.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
