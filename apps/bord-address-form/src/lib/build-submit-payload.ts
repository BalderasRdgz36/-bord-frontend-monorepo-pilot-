import type { SubmitPayload } from '@/types/address-verification.types';
import type { Form } from '@/types/form.types';
import type { PhoneRule } from '@/types/reference-data.types';

import { GoogleMapsChoice } from '@/constants/form.constants';

interface BuildSubmitPayloadParams {
  form: Form;
  address: string;
  mapsUrl: string;
  allPhones: PhoneRule[];
}

/**
 * Construye el payload que espera el backend a partir del estado del formulario.
 * Función pura: no toca estado de React ni hace efectos secundarios.
 */
export function buildSubmitPayload({
  form,
  address,
  mapsUrl,
  allPhones,
}: BuildSubmitPayloadParams): SubmitPayload {
  const finalMapsLink =
    form.googleMapsChoice === GoogleMapsChoice.MISMATCH && form.userProvidedGoogleMapsLink
      ? form.userProvidedGoogleMapsLink
      : mapsUrl || undefined;

  const receiverPhoneCountryCode = form.authorizedReceiverPhoneCountry
    ? String(
        allPhones.find((phone) => phone.country === form.authorizedReceiverPhoneCountry)
          ?.country_code ?? '',
      )
    : '';

  return {
    address,
    cityId: form.cityId ?? 0,
    countryCode: form.residenceCountryCode || undefined,
    postalCode: form.postalCode || undefined,
    instructions: form.indications || undefined,
    googleMapsLink: finalMapsLink,
    deliveryPreference: {
      timePreference: form.deliveryTimePreference,
      leaveAtReception: form.leaveAtReceptionAuthorized,
    },
    authorizedReceiver: form.thirdPartyDeliveryAuthorized
      ? {
          firstName: form.authorizedReceiverFirstName,
          lastName: form.authorizedReceiverLastName,
          document: form.authorizedReceiverDocumentRaw,
          phoneNumber: form.authorizedReceiverPhoneNumber,
          phoneCountryCode: receiverPhoneCountryCode,
        }
      : undefined,
  };
}
