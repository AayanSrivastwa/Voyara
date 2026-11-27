import api from './api';

export const expenseService = {
  async getExpenses(tripId) {
    const res = await api.get(`/trips/${tripId}/expenses`);
    return res.data;
  },

  async createExpense(tripId, data) {
    const res = await api.post(`/trips/${tripId}/expenses`, data);
    return res.data.data;
  },

  async updateExpense(tripId, id, data) {
    const res = await api.patch(`/trips/${tripId}/expenses/${id}`, data);
    return res.data.data;
  },

  async deleteExpense(tripId, id) {
    const res = await api.delete(`/trips/${tripId}/expenses/${id}`);
    return res.data;
  },
};
