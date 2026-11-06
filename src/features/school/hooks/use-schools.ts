import { School } from '@/types/school';
import useSWR from 'swr';
import { schoolService } from '../services/school.service';

export function useSchools() {
  const {
    data = [],
    error,
    isLoading,
  } = useSWR<School[]>(['schools'], () => schoolService.getSchools());

  return {
    schools: data,
    isLoading,
    error,
  };
}
