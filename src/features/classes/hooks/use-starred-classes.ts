import { Class } from '@/types/class';
import useSWR from 'swr';
import { enrollmentService } from '../services/enrollment.service';

interface Props {
  initialData?: {
    classes: Class[];
    total: number;
  };
}

export function useStarredClasses({ initialData }: Props = {}) {
  const { data, mutate } = useSWR('starred-classes', () => enrollmentService.getStarredClasses(), {
    fallbackData: initialData,
  });

  return {
    starredClasses: data?.classes || [],
    total: data?.total || 0,
    mutateStar: mutate,
  };
}
