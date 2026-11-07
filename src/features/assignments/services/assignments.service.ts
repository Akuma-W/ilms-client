import { clientApiClient } from '@/lib/api/client-api-client';
import { MOCK_ASSIGNMENTS } from '@/mocks/classes/mock-assignments';
import { submissionService } from './submission.service';
import type {
  Assignment,
  CreateAssignmentPayload,
  SubmitAssignmentPayload,
} from '@/types/assignment';
import type { User } from '@/types/user';

// In-memory local state fallback for development preview
let localAssignments: Assignment[] = [...MOCK_ASSIGNMENTS];

export function getLocalAssignments(): Assignment[] {
  return localAssignments;
}

export function setLocalAssignments(newList: Assignment[]): void {
  localAssignments = newList;
}

/**
 * Service handling assignment management, submissions, and grading.
 * Completely encapsulates mock data fallback logic inside the service layer.
 */
export const assignmentsService = {
  /**
   * Returns initial assignments for SSR or fallback without leaking mock imports to components.
   */
  getInitialAssignments(classId: string, initialList: Assignment[] = []): Assignment[] {
    if (Array.isArray(initialList) && initialList.length > 0) {
      return initialList;
    }
    const matched = localAssignments.filter((a) => !classId || a.classId === classId);
    if (matched.length > 0) {
      return matched;
    }
    // Fallback: adapt mock assignments to current classId so UI displays assignments for any class in dev preview
    return localAssignments.map((a) => ({
      ...a,
      classId,
    }));
  },

  /**
   * Retrieves all assignments for a class.
   */
  async getAssignments(classId: string): Promise<Assignment[]> {
    try {
      const res = await clientApiClient<Assignment[]>(`/assignments/classes/${classId}`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
      }
      return this.getInitialAssignments(classId);
    } catch {
      return this.getInitialAssignments(classId);
    }
  },

  /**
   * Retrieves a single assignment by its UUID.
   */
  async getAssignmentById(id: string): Promise<Assignment | null> {
    try {
      const res = await clientApiClient<Assignment>(`/assignments/${id}`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
      const found = localAssignments.find((a) => a.id === id);
      if (found) return found;
      // In dev/mock preview: fallback to first assignment if ID doesn't match mock UUID
      return localAssignments[0] || null;
    } catch {
      const found = localAssignments.find((a) => a.id === id);
      if (found) return found;
      return localAssignments[0] || null;
    }
  },

  /**
   * Creates a new assignment.
   */
  async createAssignment(
    classId: string,
    payload: CreateAssignmentPayload,
  ): Promise<{ success: boolean; data: Assignment; message?: string }> {
    try {
      const res = await clientApiClient<Assignment>(`/assignments/classes/${classId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        localAssignments.unshift(res.data);
        return { success: true, data: res.data };
      }
    } catch {
      // Fallback local mutation
    }

    const newAssignment: Assignment = {
      id: `a1000000-${Date.now().toString(16).slice(-4)}-4000-8000-${Math.floor(Math.random() * 1e12)}`,
      title: payload.title,
      description: payload.description || null,
      dueAt: payload.dueAt || null,
      maxScore: payload.maxScore ?? 10,
      classId,
      topicId: payload.topicId || null,
      createdBy: 'teacher-admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      materials: (payload.materials || []).map((m, idx) => ({
        id: `am-${Date.now()}-${idx}`,
        fileUrl: m.fileUrl,
        fileType: m.fileType,
        fileName: m.fileName,
        fileSize: m.fileSize,
        assignmentId: '',
      })),
      submissions: [],
      submissionCount: 0,
      totalStudents: 15,
    };

    localAssignments = [newAssignment, ...localAssignments];
    return { success: true, data: newAssignment, message: 'Giao bài tập thành công!' };
  },

  /**
   * Updates an existing assignment.
   */
  async updateAssignment(
    id: string,
    payload: Partial<CreateAssignmentPayload>,
  ): Promise<{ success: boolean; data: Assignment; message?: string }> {
    try {
      const res = await clientApiClient<Assignment>(`/assignments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        const data = res.data;
        localAssignments = localAssignments.map((a) => (a.id === id ? data : a));
        return { success: true, data };
      }
    } catch {
      // Fallback local mutation
    }

    let updatedAssignment: Assignment | null = null;
    localAssignments = localAssignments.map((a): Assignment => {
      if (a.id === id) {
        const updated: Assignment = {
          ...a,
          title: payload.title ?? a.title,
          description: payload.description !== undefined ? payload.description : a.description,
          dueAt: payload.dueAt !== undefined ? payload.dueAt : a.dueAt,
          maxScore: payload.maxScore ?? a.maxScore,
          topicId: payload.topicId !== undefined ? payload.topicId : a.topicId,
          updatedAt: new Date().toISOString(),
          materials: payload.materials
            ? payload.materials.map((m, idx) => ({
                id: `am-${Date.now()}-${idx}`,
                fileUrl: m.fileUrl,
                fileType: m.fileType,
                fileName: m.fileName,
                fileSize: m.fileSize,
                assignmentId: id,
              }))
            : a.materials,
        };
        updatedAssignment = updated;
        return updated;
      }
      return a;
    });

    if (updatedAssignment) {
      return { success: true, data: updatedAssignment, message: 'Cập nhật bài tập thành công!' };
    }
    return { success: false, data: {} as Assignment, message: 'Không tìm thấy bài tập để sửa.' };
  },

  /**
   * Deletes an assignment.
   */
  async deleteAssignment(id: string): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/assignments/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback local mutation
    }
    localAssignments = localAssignments.filter((a) => a.id !== id);
    return { success: true, message: 'Xóa bài tập thành công!' };
  },

  /**
   * Submits student work for an assignment (delegated to submissionService).
   */
  submitAssignment(
    assignmentId: string,
    payload: SubmitAssignmentPayload,
    currentUser?: User | null,
  ) {
    return submissionService.submitAssignment(assignmentId, payload, currentUser);
  },
};
