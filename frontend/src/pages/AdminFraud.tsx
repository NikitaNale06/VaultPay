import React, { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';
import { AlertTriangle, Shield, Eye, Clock, DollarSign } from 'lucide-react';
import type { Transaction } from '../types';

const AdminFraud: React.FC = () => {
  const [fraudAlerts, setFraudAlerts] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFraudAlerts();
  }, []);

  const fetchFraudAlerts = async () => {
    try {
      const data = await adminService.getFraudAlerts();
      setFraudAlerts(data);
    } catch (error) {
      console.error('Error fetching fraud alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (amount: number) => {
    if (amount > 50000) return { level: 'Critical', color: 'bg-red-100 text-red-700' };
    if (amount > 25000) return { level: 'High', color: 'bg-orange-100 text-orange-700' };
    return { level: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-800">Fraud Detection</h1>
        </div>
        <p className="text-gray-600">Monitor and investigate suspicious transactions</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800 font-medium">Fraud Detection Rules</p>
            <p className="text-xs text-red-600 mt-1">Transactions above ₹10,000 are flagged for review</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
          <p className="text-sm text-red-600 font-medium">Total Fraud Alerts</p>
          <p className="text-2xl font-bold text-red-700">{fraudAlerts.length}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
          <p className="text-sm text-orange-600 font-medium">Total Amount Flagged</p>
          <p className="text-2xl font-bold text-orange-700">
            ₹{fraudAlerts.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
          <p className="text-sm text-yellow-600 font-medium">Highest Amount</p>
          <p className="text-2xl font-bold text-yellow-700">
            ₹{Math.max(...fraudAlerts.map(tx => tx.amount), 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading alerts...</p>
          </div>
        ) : fraudAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-gray-500">No suspicious transactions detected</p>
            <p className="text-sm text-gray-400 mt-2">All transactions are within normal limits</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {fraudAlerts.map((alert) => {
              const risk = getRiskLevel(alert.amount);
              return (
                <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-800">Transaction #{alert.id}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${risk.color}`}>
                            {risk.level} Risk
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>Amount: ₹{alert.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Time: {new Date(alert.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Eye className="h-4 w-4" />
                            <span>Type: {alert.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors">
                      Investigate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFraud;