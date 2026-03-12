import React, { useState, useEffect } from 'react';
import { Stethoscope, CalendarDays, Clock, Users } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        // Assuming we filter for today's. Just slicing for now
        setTodaysAppointments((data || []).slice(0, 5));
      } catch (error) {
        setTodaysAppointments([
          { id: 1, patient: 'John Doe', time: '10:00 AM', status: 'Confirmed', type: 'Consultation' },
          { id: 2, patient: 'Jane Smith', time: '02:00 PM', status: 'Pending', type: 'Follow up' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden">
         <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Stethoscope className="w-full h-full transform scale-150 translate-x-1/4 -translate-y-1/4" />
         </div>
         <div className="relative z-10">
           <h1 className="text-4xl lg:text-5xl font-bold mb-4">Hello, {user?.user?.name || 'Doctor'}</h1>
           <p className="text-blue-100 text-lg lg:text-xl max-w-xl">
             You have <strong className="text-white">{todaysAppointments.length} pending appointments</strong> today. Your next consultation is at 10:00 AM.
           </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <CalendarDays className="w-6 h-6 text-blue-600 mr-2" />
              Today's Schedule
            </h2>
            <Link to="/doctor/schedule" className="text-blue-600 font-medium hover:text-blue-700">View All →</Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">Loading schedule...</div>
            ) : todaysAppointments.length > 0 ? (
              todaysAppointments.map(appt => (
                <div key={appt.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold font-mono">
                      {appt.time.split(' ')[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-0.5">{appt.patient}</h3>
                      <p className="text-sm text-slate-500">{appt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      appt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {appt.status}
                    </span>
                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors">
                      View Notes
                    </button>
                  </div>
                </div>
              ))
            ) : (
                <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">No appointments scheduled for today.</div>
            )}
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Weekly Summary</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
             <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6"/></div>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">+14%</span>
             </div>
             <div>
               <p className="text-slate-500 text-sm font-medium">Patients Seen</p>
               <h3 className="text-4xl font-bold text-slate-900 mt-1">42</h3>
             </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
             <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Clock className="w-6 h-6"/></div>
             </div>
             <div>
               <p className="text-slate-500 text-sm font-medium">Hours Consulted</p>
               <h3 className="text-4xl font-bold text-slate-900 mt-1">28h <span className="text-lg text-slate-400 font-normal">.5m</span></h3>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;

