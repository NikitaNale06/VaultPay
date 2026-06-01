import api from './api';
import type { Transaction, TransactionRequest, TransferRequest } from '../types';

export const transactionService = {
  async credit(data: TransactionRequest): Promise<string> {
    const response = await api.post('/transactions/credit', {
      amount: data.amount,
      idempotencyKey: data.idempotencyKey || crypto.randomUUID()
    });
    return response.data;
  },

  async debit(data: TransactionRequest): Promise<string> {
    const response = await api.post('/transactions/debit', {
      amount: data.amount,
      idempotencyKey: data.idempotencyKey || crypto.randomUUID()
    });
    return response.data;
  },

  async transfer(data: TransferRequest): Promise<string> {
    const response = await api.post('/transactions/transfer', {
      toEmail: data.toEmail,
      amount: data.amount,
      idempotencyKey: data.idempotencyKey || crypto.randomUUID()
    });
    return response.data;
  },

  async getHistory(): Promise<Transaction[]> {
    const response = await api.get('/transactions/history');
    return response.data;
  }
};