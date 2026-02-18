// =====================================================
// CONSTANTS AND MOCK DATA FOR CRYPTO TRADING DASHBOARD
// =====================================================

import { Crypto, DashboardState, PortfolioAsset, Transaction } from './types';

// Crypto color schemes for consistent branding
export const CRYPTO_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  BNB: '#F3BA2F',
  SOL: '#00FFA3',
  XRP: '#23292F',
  ADA: '#0033AD',
  AVAX: '#E84142',
  DOT: '#E6007A',
  DOGE: '#C2A633',
  MATIC: '#8247E5',
};

// Crypto icons (using emoji for simplicity, can be replaced with SVG)
export const CRYPTO_ICONS: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  BNB: '◉',
  SOL: '◎',
  XRP: '✕',
  ADA: '₳',
  AVAX: '▲',
  DOT: '●',
  DOGE: 'Ð',
  MATIC: '⬡',
};

// Generate random price history for demo
const generatePriceHistory = (basePrice: number, points: number = 50): { time: number; price: number }[] => {
  const history: { time: number; price: number }[] = [];
  let currentPrice = basePrice * 0.95;
  const now = Date.now();
  
  for (let i = points; i >= 0; i--) {
    const volatility = basePrice * 0.02;
    const change = (Math.random() - 0.48) * volatility;
    currentPrice = Math.max(currentPrice * 0.9, Math.min(currentPrice * 1.1, currentPrice + change));
    history.push({
      time: now - i * 60000, // 1 minute intervals
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }
  return history;
};

// Initial crypto data
export const INITIAL_CRYPTOS: Crypto[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67542.32,
    change24h: 1234.56,
    changePercent24h: 1.86,
    volume24h: 28500000000,
    marketCap: 1328000000000,
    icon: CRYPTO_ICONS.BTC,
    color: CRYPTO_COLORS.BTC,
    priceHistory: generatePriceHistory(67542.32),
    high24h: 68150.00,
    low24h: 66200.00,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3456.78,
    change24h: -45.23,
    changePercent24h: -1.29,
    volume24h: 15200000000,
    marketCap: 415000000000,
    icon: CRYPTO_ICONS.ETH,
    color: CRYPTO_COLORS.ETH,
    priceHistory: generatePriceHistory(3456.78),
    high24h: 3520.00,
    low24h: 3380.00,
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    price: 587.45,
    change24h: 12.34,
    changePercent24h: 2.14,
    volume24h: 1850000000,
    marketCap: 87600000000,
    icon: CRYPTO_ICONS.BNB,
    color: CRYPTO_COLORS.BNB,
    priceHistory: generatePriceHistory(587.45),
    high24h: 595.00,
    low24h: 570.00,
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 172.89,
    change24h: 8.76,
    changePercent24h: 5.33,
    volume24h: 3200000000,
    marketCap: 76500000000,
    icon: CRYPTO_ICONS.SOL,
    color: CRYPTO_COLORS.SOL,
    priceHistory: generatePriceHistory(172.89),
    high24h: 178.50,
    low24h: 162.00,
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    price: 0.5234,
    change24h: -0.0123,
    changePercent24h: -2.30,
    volume24h: 1450000000,
    marketCap: 28500000000,
    icon: CRYPTO_ICONS.XRP,
    color: CRYPTO_COLORS.XRP,
    priceHistory: generatePriceHistory(0.5234),
    high24h: 0.5480,
    low24h: 0.5120,
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.4567,
    change24h: 0.0234,
    changePercent24h: 5.40,
    volume24h: 520000000,
    marketCap: 16200000000,
    icon: CRYPTO_ICONS.ADA,
    color: CRYPTO_COLORS.ADA,
    priceHistory: generatePriceHistory(0.4567),
    high24h: 0.4720,
    low24h: 0.4310,
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 35.67,
    change24h: 1.23,
    changePercent24h: 3.57,
    volume24h: 480000000,
    marketCap: 14200000000,
    icon: CRYPTO_ICONS.AVAX,
    color: CRYPTO_COLORS.AVAX,
    priceHistory: generatePriceHistory(35.67),
    high24h: 37.20,
    low24h: 33.80,
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.23,
    change24h: -0.18,
    changePercent24h: -2.43,
    volume24h: 320000000,
    marketCap: 10500000000,
    icon: CRYPTO_ICONS.DOT,
    color: CRYPTO_COLORS.DOT,
    priceHistory: generatePriceHistory(7.23),
    high24h: 7.58,
    low24h: 7.02,
  },
];

// Initial portfolio (user holdings)
export const INITIAL_PORTFOLIO: PortfolioAsset[] = [
  {
    cryptoId: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    quantity: 0.5234,
    averageBuyPrice: 62500.00,
    currentPrice: 67542.32,
    totalValue: 35364.89,
    profitLoss: 2640.72,
    profitLossPercent: 8.06,
    color: CRYPTO_COLORS.BTC,
  },
  {
    cryptoId: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    quantity: 2.1567,
    averageBuyPrice: 3200.00,
    currentPrice: 3456.78,
    totalValue: 7455.35,
    profitLoss: 553.22,
    profitLossPercent: 8.01,
    color: CRYPTO_COLORS.ETH,
  },
  {
    cryptoId: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    quantity: 15.5,
    averageBuyPrice: 150.00,
    currentPrice: 172.89,
    totalValue: 2679.80,
    profitLoss: 354.79,
    profitLossPercent: 15.26,
    color: CRYPTO_COLORS.SOL,
  },
];

// Initial transaction history
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    cryptoId: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'buy',
    quantity: 0.25,
    price: 65000.00,
    total: 16250.00,
    timestamp: Date.now() - 86400000 * 2,
    status: 'completed',
    fee: 16.25,
  },
  {
    id: 'tx-002',
    cryptoId: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'buy',
    quantity: 1.0,
    price: 3300.00,
    total: 3300.00,
    timestamp: Date.now() - 86400000 * 5,
    status: 'completed',
    fee: 3.30,
  },
  {
    id: 'tx-003',
    cryptoId: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    type: 'buy',
    quantity: 10.0,
    price: 155.00,
    total: 1550.00,
    timestamp: Date.now() - 86400000 * 7,
    status: 'completed',
    fee: 1.55,
  },
  {
    id: 'tx-004',
    cryptoId: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'sell',
    quantity: 0.1,
    price: 67000.00,
    total: 6700.00,
    timestamp: Date.now() - 86400000,
    status: 'completed',
    fee: 6.70,
  },
  {
    id: 'tx-005',
    cryptoId: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    type: 'buy',
    quantity: 5.5,
    price: 145.00,
    total: 797.50,
    timestamp: Date.now() - 3600000 * 12,
    status: 'completed',
    fee: 0.80,
  },
];

// Initial dashboard state
export const INITIAL_STATE: DashboardState = {
  cryptos: INITIAL_CRYPTOS,
  portfolio: INITIAL_PORTFOLIO,
  transactions: INITIAL_TRANSACTIONS,
  selectedCrypto: null,
  balance: 50000.00,
  totalPortfolioValue: 45500.04,
  totalProfitLoss: 3548.73,
  totalProfitLossPercent: 8.47,
  isModalOpen: false,
  modalType: null,
  isLoading: false,
  lastUpdated: Date.now(),
  error: null,
};

// Time format helpers
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format currency
export const formatCurrency = (value: number, decimals: number = 2): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};

// Format crypto quantity
export const formatQuantity = (value: number, symbol: string): string => {
  if (value < 0.01) return `${value.toFixed(6)} ${symbol}`;
  if (value < 1) return `${value.toFixed(4)} ${symbol}`;
  return `${value.toFixed(2)} ${symbol}`;
};
