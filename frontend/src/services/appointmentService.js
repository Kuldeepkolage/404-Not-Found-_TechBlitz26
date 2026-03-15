import api from './authService';
import toast from 'react-hot-toast';

export const appointmentService = {
  getAppointments: async () => {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      throw error;
    }
  },

  getTodayAppointments: async () => {
    try {
      const response = await api.get('/appointments/today');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch today appointments:', error);
      throw error;
    }
  },
  
  book: async (appointmentData) => {
    try {
      const response = await api.post('/appointments/book', appointmentData);
      toast.success('Appointment booked successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      toast.success(`Appointment marked as ${status}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to update status');
      throw error;
    }
  },

  cancel: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
      throw error;
    }
  },

  reschedule: async (id, date, time) => {
    try {
      const response = await api.put(`/appointments/${id}/reschedule`, { date, start_time: time });
      toast.success('Appointment rescheduled successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reschedule appointment');
      throw error;
    }
  },

  getByDoctor: async (doctorId, date) => {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await api.get(`/appointments/doctor/${doctorId}${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch doctor appointments:', error);
      throw error;
    }
  }
};
