'use client';

import { useEffect, useState } from 'react';
import { useMediaStore } from '@/store/mediaStore';
import { Button, Modal, Input, Loading } from '@/components/ui';

export default function ContentsPage() {
  const { media, isLoading, fetchMedia, addMedia, deleteMedia } = useMediaStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
  });
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFormData({ ...formData, duration: '10' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadProgress(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('title', formData.title);
      if (formData.duration) {
        formDataToSend.append('duration', formData.duration);
      }

      await addMedia(formDataToSend);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to upload media:', error);
      alert('Medya yüklenirken hata oluştu');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDelete = async (mediaId: number) => {
    if (!confirm('Bu medya dosyasını silmek istediğinize emin misiniz?')) return;
    try {
      await deleteMedia(mediaId);
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', duration: '' });
    setSelectedFile(null);
  };

  const filteredMedia = media.filter((item) =>
    item.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && media.length === 0) {
    return <Loading text="Medya dosyaları yükleniyor..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İçerikler</h1>
          <p className="text-gray-600 mt-2">Medya dosyalarını yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          + Yeni Medya Yükle
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="🔍 Medya ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.MediaID}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gray-200 relative">
              {item.MediaType === 'image' ? (
                <img
                  src={`http://localhost:4141${item.MediaPath}`}
                  alt={item.Title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
                  <span className="text-6xl text-white">🎬</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.MediaType === 'video'
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {item.MediaType === 'video' ? 'Video' : 'Fotoğraf'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 truncate">
                {item.Title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {item.Duration ? `${item.Duration}s` : 'Süre: Otomatik'}
              </p>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(item.MediaID)}
                fullWidth
              >
                Sil
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz medya dosyası eklenmemiş'}
          </p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title="Yeni Medya Yükle"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Başlık"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            fullWidth
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosya (Video/Fotoğraf)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Seçili: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {selectedFile?.type.startsWith('image/') && (
            <Input
              label="Süre (saniye)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              fullWidth
              placeholder="Fotoğraf için gösterim süresi"
            />
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              disabled={uploadProgress}
            >
              İptal
            </Button>
            <Button type="submit" disabled={uploadProgress}>
              {uploadProgress ? 'Yükleniyor...' : 'Yükle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
