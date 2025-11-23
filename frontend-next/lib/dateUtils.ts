import { format, addDays, startOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';

export function getWeekDays(startDate: Date): Array<{ date: string; dayName: string; dayDate: string }> {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    days.push({
      date: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEEE', { locale: tr }),
      dayDate: format(date, 'd MMM', { locale: tr }),
    });
  }

  return days;
}

export function formatTime(time: string): string {
  return time.substring(0, 5); // HH:MM
}

export function generateTimeSlots(startHour = 6, endHour = 23): string[] {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
}
