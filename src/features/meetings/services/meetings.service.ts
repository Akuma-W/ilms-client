import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  CloseMeetingInput,
  CreateMeetingInput,
  MeetingAttendance,
  MeetingSession,
  MeetingTokenResponse,
  UpdateMeetingInput,
} from '@/types/meeting';

export const meetingsService = {
  // Retrieves list of virtual meeting sessions for a classroom
  async getClassMeetings(classId: string): Promise<MeetingSession[]> {
    try {
      const res = await clientApiClient<MeetingSession[]>(`/classes/${classId}/meetings`);
      if (res.success && res.data) {
        return Array.isArray(res.data) ? res.data : Object.values(res.data);
      }
    } catch {
      // Fallback
    }
    return [];
  },

  // Retrieves single meeting session details
  async getMeetingById(meetingId: string): Promise<MeetingSession | null> {
    try {
      const res = await clientApiClient<MeetingSession>(`/meetings/${meetingId}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  // Creates a new online meeting session and optionally broadcasts email notification
  async createMeeting(classId: string, input: CreateMeetingInput): Promise<MeetingSession> {
    const res = await clientApiClient<MeetingSession>(`/classes/${classId}/meetings`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Không thể tạo buổi họp trực tuyến');
    }
    return res.data;
  },

  // Updates scheduled meeting session details before it goes live
  async updateMeeting(meetingId: string, input: UpdateMeetingInput): Promise<MeetingSession> {
    const res = await clientApiClient<MeetingSession>(`/meetings/${meetingId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Không thể cập nhật buổi họp trực tuyến');
    }
    return res.data;
  },

  // Requests LiveKit access token and logs student attendance
  async joinMeeting(meetingId: string): Promise<MeetingTokenResponse> {
    const res = await clientApiClient<MeetingTokenResponse>(`/meetings/${meetingId}/join`, {
      method: 'POST',
    });
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Không thể tham gia phòng họp');
    }
    return res.data;
  },

  // Closes an active meeting session with optional video recording link
  async closeMeeting(meetingId: string, input?: CloseMeetingInput): Promise<MeetingSession> {
    const res = await clientApiClient<MeetingSession>(`/meetings/${meetingId}/close`, {
      method: 'PATCH',
      body: JSON.stringify(input || {}),
    });
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Không thể kết thúc buổi họp');
    }
    return res.data;
  },

  // Permanently deletes a scheduled or concluded meeting session
  async deleteMeeting(meetingId: string): Promise<boolean> {
    const res = await clientApiClient<{ success: boolean; message: string }>(
      `/meetings/${meetingId}`,
      {
        method: 'DELETE',
      },
    );
    if (!res.success) {
      throw new Error(res.message || 'Không thể xóa buổi họp');
    }
    return true;
  },

  // Retrieves attendance logs for a specific meeting session
  async getAttendances(meetingId: string): Promise<MeetingAttendance[]> {
    try {
      const res = await clientApiClient<MeetingAttendance[]>(`/meetings/${meetingId}/attendances`);
      if (res.success && res.data) {
        return Array.isArray(res.data) ? res.data : Object.values(res.data);
      }
    } catch {
      // Fallback
    }
    return [];
  },
};
