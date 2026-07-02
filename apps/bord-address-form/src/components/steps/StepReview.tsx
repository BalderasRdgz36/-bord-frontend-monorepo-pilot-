import { ExternalLink } from 'lucide-react';

import type { Translations } from '@/i18n';
import type { Form, FormErrors } from '@/types/form.types';
import type { PhoneRule } from '@/types/reference-data.types';

import { Section, Field, Row, Summary, ErrorMessage } from '@/components/shared/FormPrimitives';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { DeliveryTimePreference, GoogleMapsChoice } from '@/constants/form.constants';
import { GOOGLE_MAPS_PLACEHOLDER } from '@/constants/placeholders';
import { cleanDocument } from '@/lib/form-helpers';

interface Props {
  form: Form;
  updateField: <FieldKey extends keyof Form>(key: FieldKey, value: Form[FieldKey]) => void;
  address: string;
  mapsUrl: string;
  whatsappDigits: string;
  allPhones: PhoneRule[];
  finalConfirmed: boolean;
  setFinalConfirmed: (value: boolean) => void;
  errors: FormErrors;
  texts: Translations;
}

export function StepReview({
  form,
  updateField,
  address,
  mapsUrl,
  whatsappDigits,
  allPhones,
  finalConfirmed,
  setFinalConfirmed,
  errors,
  texts,
}: Props) {
  return (
    <Section title={texts.step3Title} subtitle={texts.step3Sub}>
      <div className="space-y-3">
        <Summary title={texts.sumPersonal}>
          <Row label={texts.sumName} value={`${form.firstName} ${form.lastName}`.trim()} />
          <Row label={texts.sumMail} value={form.workEmail} />
          <Row
            label={texts.sumWhatsapp}
            value={
              form.noWhatsapp ? texts.noHasWhatsapp : whatsappDigits ? `+${whatsappDigits}` : '—'
            }
          />
          {form.documentTypeSelected && (
            <Row
              label={form.documentTypeSelected}
              value={
                form.documentNumber
                  ? form.documentCountrySelected
                    ? cleanDocument(form.documentCountrySelected, form.documentNumber)
                    : form.documentNumber
                  : '—'
              }
            />
          )}
        </Summary>

        <Summary title={texts.sumAddress}>
          <Row label={texts.countryLabel} value={form.residenceCountry} />
          <Row label={texts.sumAddress} value={address} />
        </Summary>

        <div className="rounded-xl border border-border/70 bg-surface-strong p-4 space-y-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {texts.googleMaps}
          </div>
          <p className="text-sm break-words">{address || '—'}</p>
          {mapsUrl && (
            <a
              className="inline-flex items-center gap-1 text-primary text-sm break-all hover:text-primary/80 transition-colors"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {texts.openMaps} <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          )}
          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-3 cursor-pointer text-sm">
              <input
                type="radio"
                name="maps_choice"
                className="mt-1 accent-[hsl(var(--primary))]"
                checked={form.googleMapsChoice === GoogleMapsChoice.MATCH}
                onChange={() => updateField('googleMapsChoice', GoogleMapsChoice.MATCH)}
              />
              <span>{texts.mapsMatch}</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer text-sm">
              <input
                type="radio"
                name="maps_choice"
                className="mt-1 accent-[hsl(var(--primary))]"
                checked={form.googleMapsChoice === GoogleMapsChoice.MISMATCH}
                onChange={() => updateField('googleMapsChoice', GoogleMapsChoice.MISMATCH)}
              />
              <span>{texts.mapsMismatch}</span>
            </label>
          </div>
          {form.googleMapsChoice === GoogleMapsChoice.MISMATCH && (
            <Field
              label={texts.pasteMaps}
              required
              error={errors.userProvidedGoogleMapsLink}
              full
              texts={texts}
            >
              <Input
                value={form.userProvidedGoogleMapsLink}
                onChange={(event) => updateField('userProvidedGoogleMapsLink', event.target.value)}
                placeholder={GOOGLE_MAPS_PLACEHOLDER}
              />
            </Field>
          )}
          <ErrorMessage message={errors.googleMapsChoice} />
        </div>

        <Summary title={texts.sumDelivery}>
          <Row
            label={texts.sumSlot}
            value={
              form.deliveryTimePreference === DeliveryTimePreference.AM
                ? texts.am
                : form.deliveryTimePreference === DeliveryTimePreference.PM
                  ? texts.pm
                  : texts.noPref
            }
          />
          <Row
            label={texts.sumThirdParty}
            value={form.thirdPartyDeliveryAuthorized ? texts.yes : texts.no}
          />
          {form.thirdPartyDeliveryAuthorized && (
            <>
              <Row
                label={texts.sumReceiverName}
                value={`${form.authorizedReceiverFirstName} ${form.authorizedReceiverLastName}`.trim()}
              />
              {form.authorizedReceiverDocumentRaw && (
                <Row label={texts.sumReceiverDoc} value={form.authorizedReceiverDocumentRaw} />
              )}
              {form.authorizedReceiverPhoneNumber && (
                <Row
                  label={texts.sumReceiverPhone}
                  value={[
                    allPhones.find((phone) => phone.country === form.authorizedReceiverPhoneCountry)
                      ?.country_code
                      ? `+${String(
                          allPhones.find(
                            (phone) => phone.country === form.authorizedReceiverPhoneCountry,
                          )!.country_code,
                        )}`
                      : '',
                    form.authorizedReceiverPhoneNumber,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              )}
            </>
          )}
          <Row
            label={texts.sumReception}
            value={form.leaveAtReceptionAuthorized ? texts.yes : texts.no}
          />
        </Summary>

        <label className="flex items-start gap-3 cursor-pointer pt-2">
          <Checkbox
            checked={finalConfirmed}
            onCheckedChange={(isChecked) => setFinalConfirmed(isChecked === true)}
          />
          <span className="text-sm">
            {texts.confirmFinal}{' '}
            <a
              href="https://bord.co"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline hover:text-primary/80 transition-colors"
            >
              {texts.terms}
            </a>
            .
          </span>
        </label>
        <ErrorMessage message={errors.final} />
      </div>
      <ErrorMessage message={errors.submit} />
    </Section>
  );
}
