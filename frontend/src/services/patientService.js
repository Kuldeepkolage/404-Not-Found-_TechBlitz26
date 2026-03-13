import api from './authService';
import toast from 'react-hot-toast';

export const patientService = {
  getPatients: async () => {
    try {
      const response = await api.get('/patients');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      return [
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0102', lastVisit: '2024-03-01' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0103', lastVisit: '2024-03-10' },
      ];
    }
  },

  addPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      toast.success('Patient added successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error('Failed to add patient');
      throw error;
    }
  }
};
