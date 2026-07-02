import { useState } from 'react';

import type { Translations } from '@/i18n';
import type { Form, FormErrors } from '@/types/form.types';
import type { CountryRule, PhoneRule } from '@/types/reference-data.types';

import { FormStep, GoogleMapsChoice, isDocumentRequired } from '@/constants/form.constants';
import { onlyDigits, isValidDocument } from '@/lib/form-helpers';

function isValidMapsUrl(mapsUrl: string): boolean {
  if (!mapsUrl) return false;
  try {
    const url = new URL(mapsUrl.trim());
    return (
      /(^|\.)google\./i.test(url.hostname) ||
      url.hostname === 'goo.gl' ||
      url.hostname === 'maps.app.goo.gl'
    );
  } catch {
    return false;
  }
}

export function useFormValidation(
  form: Form,
  finalConfirmed: boolean,
  selectedPhone: PhoneRule | undefined,
  rule: CountryRule | undefined,
  texts: Translations,
) {
  const [errors, setErrors] = useState<FormErrors>({});

  function validateStep(step: FormStep): boolean {
    const stepErrors: FormErrors = {};

    if (step === FormStep.PERSONAL_INFO) {
      if (!form.residenceCountry) stepErrors.residenceCountry = texts.eCountry;
      if (!form.firstName.trim()) stepErrors.firstName = texts.eRequired;
      if (!form.lastName.trim()) stepErrors.lastName = texts.eRequired;
      if (!/^\S+@\S+\.\S+$/.test(form.workEmail)) stepErrors.workEmail = texts.eEmail;

      // El teléfono SIEMPRE es obligatorio (incluso si marca "No tengo WhatsApp").
      if (!form.phoneCountrySelected) stepErrors.phoneCountrySelected = texts.ePhoneCountry;
      if (!form.phoneLocal.trim()) stepErrors.phoneLocal = texts.eRequired;
      else if (selectedPhone) {
        const localDigits = onlyDigits(form.phoneLocal);
        const expectedDigits = selectedPhone.digits;
        if (expectedDigits && Math.abs(localDigits.length - expectedDigits) > 2)
          stepErrors.phoneLocal = texts.eDigits(expectedDigits, selectedPhone.country);
      }

      if (isDocumentRequired(form.residenceCountry)) {
        if (!form.documentTypeSelected) stepErrors.documentTypeSelected = texts.eRequired;
        if (!form.documentNumber.trim()) stepErrors.documentNumber = texts.eRequired;
        else if (
          form.documentCountrySelected &&
          !isValidDocument(form.documentCountrySelected, form.documentNumber)
        )
          stepErrors.documentNumber = texts.eDocFormat;
      }
    }

    if (step === FormStep.ADDRESS) {
      // Mismos campos obligatorios para todos los países; el código postal es opcional.
      if (!form.city.trim()) stepErrors.city = texts.eRequired;
      if (!form.neighborhood.trim()) stepErrors.neighborhood = texts.eRequired;
      if (!form.street.trim()) stepErrors.street = texts.eRequired;
      if (!form.streetNumber.trim()) stepErrors.streetNumber = texts.eRequired;
    }

    if (step === FormStep.DELIVERY_PREFERENCES) {
      if (form.thirdPartyDeliveryAuthorized) {
        if (!form.authorizedReceiverFirstName.trim())
          stepErrors.authorizedReceiverFirstName = texts.eRequired;
        if (!form.authorizedReceiverLastName.trim())
          stepErrors.authorizedReceiverLastName = texts.eRequired;
        if (isDocumentRequired(form.residenceCountry) && !form.authorizedReceiverDocumentRaw.trim())
          stepErrors.authorizedReceiverDocumentRaw = texts.eRequired;
        if (!form.authorizedReceiverPhoneCountry)
          stepErrors.authorizedReceiverPhoneCountry = texts.ePhoneCountry;
        if (!form.authorizedReceiverPhoneNumber.trim())
          stepErrors.authorizedReceiverPhoneNumber = texts.eRequired;
      }
    }

    if (step === FormStep.REVIEW) {
      if (!form.googleMapsChoice) stepErrors.googleMapsChoice = texts.eMapsChoice;
      if (
        form.googleMapsChoice === GoogleMapsChoice.MISMATCH &&
        !isValidMapsUrl(form.userProvidedGoogleMapsLink)
      )
        stepErrors.userProvidedGoogleMapsLink = texts.eMapsLink;
      if (!finalConfirmed) stepErrors.final = texts.eFinalCheck;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }

  function isStepComplete(step: FormStep): boolean {
    if (step === FormStep.PERSONAL_INFO) {
      if (!form.residenceCountry) return false;
      if (!rule) return false;
      if (!form.firstName.trim()) return false;
      if (!form.lastName.trim()) return false;
      if (!form.workEmail.trim()) return false;
      if (!form.phoneCountrySelected) return false;
      if (!form.phoneLocal.trim()) return false;
      if (isDocumentRequired(form.residenceCountry)) {
        if (!form.documentTypeSelected) return false;
        if (!form.documentNumber.trim()) return false;
      }
      return true;
    }
    if (step === FormStep.ADDRESS) {
      if (!rule) return false;
      if (!form.city.trim()) return false;
      if (!form.neighborhood.trim()) return false;
      if (!form.street.trim()) return false;
      if (!form.streetNumber.trim()) return false;
      return true;
    }
    if (step === FormStep.DELIVERY_PREFERENCES) {
      if (form.thirdPartyDeliveryAuthorized) {
        if (!form.authorizedReceiverFirstName.trim()) return false;
        if (!form.authorizedReceiverLastName.trim()) return false;
        if (isDocumentRequired(form.residenceCountry) && !form.authorizedReceiverDocumentRaw.trim())
          return false;
        if (!form.authorizedReceiverPhoneCountry) return false;
        if (!form.authorizedReceiverPhoneNumber.trim()) return false;
      }
      return true;
    }
    if (step === FormStep.REVIEW) {
      if (!form.googleMapsChoice) return false;
      if (!finalConfirmed) return false;
      return true;
    }
    return true;
  }

  return { errors, setErrors, validateStep, isStepComplete };
}
