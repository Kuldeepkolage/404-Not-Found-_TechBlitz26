export const slotGenerator = (start, end, duration) => {
  const slots = [];
  
  // Parse start time
  const [startHour, startMin] = start.split(':').map(Number);
  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);
  
  // Parse end time
  const [endHour, endMin] = end.split(':').map(Number);
  const endTime = new Date();
  endTime.setHours(endHour, endMin, 0, 0);
  
  while (current < endTime) {
    const hours = current.getHours().toString().padStart(2, '0');
    const minutes = current.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`); // e.g. "10:00"
    current = new Date(current.getTime() + duration * 60000);
  }
  return slots;
};

export default slotGenerator;
