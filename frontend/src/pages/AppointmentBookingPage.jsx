import React, { useState, useEffect } from 'react';
import { CalendarDays, User, Clock, Save, Stethoscope, Search, Plus } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import { patientService } from '../services/patientService';
import toast from 'react-hot-toast';

const AppointmentBookingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);

  // Form State
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: 'male'
  });

  useEffect(() => {
    const fetchData = async () => {
      const [doctorsData, patientsData] = await Promise.all([
        doctorService.getDoctors(),
        patientService.getPatients()
      ]);
      setDoctors(doctorsData || []);
      setPatients(patientsData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setSlots([]);
        return;
      }
      setLoadingSlots(true);
      try {
        const data = await doctorService.getAvailableSlots(selectedDoctor, selectedDate);
        setSlots(data || []);
        setSelectedTime(''); // Reset time when date/doc changes
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }
    if (!selectedTime) {
      toast.error('Please select an appointment time');
      return;
    }

    setLoading(true);
    try {
      await appointmentService.book({
        patient_id: selectedPatient,
        doctor_id: selectedDoctor,
        date: selectedDate,
        start_time: selectedTime,
        reason: reason,
      });
      // Reset form
      setSelectedPatient('');
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      setSlots([]);
    } catch (error) {
       // handled by service
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const created = await patientService.addPatient(newPatient);
      setPatients([...patients, created]);
      setSelectedPatient(created._id);
      setShowAddPatient(false);
      setNewPatient({ name: '', phone: '', email: '', age: '', gender: 'male' });
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">Book Appointment</h1>
        <p className="text-slate-500 mt-1">Schedule a new consultation session for a patient.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center">
           <CalendarDays className="w-5 h-5 text-blue-600 mr-2" />
           <h2 className="text-lg font-bold text-slate-800">Appointment Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center"><User className="w-4 h-4 mr-2 text-slate-400" /> Select Patient</span>
                <button
                  type="button"
                  onClick={() => setShowAddPatient(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add New
                </button>
              </label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900"
                required
              >
                <option value="" disabled>Choose a patient...</option>
                {patients.map(patient => (
                  <option key={patient._id} value={patient._id}>{patient.name} - {patient.phone}</option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Stethoscope className="w-4 h-4 mr-2 text-slate-400" /> Select Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900"
                required
              >
                <option value="" disabled>Choose a specialist...</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.name} - {doc.specialization}</option>
                ))}
              </select>
            </div>
            
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-slate-400" /> Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900"
                required
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Search className="w-4 h-4 mr-2 text-slate-400" /> Reason for Visit
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder-slate-400"
                placeholder="e.g. Regular checkup, Consultation..."
              />
            </div>
          </div>

          {/* Time Slots Area */}
          <div className="border-t border-slate-200 pt-8 mb-8">
             <div className="flex items-center justify-between mb-4">
               <label className="text-sm font-semibold text-slate-700 flex items-center">
                 <Clock className="w-4 h-4 mr-2 text-slate-400" /> Available Time Slots
               </label>
               {loadingSlots && <span className="text-sm text-blue-600 flex items-center"><div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div> Fetching slots...</span>}
             </div>

             {!selectedDoctor || !selectedDate ? (
               <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed p-8 text-center">
                  <p className="text-slate-500 text-sm">Please select a doctor and date to view available time slots.</p>
               </div>
             ) : slots.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                 {slots.map((slot, idx) => (
                   <button
                     key={idx}
                     type="button"
                     disabled={slot.isBooked}
                     onClick={() => setSelectedTime(slot.time)}
                     className={`py-3 px-2 text-sm font-bold rounded-xl border transition-all ${
                       slot.isBooked 
                         ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed hidden' 
                         : selectedTime === slot.time
                           ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30 -translate-y-0.5'
                           : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:shadow shadow-blue-900/5'
                     }`}
                   >
                     {slot.time}
                   </button>
                 ))}
               </div>
             ) : !loadingSlots ? (
                <div className="bg-amber-50 rounded-xl border border-amber-200 px-6 py-4 text-amber-700 text-sm">
                  No availability found for this doctor on the selected date.
                </div>
             ) : null}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || !selectedTime}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add Patient Modal */}
      {showAddPatient && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Add New Patient</h2>
              <button onClick={() => setShowAddPatient(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input 
                  type="tel" 
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input 
                    type="number" 
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select 
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddPatient(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBookingPage;
