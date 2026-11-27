import api from './api';

export const tripService = {
  async getTrips(params = {}) {
    const res = await api.get('/trips', { params });
    return res.data.data;
  },

  async getTripById(id) {
    const res = await api.get(`/trips/${id}`);
    return res.data.data;
  },

  async createTrip(data) {
    const res = await api.post('/trips', data);
    return res.data.data;
  },

  async updateTrip(id, data) {
    const res = await api.patch(`/trips/${id}`, data);
    return res.data.data;
  },

  async deleteTrip(id) {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
  },

  // Itinerary sub-resource
  async getItineraries(tripId) {
    const res = await api.get(`/trips/${tripId}/itineraries`);
    return res.data.data;
  },

  async createItinerary(tripId, data) {
    const res = await api.post(`/trips/${tripId}/itineraries`, data);
    return res.data.data;
  },

  async updateItinerary(tripId, id, data) {
    const res = await api.patch(`/trips/${tripId}/itineraries/${id}`, data);
    return res.data.data;
  },

  async deleteItinerary(tripId, id) {
    const res = await api.delete(`/trips/${tripId}/itineraries/${id}`);
    return res.data;
  },
};
