import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getCountries } from '@/services/address-verification.service';

export function useCountries(enabled: boolean, eApiError: string) {
  const { data: countriesData, error: countriesError } = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries(),
    enabled,
  });

  useEffect(() => {
    if (countriesError) toast.error(eApiError);
  }, [countriesError, eApiError]);

  return { countriesData };
}
