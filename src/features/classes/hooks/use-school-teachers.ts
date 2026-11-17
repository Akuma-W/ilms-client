import useSWR from 'swr';
import { schoolTeachersService } from '../services/school-teachers.service';
import type { SchoolTeacherItem } from '@/types/school';

export function useSchoolTeachers(search?: string) {
  const { data, error, isLoading } = useSWR<SchoolTeacherItem[]>(
    ['school-teachers', search ?? ''],
    () => schoolTeachersService.getSchoolTeachers(search),
    { keepPreviousData: true, dedupingInterval: 10000 },
  );

  return {
    teachers: data ?? [],
    isLoading,
    error,
  };
}
