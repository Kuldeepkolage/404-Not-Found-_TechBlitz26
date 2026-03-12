import React from 'react';
import { Bell, Search, LogOut, Activity, Stethoscope, Users } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const RoleIcon = user?.role === 'doctor' ? Stethoscope : Users;

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 lg:hidden">
           <Activity className="w-8 h-8 text-blue-600" />
           <span className="text-xl font-bold text-slate-900">ClinicPro</span>
        </div>
        
        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 w-96 ml-64">
           <Search className="w-4 h-4 text-slate-400 mr-2" />
           <input 
             type="text" 
             placeholder="Search patients, appointments..." 
             className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder-slate-400"
           />
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-slate-900 capitalize">{user?.role || 'Guest'}</span>
              <span className="text-xs text-slate-500">Clinic Staff</span>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
               <RoleIcon className="w-5 h-5" />
            </div>
          </div>

          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

