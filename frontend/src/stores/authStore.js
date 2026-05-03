import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('ppdb_user') || 'null'),
  token: localStorage.getItem('ppdb_token') || null,
  isAuthenticated: !!localStorage.getItem('ppdb_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data.data;

      localStorage.setItem('ppdb_token', token);
      localStorage.setItem('ppdb_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  loginWithGoogle: async (credential, jenjangDaftar = null) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/google', { credential, jenjang_daftar: jenjangDaftar });
      const { user, token } = res.data.data;

      localStorage.setItem('ppdb_token', token);
      localStorage.setItem('ppdb_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Google Sign-In gagal. Silakan coba lagi.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', data);
      set({ isLoading: false, error: null });
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      const errors = err.response?.data?.errors || {};
      set({ isLoading: false, error: message });
      return { success: false, message, errors };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // silent fail
    } finally {
      localStorage.removeItem('ppdb_token');
      localStorage.removeItem('ppdb_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me');
      const user = res.data.data.user;
      localStorage.setItem('ppdb_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('ppdb_token');
      localStorage.removeItem('ppdb_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
