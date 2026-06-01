import React, { useState } from 'react';
import { transactionService } from '../services/transaction.service';
import { authService } from '../services/auth.service';
import { PlusCircle, IndianRupee, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Credit: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  React.useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const bal = await authService.getBalance();
      setBalance(bal);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await transactionService.credit({ amount });
      toast.success(`₹${amountNum.toLocaleString()} credited successfully!`);
      setAmount('');
      await loadBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Credit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add Money</h1>
        <p className="text-gray-600 mt-1">Credit funds to your account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <PlusCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Credit Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (INR)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Balance:</span>
                <span className="text-xl font-bold text-gray-800">₹{balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-600">New Balance:</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{(balance + (parseFloat(amount) || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Add Money'}
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Secure Transaction</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>✓ Instant credit to your account</p>
            <p>✓ 100% secure payment gateway</p>
            <p>✓ Transaction ID for reference</p>
            <p>✓ 24/7 customer support</p>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Need help?</p>
            <p className="text-xs text-gray-500 mt-1">Contact support: support@vaultpay.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credit;