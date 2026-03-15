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
        { _id: '1', name: 'Dr. Sarah Smith', specialization: 'Cardiology', availability_start: '09:00', availability_end: '17:00', slot_duration: 30 },
        { _id: '2', name: 'Dr. Michael Johnson', specialization: 'Pediatrics', availability_start: '09:00', availability_end: '17:00', slot_duration: 30 },
        { _id: '3', name: 'Dr. Emily Williams', specialization: 'General Practice', availability_start: '09:00', availability_end: '17:00', slot_duration: 30 }
      ];
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
      throw error;
    }
  },

  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/doctors', doctorData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to create doctor:', error);
      throw error;
    }
  },

  updateDoctor: async (id, doctorData) => {
    try {
      const response = await api.put(`/doctors/${id}`, doctorData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to update doctor:', error);
      throw error;
    }
  },

  deleteDoctor: async (id) => {
    try {
      const response = await api.delete(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      throw error;
    }
  },

  getAvailableSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/slots/${date}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      // Fallback response for UI dev
      return [
        { time: '09:00 AM', isBooked: false },
        { time: '09:30 AM', isBooked: false },
        { time: '10:00 AM', isBooked: true },
        { time: '10:30 AM', isBooked: false },
        { time: '11:00 AM', isBooked: false },
        { time: '11:30 AM', isBooked: false },
        { time: '01:00 PM', isBooked: false },
        { time: '01:30 PM', isBooked: false },
        { time: '02:00 PM', isBooked: true },
        { time: '02:30 PM', isBooked: false },
        { time: '03:00 PM', isBooked: false },
        { time: '03:30 PM', isBooked: false },
      ];
    }
  }
};
