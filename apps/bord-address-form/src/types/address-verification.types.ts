export interface CountryApiData {
  id: number;
  name: string;
  code: string;
  phoneCode: string | null;
}

export interface FormApiData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  existingAddress: unknown | null;
}

import type { DeliveryTimePreference, FormStatus } from '@/constants/form.constants';

// Respuesta mínima del GET por token: solo el estado, sin datos personales.
export interface FormStatusResponse {
  status: FormStatus;
}

// Respuesta de validar el documento. Solo trae los datos si el documento coincide.
export interface VerifyDocumentResponse {
  valid: boolean;
  form: FormApiData | null;
}

export interface SubmitPayload {
  address: string;
  cityId: number;
  countryCode?: string;
  postalCode?: string;
  instructions?: string;
  googleMapsLink?: string;
  deliveryPreference: {
    timePreference: DeliveryTimePreference;
    leaveAtReception: boolean;
  };
  authorizedReceiver?: {
    firstName: string;
    lastName: string;
    document: string;
    phoneNumber: string;
    phoneCountryCode: string;
  };
}
