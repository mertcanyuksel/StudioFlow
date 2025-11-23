'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Instructor } from '@/types';
import { Button, Modal, Input, Loading } from '@/components/ui';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [formData, setFormData] = useState({
    InstructorName: '',
    Bio: '',
    PhotoURL: '',
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setIsLoading(true);
    try {
      const response = await api.request<Instructor[]>('/instructors');
      if (response.success && response.data) {
        setInstructors(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInstructor) {
        await api.request(`/instructors/${editingInstructor.InstructorID}`, 'PUT', formData);
      } else {
        await api.request('/instructors', 'POST', formData);
      }
      setIsModalOpen(false);
      setEditingInstructor(null);
      resetForm();
      fetchInstructors();
    } catch (error) {
      console.error('Failed to save instructor:', error);
    }
  };

  const handleDelete = async (instructorId: number) => {
    if (!confirm('Bu eğitmeni silmek istediğinize emin misiniz?')) return;
    try {
      await api.request(`/instructors/${instructorId}`, 'DELETE');
      fetchInstructors();
    } catch (error) {
      console.error('Failed to delete instructor:', error);
    }
  };

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      InstructorName: instructor.InstructorName,
      Bio: instructor.Bio || '',
      PhotoURL: instructor.PhotoURL || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      InstructorName: '',
      Bio: '',
      PhotoURL: '',
    });
  };

  if (isLoading) {
    return <Loading text="Eğitmenler yükleniyor..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eğitmenler</h1>
          <p className="text-gray-600 mt-2">Eğitmen bilgilerini yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          + Yeni Eğitmen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <div
            key={instructor.InstructorID}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              {instructor.PhotoURL ? (
                <img
                  src={instructor.PhotoURL}
                  alt={instructor.InstructorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl text-white">👨‍🏫</span>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {instructor.InstructorName}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {instructor.Bio || 'Biyografi bilgisi yok'}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(instructor)}
                  className="flex-1"
                >
                  Düzenle
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(instructor.InstructorID)}
                  className="flex-1"
                >
                  Sil
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {instructors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Henüz eğitmen eklenmemiş</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingInstructor(null); }}
        title={editingInstructor ? 'Eğitmen Düzenle' : 'Yeni Eğitmen Ekle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Eğitmen Adı"
            value={formData.InstructorName}
            onChange={(e) => setFormData({ ...formData, InstructorName: e.target.value })}
            fullWidth
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biyografi
            </label>
            <textarea
              value={formData.Bio}
              onChange={(e) => setFormData({ ...formData, Bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <Input
            label="Fotoğraf URL"
            value={formData.PhotoURL}
            onChange={(e) => setFormData({ ...formData, PhotoURL: e.target.value })}
            fullWidth
            placeholder="https://example.com/photo.jpg"
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setIsModalOpen(false); setEditingInstructor(null); }}
            >
              İptal
            </Button>
            <Button type="submit">
              {editingInstructor ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
