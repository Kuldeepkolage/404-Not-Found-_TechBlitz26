import React, { useState } from 'react';
import { CalendarDays, User, Clock, Save, Stethoscope } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import toast from 'react-hot-toast';

const AppointmentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    doctor: '',
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);

  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown']; // mock
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']; // mock

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentService.book(formData);
      onSuccess();
      setFormData({ patientName: '', doctor: '', date: '', time: '' });
    } catch (error) {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Book New Appointment</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span>Patient Name</span>
          </label>
          <input
            type="text"
            value={formData.patientName}
            onChange={(e) => setFormData({...formData, patientName: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-gray-500" />
            <span>Doctor</span>
          </label>
          <select
            value={formData.doctor}
            onChange={(e) => setFormData({...formData, doctor: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Time</span>
          </label>
          <select
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            required
          >
            <option value="">Select Time</option>
            {times.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-success to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        <span>{loading ? 'Booking...' : 'Book Appointment'}</span>
      </button>
    </form>
  );
};

export default AppointmentForm;

