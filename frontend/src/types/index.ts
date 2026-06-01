export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  name?: string;
  phone?: string;
}

export interface Account {
  id: number;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'CREDIT' | 'DEBIT' | 'TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  account?: Account;
  toEmail?: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface TransactionRequest {
  amount: string;
  idempotencyKey?: string;
}

export interface TransferRequest {
  toEmail: string;
  amount: string;
  idempotencyKey?: string;
}