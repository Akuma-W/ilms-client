// 'use server';

// import { apiClient } from '@/lib/api/api-client';
// import { CreateTopicPayload, Topic } from '@/types';

// export const topicsService = {
//   // 1. Get all topics for a class
//   async getTopics(classId: string) {
//     const result = await apiClient<Topic[]>(`/topics/classes/${classId}`);
    
//     if (!result.success || !result.data) {
//       return [];
//     }

//     return result.data;
//   },

//   // 2. Create a new topic under a class
//   async createTopic(classId: string, payload: CreateTopicPayload) {
//     const result = await apiClient<Topic>(`/topics/classes/${classId}`, {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     });

//     return result;
//   },

//   // 3. Update topic title/description
//   async updateTopic(id: string, payload: CreateTopicPayload) {
//     const result = await apiClient<Topic>(`/topics/${id}`, {
//       method: 'PATCH',
//       body: JSON.stringify(payload),
//     });

//     return result;
//   },

//   // 4. Delete topic
//   async deleteTopic(id: string) {
//     const result = await apiClient<{ message: string }>(`/topics/${id}`, {
//       method: 'DELETE',
//     });

//     return result;
//   },
// };
