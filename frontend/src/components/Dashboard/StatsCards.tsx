import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    totalTransactions: number;
    monthlyChange: number;
    avgTransaction: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Balance',
      value: stats.totalBalance,
      icon: Wallet,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
      prefix: '₹'
    },
    {
      title: 'Total Income',
      value: stats.totalIncome,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      prefix: '₹'
    },
    {
      title: 'Total Expense',
      value: stats.totalExpense,
      icon: TrendingDown,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      prefix: '₹'
    },
    {
      title: 'Transactions',
      value: stats.totalTransactions,
      icon: Activity,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      prefix: ''
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${card.bgColor} rounded-xl`}>
              <card.icon className={`h-6 w-6 ${card.textColor}`} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">
                {card.prefix}{card.value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{card.title}</p>
            </div>
          </div>
          {card.title === 'Total Balance' && stats.monthlyChange !== undefined && (
            <div className={`flex items-center justify-end text-sm ${stats.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.monthlyChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span className="ml-1">{Math.abs(stats.monthlyChange)}% from last month</span>
            </div>
          )}
          {card.title === 'Transactions' && stats.avgTransaction !== undefined && (
            <div className="text-right text-xs text-gray-400 mt-2">
              Avg: ₹{stats.avgTransaction.toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;