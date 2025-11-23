'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Lesson } from '@/types';
import { Button, Modal, Input, Loading } from '@/components/ui';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    LessonName: '',
    StartTime: '',
    EndTime: '',
    DayOfWeek: 'Monday',
    StudioID: '',
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const response = await api.request<Lesson[]>('/lessons');
      if (response.success && response.data) {
        setLessons(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await api.request(`/lessons/${editingLesson.LessonID}`, 'PUT', formData);
      } else {
        await api.request('/lessons', 'POST', formData);
      }
      setIsModalOpen(false);
      setEditingLesson(null);
      resetForm();
      fetchLessons();
    } catch (error) {
      console.error('Failed to save lesson:', error);
    }
  };

  const handleDelete = async (lessonId: number) => {
    if (!confirm('Bu dersi silmek istediğinize emin misiniz?')) return;
    try {
      await api.request(`/lessons/${lessonId}`, 'DELETE');
      fetchLessons();
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      LessonName: lesson.LessonName,
      StartTime: lesson.StartTime,
      EndTime: lesson.EndTime,
      DayOfWeek: lesson.DayOfWeek,
      StudioID: lesson.StudioID.toString(),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      LessonName: '',
      StartTime: '',
      EndTime: '',
      DayOfWeek: 'Monday',
      StudioID: '',
    });
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayTranslations: Record<string, string> = {
    Monday: 'Pazartesi',
    Tuesday: 'Salı',
    Wednesday: 'Çarşamba',
    Thursday: 'Perşembe',
    Friday: 'Cuma',
    Saturday: 'Cumartesi',
    Sunday: 'Pazar',
  };

  if (isLoading) {
    return <Loading text="Dersler yükleniyor..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dersler</h1>
          <p className="text-gray-600 mt-2">Ders programlarını yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          + Yeni Ders
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ders Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gün
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Eğitmen
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lessons.map((lesson) => (
              <tr key={lesson.LessonID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lesson.LessonName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{dayTranslations[lesson.DayOfWeek]}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {lesson.StartTime} - {lesson.EndTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lesson.InstructorName || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.LessonID)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {lessons.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz ders eklenmemiş
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLesson(null); }}
        title={editingLesson ? 'Ders Düzenle' : 'Yeni Ders Ekle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ders Adı"
            value={formData.LessonName}
            onChange={(e) => setFormData({ ...formData, LessonName: e.target.value })}
            fullWidth
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Başlangıç Saati"
              type="time"
              value={formData.StartTime}
              onChange={(e) => setFormData({ ...formData, StartTime: e.target.value })}
              fullWidth
              required
            />
            <Input
              label="Bitiş Saati"
              type="time"
              value={formData.EndTime}
              onChange={(e) => setFormData({ ...formData, EndTime: e.target.value })}
              fullWidth
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gün</label>
            <select
              value={formData.DayOfWeek}
              onChange={(e) => setFormData({ ...formData, DayOfWeek: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {dayTranslations[day]}
                </option>
              ))}
            </select>
          </div>

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
              onClick={() => { setIsModalOpen(false); setEditingLesson(null); }}
            >
              İptal
            </Button>
            <Button type="submit">
              {editingLesson ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
