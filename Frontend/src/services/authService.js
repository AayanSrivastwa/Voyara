import api from './api';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.token) {
      localStorage.setItem('voyara_token', res.data.token);
      localStorage.setItem('voyara_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('voyara_token', res.data.token);
      localStorage.setItem('voyara_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem('voyara_token');
      localStorage.removeItem('voyara_user');
    }
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.user;
  },

  async updateProfile(data) {
    const res = await api.patch('/auth/profile', data);
    if (res.data.user) {
      localStorage.setItem('voyara_user', JSON.stringify(res.data.user));
    }
    return res.data.user;
  },

  async updatePassword(currentPassword, newPassword) {
    const res = await api.patch('/auth/password', { currentPassword, newPassword });
    return res.data;
  },

  async deleteAccount(password) {
    const res = await api.delete('/auth/account', { data: { password } });
    localStorage.removeItem('voyara_token');
    localStorage.removeItem('voyara_user');
    return res.data;
  },

  getCurrentUser() {
    const user = localStorage.getItem('voyara_user');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};
