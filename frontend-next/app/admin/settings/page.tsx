'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4141/api',
    autoRefresh: true,
    refreshInterval: '30',
    theme: 'light',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600 mt-2">Uygulama ayarlarını yapılandırın</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Genel Ayarlar</h2>

            <div className="space-y-4">
              <Input
                label="API URL"
                value={settings.apiUrl}
                onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
                fullWidth
                placeholder="http://localhost:4141/api"
              />

              <div className="flex items-center justify-between py-3">
                <div>
                  <label className="font-medium text-gray-900">Otomatik Yenileme</label>
                  <p className="text-sm text-gray-600">Ekranları otomatik olarak yenile</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoRefresh: !settings.autoRefresh })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.autoRefresh && (
                <Input
                  label="Yenileme Aralığı (saniye)"
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) => setSettings({ ...settings, refreshInterval: e.target.value })}
                  fullWidth
                  min="5"
                />
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Görünüm</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    settings.theme === 'light'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">☀️</div>
                  <div className="font-medium">Açık Tema</div>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    settings.theme === 'dark'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🌙</div>
                  <div className="font-medium">Koyu Tema</div>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sistem Bilgisi</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Versiyon</span>
                <span className="font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Framework</span>
                <span className="font-medium text-gray-900">Next.js 15</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">React</span>
                <span className="font-medium text-gray-900">19.0.0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Backend</span>
                <span className="font-medium text-gray-900">Express.js</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} fullWidth>
              {isSaved ? '✓ Kaydedildi' : 'Ayarları Kaydet'}
            </Button>
          </div>

          {isSaved && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Ayarlar başarıyla kaydedildi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
