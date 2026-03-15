import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, TrendingUp, Activity, Plus } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const ReceptionistDashboard = () => {
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data.data || data || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedAppointment || !newDate || !newTime) return;
      await appointmentService.reschedule(selectedAppointment._id || selectedAppointment.id, newDate, newTime);
      
      await fetchAppointments();
      
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setNewDate('');
      setNewTime('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancel(appointmentId);
      await fetchAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const formatTime = (timeStr, lng) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : period === 'AM' && hours === '12' ? 0 : parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat(lng, { hour: 'numeric', minute: 'numeric' }).format(date);
  };

  const formatDate = (dateStr, lng) => {
    return new Intl.DateTimeFormat(lng, { dateStyle: 'medium' }).format(new Date(dateStr));
  };

  const stats = [
    { name: t('receptionist_dashboard.stats.total_appointments'), value: '124', change: '+12%', icon: CalendarDays, color: 'blue' },
    { name: t('receptionist_dashboard.stats.new_patients'), value: '28', change: '+8%', icon: Users, color: 'emerald' },
    { name: t('receptionist_dashboard.stats.clinic_activity'), value: 'High', change: 'Trending', icon: Activity, color: 'indigo' },
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">{t('receptionist_dashboard.title')}</h1>
          <p className="text-slate-500 mt-1">{t('receptionist_dashboard.subtitle')}</p>
        </div>
        <Link 
          to="/receptionist/book"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>{t('receptionist_dashboard.new_appointment')}</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colorClasses = {
             blue: 'bg-blue-50 text-blue-600',
             emerald: 'bg-emerald-50 text-emerald-600',
             indigo: 'bg-indigo-50 text-indigo-600'
          };
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-600 text-sm font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                   <TrendingUp className="w-4 h-4" />
                   <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-slate-500 font-medium text-sm mb-1">{stat.name}</h3>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{t('receptionist_dashboard.recent_appointments')}</h2>
          <Link to="/receptionist/calendar" className="text-blue-600 hover:text-blue-700 text-sm font-medium">{t('receptionist_dashboard.view_calendar')}</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">{t('receptionist_dashboard.table_headers.patient')}</th>
                <th className="px-6 py-4 font-semibold">{t('receptionist_dashboard.table_headers.doctor')}</th>
                <th className="px-6 py-4 font-semibold">{t('receptionist_dashboard.table_headers.date_time')}</th>
                <th className="px-6 py-4 font-semibold">{t('receptionist_dashboard.table_headers.status')}</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">{t('receptionist_dashboard.loading')}</td>
                </tr>
              ) : appointments.slice(0, 5).map((appt) => (
                <tr key={appt._id || appt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{appt.patient_id?.name || appt.patientName || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{appt.doctor_id?.name || appt.doctor || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{formatDate(appt.date, i18n.language)}</div>
                    <div className="text-slate-500 text-sm border border-slate-200 rounded px-2 py-0.5 mt-1 inline-block">{formatTime(appt.start_time || appt.time, i18n.language)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      appt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {t(`doctor_dashboard.status.${appt.status}`, appt.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setNewDate(appt.date);
                        setNewTime(appt.start_time || appt.time);
                        setShowRescheduleModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => handleCancel(appt._id || appt.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && !loading && (
                <tr>
                   <td colSpan="5" className="px-6 py-8 text-center text-slate-500 bg-slate-50/50">{t('receptionist_dashboard.no_recent_appointments')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Reschedule Appointment</h2>
              <button onClick={() => setShowRescheduleModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">New Date</label>
                 <input 
                   type="date" 
                   value={newDate} 
                   onChange={(e) => setNewDate(e.target.value)}
                   className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                   required
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">New Time</label>
                 <input 
                   type="time" 
                   value={newTime} 
                   onChange={(e) => setNewTime(e.target.value)}
                   className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                   required
                 />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                 <button 
                   type="button" 
                   onClick={() => setShowRescheduleModal(false)}
                   className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
                 >
                   Confirm Reschedule
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReceptionistDashboard;

