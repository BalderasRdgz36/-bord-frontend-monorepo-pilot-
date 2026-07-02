import { useState, useEffect } from 'react';

import type { CountryApiData } from '@/types/address-verification.types';
import type { FormApiData } from '@/types/address-verification.types';
import type { Form } from '@/types/form.types';
import type { DocumentOption, DocumentType } from '@/types/reference-data.types';

import { EMPTY } from '@/types/form.types';

type RefData =
  | {
      rules: unknown;
      phones: unknown;
      docs: unknown;
    }
  | undefined;

export function useFormState(
  formApiData: FormApiData | undefined,
  countriesData: CountryApiData[] | undefined,
  refData: RefData,
  allDocs: DocumentType[],
) {
  const [form, setForm] = useState<Form>(EMPTY);

  const updateField = <FieldKey extends keyof Form>(key: FieldKey, value: Form[FieldKey]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const onCountryChange = (country: string) => {
    const countryCode = countriesData?.find((item) => item.name === country)?.code ?? '';
    setForm((previous) => {
      const next: Form = {
        ...previous,
        residenceCountry: country,
        residenceCountryCode: countryCode,
        city: '',
        cityId: null,
      };
      if (!previous.phoneCountryWasManuallyChanged) {
        next.phoneCountrySelected = country;
      }
      if (!previous.documentTypeWasManuallyChanged) {
        const defaultDoc = allDocs.find((document) => document.country === country);
        if (defaultDoc) {
          next.documentCountrySelected = defaultDoc.country;
          next.documentTypeSelected = defaultDoc.document_name;
        }
      }
      return next;
    });
  };

  const onPhoneCountryChange = (country: string) => {
    setForm((previous) => ({
      ...previous,
      phoneCountrySelected: country,
      phoneCountryWasManuallyChanged: true,
    }));
  };

  const onDocTypeChange = (key: string, docOptions: DocumentOption[]) => {
    const option = docOptions.find((item) => item.key === key);
    if (!option) return;
    setForm((previous) => ({
      ...previous,
      documentCountrySelected: option.country,
      documentTypeSelected: option.name,
      documentTypeWasManuallyChanged: true,
    }));
  };

  const syncFormWithApiData = () => {
    if (!formApiData) return;
    setForm((previous) => ({
      ...previous,
      firstName: formApiData.firstName || previous.firstName,
      lastName: formApiData.lastName || previous.lastName,
      workEmail: formApiData.email || previous.workEmail,
      residenceCountryCode: formApiData.countryCode || previous.residenceCountryCode,
      residenceCountry: formApiData.countryCode
        ? (countriesData?.find(
            (country) => country.code.toLowerCase() === formApiData.countryCode.toLowerCase(),
          )?.name ??
          (refData?.rules as Array<{ country: string; country_code?: string }> | undefined)?.find(
            (rule) => rule.country_code?.toLowerCase() === formApiData.countryCode.toLowerCase(),
          )?.country ??
          previous.residenceCountry)
        : previous.residenceCountry,
    }));
  };

  useEffect(() => {
    syncFormWithApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formApiData, refData, countriesData]);

  return { form, setForm, updateField, onCountryChange, onPhoneCountryChange, onDocTypeChange };
}
