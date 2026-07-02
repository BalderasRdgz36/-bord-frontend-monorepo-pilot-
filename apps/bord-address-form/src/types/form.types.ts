import { DeliveryTimePreference, GoogleMapsChoice } from '@/constants/form.constants';

export type Form = {
  firstName: string;
  lastName: string;
  workEmail: string;

  noWhatsapp: boolean;
  phoneCountrySelected: string;
  phoneCountryWasManuallyChanged: boolean;
  phoneLocal: string;

  documentTypeSelected: string;
  documentCountrySelected: string;
  documentTypeWasManuallyChanged: boolean;
  documentNumber: string;

  residenceCountry: string;
  residenceCountryCode: string;
  city: string;
  cityId: number | null;
  neighborhood: string;
  postalCode: string;
  street: string;
  streetNumber: string;
  apartment: string;
  indications: string;

  deliveryTimePreference: DeliveryTimePreference;
  thirdPartyDeliveryAuthorized: boolean;
  leaveAtReceptionAuthorized: boolean;
  authorizedReceiverFirstName: string;
  authorizedReceiverLastName: string;
  authorizedReceiverDocumentRaw: string;
  authorizedReceiverPhoneCountry: string;
  authorizedReceiverPhoneNumber: string;

  googleMapsChoice: GoogleMapsChoice;
  userProvidedGoogleMapsLink: string;
};

export type FormErrorKey = keyof Form | 'final' | 'submit';
export type FormErrors = Partial<Record<FormErrorKey, string>>;

export const EMPTY: Form = {
  firstName: '',
  lastName: '',
  workEmail: '',
  noWhatsapp: false,
  phoneCountrySelected: '',
  phoneCountryWasManuallyChanged: false,
  phoneLocal: '',
  documentTypeSelected: '',
  documentCountrySelected: '',
  documentTypeWasManuallyChanged: false,
  documentNumber: '',
  residenceCountry: '',
  residenceCountryCode: '',
  city: '',
  cityId: null,
  neighborhood: '',
  postalCode: '',
  street: '',
  streetNumber: '',
  apartment: '',
  indications: '',
  deliveryTimePreference: DeliveryTimePreference.NONE,
  thirdPartyDeliveryAuthorized: false,
  leaveAtReceptionAuthorized: false,
  authorizedReceiverFirstName: '',
  authorizedReceiverLastName: '',
  authorizedReceiverDocumentRaw: '',
  authorizedReceiverPhoneCountry: '',
  authorizedReceiverPhoneNumber: '',
  googleMapsChoice: GoogleMapsChoice.NONE,
  userProvidedGoogleMapsLink: '',
};
