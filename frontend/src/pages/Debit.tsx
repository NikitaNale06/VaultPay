import React, { useState } from 'react';
import { transactionService } from '../services/transaction.service';
import { authService } from '../services/auth.service';
import { MinusCircle, IndianRupee, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Debit: React.FC = () => {
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
    
    if (amountNum > balance) {
      toast.error('Insufficient balance!');
      return;
    }

    setLoading(true);
    try {
      await transactionService.debit({ amount });
      toast.success(`₹${amountNum.toLocaleString()} debited successfully!`);
      setAmount('');
      await loadBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Debit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Withdraw Money</h1>
        <p className="text-gray-600 mt-1">Debit funds from your account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <MinusCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Debit Form</h2>
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
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
                <span className={`text-xl font-bold ${(balance - (parseFloat(amount) || 0)) < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  ₹{(balance - (parseFloat(amount) || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            {parseFloat(amount) > balance && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">Insufficient balance! Please enter a smaller amount.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || parseFloat(amount) > balance}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Withdraw Money'}
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Important Notes</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>✓ Minimum withdrawal: ₹1.00</p>
            <p>✓ Maximum daily limit: ₹50,000</p>
            <p>✓ Amount will be deducted instantly</p>
            <p>✓ Large transactions may be flagged for security</p>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Fraud Prevention</p>
            <p className="text-xs text-gray-500 mt-1">Transactions over ₹10,000 are monitored for security</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debit;