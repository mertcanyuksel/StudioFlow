'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Loading } from '@/components/ui';

interface DashboardStats {
  totalLessons: number;
  totalInstructors: number;
  totalMedia: number;
  totalScreens: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lessons, instructors, media, screens] = await Promise.all([
          api.request('/lessons'),
          api.request('/instructors'),
          api.request('/media'),
          api.request('/screens'),
        ]);

        setStats({
          totalLessons: lessons.data?.length || 0,
          totalInstructors: instructors.data?.length || 0,
          totalMedia: media.data?.length || 0,
          totalScreens: screens.data?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <Loading text="İstatistikler yükleniyor..." />;
  }

  const statCards = [
    { label: 'Toplam Ders', value: stats?.totalLessons || 0, icon: '🏋️', color: 'blue' },
    { label: 'Eğitmenler', value: stats?.totalInstructors || 0, icon: '👨‍🏫', color: 'green' },
    { label: 'Medya Dosyaları', value: stats?.totalMedia || 0, icon: '📁', color: 'purple' },
    { label: 'Ekranlar', value: stats?.totalScreens || 0, icon: '🖥️', color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Studio Display yönetim paneline hoş geldiniz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`p-6 rounded-lg border-2 ${colorClasses[card.color as keyof typeof colorClasses]}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{card.icon}</span>
              <span className="text-3xl font-bold">{card.value}</span>
            </div>
            <p className="text-sm font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/schedule"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold">Haftalık Program</div>
            <div className="text-sm text-gray-600">Ekran programlarını düzenle</div>
          </a>
          <a
            href="/admin/lessons"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">🏋️</div>
            <div className="font-semibold">Dersler</div>
            <div className="text-sm text-gray-600">Ders programlarını yönet</div>
          </a>
          <a
            href="/admin/contents"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">📁</div>
            <div className="font-semibold">İçerikler</div>
            <div className="text-sm text-gray-600">Medya dosyalarını yönet</div>
          </a>
        </div>
      </div>
    </div>
  );
}
