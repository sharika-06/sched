import axios from 'axios';
const API_URL = 'http://localhost:5000/api/bookings';

export const createBooking = async (data) => {
  return axios.post(API_URL, data);
};

export const getMyBookings = async (token) => {
  return axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
};