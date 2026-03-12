import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, UserPlus, Users, Clock, Activity, LogOut, CheckSquare
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const receptionistLinks = [
    { path: '/receptionist', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/receptionist/book', icon: UserPlus, label: 'Book Appointment' },
    { path: '/receptionist/patients', icon: Users, label: 'Patient List' },
    { path: '/receptionist/calendar', icon: Calendar, label: 'Calendar View' },
  ];

  const doctorLinks = [
    { path: '/doctor', icon: LayoutDashboard, label: 'Overview' },
    { path: '/doctor/schedule', icon: CheckSquare, label: 'Upcoming Schedule' },
    { path: '/doctor/patients', icon: Users, label: 'My Patients' },
    { path: '/doctor/calendar', icon: Calendar, label: 'Calendar View' },
  ];

  const links = user?.role === 'doctor' ? doctorLinks : receptionistLinks;

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-slate-900 border-r border-slate-800 flex flex-col`}>
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50">
        <Activity className="w-8 h-8 text-blue-500 mr-3" />
        <span className="text-xl font-bold text-white tracking-wide">ClinicPro</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="mb-4 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Area Bottom */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:text-red-400" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

