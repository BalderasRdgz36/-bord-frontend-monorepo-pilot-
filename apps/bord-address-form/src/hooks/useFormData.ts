import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getReferenceData } from '@/lib/reference-data';
import { getFormStatus } from '@/services/address-verification.service';

export function useFormData(token: string, eApiError: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['ref'],
    queryFn: () => getReferenceData(),
  });

  const { data: formStatus, error: formError } = useQuery({
    queryKey: ['form-status', token],
    queryFn: () => getFormStatus(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (formError) toast.error(eApiError);
  }, [formError, eApiError]);

  return { data, formStatus, isLoading };
}
