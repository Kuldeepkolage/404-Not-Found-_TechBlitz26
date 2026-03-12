import React, { useState, useEffect } from 'react';
import { CalendarDays, User, Clock, Save, Stethoscope, ChevronRight } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import toast from 'react-hot-toast';

const AppointmentBookingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await doctorService.getDoctors();
      setDoctors(data || []);
    };
    fetchDoctors();
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
    if (!selectedTime) {
      toast.error('Please select an appointment time');
      return;
    }

    setLoading(true);
    try {
      await appointmentService.book({
        patientName,
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
      });
      // Reset form
      setPatientName('');
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setSlots([]);
    } catch (error) {
       // handled by service
    } finally {
      setLoading(false);
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
            {/* Patient Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" /> Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder-slate-400"
                placeholder="e.g. John Doe"
                required
              />
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900"
                required
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
    </div>
  );
};

export default AppointmentBookingPage;
