import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Filter, Search, User } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        setAppointments(data || []);
      } catch (error) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Filter logic (mocking date logic for now, assuming all returned are relevant)
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          appt.patient?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">My Schedule</h1>
          <p className="text-slate-500 mt-1">View and manage all your upcoming consultations.</p>
        </div>
        <div className="flex space-x-2">
           <button 
             onClick={() => setFilter('upcoming')}
             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'upcoming' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
           >
             Upcoming
           </button>
           <button 
             onClick={() => setFilter('past')}
             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'past' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
           >
             Past
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
           <div className="relative w-full max-w-md">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search appointments by patient name..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
             />
           </div>
           
           <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
           </button>
        </div>

        {/* List View */}
        <div className="divide-y divide-slate-100">
           {loading ? (
             <div className="p-12 text-center text-slate-500 font-medium">Loading schedule...</div>
           ) : filteredAppointments.length > 0 ? (
             filteredAppointments.map((appt, i) => (
               <div key={appt._id || i} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                 
                 <div className="flex items-start space-x-5">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center border border-blue-100/50 group-hover:scale-105 transition-transform shadow-sm">
                     <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{appt.date ? new Date(appt.date).toLocaleString('en-US', { month: 'short' }) : 'MAR'}</span>
                     <span className="text-xl font-black">{appt.date ? new Date(appt.date).getDate() : '15'}</span>
                   </div>
                   
                   <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-1">{appt.patientName || appt.patient}</h3>
                     <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                       <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-slate-400"/> {appt.time}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                       <span className="flex items-center"><User className="w-4 h-4 mr-1.5 text-slate-400"/> New Patient Consultation</span>
                     </div>
                   </div>
                 </div>

                 <div className="flex items-center space-x-4">
                   <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                     appt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/50' : 'bg-amber-100 text-amber-700 border border-amber-200/50'
                   }`}>
                     {appt.status}
                   </span>
                   <button className="px-5 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm rounded-xl transition-all">
                     View Details
                   </button>
                 </div>

               </div>
             ))
           ) : (
             <div className="p-16 text-center text-slate-500 bg-slate-50">
               <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <p className="text-lg font-medium text-slate-600">No appointments found.</p>
               <p className="text-sm">Enjoy your free time!</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
