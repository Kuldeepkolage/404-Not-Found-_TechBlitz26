export const slotGenerator = (start, end, duration) => {
  const slots = [];
  let current = new Date(`2021-01-01T${start}:00`);
  const endTime = new Date(`2021-01-01T${end}:00`);
  
  while (current < endTime) {
    slots.push(current.toTimeString().slice(0, 5)); // e.g. "10:00"
    current = new Date(current.getTime() + duration * 60000);
  }
  return slots;
};
