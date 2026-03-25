// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.replace('/login');
//     }
//   }, [user, loading, router]);

//   if (loading) return null;

//   return children;
// }
