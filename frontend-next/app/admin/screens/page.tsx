'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Screen } from '@/types';
import { Button, Modal, Input, Loading } from '@/components/ui';

export default function ScreensPage() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screen | null>(null);
  const [formData, setFormData] = useState({
    ScreenName: '',
    Location: '',
    StudioID: '',
  });

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    setIsLoading(true);
    try {
      const response = await api.request<Screen[]>('/screens');
      if (response.success && response.data) {
        setScreens(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch screens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingScreen) {
        await api.request(`/screens/${editingScreen.ScreenID}`, 'PUT', formData);
      } else {
        await api.request('/screens', 'POST', formData);
      }
      setIsModalOpen(false);
      setEditingScreen(null);
      resetForm();
      fetchScreens();
    } catch (error) {
      console.error('Failed to save screen:', error);
    }
  };

  const handleDelete = async (screenId: number) => {
    if (!confirm('Bu ekranı silmek istediğinize emin misiniz?')) return;
    try {
      await api.request(`/screens/${screenId}`, 'DELETE');
      fetchScreens();
    } catch (error) {
      console.error('Failed to delete screen:', error);
    }
  };

  const handleEdit = (screen: Screen) => {
    setEditingScreen(screen);
    setFormData({
      ScreenName: screen.ScreenName,
      Location: screen.Location || '',
      StudioID: screen.StudioID.toString(),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      ScreenName: '',
      Location: '',
      StudioID: '',
    });
  };

  if (isLoading) {
    return <Loading text="Ekranlar yükleniyor..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ekranlar</h1>
          <p className="text-gray-600 mt-2">Display ekranlarını yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          + Yeni Ekran
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map((screen) => (
          <div
            key={screen.ScreenID}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-3xl text-white">🖥️</span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  screen.IsActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {screen.IsActive ? 'Aktif' : 'Pasif'}
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {screen.ScreenName}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Lokasyon:</span>
                <span>{screen.Location || 'Belirtilmemiş'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Stüdyo ID:</span>
                <span>{screen.StudioID}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleEdit(screen)}
                className="flex-1"
              >
                Düzenle
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(screen.ScreenID)}
                className="flex-1"
              >
                Sil
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href={`/display/${screen.ScreenID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
              >
                <span>Display Ekranını Aç</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {screens.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Henüz ekran eklenmemiş</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingScreen(null); }}
        title={editingScreen ? 'Ekran Düzenle' : 'Yeni Ekran Ekle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ekran Adı"
            value={formData.ScreenName}
            onChange={(e) => setFormData({ ...formData, ScreenName: e.target.value })}
            fullWidth
            required
          />

          <Input
            label="Lokasyon"
            value={formData.Location}
            onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
            fullWidth
            placeholder="Örn: Ana Salon, Giriş Holü"
          />

          <Input
            label="Stüdyo ID"
            type="number"
            value={formData.StudioID}
            onChange={(e) => setFormData({ ...formData, StudioID: e.target.value })}
            fullWidth
            required
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setIsModalOpen(false); setEditingScreen(null); }}
            >
              İptal
            </Button>
            <Button type="submit">
              {editingScreen ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
