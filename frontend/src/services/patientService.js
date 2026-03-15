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
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0102', age: 30, gender: 'male' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0103', age: 25, gender: 'female' },
      ];
    }
  },

  getPatientById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch patient:', error);
      throw error;
    }
  },

  addPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      toast.success('Patient added successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add patient');
      throw error;
    }
  },

  updatePatient: async (id, patientData) => {
    try {
      const response = await api.put(`/patients/${id}`, patientData);
      toast.success('Patient updated successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update patient');
      throw error;
    }
  },

  deletePatient: async (id) => {
    try {
      const response = await api.delete(`/patients/${id}`);
      toast.success('Patient deleted successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete patient');
      throw error;
    }
  },

  getPatientAppointments: async (id) => {
    try {
      const response = await api.get(`/patients/${id}/appointments`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch patient appointments:', error);
      throw error;
    }
  }
};
