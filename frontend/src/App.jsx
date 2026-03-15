import React, { useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import PrivateRoute from './utils/PrivateRoute'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Pages
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AppointmentBookingPage from './pages/AppointmentBookingPage'
import PatientList from './pages/PatientList'
import DoctorSchedule from './pages/DoctorSchedule'
import CalendarView from './pages/CalendarView'

// Layout Wrapper
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} />
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 lg:ml-64 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Receptionist Routes */}
      <Route path="/receptionist" element={
        <PrivateRoute allowedRoles={['receptionist']}>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<ReceptionistDashboard />} />
        <Route path="book" element={<AppointmentBookingPage />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="calendar" element={<CalendarView />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={
        <PrivateRoute allowedRoles={['doctor']}>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<DoctorDashboard />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="calendar" element={<CalendarView />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App

