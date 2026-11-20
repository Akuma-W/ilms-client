export interface MeetingSession {
  id: string;
  title: string;
  description?: string | null;
  roomName: string;
  startTime: string;
  endTime?: string | null;
  isLive: boolean;
  isGraded: boolean;
  recordingUrl?: string | null;
  classId: string;
  attendanceCount?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface MeetingAttendance {
  id: string;
  sessionId: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  identityCode?: string | null;
  avatarUrl?: string | null;
  joinedAt: string;
  durationMinutes?: number | null;
}

export interface MeetingTokenResponse {
  token: string;
  serverUrl: string;
  roomName: string;
  session: MeetingSession;
}

export interface CreateMeetingInput {
  title: string;
  description?: string;
  startTime: string;
  notifyStudents?: boolean;
  language?: 'vi' | 'en';
  isGraded?: boolean;
  recurringWeeks?: number;
}

export interface UpdateMeetingInput {
  title?: string;
  description?: string;
  startTime?: string;
  isGraded?: boolean;
}

export interface CloseMeetingInput {
  recordingUrl?: string;
  forceCloseRoom?: boolean;
}
