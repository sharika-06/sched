// src/api/eventTypeApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/event-types';

export const createEventType = async (data, token) => {
  return axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const getMyEventTypes = async (token) => {
  return axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
};

export const getEventTypeBySlug = async (slug) => {
  return axios.get(`${API_URL}/${slug}`);
};

export const getAvailableSlots = async (slug, days = 14) => {
  return axios.get(`${API_URL}/${slug}/slots?days=${days}`);
};