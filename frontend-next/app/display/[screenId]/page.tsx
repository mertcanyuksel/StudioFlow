'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Lesson } from '@/types';
import { io, Socket } from 'socket.io-client';

interface DisplayContent {
  type: 'lesson' | 'next-lesson' | 'media' | 'idle';
  lesson?: Lesson;
  nextLesson?: Lesson;
  mediaUrl?: string;
  mediaType?: 'video' | 'image';
  title?: string;
  endDateTime?: string;
}

export default function DisplayScreen() {
  const params = useParams();
  const screenId = params.screenId as string;

  const [content, setContent] = useState<DisplayContent>({ type: 'idle' });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Her 30 saniyede bir içeriği kontrol et (override başladığında veya ders değişiminde)
    const scheduleCheck = setInterval(() => {
      fetchCurrentContent();
    }, 30000); // 30 saniye

    return () => clearInterval(scheduleCheck);
  }, [screenId]);

  useEffect(() => {
    // Calculate countdown when content changes or every second
    if (content.type === 'lesson' && content.lesson?.EndTime) {
      const calculateCountdown = () => {
        const now = new Date();
        const [hours, minutes] = content.lesson.EndTime.split(':').map(Number);
        const endTime = new Date();
        endTime.setHours(hours, minutes, 0, 0);

        const diff = endTime.getTime() - now.getTime();

        if (diff <= 0) {
          setCountdown('00:00');
          // Ders bitti, yeni içeriği çek
          fetchCurrentContent();
          return;
        }

        const totalMinutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        setCountdown(`${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      };

      calculateCountdown();
      const interval = setInterval(calculateCountdown, 1000);

      return () => clearInterval(interval);
    } else {
      setCountdown('');
    }
  }, [content, currentTime]);

  useEffect(() => {
    if (!screenId) return;

    // Socket.IO bağlantısı
    const socket = io('http://localhost:4141', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected');
      socket.emit('register-screen', screenId);
    });

    socket.on('content-update', (data: DisplayContent) => {
      console.log('Content update received:', data);
      setContent(data);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    socketRef.current = socket;

    // İlk içeriği yükle
    fetchCurrentContent();

    return () => {
      socket.disconnect();
    };
  }, [screenId]);

  useEffect(() => {
    // Video bittiğinde sonraki içeriği kontrol et
    if (videoRef.current && content.type === 'media' && content.mediaType === 'video') {
      const video = videoRef.current;
      const handleEnded = () => {
        fetchCurrentContent();
      };
      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, [content]);

  useEffect(() => {
    // Media (image veya override) bittiğinde kontrol et
    if (content.type === 'media' && content.endDateTime) {
      const checkMediaEnd = () => {
        const now = new Date();
        const endTime = new Date(content.endDateTime!);

        if (now >= endTime) {
          fetchCurrentContent();
        }
      };

      // Her saniye kontrol et
      const interval = setInterval(checkMediaEnd, 1000);
      return () => clearInterval(interval);
    }
  }, [content]);

  const fetchCurrentContent = async () => {
    try {
      const response = await api.request(`/display/${screenId}/current`);
      if (response.success && response.data) {
        setContent(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch current content:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Top Bar */}
      <div className="bg-black/30 backdrop-blur-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{formatTime(currentTime)}</div>
          <div className="text-lg opacity-80">{formatDate(currentTime)}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">Studio Display</div>
          <div className="text-sm opacity-70">Screen #{screenId}</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-8 py-12">
        {content.type === 'lesson' && content.lesson && (
          <div className="space-y-8">
            {/* Current Lesson - Large Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-10 shadow-2xl">
              <div className="flex items-start justify-between gap-8 mb-6">
                <div className="flex-1">
                  <div className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-90">Şu Anda</div>
                  <h1 className="text-6xl font-bold mb-4">{content.lesson.LessonName}</h1>
                  {content.lesson.Description && (
                    <p className="text-xl opacity-90 mb-4">{content.lesson.Description}</p>
                  )}
                  <div className="flex items-center gap-6 text-2xl">
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>{content.lesson.StartTime} - {content.lesson.EndTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  {/* Countdown Timer */}
                  {countdown && (
                    <div className="flex-shrink-0">
                      <div className="bg-white/25 backdrop-blur-sm rounded-xl border-3 border-white/40 shadow-xl w-64 h-[208px] flex items-center justify-center">
                        <div className="text-center px-6">
                          <div className="text-base font-bold uppercase tracking-wider mb-3 opacity-95">Kalan Süre</div>
                          <div className="text-6xl font-bold font-mono tracking-tight">{countdown}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QR Code Section */}
                  {content.lesson.QRCodeImagePath && (
                    <div className="flex-shrink-0">
                      <div className="bg-white p-4 rounded-xl shadow-lg">
                        <img
                          src={`http://localhost:4141/uploads${content.lesson.QRCodeImagePath}`}
                          alt="QR Code"
                          className="w-40 h-40"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <p className="text-center text-xs text-gray-700 mt-2 font-medium">
                          Dersi Kaydet
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {content.lesson.InstructorName && (
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/20">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                    👨‍🏫
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Eğitmen</div>
                    <div className="text-2xl font-semibold">{content.lesson.InstructorName}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Next Lesson - Smaller Card */}
            {content.nextLesson && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div>
                      <div className="text-sm opacity-70 uppercase tracking-wide">Sonra</div>
                      <div className="text-2xl font-bold">{content.nextLesson.LessonName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">{content.nextLesson.StartTime}</div>
                    {content.nextLesson.InstructorName && (
                      <div className="text-sm opacity-70">{content.nextLesson.InstructorName}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {content.type === 'next-lesson' && content.nextLesson && (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-12 shadow-2xl max-w-4xl w-full text-center">
              <div className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-90">Yakında</div>
              <h1 className="text-7xl font-bold mb-6">{content.nextLesson.LessonName}</h1>
              {content.nextLesson.Description && (
                <p className="text-2xl opacity-90 mb-6">{content.nextLesson.Description}</p>
              )}
              <div className="text-3xl mb-8">
                {content.nextLesson.StartTime} - {content.nextLesson.EndTime}
              </div>
              {content.nextLesson.InstructorName && (
                <div className="flex items-center justify-center gap-4 text-2xl">
                  <span className="text-4xl">👨‍🏫</span>
                  <span>{content.nextLesson.InstructorName}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {content.type === 'media' && (
          <div className="flex items-center justify-center min-h-[80vh]">
            {content.mediaType === 'video' ? (
              <video
                ref={videoRef}
                src={`http://localhost:4141${content.mediaUrl}`}
                autoPlay
                muted
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
              />
            ) : (
              <img
                src={`http://localhost:4141${content.mediaUrl}`}
                alt={content.title || 'Media'}
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
              />
            )}
          </div>
        )}

        {content.type === 'idle' && (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="text-9xl mb-8">🏋️</div>
              <div className="text-6xl font-bold mb-4">Hoş Geldiniz</div>
              <div className="text-2xl opacity-70">Program yükleniyor...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
