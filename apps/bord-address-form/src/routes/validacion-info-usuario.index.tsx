import { useMemo, useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';

import type { Lang } from '@/i18n';
import type { FormApiData } from '@/types/address-verification.types';
import type { CountryRule, PhoneRule, DocumentType } from '@/types/reference-data.types';

import { DocumentGate } from '@/components/form/DocumentGate';
import { FormCompletedScreen } from '@/components/form/FormCompletedScreen';
import { FormHeader } from '@/components/form/FormHeader';
import { FormNavigation } from '@/components/form/FormNavigation';
import { FormSkeleton } from '@/components/form/FormSkeleton';
import { FormStepper } from '@/components/form/FormStepper';
import { StepAddress } from '@/components/steps/StepAddress';
import { StepDeliveryPreferences } from '@/components/steps/StepDeliveryPreferences';
import { StepPersonalInfo } from '@/components/steps/StepPersonalInfo';
import { StepReview } from '@/components/steps/StepReview';
import { SuccessScreen } from '@/components/SuccessScreen';
import { FormStatus, FormStep, TOTAL_STEPS } from '@/constants/form.constants';
import { useCities } from '@/hooks/useCities';
import { useCountries } from '@/hooks/useCountries';
import { useFormData } from '@/hooks/useFormData';
import { useFormState } from '@/hooks/useFormState';
import { useFormValidation } from '@/hooks/useFormValidation';
import { DICT } from '@/i18n';
import { buildSubmitPayload } from '@/lib/build-submit-payload';
import {
  buildAddressText,
  buildDocumentOptions,
  buildWhatsAppNumber,
  googleMapsLink,
} from '@/lib/form-helpers';
import { submitFormToApi } from '@/services/address-verification.service';

export const Route = createFileRoute('/validacion-info-usuario/')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) ?? '',
  }),
  component: FormPage,
});

function FormPage() {
  const { token } = Route.useSearch();

  const [lang, setLang] = useState<Lang>('es');
  const [step, setStep] = useState<FormStep>(FormStep.PERSONAL_INFO);
  const [finalConfirmed, setFinalConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Datos personales del empleado: llegan solo tras validar el documento.
  const [verifiedData, setVerifiedData] = useState<FormApiData | null>(null);

  const texts = DICT[lang];

  const { data, formStatus, isLoading } = useFormData(token, texts.eApiError);
  const { countriesData } = useCountries(!!verifiedData, texts.eApiError);

  const allPhones: PhoneRule[] = useMemo(
    () => (data?.phones as PhoneRule[] | undefined) ?? [],
    [data],
  );
  const allDocs: DocumentType[] = useMemo(
    () => (data?.docs as DocumentType[] | undefined) ?? [],
    [data],
  );

  const { form, setForm, updateField, onCountryChange, onPhoneCountryChange, onDocTypeChange } =
    useFormState(verifiedData ?? undefined, countriesData, data, allDocs);

  const { citiesData, isFetchingCities } = useCities(form.residenceCountryCode, texts.eApiError);

  const rule: CountryRule | undefined = useMemo(
    () =>
      (data?.rules as CountryRule[] | undefined)?.find(
        (countryRule) => countryRule.country === form.residenceCountry,
      ),
    [data, form.residenceCountry],
  );

  const selectedPhone: PhoneRule | undefined = useMemo(
    () => allPhones.find((phone) => phone.country === form.phoneCountrySelected),
    [allPhones, form.phoneCountrySelected],
  );

  const whatsappDigits = useMemo(() => {
    if (form.noWhatsapp || !selectedPhone || !form.phoneLocal) return '';
    return buildWhatsAppNumber(selectedPhone.country, selectedPhone.country_code, form.phoneLocal);
  }, [form.noWhatsapp, selectedPhone, form.phoneLocal]);

  const address = useMemo(
    () =>
      form.residenceCountry
        ? buildAddressText({
            country: form.residenceCountry,
            street: form.street,
            streetNumber: form.streetNumber,
            apartment: form.apartment,
            neighborhood: form.neighborhood,
            city: form.city,
            postalCode: form.postalCode,
          })
        : '',
    [form],
  );

  const mapsUrl = address ? googleMapsLink(address) : '';

  const docOptions = useMemo(() => buildDocumentOptions(allDocs), [allDocs]);

  const countries = useMemo(
    () => countriesData?.map((country) => country.name) ?? [],
    [countriesData],
  );

  const phoneCountries = useMemo(
    () =>
      allPhones
        .slice()
        .sort((firstPhone, secondPhone) => firstPhone.country.localeCompare(secondPhone.country)),
    [allPhones],
  );

  const { errors, setErrors, validateStep, isStepComplete } = useFormValidation(
    form,
    finalConfirmed,
    selectedPhone,
    rule,
    texts,
  );

  const handleSubmit = async () => {
    if (!validateStep(FormStep.REVIEW)) return;
    setSubmitting(true);

    const payload = buildSubmitPayload({ form, address, mapsUrl, allPhones });

    try {
      await submitFormToApi(token, payload);
    } catch {
      toast.error(texts.eApiError);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const goNext = () => {
    if (validateStep(step)) setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  if (submitted)
    return (
      <SuccessScreen
        form={form}
        address={address}
        mapsUrl={mapsUrl}
        whatsappDigits={whatsappDigits}
        texts={texts}
      />
    );

  if (isLoading) return <FormSkeleton />;

  // Seguridad: un formulario ya completado (o expirado) no se puede volver a llenar.
  if (formStatus?.status === FormStatus.COMPLETED || formStatus?.status === FormStatus.EXPIRED)
    return <FormCompletedScreen texts={texts} />;

  // Candado: hasta no validar el documento no se muestra el formulario.
  if (!verifiedData)
    return <DocumentGate token={token} texts={texts} onVerified={setVerifiedData} />;

  return (
    <div className="min-h-screen bg-background">
      <FormHeader lang={lang} setLang={setLang} texts={texts} />

      <main className="max-w-[880px] mx-auto px-4 md:px-6 py-8 md:py-10">
        <FormStepper pills={texts.pills} activeStep={step} />

        <div className="mt-4 rounded-[22px] border border-border/70 bg-surface p-5 md:p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]">
          {step === FormStep.PERSONAL_INFO && (
            <StepPersonalInfo
              form={form}
              updateField={updateField}
              onCountryChange={onCountryChange}
              onPhoneCountryChange={onPhoneCountryChange}
              onDocTypeChange={onDocTypeChange}
              countries={countries}
              phoneCountries={phoneCountries}
              docOptions={docOptions}
              selectedPhone={selectedPhone}
              rule={rule}
              errors={errors}
              texts={texts}
            />
          )}

          {step === FormStep.ADDRESS && rule && (
            <StepAddress
              form={form}
              updateField={updateField}
              setForm={setForm}
              rule={rule}
              citiesData={citiesData}
              isFetchingCities={isFetchingCities}
              errors={errors}
              texts={texts}
            />
          )}

          {step === FormStep.DELIVERY_PREFERENCES && (
            <StepDeliveryPreferences
              form={form}
              updateField={updateField}
              phoneCountries={phoneCountries}
              errors={errors}
              texts={texts}
            />
          )}

          {step === FormStep.REVIEW && (
            <StepReview
              form={form}
              updateField={updateField}
              address={address}
              mapsUrl={mapsUrl}
              whatsappDigits={whatsappDigits}
              allPhones={allPhones}
              finalConfirmed={finalConfirmed}
              setFinalConfirmed={setFinalConfirmed}
              errors={errors}
              texts={texts}
            />
          )}

          <FormNavigation
            isFirstStep={step === FormStep.PERSONAL_INFO}
            isLastStep={step === TOTAL_STEPS - 1}
            canProceed={isStepComplete(step)}
            submitting={submitting}
            onBack={goBack}
            onNext={goNext}
            onSubmit={handleSubmit}
            texts={texts}
          />
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">{texts.poweredBy}</p>
      </main>
    </div>
  );
}
