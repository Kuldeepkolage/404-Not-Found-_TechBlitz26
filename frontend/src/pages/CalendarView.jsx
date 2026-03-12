import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { appointmentService } from '../services/appointmentService';

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        
        // Map backend appointments to FullCalendar event format
        const calendarEvents = data.map(appt => {
          // Parse time like "10:00 AM" into datetime
          let dateStr = appt.date || new Date().toISOString().split('T')[0];
          let timeParts = appt.time ? appt.time.match(/(\d+):(\d+)\s*(AM|PM)/i) : null;
          let hour = 10, minute = 0;
          
          if (timeParts) {
            hour = parseInt(timeParts[1]);
            minute = parseInt(timeParts[2]);
            if (timeParts[3].toUpperCase() === 'PM' && hour < 12) hour += 12;
            if (timeParts[3].toUpperCase() === 'AM' && hour === 12) hour = 0;
          }
          
          const startDate = new Date(dateStr);
          startDate.setHours(hour, minute, 0);

          const endDate = new Date(startDate);
          endDate.setHours(hour + 1, minute, 0); // Assuming 1 hour slot

          return {
            id: appt._id || Math.random().toString(),
            title: `${appt.patientName || appt.patient} - ${appt.status}`,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            backgroundColor: appt.status === 'Confirmed' ? '#10b981' : '#f59e0b',
            borderColor: appt.status === 'Confirmed' ? '#059669' : '#d97706',
            textColor: '#ffffff',
            extendedProps: {
               status: appt.status,
               doctor: appt.doctor
            }
          };
        });
        
        setEvents(calendarEvents);
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">Calendar Planner</h1>
        <p className="text-slate-500 mt-1">Get a complete visual overview of all clinic appointments.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
        <style dangerouslySetInnerHTML={{__html: `
           /* Custom overrides for FullCalendar to make it look sleek & modern */
           .fc-theme-standard th { border: none; padding: 10px 0; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
           .fc-theme-standard td { border-color: #f1f5f9; }
           .fc .fc-toolbar-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
           .fc .fc-button-primary { background-color: #2563eb; border-color: #2563eb; font-weight: 600; text-transform: capitalize; border-radius: 0.5rem; }
           .fc .fc-button-primary:hover { background-color: #1d4ed8; border-color: #1d4ed8; }
           .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: #1e40af; border-color: #1e40af; shadow: none; }
           .fc-daygrid-event { border-radius: 6px; padding: 2px 4px; font-size: 0.8rem; font-weight: 500; border: none !important; margin: 2px 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: transform 0.2s; }
           .fc-daygrid-event:hover { transform: scale(1.02); }
           .fc .fc-daygrid-day.fc-day-today { background-color: #f8fafc; }
           .fc-daygrid-day-number { color: #475569; font-weight: 600; padding: 8px !important; }
        `}} />
        
        {loading ? (
           <div className="h-[600px] flex items-center justify-center text-slate-500">
              Loading calendar data...
           </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            height="auto"
            aspectRatio={1.35}
            dayMaxEvents={true}
            eventClick={(info) => {
              // Custom interactive popover could go here. For now, just logging.
              console.log('Event clicked:', info.event);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarView;
