import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { appointmentService } from '../services/appointmentService';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarScheduler = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const appointments = await appointmentService.getAppointments();
        const calendarEvents = appointments.map((appt) => ({
          title: `${appt.patientName} - ${appt.doctor}`,
          start: `${appt.date}T${appt.time}:00`,
          backgroundColor: '#0ea5e9',
          borderColor: '#0284c7',
          textColor: 'white',
          extendedProps: appt,
        }));
        setEvents(calendarEvents);
      } catch (error) {
        setEvents(mockEvents);
      }
    };
    fetchEvents();
  }, []);

  const mockEvents = [
    {
      title: 'John Doe - Dr. Smith',
      start: '2024-03-15T10:00:00',
      backgroundColor: '#10b981',
      borderColor: '#059669',
      textColor: 'white',
    },
    {
      title: 'Jane Smith - Dr. Johnson',
      start: '2024-03-16T14:00:00',
      backgroundColor: '#f59e0b',
      borderColor: '#d97706',
      textColor: 'white',
    },
  ];

  const handleEventClick = (clickInfo) => {
    toast(`Appointment: ${clickInfo.event.title}`);
  };

  const handleDateSelect = (selectInfo) => {
    toast.success(`Selected ${selectInfo.startStr}`);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <CalendarIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Appointment Calendar</h3>
          <p className="text-slate-600">Visual schedule overview</p>
        </div>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateSelect}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        height={500}
        eventDisplay="block"
        selectable={true}
        dayMaxEvents={true}
        weekends={true}
        editable={false}
        initialDate={new Date()}
        slotMinTime="08:00"
        slotMaxTime="18:00"
        dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week'
        }}
      />
    </div>
  );
};

export default CalendarScheduler;

