import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getCitiesByCountryCode } from '@/services/address-verification.service';

/**
 * Carga las ciudades del país de residencia elegido. Solo dispara la consulta
 * cuando hay un código de país; muestra un toast si la petición externa falla.
 */
export function useCities(countryCode: string, eApiError: string) {
  const {
    data: citiesData,
    error: citiesError,
    isFetching: isFetchingCities,
  } = useQuery({
    queryKey: ['cities', countryCode],
    queryFn: () => getCitiesByCountryCode(countryCode),
    enabled: !!countryCode,
  });

  useEffect(() => {
    if (citiesError) toast.error(eApiError);
  }, [citiesError, eApiError]);

  return { citiesData, isFetchingCities };
}
