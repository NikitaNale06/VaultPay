import React from 'react';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  onRefresh: () => void;
  loading: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, onRefresh, loading }) => {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-xl p-6 text-white card-hover">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-primary-100 text-sm font-medium">Total Balance</p>
          <div className="flex items-center space-x-2 mt-2">
            <h2 className="text-4xl font-bold">
              {showBalance ? `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
            </h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-primary-100 hover:text-white transition-colors"
            >
              {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="bg-white/20 rounded-full p-3">
          <Wallet className="h-8 w-8" />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-300" />
            <span className="text-sm">Income</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingDown className="h-4 w-4 text-red-300" />
            <span className="text-sm">Expenses</span>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs text-primary-100">Account: VAULT********</p>
      </div>
    </div>
  );
};

export default BalanceCard;