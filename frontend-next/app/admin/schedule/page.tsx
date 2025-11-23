'use client';

import { useEffect, useState, useRef } from 'react';
import { useScheduleStore } from '@/store/scheduleStore';
import { useMediaStore } from '@/store/mediaStore';
import { api } from '@/lib/api';
import { Button, Modal, Input, Loading, Select } from '@/components/ui';
import { Studio, Lesson } from '@/types';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Pazartesi', short: 'Pzt' },
  { value: 2, label: 'Salı', short: 'Sal' },
  { value: 3, label: 'Çarşamba', short: 'Çar' },
  { value: 4, label: 'Perşembe', short: 'Per' },
  { value: 5, label: 'Cuma', short: 'Cum' },
  { value: 6, label: 'Cumartesi', short: 'Cmt' },
  { value: 0, label: 'Pazar', short: 'Paz' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  title: string;
  type: 'lesson' | 'override';
  color?: string;
  mediaType?: 'video' | 'image';
  startMinutes: number;
  durationMinutes: number;
}

export default function SchedulePage() {
  const { overrides, selectedStudioId, setSelectedStudio, fetchSchedule, addOverride, deleteOverride, updateOverride } = useScheduleStore();
  const { media, fetchMedia } = useMediaStore();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: number; time: number } | null>(null);
  const [resizingOverride, setResizingOverride] = useState<{ id: number; edge: 'start' | 'end' } | null>(null);
  const [editingOverride, setEditingOverride] = useState<any>(null);
  const [selectedMediaForBulk, setSelectedMediaForBulk] = useState<any>(null);
  const [bulkForm, setBulkForm] = useState({
    selectedDays: [] as number[],
    timeSlots: [{ startTime: '09:00', endTime: '09:30', repeatCount: 0, duration: 30 }],
  });

  const [addForm, setAddForm] = useState({
    mediaId: '',
    dayOfWeek: '1',
    startTime: '09:00',
    endTime: '09:30',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studiosRes] = await Promise.all([
          api.request<Studio[]>('/studios'),
          fetchMedia(),
        ]);

        if (studiosRes.success && studiosRes.data) {
          setStudios(studiosRes.data);
          if (studiosRes.data.length > 0 && !selectedStudioId) {
            setSelectedStudio(studiosRes.data[0].StudioID);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedStudioId) {
      loadLessonsAndOverrides();
    }
  }, [selectedStudioId]);

  const loadLessonsAndOverrides = async () => {
    if (!selectedStudioId) return;

    try {
      // Load lessons for this studio
      const lessonsRes = await api.request<Lesson[]>('/lessons');
      if (lessonsRes.success && lessonsRes.data) {
        const studioLessons = lessonsRes.data.filter(l => l.StudioID === selectedStudioId && l.IsActive);
        setLessons(studioLessons);
      }

      // Load overrides for the week
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      await fetchSchedule(
        selectedStudioId,
        weekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0]
      );
    } catch (error) {
      console.error('Failed to load schedule:', error);
    }
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const getLessonSlots = (dayOfWeek: number): TimeSlot[] => {
    return lessons
      .filter(l => l.DayOfWeek === dayOfWeek)
      .map(l => ({
        id: l.LessonID,
        startTime: l.StartTime,
        endTime: l.EndTime,
        title: l.LessonName,
        type: 'lesson' as const,
        color: 'bg-blue-500',
        startMinutes: timeToMinutes(l.StartTime),
        durationMinutes: timeToMinutes(l.EndTime) - timeToMinutes(l.StartTime),
      }));
  };

  const getOverrideSlots = (dayOfWeek: number): TimeSlot[] => {
    return overrides
      .filter(o => {
        const date = new Date(o.StartDateTime);
        return date.getDay() === dayOfWeek;
      })
      .map(o => {
        const startDateTime = new Date(o.StartDateTime);
        const endDateTime = new Date(o.EndDateTime);
        const startTime = `${String(startDateTime.getHours()).padStart(2, '0')}:${String(startDateTime.getMinutes()).padStart(2, '0')}`;
        const endTime = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`;

        return {
          id: o.OverrideID,
          startTime,
          endTime,
          title: o.MediaTitle || 'Media',
          type: 'override' as const,
          color: o.MediaType === 'video' ? 'bg-purple-500' : 'bg-orange-500',
          mediaType: o.MediaType as 'video' | 'image',
          startMinutes: timeToMinutes(startTime),
          durationMinutes: timeToMinutes(endTime) - timeToMinutes(startTime),
        };
      });
  };

  const handleAddOverrideFromLibrary = async (mediaItem: any, targetDay: number, targetHour: number) => {
    if (!selectedStudioId) return;

    try {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const dayDiff = targetDay - currentDayOfWeek;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayDiff);

      const startDate = new Date(targetDate);
      startDate.setHours(targetHour, 0, 0, 0);

      const endDate = new Date(targetDate);
      endDate.setHours(targetHour, 30, 0, 0); // Default 30 minutes

      await addOverride({
        StudioID: selectedStudioId,
        MediaID: mediaItem.MediaID,
        StartDateTime: startDate.toISOString(),
        EndDateTime: endDate.toISOString(),
        IsActive: true,
      });

      await loadLessonsAndOverrides();
      setIsMediaLibraryOpen(false);
    } catch (error) {
      console.error('Failed to add override:', error);
      alert('Override eklenirken hata oluştu');
    }
  };

  const handleDeleteOverride = async (overrideId: number) => {
    if (!confirm('Bu override\'ı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteOverride(overrideId);
      await loadLessonsAndOverrides();
    } catch (error) {
      console.error('Failed to delete override:', error);
    }
  };

  const handleDuplicateOverride = async (override: any) => {
    if (!selectedStudioId) return;

    try {
      await addOverride({
        StudioID: selectedStudioId,
        MediaID: override.MediaID,
        StartDateTime: override.StartDateTime,
        EndDateTime: override.EndDateTime,
        IsActive: true,
      });
      await loadLessonsAndOverrides();
    } catch (error) {
      console.error('Failed to duplicate override:', error);
    }
  };

  const handleBulkAddOverrides = async () => {
    if (!selectedStudioId || !selectedMediaForBulk || bulkForm.selectedDays.length === 0) {
      alert('Lütfen en az bir gün seçin');
      return;
    }

    if (bulkForm.timeSlots.length === 0) {
      alert('Lütfen en az bir saat aralığı ekleyin');
      return;
    }

    try {
      const today = new Date();
      const currentDayOfWeek = today.getDay();

      // Her seçili gün ve her saat aralığı için override oluştur
      for (const targetDay of bulkForm.selectedDays) {
        const dayDiff = targetDay - currentDayOfWeek;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + dayDiff);

        for (const timeSlot of bulkForm.timeSlots) {
          const [startHour, startMin] = timeSlot.startTime.split(':').map(Number);
          const [endHour, endMin] = timeSlot.endTime.split(':').map(Number);

          const startDate = new Date(targetDate);
          startDate.setHours(startHour, startMin, 0, 0);

          const endDate = new Date(targetDate);
          endDate.setHours(endHour, endMin, 0, 0);

          await addOverride({
            StudioID: selectedStudioId,
            MediaID: selectedMediaForBulk.MediaID,
            StartDateTime: startDate.toISOString(),
            EndDateTime: endDate.toISOString(),
            IsActive: true,
          });
        }
      }

      await loadLessonsAndOverrides();
      setSelectedMediaForBulk(null);
      setBulkForm({ selectedDays: [], timeSlots: [{ startTime: '09:00', endTime: '09:30', repeatCount: 0, duration: 30 }] });
      setIsMediaLibraryOpen(false);
    } catch (error) {
      console.error('Failed to add bulk overrides:', error);
      alert('Override eklenirken hata oluştu');
    }
  };

  const addTimeSlot = () => {
    setBulkForm(prev => {
      // Eğer video seçiliyse ve duration varsa, yeni slot için de aynı duration'ı kullan
      const videoDuration = selectedMediaForBulk?.MediaType === 'video' && selectedMediaForBulk?.Duration
        ? Math.ceil(selectedMediaForBulk.Duration / 60)
        : 30;

      return {
        ...prev,
        timeSlots: [...prev.timeSlots, { startTime: '09:00', endTime: '09:30', repeatCount: 0, duration: videoDuration }]
      };
    });
  };

  const removeTimeSlot = (index: number) => {
    setBulkForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime' | 'repeatCount' | 'duration', value: string | number) => {
    setBulkForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => {
        if (i !== index) return slot;

        const updatedSlot = { ...slot, [field]: value };

        // If repeatCount is updated and > 0, calculate endTime automatically
        if (field === 'repeatCount' && typeof value === 'number' && value > 0) {
          const [startHour, startMin] = slot.startTime.split(':').map(Number);
          const totalMinutes = startHour * 60 + startMin + (slot.duration * value);
          const endHour = Math.floor(totalMinutes / 60) % 24;
          const endMin = totalMinutes % 60;
          updatedSlot.endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        }

        // If duration is updated and repeatCount > 0, recalculate endTime
        if (field === 'duration' && typeof value === 'number' && slot.repeatCount > 0) {
          const [startHour, startMin] = slot.startTime.split(':').map(Number);
          const totalMinutes = startHour * 60 + startMin + (value * slot.repeatCount);
          const endHour = Math.floor(totalMinutes / 60) % 24;
          const endMin = totalMinutes % 60;
          updatedSlot.endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        }

        // If startTime is updated and repeatCount > 0, recalculate endTime
        if (field === 'startTime' && slot.repeatCount > 0) {
          const [startHour, startMin] = (value as string).split(':').map(Number);
          const totalMinutes = startHour * 60 + startMin + (slot.duration * slot.repeatCount);
          const endHour = Math.floor(totalMinutes / 60) % 24;
          const endMin = totalMinutes % 60;
          updatedSlot.endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        }

        // If repeatCount is set to 0, allow manual endTime editing
        if (field === 'repeatCount' && value === 0) {
          // Keep the current endTime, user can now edit it manually
        }

        return updatedSlot;
      })
    }));
  };

  const getExistingOverridesForMedia = (mediaId: number) => {
    return overrides.filter(o => o.MediaID === mediaId);
  };

  const toggleDay = (day: number) => {
    setBulkForm(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const handleDragStart = (e: React.DragEvent, item: any, type: 'media' | 'override') => {
    setDraggedItem({ ...item, type });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ day, time: hour });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = async (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    setDragOverSlot(null);

    if (!draggedItem || !selectedStudioId) return;

    try {
      if (draggedItem.type === 'media') {
        await handleAddOverrideFromLibrary(draggedItem, day, hour);
      } else if (draggedItem.type === 'override') {
        // Move existing override to new time
        const today = new Date();
        const currentDayOfWeek = today.getDay();
        const dayDiff = day - currentDayOfWeek;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + dayDiff);

        const oldStart = new Date(draggedItem.StartDateTime);
        const oldEnd = new Date(draggedItem.EndDateTime);
        const duration = oldEnd.getTime() - oldStart.getTime();

        const newStart = new Date(targetDate);
        newStart.setHours(hour, 0, 0, 0);

        const newEnd = new Date(newStart.getTime() + duration);

        await updateOverride(draggedItem.OverrideID, {
          StartDateTime: newStart.toISOString(),
          EndDateTime: newEnd.toISOString(),
        });

        await loadLessonsAndOverrides();
      }
    } catch (error) {
      console.error('Failed to handle drop:', error);
    }

    setDraggedItem(null);
  };

  if (isLoading) {
    return <Loading text="Program yükleniyor..." fullScreen />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Haftalık Program Yönetimi</h1>
            <p className="text-sm text-gray-600 mt-1">24 saatlik görünüm ile ders ve override yönetimi</p>
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedStudioId?.toString() || ''}
              onChange={(e) => setSelectedStudio(parseInt(e.target.value))}
              options={[
                { value: '', label: 'Stüdyo seçiniz...' },
                ...studios.map(s => ({ value: s.StudioID.toString(), label: s.StudioName }))
              ]}
            />
            <Button onClick={() => setIsMediaLibraryOpen(true)}>
              📚 Medya Kütüphanesi
            </Button>
          </div>
        </div>
      </div>

      {!selectedStudioId && (
        <div className="m-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          Lütfen bir stüdyo seçin
        </div>
      )}

      {selectedStudioId && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Day Tabs */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
            <div className="flex gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDay(day.value)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    day.value === selectedDay
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="flex-1 overflow-auto px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[80px_1fr_1fr] bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 font-semibold text-sm text-gray-700 border-r border-gray-200">
                  Saat
                </div>
                <div className="px-4 py-3 font-semibold text-sm text-gray-700 border-r border-gray-200 bg-blue-50">
                  Ders Programı (Sabit)
                </div>
                <div className="px-4 py-3 font-semibold text-sm text-gray-700 bg-purple-50">
                  Override (Düzenlenebilir)
                </div>
              </div>

              {/* 24 Hour Rows */}
              {HOURS.map((hour) => {
                const lessonSlots = getLessonSlots(selectedDay).filter(
                  slot => Math.floor(slot.startMinutes / 60) === hour
                );
                const overrideSlots = getOverrideSlots(selectedDay).filter(
                  slot => Math.floor(slot.startMinutes / 60) === hour
                );

                return (
                  <div
                    key={hour}
                    className="grid grid-cols-[80px_1fr_1fr] border-b border-gray-200 hover:bg-gray-50 transition-colors min-h-[80px]"
                  >
                    {/* Hour Label */}
                    <div className="px-4 py-3 font-mono text-sm text-gray-600 border-r border-gray-200 flex items-start">
                      {String(hour).padStart(2, '0')}:00
                    </div>

                    {/* Lesson Column (Read-only) */}
                    <div className="px-2 py-2 border-r border-gray-200 bg-blue-50/30">
                      {lessonSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="bg-blue-500 text-white rounded-lg p-3 mb-2 shadow-sm"
                        >
                          <div className="font-semibold text-sm mb-1">{slot.title}</div>
                          <div className="text-xs opacity-90">
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                      ))}
                      {lessonSlots.length === 0 && (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          Ders yok
                        </div>
                      )}
                    </div>

                    {/* Override Column (Editable) */}
                    <div
                      className={`px-2 py-2 bg-purple-50/30 transition-colors ${
                        dragOverSlot?.day === selectedDay && dragOverSlot?.time === hour
                          ? 'bg-purple-200 ring-2 ring-purple-400'
                          : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, selectedDay, hour)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, selectedDay, hour)}
                    >
                      {overrideSlots.map((slot) => {
                        const override = overrides.find(o => o.OverrideID === slot.id);
                        return (
                          <div
                            key={slot.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, override, 'override')}
                            className={`${slot.color} text-white rounded-lg p-3 mb-2 shadow-sm cursor-move hover:shadow-md transition-shadow`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {slot.mediaType === 'video' ? '🎬' : '📷'}
                                </span>
                                <div className="font-semibold text-sm">{slot.title}</div>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingOverride(override);
                                  }}
                                  className="bg-white/20 hover:bg-white/30 rounded px-2 py-1 text-xs"
                                  title="Düzenle"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    override && handleDuplicateOverride(override);
                                  }}
                                  className="bg-white/20 hover:bg-white/30 rounded px-2 py-1 text-xs"
                                  title="Kopyala"
                                >
                                  📋
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteOverride(slot.id);
                                  }}
                                  className="bg-white/20 hover:bg-white/30 rounded px-2 py-1 text-xs"
                                  title="Sil"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                            <div className="text-xs opacity-90">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </div>
                        );
                      })}
                      {overrideSlots.length === 0 && (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          Buraya sürükle
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      {/* Edit Override Modal */}
      <Modal
        isOpen={!!editingOverride}
        onClose={() => setEditingOverride(null)}
        title="Override Düzenle"
      >
        {editingOverride && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Saati</label>
              <Input
                type="time"
                value={new Date(editingOverride.StartDateTime).toTimeString().substring(0, 5)}
                onChange={(e) => {
                  const date = new Date(editingOverride.StartDateTime);
                  const [hours, minutes] = e.target.value.split(':');
                  date.setHours(parseInt(hours), parseInt(minutes));
                  setEditingOverride({ ...editingOverride, StartDateTime: date.toISOString() });
                }}
                fullWidth
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Saati</label>
              <Input
                type="time"
                value={new Date(editingOverride.EndDateTime).toTimeString().substring(0, 5)}
                onChange={(e) => {
                  const date = new Date(editingOverride.EndDateTime);
                  const [hours, minutes] = e.target.value.split(':');
                  date.setHours(parseInt(hours), parseInt(minutes));
                  setEditingOverride({ ...editingOverride, EndDateTime: date.toISOString() });
                }}
                fullWidth
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="secondary" onClick={() => setEditingOverride(null)}>
                İptal
              </Button>
              <Button onClick={async () => {
                await updateOverride(editingOverride.OverrideID, {
                  StartDateTime: editingOverride.StartDateTime,
                  EndDateTime: editingOverride.EndDateTime,
                });
                await loadLessonsAndOverrides();
                setEditingOverride(null);
              }}>
                Kaydet
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Media Library Modal */}
      <Modal
        isOpen={isMediaLibraryOpen && !selectedMediaForBulk}
        onClose={() => setIsMediaLibraryOpen(false)}
        title="Medya Kütüphanesi"
        maxWidth="xl"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Medyayı sürükleyip takvime bırakın veya tıklayarak toplu ekleme yapın
          </p>
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {media.map((item) => (
              <div
                key={item.MediaID}
                draggable
                onDragStart={(e) => handleDragStart(e, item, 'media')}
                onClick={() => {
                  setSelectedMediaForBulk(item);
                  // Eğer video ise, duration'ı otomatik set et (saniyeden dakikaya çevir)
                  if (item.MediaType === 'video' && item.Duration) {
                    const durationInMinutes = Math.ceil(item.Duration / 60);
                    setBulkForm(prev => ({
                      ...prev,
                      timeSlots: prev.timeSlots.map(slot => ({
                        ...slot,
                        duration: durationInMinutes
                      }))
                    }));
                  }
                }}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded flex items-center justify-center text-2xl">
                    {item.MediaType === 'video' ? '🎬' : '📷'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{item.Title}</div>
                    <div className="text-xs text-gray-500 capitalize">{item.MediaType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Bulk Add Override Modal */}
      <Modal
        isOpen={!!selectedMediaForBulk}
        onClose={() => {
          setSelectedMediaForBulk(null);
          setBulkForm({ selectedDays: [], timeSlots: [{ startTime: '09:00', endTime: '09:30', repeatCount: 0, duration: 30 }] });
        }}
        title="Medya Override Yönetimi"
        maxWidth="xl"
      >
        {selectedMediaForBulk && (
          <div className="space-y-6">
            {/* Selected Media Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-3xl">
                  {selectedMediaForBulk.MediaType === 'video' ? '🎬' : '📷'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900">{selectedMediaForBulk.Title}</div>
                  <div className="text-sm text-gray-600 capitalize">{selectedMediaForBulk.MediaType}</div>
                </div>
              </div>
            </div>

            {/* Existing Overrides */}
            {getExistingOverridesForMedia(selectedMediaForBulk.MediaID).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="font-semibold text-gray-900 mb-3">Mevcut Override'lar</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {getExistingOverridesForMedia(selectedMediaForBulk.MediaID).map((override) => {
                    const startDate = new Date(override.StartDateTime);
                    const endDate = new Date(override.EndDateTime);
                    const dayName = DAYS_OF_WEEK.find(d => d.value === startDate.getDay())?.label;
                    const startTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
                    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

                    return (
                      <div key={override.OverrideID} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                        <div className="text-sm">
                          <span className="font-semibold">{dayName}</span> - {startTime} - {endTime}
                        </div>
                        <button
                          onClick={async () => {
                            await handleDeleteOverride(override.OverrideID);
                          }}
                          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 hover:bg-red-50 rounded"
                        >
                          Sil
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="font-semibold text-gray-900 mb-4">Yeni Override Ekle</div>

              {/* Day Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Hangi günlerde gösterilsin?
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                        bulkForm.selectedDays.includes(day.value)
                          ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Saat Aralıkları
                  </label>
                  <Button size="sm" onClick={addTimeSlot}>
                    + Saat Ekle
                  </Button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkForm.timeSlots.map((slot, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          {/* Start Time and End Time */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Başlangıç</label>
                              <Input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                                fullWidth
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Bitiş</label>
                              <Input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                                fullWidth
                                disabled={slot.repeatCount > 0}
                                className={slot.repeatCount > 0 ? 'bg-gray-100 cursor-not-allowed' : ''}
                              />
                            </div>
                          </div>

                          {/* Duration and Repeat Count */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Süre (dakika)
                              </label>
                              <Input
                                type="number"
                                min="1"
                                value={slot.duration}
                                onChange={(e) => updateTimeSlot(index, 'duration', parseInt(e.target.value) || 30)}
                                fullWidth
                                disabled={selectedMediaForBulk?.MediaType === 'video'}
                                className={selectedMediaForBulk?.MediaType === 'video' ? 'bg-gray-100 cursor-not-allowed' : ''}
                              />
                              {selectedMediaForBulk?.MediaType === 'video' && (
                                <p className="text-xs text-gray-500 mt-1">Video süresi otomatik</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tekrar Sayısı
                              </label>
                              <Input
                                type="number"
                                min="0"
                                value={slot.repeatCount}
                                onChange={(e) => updateTimeSlot(index, 'repeatCount', parseInt(e.target.value) || 0)}
                                placeholder="0 = manuel bitiş"
                                fullWidth
                              />
                            </div>
                          </div>

                          {/* Info message when repeat count is active */}
                          {slot.repeatCount > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                              Bitiş saati otomatik hesaplandı: {slot.duration} dk × {slot.repeatCount} tekrar = {slot.duration * slot.repeatCount} dakika
                            </div>
                          )}
                        </div>

                        {bulkForm.timeSlots.length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(index)}
                            className="text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded mt-6"
                            title="Sil"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {bulkForm.selectedDays.length > 0 && bulkForm.timeSlots.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="text-sm text-blue-900">
                    <strong>{bulkForm.selectedDays.length} gün</strong> x{' '}
                    <strong>{bulkForm.timeSlots.length} saat aralığı</strong> ={' '}
                    <strong>{bulkForm.selectedDays.length * bulkForm.timeSlots.length} override</strong> oluşturulacak
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Günler: {bulkForm.selectedDays.map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label).join(', ')}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedMediaForBulk(null);
                  setBulkForm({ selectedDays: [], timeSlots: [{ startTime: '09:00', endTime: '09:30', repeatCount: 0, duration: 30 }] });
                }}
              >
                İptal
              </Button>
              <Button onClick={handleBulkAddOverrides}>
                {bulkForm.selectedDays.length * bulkForm.timeSlots.length} Override Ekle
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
