import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, TrendingUp, Activity, Plus } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ReceptionistDashboard = () => {
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        setAppointments(data || []);
      } catch (error) {
        // Fallback for UI visualization if backend is unavailable
        setAppointments([
            { _id: '1', patientName: 'John Doe', doctor: 'Dr. Smith', date: '2024-03-15', time: '10:00 AM', status: 'Confirmed' },
            { _id: '2', patientName: 'Jane Smith', doctor: 'Dr. Johnson', date: '2024-03-15', time: '02:00 PM', status: 'Pending' }
        ]);
      } finally {
        setLoading(false);
      }
    };
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">{t('receptionist_dashboard.loading')}</td>
                </tr>
              ) : appointments.slice(0, 5).map((appt) => (
                <tr key={appt._id || appt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{t(`dummy_data.${appt.patientName}`, appt.patientName)}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{t(`dummy_data.${appt.doctor}`, appt.doctor)}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{formatDate(appt.date, i18n.language)}</div>
                    <div className="text-slate-500 text-sm border border-slate-200 rounded px-2 py-0.5 mt-1 inline-block">{formatTime(appt.time, i18n.language)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      appt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t(`doctor_dashboard.status.${appt.status}`, appt.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && !loading && (
                <tr>
                   <td colSpan="4" className="px-6 py-8 text-center text-slate-500 bg-slate-50/50">{t('receptionist_dashboard.no_recent_appointments')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;

