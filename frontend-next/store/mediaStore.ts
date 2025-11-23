import { create } from 'zustand';
import { Media } from '@/types';
import { api } from '@/lib/api';

interface MediaState {
  media: Media[];
  isLoading: boolean;
  error: string | null;
  fetchMedia: () => Promise<void>;
  addMedia: (formData: FormData) => Promise<void>;
  deleteMedia: (mediaId: number) => Promise<void>;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  media: [],
  isLoading: false,
  error: null,

  fetchMedia: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.request<Media[]>('/media');
      if (response.success && response.data) {
        set({ media: response.data, isLoading: false });
      } else {
        set({ error: 'Medya yüklenemedi', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Medya yüklenirken hata oluştu', isLoading: false });
    }
  },

  addMedia: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.upload<Media>('/media', formData);
      if (response.success && response.data) {
        set((state) => ({
          media: [...state.media, response.data!],
          isLoading: false,
        }));
      } else {
        set({ error: 'Medya eklenemedi', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Medya eklenirken hata oluştu', isLoading: false });
      throw error;
    }
  },

  deleteMedia: async (mediaId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.request(`/media/${mediaId}`, 'DELETE');
      if (response.success) {
        set((state) => ({
          media: state.media.filter((m) => m.MediaID !== mediaId),
          isLoading: false,
        }));
      } else {
        set({ error: 'Medya silinemedi', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Medya silinirken hata oluştu', isLoading: false });
      throw error;
    }
  },
}));
