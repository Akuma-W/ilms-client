import { serverApiClient } from '@/lib/api/server-api-client';
import type { Assignment } from '@/types/assignment';

/**
 * Server-side assignments service for Server Components (SSR).
 * Reads HttpOnly cookies via next/headers and forwards them to the NestJS backend.
 */
export const assignmentsServerService = {
  /**
   * Retrieves assignments list for a class via SSR prefetch.
   */
  async getAssignments(classId: string): Promise<Assignment[]> {
    try {
      const res = await serverApiClient<Assignment[]>(`/assignments/classes/${classId}`, {
        ignoreAuthError: true,
      });
      console.log('res', res.data);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return Array.isArray(res.data) ? res.data : [];
      }
    } catch {
      // Graceful fallback to empty list
    }

    return [];
  },

  /**
   * Retrieves a single assignment by ID via SSR prefetch.
   */
  async getAssignmentById(id: string): Promise<Assignment | null> {
    try {
      const res = await serverApiClient<Assignment>(`/assignments/${id}`, {
        ignoreAuthError: true,
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
    } catch {
      // Graceful fallback to null
    }

    return null;
  },
};
