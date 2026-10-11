// 'use server';

// import { cookies } from 'next/headers';
// import { CLIENT_API_URL } from '@/config';
// import { apiClient } from '@/lib/api/api-client';
// import { CreateMaterialPayload, Material } from '@/types';

// export const materialsService = {
//   // 1. Get all materials for a topic
//   async getMaterials(topicId: string) {
//     const result = await apiClient<Material[]>(`/materials/topics/${topicId}`);
    
//     if (!result.success || !result.data) {
//       return [];
//     }

//     return result.data;
//   },

//   // 2. Create a new material under a topic
//   async createMaterial(topicId: string, payload: CreateMaterialPayload) {
//     const result = await apiClient<Material>(`/materials/topics/${topicId}`, {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     });

//     return result;
//   },

//   // 3. Delete material by ID
//   async deleteMaterial(id: string) {
//     const result = await apiClient<{ message: string }>(`/materials/${id}`, {
//       method: 'DELETE',
//     });

//     return result;
//   },

//   // 4. Upload file to MinIO/Local storage via NestJS Storage endpoint
//   async uploadFile(formData: FormData) {
//     const cookiesStore = await cookies();
//     const accessToken = cookiesStore.get('access_token')?.value;

//     try {
//       const res = await fetch(`${CLIENT_API_URL}/storage/upload?folder=materials`, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           // Note: DO NOT set Content-Type header, fetch will automatically set it with boundary
//         },
//       });

//       if (!res.ok) {
//         const errorRes = await res.json().catch(() => null);
//         return {
//           success: false,
//           message: errorRes?.message || 'File upload failed',
//           data: null,
//         };
//       }

//       const result = await res.json();
//       return {
//         success: true,
//         message: 'Upload successful',
//         data: result, // result will contain { path, url }
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error instanceof Error ? error.message : 'An error occurred during upload',
//         data: null,
//       };
//     }
//   },
// };
