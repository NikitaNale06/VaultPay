import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('Login attempt with:', data.email);
    try {
      const response = await api.post<AuthResponse>('/users/login', data);
      console.log('Login response:', response);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Don't call getProfile here, or fix getProfile
        await this.getProfile();
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<string> {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    console.log('Profile response:', response);
    
    // Backend returns an object, not a string
    if (response.data && typeof response.data === 'object') {
      // Extract email from the response object
      const userData = response.data;
      const user: User = { 
        id: userData.id || 0,
        email: userData.email || '',
        role: userData.role || 'USER',
        createdAt: new Date().toISOString()
      };
      
      // Get role from token if not in response
      const token = localStorage.getItem('token');
      if (token && !user.role) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          user.role = payload.role || 'USER';
          user.email = payload.sub || user.email;
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }
      
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    // Fallback for old string response
    const email = response.data.split(': ')[1];
    const user: User = { id: 0, email, role: 'USER', createdAt: new Date().toISOString() };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async getBalance(): Promise<number> {
    const response = await api.get('/users/balance');
    console.log('Balance response:', response);
    // Handle both object and string responses
    if (typeof response.data === 'object') {
      return response.data.balance || 0;
    }
    return parseFloat(response.data);
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user:', e);
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }
};