import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { transactionService } from '../services/transaction.service';
import BalanceCard from '../components/Dashboard/BalanceCard';
import QuickActions from '../components/Dashboard/QuickActions';
import StatsCards from '../components/Dashboard/StatsCards';
import SpendingChart from '../components/Dashboard/SpendingChart';
import { CategoryChart } from '../components/Dashboard/Category';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import type { Transaction } from '../types';

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<Array<{date: string; income: number; expense: number}>>([]);
  const [categoryData, setCategoryData] = useState<Array<{name: string; value: number; color: string}>>([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalTransactions: 0,
    monthlyChange: 12.5,
    avgTransaction: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [balanceData, transactions] = await Promise.all([
        authService.getBalance(),
        transactionService.getHistory()
      ]);
      
      setBalance(balanceData);
      setRecentTransactions(transactions.slice(0, 5));
      
      // Calculate stats
      const credits = transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
      const debits = transactions.filter(t => t.type === 'DEBIT' || t.type === 'TRANSFER').reduce((sum, t) => sum + t.amount, 0);
      
      setStats({
        totalBalance: balanceData,
        totalIncome: credits,
        totalExpense: debits,
        totalTransactions: transactions.length,
        monthlyChange: 12.5,
        avgTransaction: transactions.length > 0 ? (credits + debits) / transactions.length : 0
      });

      // Prepare chart data for last 30 days
      const last30Days = eachDayOfInterval({
        start: subDays(new Date(), 29),
        end: new Date()
      });

      const dailyData = last30Days.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayTransactions = transactions.filter(t => 
          format(new Date(t.createdAt), 'yyyy-MM-dd') === dateStr
        );
        
        return {
          date: dateStr,
          income: dayTransactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0),
          expense: dayTransactions.filter(t => t.type === 'DEBIT' || t.type === 'TRANSFER').reduce((sum, t) => sum + t.amount, 0)
        };
      });
      
      setChartData(dailyData);

      // Prepare category data
      const categories = new Map<string, number>();
      const categoryColors: Record<string, string> = {
        'CREDIT': '#22c55e',
        'DEBIT': '#ef4444',
        'TRANSFER': '#3b82f6',
        'REFUND': '#f59e0b',
        'FEE': '#8b5cf6'
      };

      transactions.forEach(t => {
        const current = categories.get(t.type) || 0;
        categories.set(t.type, current + t.amount);
      });

      const categoryArray = Array.from(categories.entries()).map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || '#6b7280'
      }));

      setCategoryData(categoryArray);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'CREDIT': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'DEBIT': return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <ArrowUpRight className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'CREDIT': return 'text-green-600';
      case 'DEBIT': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back to VaultPay</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      {/* Balance Card and Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <BalanceCard balance={balance} onRefresh={fetchDashboardData} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <SpendingChart data={chartData} />
        </div>
      </div>

      {/* Category Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CategoryChart data={categoryData} title="Transaction Distribution" />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Average Daily Spend</span>
              <span className="font-semibold">
                ₹{(stats.totalExpense / 30).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Most Used Type</span>
              <span className="font-semibold">
                {categoryData.length > 0 ? categoryData.reduce((a, b) => a.value > b.value ? a : b).name : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Transaction Success Rate</span>
              <span className="font-semibold text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
          </div>
          <button 
            onClick={() => window.location.href = '/transactions'}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTransactions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No transactions yet. Start by adding money to your account!
            </div>
          ) : (
            recentTransactions.map((tx) => (
              <div key={tx.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{tx.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{tx.status}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Add missing imports at the top
import { TrendingUp, TrendingDown, ArrowUpRight, Clock } from 'lucide-react';

export default Dashboard;