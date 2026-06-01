import api from './api';
import type { User, Transaction } from '../types';

export const adminService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getAllTransactions(): Promise<Transaction[]> {
    const response = await api.get('/admin/transactions');
    return response.data;
  },

  async getFraudAlerts(): Promise<Transaction[]> {
    const response = await api.get('/admin/fraud-alerts');
    return response.data;
  }
};