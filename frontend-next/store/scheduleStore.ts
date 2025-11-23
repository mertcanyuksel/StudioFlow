import { create } from 'zustand';
import { ScheduleOverride, BulkOverridePattern } from '@/types';
import { api } from '@/lib/api';

interface ScheduleState {
  overrides: ScheduleOverride[];
  selectedStudioId: number | null;
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
  setSelectedStudio: (studioId: number | null) => void;
  setSelectedDate: (date: string) => void;
  fetchSchedule: (studioId: number, startDate: string, endDate: string) => Promise<void>;
  addOverride: (override: Partial<ScheduleOverride>) => Promise<void>;
  updateOverride: (overrideId: number, override: Partial<ScheduleOverride>) => Promise<void>;
  deleteOverride: (overrideId: number) => Promise<void>;
  bulkAddOverrides: (pattern: BulkOverridePattern) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  overrides: [],
  selectedStudioId: null,
  selectedDate: new Date().toISOString().split('T')[0],
  isLoading: false,
  error: null,

  setSelectedStudio: (studioId) => {
    set({ selectedStudioId: studioId });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  fetchSchedule: async (studioId: number, startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.request<ScheduleOverride[]>(
        `/schedule/${studioId}?start=${startDate}&end=${endDate}`
      );
      if (response.success && response.data) {
        set({ overrides: response.data, isLoading: false });
      } else {
        set({ error: 'Program yüklenemedi', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Program yüklenirken hata oluştu', isLoading: false });
    }
  },

  addOverride: async (override: Partial<ScheduleOverride>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.request<ScheduleOverride>('/schedule-overrides', 'POST', override);
      if (response.success && response.data) {
        set((state) => ({
          overrides: [...state.overrides, response.data!],
          isLoading: false,
        }));
      } else {
        set({ error: 'Override eklenemedi', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Override eklenirken hata oluştu', isLoading: false });
      throw error;
    }
  },

  updateOverride: async (overrideId: number, override: Partial<ScheduleOverride>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.request<ScheduleOverride>(
        `/schedule-overrides/${overrideId}`,
        'PUT',
        override
      );
      if (response.success && response.data) {
        set((state) => ({
          overrides: state.overrides.map((o) =>
            o.OverrideID === overrideId ? response.data! : o
          ),
          isLoading: false,
        }));
      } else {
        set({ error: 'Override güncellenemedi', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Override güncellenirken hata oluştu', isLoading: false });
      throw error;
    }
  },

  deleteOverride: async (overrideId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.request(`/schedule-overrides/${overrideId}`, 'DELETE');
      if (response.success) {
        set((state) => ({
          overrides: state.overrides.filter((o) => o.OverrideID !== overrideId),
          isLoading: false,
        }));
      } else {
        set({ error: 'Override silinemedi', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Override silinirken hata oluştu', isLoading: false });
      throw error;
    }
  },

  bulkAddOverrides: async (pattern: BulkOverridePattern) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.request<ScheduleOverride[]>(
        '/schedule-overrides/bulk',
        'POST',
        pattern
      );
      if (response.success && response.data) {
        set((state) => ({
          overrides: [...state.overrides, ...response.data!],
          isLoading: false,
        }));
      } else {
        set({ error: 'Toplu override eklenemedi', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Toplu override eklenirken hata oluştu', isLoading: false });
      throw error;
    }
  },
}));
