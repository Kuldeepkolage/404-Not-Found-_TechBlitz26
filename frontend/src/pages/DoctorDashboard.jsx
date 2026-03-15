import React, { useState, useEffect } from 'react';
import { Stethoscope, CalendarDays, Clock, Users } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (timeStr, lng) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : period === 'AM' && hours === '12' ? 0 : parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat(lng, { hour: 'numeric', minute: 'numeric' }).format(date);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentService.getTodayAppointments();
        const data = response.data || response;
        setTodaysAppointments(data || []);
      } catch (error) {
        setTodaysAppointments([]);
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
           <h1 className="text-4xl lg:text-5xl font-bold mb-4">{t('doctor_dashboard.hello', { name: user?.user?.name || 'Doctor' })}</h1>
           <p className="text-blue-100 text-lg lg:text-xl max-w-xl">
             {t('doctor_dashboard.you_have')}<strong className="text-white">{todaysAppointments.length}{t('doctor_dashboard.pending_appointments')}</strong>{t('doctor_dashboard.today_next_consult')}
           </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <CalendarDays className="w-6 h-6 text-blue-600 mr-2" />
              {t('doctor_dashboard.todays_schedule')}
            </h2>
            <Link to="/doctor/schedule" className="text-blue-600 font-medium hover:text-blue-700">{t('doctor_dashboard.view_all')}</Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">{t('doctor_dashboard.loading_schedule')}</div>
            ) : todaysAppointments.length > 0 ? (
              todaysAppointments.map(appt => (
                <div key={appt._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-14 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center font-bold font-mono text-sm leading-tight px-1 text-center">
                      {formatTime(appt.start_time || appt.time, i18n.language).split(' ').map((part, idx) => <span key={idx}>{part}</span>)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-0.5">{appt.patient_id?.name || appt.patientName || 'Unknown'}</h3>
                      <p className="text-sm text-slate-500">{appt.reason || 'Consultation'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      appt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {t(`doctor_dashboard.status.${appt.status}`, appt.status)}
                    </span>
                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors">
                      {t('doctor_dashboard.view_notes')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
                <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">{t('doctor_dashboard.no_appointments')}</div>
            )}
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">{t('doctor_dashboard.weekly_summary')}</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
             <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6"/></div>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">+14%</span>
             </div>
             <div>
               <p className="text-slate-500 text-sm font-medium">{t('doctor_dashboard.patients_seen')}</p>
               <h3 className="text-4xl font-bold text-slate-900 mt-1">42</h3>
             </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
             <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Clock className="w-6 h-6"/></div>
             </div>
             <div>
               <p className="text-slate-500 text-sm font-medium">{t('doctor_dashboard.hours_consulted')}</p>
               <h3 className="text-4xl font-bold text-slate-900 mt-1">28h <span className="text-lg text-slate-400 font-normal">.5m</span></h3>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;

