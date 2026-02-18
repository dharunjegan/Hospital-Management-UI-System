// =====================================================
// TYPE DEFINITIONS FOR CRYPTO TRADING DASHBOARD
// =====================================================

export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  icon: string;
  color: string;
  priceHistory: PricePoint[];
  high24h: number;
  low24h: number;
}

export interface PricePoint {
  time: number;
  price: number;
  volume?: number;
}

export interface PortfolioAsset {
  cryptoId: string;
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
  color: string;
}

export interface Transaction {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  fee: number;
}

export interface DashboardState {
  cryptos: Crypto[];
  portfolio: PortfolioAsset[];
  transactions: Transaction[];
  selectedCrypto: Crypto | null;
  balance: number;
  totalPortfolioValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  isModalOpen: boolean;
  modalType: 'buy' | 'sell' | null;
  isLoading: boolean;
  lastUpdated: number;
  error: string | null;
}

export type DashboardAction =
  | { type: 'SET_CRYPTOS'; payload: Crypto[] }
  | { type: 'UPDATE_CRYPTO_PRICE'; payload: { id: string; price: number; change24h: number; changePercent24h: number; priceHistory: PricePoint[] } }
  | { type: 'SET_SELECTED_CRYPTO'; payload: Crypto | null }
  | { type: 'OPEN_MODAL'; payload: 'buy' | 'sell' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'EXECUTE_BUY'; payload: { cryptoId: string; quantity: number; price: number } }
  | { type: 'EXECUTE_SELL'; payload: { cryptoId: string; quantity: number; price: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_PORTFOLIO' }
  | { type: 'SIMULATE_PRICE_UPDATE' };

export interface ChartDataPoint {
  time: string;
  price: number;
  fullTime: number;
}

export interface WatchlistItem {
  cryptoId: string;
  addedAt: number;
}

export interface OrderForm {
  cryptoId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
}
