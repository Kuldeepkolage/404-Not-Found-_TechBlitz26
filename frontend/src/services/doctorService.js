import api from './authService';

export const doctorService = {
  getDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      // fallback for UI development without backend
      return [
        { _id: '1', name: 'Dr. Sarah Smith', specialization: 'Cardiology' },
        { _id: '2', name: 'Dr. Michael Johnson', specialization: 'Pediatrics' },
        { _id: '3', name: 'Dr. Emily Williams', specialization: 'General Practice' }
      ];
    }
  },

  getAvailableSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/slots/${doctorId}/${date}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      // Fallback response for UI dev
      return [
        { time: '09:00 AM', isBooked: false },
        { time: '10:00 AM', isBooked: true },
        { time: '11:00 AM', isBooked: false },
        { time: '01:00 PM', isBooked: false },
        { time: '02:00 PM', isBooked: true },
        { time: '03:00 PM', isBooked: false },
      ];
    }
  }
};
