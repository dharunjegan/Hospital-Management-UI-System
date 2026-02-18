// =====================================================
// CRYPTO REDUCER - ADVANCED STATE MANAGEMENT
// Using useReducer for complex state operations
// =====================================================

import { DashboardState, DashboardAction, Transaction, PortfolioAsset } from './types';
import { INITIAL_STATE, CRYPTO_COLORS } from './constants';

// Generate unique transaction ID
const generateTransactionId = (): string => {
  return `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Simulate price fluctuation
const simulatePriceChange = (currentPrice: number, volatility: number = 0.005): number => {
  const change = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = currentPrice * (1 + change);
  return parseFloat(newPrice.toFixed(currentPrice < 1 ? 4 : 2));
};

// Calculate portfolio totals
const calculatePortfolioTotals = (portfolio: PortfolioAsset[]): { totalValue: number; totalProfitLoss: number; totalProfitLossPercent: number } => {
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.totalValue, 0);
  const totalCost = portfolio.reduce((sum, asset) => sum + (asset.averageBuyPrice * asset.quantity), 0);
  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;
  
  return {
    totalValue: parseFloat(totalValue.toFixed(2)),
    totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
    totalProfitLossPercent: parseFloat(totalProfitLossPercent.toFixed(2)),
  };
};

// Main reducer function
export const cryptoReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_CRYPTOS':
      return {
        ...state,
        cryptos: action.payload,
        lastUpdated: Date.now(),
      };

    case 'UPDATE_CRYPTO_PRICE': {
      const { id, price, change24h, changePercent24h, priceHistory } = action.payload;
      const updatedCryptos = state.cryptos.map((crypto) => {
        if (crypto.id === id) {
          return {
            ...crypto,
            price,
            change24h,
            changePercent24h,
            priceHistory,
            high24h: Math.max(crypto.high24h, price),
            low24h: Math.min(crypto.low24h, price),
          };
        }
        return crypto;
      });

      // Update portfolio with new prices
      const updatedPortfolio = state.portfolio.map((asset) => {
        const crypto = updatedCryptos.find((c) => c.id === asset.cryptoId);
        if (crypto) {
          const totalValue = asset.quantity * crypto.price;
          const costBasis = asset.quantity * asset.averageBuyPrice;
          const profitLoss = totalValue - costBasis;
          const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
          
          return {
            ...asset,
            currentPrice: crypto.price,
            totalValue: parseFloat(totalValue.toFixed(2)),
            profitLoss: parseFloat(profitLoss.toFixed(2)),
            profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
          };
        }
        return asset;
      });

      const totals = calculatePortfolioTotals(updatedPortfolio);

      return {
        ...state,
        cryptos: updatedCryptos,
        portfolio: updatedPortfolio,
        selectedCrypto: state.selectedCrypto?.id === id 
          ? updatedCryptos.find((c) => c.id === id) || state.selectedCrypto 
          : state.selectedCrypto,
        ...totals,
        lastUpdated: Date.now(),
      };
    }

    case 'SIMULATE_PRICE_UPDATE': {
      const updatedCryptos = state.cryptos.map((crypto) => {
        const newPrice = simulatePriceChange(crypto.price, crypto.price > 1000 ? 0.002 : 0.005);
        const newChange = newPrice - (crypto.price - crypto.change24h);
        const basePrice = crypto.price - crypto.change24h;
        const newChangePercent = basePrice > 0 ? (newChange / basePrice) * 100 : 0;
        
        // Add new price point to history
        const newPriceHistory = [
          ...crypto.priceHistory.slice(1),
          { time: Date.now(), price: newPrice },
        ];

        return {
          ...crypto,
          price: newPrice,
          change24h: parseFloat(newChange.toFixed(2)),
          changePercent24h: parseFloat(newChangePercent.toFixed(2)),
          priceHistory: newPriceHistory,
          high24h: Math.max(crypto.high24h, newPrice),
          low24h: Math.min(crypto.low24h, newPrice),
        };
      });

      // Update portfolio with new prices
      const updatedPortfolio = state.portfolio.map((asset) => {
        const crypto = updatedCryptos.find((c) => c.id === asset.cryptoId);
        if (crypto) {
          const totalValue = asset.quantity * crypto.price;
          const costBasis = asset.quantity * asset.averageBuyPrice;
          const profitLoss = totalValue - costBasis;
          const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
          
          return {
            ...asset,
            currentPrice: crypto.price,
            totalValue: parseFloat(totalValue.toFixed(2)),
            profitLoss: parseFloat(profitLoss.toFixed(2)),
            profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
          };
        }
        return asset;
      });

      const totals = calculatePortfolioTotals(updatedPortfolio);

      return {
        ...state,
        cryptos: updatedCryptos,
        portfolio: updatedPortfolio,
        selectedCrypto: state.selectedCrypto 
          ? updatedCryptos.find((c) => c.id === state.selectedCrypto?.id) || null
          : null,
        ...totals,
        lastUpdated: Date.now(),
      };
    }

    case 'SET_SELECTED_CRYPTO':
      return {
        ...state,
        selectedCrypto: action.payload,
      };

    case 'OPEN_MODAL':
      return {
        ...state,
        isModalOpen: true,
        modalType: action.payload,
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
        modalType: null,
      };

    case 'EXECUTE_BUY': {
      const { cryptoId, quantity, price } = action.payload;
      const crypto = state.cryptos.find((c) => c.id === cryptoId);
      
      if (!crypto || state.balance < quantity * price) {
        return {
          ...state,
          error: state.balance < quantity * price ? 'Insufficient balance' : 'Crypto not found',
        };
      }

      const total = quantity * price;
      const fee = total * 0.001; // 0.1% fee

      // Create new transaction
      const newTransaction: Transaction = {
        id: generateTransactionId(),
        cryptoId,
        symbol: crypto.symbol,
        name: crypto.name,
        type: 'buy',
        quantity,
        price,
        total,
        timestamp: Date.now(),
        status: 'completed',
        fee,
      };

      // Update or add portfolio asset
      const existingAssetIndex = state.portfolio.findIndex((a) => a.cryptoId === cryptoId);
      let updatedPortfolio: PortfolioAsset[];

      if (existingAssetIndex >= 0) {
        // Update existing asset
        const existing = state.portfolio[existingAssetIndex];
        const newQuantity = existing.quantity + quantity;
        const newAveragePrice = ((existing.averageBuyPrice * existing.quantity) + (price * quantity)) / newQuantity;
        
        updatedPortfolio = state.portfolio.map((asset, index) => {
          if (index === existingAssetIndex) {
            const totalValue = newQuantity * crypto.price;
            const costBasis = newQuantity * newAveragePrice;
            const profitLoss = totalValue - costBasis;
            const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
            
            return {
              ...asset,
              quantity: parseFloat(newQuantity.toFixed(8)),
              averageBuyPrice: parseFloat(newAveragePrice.toFixed(2)),
              currentPrice: crypto.price,
              totalValue: parseFloat(totalValue.toFixed(2)),
              profitLoss: parseFloat(profitLoss.toFixed(2)),
              profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
            };
          }
          return asset;
        });
      } else {
        // Add new asset
        const newAsset: PortfolioAsset = {
          cryptoId,
          symbol: crypto.symbol,
          name: crypto.name,
          quantity,
          averageBuyPrice: price,
          currentPrice: crypto.price,
          totalValue: parseFloat((quantity * crypto.price).toFixed(2)),
          profitLoss: 0,
          profitLossPercent: 0,
          color: CRYPTO_COLORS[crypto.symbol] || '#888888',
        };
        updatedPortfolio = [...state.portfolio, newAsset];
      }

      const totals = calculatePortfolioTotals(updatedPortfolio);

      return {
        ...state,
        portfolio: updatedPortfolio,
        transactions: [newTransaction, ...state.transactions],
        balance: parseFloat((state.balance - total - fee).toFixed(2)),
        ...totals,
        isModalOpen: false,
        modalType: null,
        error: null,
      };
    }

    case 'EXECUTE_SELL': {
      const { cryptoId, quantity, price } = action.payload;
      const crypto = state.cryptos.find((c) => c.id === cryptoId);
      const asset = state.portfolio.find((a) => a.cryptoId === cryptoId);
      
      if (!crypto || !asset || asset.quantity < quantity) {
        return {
          ...state,
          error: !asset || asset.quantity < quantity ? 'Insufficient crypto balance' : 'Crypto not found',
        };
      }

      const total = quantity * price;
      const fee = total * 0.001; // 0.1% fee

      // Create new transaction
      const newTransaction: Transaction = {
        id: generateTransactionId(),
        cryptoId,
        symbol: crypto.symbol,
        name: crypto.name,
        type: 'sell',
        quantity,
        price,
        total,
        timestamp: Date.now(),
        status: 'completed',
        fee,
      };

      // Update portfolio
      const newQuantity = asset.quantity - quantity;
      let updatedPortfolio: PortfolioAsset[];

      if (newQuantity < 0.00000001) {
        // Remove asset if quantity is effectively zero
        updatedPortfolio = state.portfolio.filter((a) => a.cryptoId !== cryptoId);
      } else {
        updatedPortfolio = state.portfolio.map((a) => {
          if (a.cryptoId === cryptoId) {
            const totalValue = newQuantity * crypto.price;
            const costBasis = newQuantity * a.averageBuyPrice;
            const profitLoss = totalValue - costBasis;
            const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
            
            return {
              ...a,
              quantity: parseFloat(newQuantity.toFixed(8)),
              currentPrice: crypto.price,
              totalValue: parseFloat(totalValue.toFixed(2)),
              profitLoss: parseFloat(profitLoss.toFixed(2)),
              profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
            };
          }
          return a;
        });
      }

      const totals = calculatePortfolioTotals(updatedPortfolio);

      return {
        ...state,
        portfolio: updatedPortfolio,
        transactions: [newTransaction, ...state.transactions],
        balance: parseFloat((state.balance + total - fee).toFixed(2)),
        ...totals,
        isModalOpen: false,
        modalType: null,
        error: null,
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'UPDATE_PORTFOLIO': {
      const totals = calculatePortfolioTotals(state.portfolio);
      return {
        ...state,
        ...totals,
      };
    }

    default:
      return state;
  }
};

// Export initial state for use in components
export { INITIAL_STATE };
