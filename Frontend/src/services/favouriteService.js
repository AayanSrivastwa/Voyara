import api from './api';

export const favouriteService = {
  async getFavourites() {
    const res = await api.get('/favourites');
    return res.data.data;
  },

  async addFavourite(destinationData) {
    const res = await api.post('/favourites', destinationData);
    return res.data.data;
  },

  async updateFavourite(id, notes) {
    const res = await api.patch(`/favourites/${id}`, { notes });
    return res.data.data;
  },

  async removeFavourite(id) {
    const res = await api.delete(`/favourites/${id}`);
    return res.data;
  },
};

export const notificationService = {
  async getNotifications() {
    const res = await api.get('/notifications');
    return res.data;
  },

  async markAsRead(id) {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data.data;
  },

  async markAllAsRead() {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },

  async deleteNotification(id) {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },
};
