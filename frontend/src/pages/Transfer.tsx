import React, { useState } from 'react';
import { transactionService } from '../services/transaction.service';
import { authService } from '../services/auth.service';
import { Send, IndianRupee, Mail, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Transfer: React.FC = () => {
  const [formData, setFormData] = useState({
    toEmail: '',
    amount: ''
  });
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
    const amountNum = parseFloat(formData.amount);
    
    if (!formData.toEmail) {
      toast.error('Please enter recipient email');
      return;
    }
    
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
      await transactionService.transfer({
        toEmail: formData.toEmail,
        amount: formData.amount
      });
      toast.success(`₹${amountNum.toLocaleString()} transferred to ${formData.toEmail}!`);
      setFormData({ toEmail: '', amount: '' });
      await loadBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Send Money</h1>
        <p className="text-gray-600 mt-1">Transfer funds to other users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Transfer Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.toEmail}
                  onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="recipient@example.com"
                />
              </div>
            </div>

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
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Your Balance:</span>
                <span className="text-xl font-bold text-gray-800">₹{balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-600">After Transfer:</span>
                <span className={`text-xl font-bold ${(balance - (parseFloat(formData.amount) || 0)) < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  ₹{(balance - (parseFloat(formData.amount) || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            {parseFloat(formData.amount) > balance && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">Insufficient balance!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || parseFloat(formData.amount) > balance}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Send Money'}
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Send className="h-8 w-8 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Transfer Details</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>✓ Instant transfer to other users</p>
            <p>✓ Zero transaction fees</p>
            <p>✓ Minimum transfer: ₹1.00</p>
            <p>✓ Maximum per transfer: ₹50,000</p>
            <p>✓ Requires recipient email address</p>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Security Note</p>
            <p className="text-xs text-gray-500 mt-1">Always verify recipient email before transferring</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;