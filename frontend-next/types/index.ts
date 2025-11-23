// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Media Types
export interface Media {
  MediaID: number;
  MediaType: 'video' | 'image';
  Title: string;
  MediaPath: string;
  Duration: number | null;
  Thumbnail: string;
  IsActive: boolean;
  CreatedAt: string;
}

// Schedule Override Types
export interface ScheduleOverride {
  OverrideID: number;
  StudioID: number;
  MediaID: number;
  StartDateTime: string;
  EndDateTime: string;
  IsActive: boolean;
  CreatedAt: string;
  MediaTitle?: string;
  MediaType?: 'video' | 'image';
  MediaPath?: string;
  MediaDuration?: number;
}

// Lesson Types
export interface Lesson {
  LessonID: number;
  LessonName: string;
  StudioID: number;
  InstructorID: number;
  StartTime: string;
  EndTime: string;
  DayOfWeek: number;
  IsActive: boolean;
  InstructorName?: string;
  StudioName?: string;
  Description?: string;
  QRCodeData?: string;
  QRCodeImagePath?: string;
  InstructorPhoto?: string;
}

// Studio Types
export interface Studio {
  StudioID: number;
  StudioName: string;
  IsActive: boolean;
}

// Instructor Types
export interface Instructor {
  InstructorID: number;
  FullName: string;
  Email: string;
  Phone: string;
  IsActive: boolean;
}

// Content Types
export interface Content {
  ContentID: number;
  ContentType: 'video' | 'image' | 'html';
  Title: string;
  FilePath: string;
  Duration: number | null;
  IsActive: boolean;
}

// Screen Types
export interface Screen {
  ScreenID: number;
  ScreenName: string;
  StudioID: number;
  Location: string;
  IsActive: boolean;
}

// Bulk Override Pattern
export interface BulkOverridePattern {
  mediaId: number;
  studioId: number;
  type: 'interval' | 'sametime_alldays';
  startDate: string;
  endDate: string;
  duration: number;
  timeStart?: string;
  timeEnd?: string;
  intervalMinutes?: number;
}

// Auth Types
export interface User {
  UserID: number;
  Username: string;
  FullName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}
