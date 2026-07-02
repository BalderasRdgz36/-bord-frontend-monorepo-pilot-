import type {
  CountryApiData,
  FormStatusResponse,
  SubmitPayload,
  VerifyDocumentResponse,
} from '@/types/address-verification.types';

import { apiGet, apiPost } from '@/services/api';

const SUBSCRIPTION_API = import.meta.env.VITE_SUBSCRIPTION as string;
const ORGANIZATION_API = import.meta.env.VITE_ORGANIZATION as string;

/**
 * Obtiene el listado de países habilitados desde subscription-ms.
 */
export const getCountries = (): Promise<CountryApiData[]> =>
  apiGet<CountryApiData[]>(`${SUBSCRIPTION_API}/country`);

/**
 * Obtiene las ciudades de un país desde organization-ms.
 * @param countryCode - Código ISO del país (ej. "CO"). Si viene vacío resuelve [].
 */
export const getCitiesByCountryCode = (
  countryCode: string,
): Promise<{ id: number; name: string }[]> => {
  if (!countryCode) return Promise.resolve([]);
  return apiGet<{ id: number; name: string }[]>(
    `${ORGANIZATION_API}/city/by-country/${encodeURIComponent(countryCode)}`,
  );
};

/**
 * Obtiene solo el estado del formulario por token (sin datos personales).
 * Sirve para decidir si mostrar la pantalla de "ya completado" o pedir el documento.
 * @param token - Token UUID del formulario incluido en el link de WhatsApp.
 */
export const getFormStatus = (token: string): Promise<FormStatusResponse> =>
  apiGet<FormStatusResponse>(`${SUBSCRIPTION_API}/address-verification/form/${token}`);

/**
 * Valida el documento del empleado contra el del backend. Solo si coincide
 * devuelve los datos del formulario para poder llenarlo.
 * @param token - Token UUID del formulario.
 * @param personalId - Documento que ingresa el empleado.
 */
export const verifyDocument = (
  token: string,
  personalId: string,
): Promise<VerifyDocumentResponse> =>
  apiPost<VerifyDocumentResponse>(
    `${SUBSCRIPTION_API}/address-verification/form/${token}/verify-document`,
    { personalId },
  );

/**
 * Envía la dirección verificada y las preferencias de entrega al backend.
 * @param token - Token UUID del formulario.
 * @param payload - Dirección, preferencias y receptor autorizado.
 */
export const submitFormToApi = (token: string, payload: SubmitPayload): Promise<void> =>
  apiPost<void>(`${SUBSCRIPTION_API}/address-verification/form/${token}/submit`, payload);
