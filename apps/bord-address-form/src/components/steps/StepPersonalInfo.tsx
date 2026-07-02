import { ExternalLink } from 'lucide-react';

import type { Translations } from '@/i18n';
import type { Form, FormErrors } from '@/types/form.types';
import type { CountryRule, DocumentOption, PhoneRule } from '@/types/reference-data.types';

import { Section, Grid, Field } from '@/components/shared/FormPrimitives';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EMPTY_OPTION_VALUE, isDocumentRequired } from '@/constants/form.constants';
import { whatsappLink, buildWhatsAppNumber, buildDocumentOptionKey } from '@/lib/form-helpers';

interface Props {
  form: Form;
  updateField: <FieldKey extends keyof Form>(key: FieldKey, value: Form[FieldKey]) => void;
  onCountryChange: (country: string) => void;
  onPhoneCountryChange: (country: string) => void;
  onDocTypeChange: (key: string, docOptions: DocumentOption[]) => void;
  countries: string[];
  phoneCountries: PhoneRule[];
  docOptions: DocumentOption[];
  selectedPhone: PhoneRule | undefined;
  rule: CountryRule | undefined;
  errors: FormErrors;
  texts: Translations;
}

export function StepPersonalInfo({
  form,
  updateField,
  onCountryChange,
  onPhoneCountryChange,
  onDocTypeChange,
  countries,
  phoneCountries,
  docOptions,
  selectedPhone,
  rule,
  errors,
  texts,
}: Props) {
  const displayDigits =
    selectedPhone && form.phoneLocal
      ? buildWhatsAppNumber(selectedPhone.country, selectedPhone.country_code, form.phoneLocal)
      : '';

  const selectedDocumentKey = form.documentTypeSelected
    ? buildDocumentOptionKey(form.documentCountrySelected, form.documentTypeSelected)
    : '';
  const docPlaceholder =
    docOptions.find((option) => option.key === selectedDocumentKey)?.placeholder ?? '';

  return (
    <Section title={texts.step0Title} subtitle={texts.step0Sub}>
      <Grid>
        <Field label={texts.country} required error={errors.residenceCountry} full texts={texts}>
          <Select value={form.residenceCountry} onValueChange={onCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder={texts.countryPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {countries.length > 0 ? (
                countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={EMPTY_OPTION_VALUE} disabled>
                  {texts.noData}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </Field>

        {rule && (
          <>
            <Field label={texts.firstName} required error={errors.firstName} texts={texts}>
              <Input
                value={form.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                placeholder={texts.firstNameEx}
              />
            </Field>
            <Field label={texts.lastName} required error={errors.lastName} texts={texts}>
              <Input
                value={form.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                placeholder={texts.lastNameEx}
              />
            </Field>

            <Field label={texts.workEmail} required error={errors.workEmail} full texts={texts}>
              <Input
                type="email"
                value={form.workEmail}
                onChange={(event) => updateField('workEmail', event.target.value)}
                placeholder={texts.workEmailEx}
              />
            </Field>

            <Field
              label={texts.docType}
              required={isDocumentRequired(form.residenceCountry)}
              error={errors.documentTypeSelected}
              texts={texts}
            >
              <Select
                value={selectedDocumentKey}
                onValueChange={(key) => onDocTypeChange(key, docOptions)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={texts.docTypePh} />
                </SelectTrigger>
                <SelectContent>
                  {docOptions.length > 0 ? (
                    docOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={EMPTY_OPTION_VALUE} disabled>
                      {texts.noData}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </Field>
            <Field
              label={texts.docNumber}
              required={isDocumentRequired(form.residenceCountry)}
              optional={!isDocumentRequired(form.residenceCountry)}
              error={errors.documentNumber}
              help={docPlaceholder ? `${texts.example} ${docPlaceholder}` : undefined}
              texts={texts}
            >
              <Input
                value={form.documentNumber}
                onChange={(event) => updateField('documentNumber', event.target.value)}
                placeholder={docPlaceholder || ''}
              />
            </Field>

            <Field
              label={texts.phoneCountry}
              required
              error={errors.phoneCountrySelected}
              texts={texts}
            >
              <Select value={form.phoneCountrySelected} onValueChange={onPhoneCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder={texts.phoneCountryPh} />
                </SelectTrigger>
                <SelectContent>
                  {phoneCountries.length > 0 ? (
                    phoneCountries.map((phone) => (
                      <SelectItem key={phone.country} value={phone.country}>
                        {phone.country} (+{phone.country_code})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={EMPTY_OPTION_VALUE} disabled>
                      {texts.noData}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </Field>
            <Field
              label={texts.phoneNumber}
              required
              error={errors.phoneLocal}
              help={
                selectedPhone
                  ? `${texts.phoneLocalFormat} ${selectedPhone.local_format_example}`
                  : undefined
              }
              texts={texts}
            >
              <Input
                value={form.phoneLocal}
                onChange={(event) => updateField('phoneLocal', event.target.value)}
                placeholder={selectedPhone?.local_format_example ?? texts.phoneNumberPh}
              />
            </Field>

            <div className="md:col-span-2 -mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={form.noWhatsapp}
                  onCheckedChange={(isChecked) => updateField('noWhatsapp', isChecked === true)}
                />
                <span>{texts.noWhatsapp}</span>
              </label>
            </div>

            <div
              className={`md:col-span-2 transition-opacity duration-200 ${form.noWhatsapp ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <div className="rounded-lg border border-border/70 p-3 bg-surface-strong text-xs flex items-center justify-between gap-3">
                <div>
                  <span className="text-muted-foreground">{texts.whatsappNormalized} </span>
                  <span className="font-mono">{displayDigits ? `+${displayDigits}` : '—'}</span>
                </div>
                {displayDigits && (
                  <a
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    href={whatsappLink(displayDigits)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {texts.test} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </Grid>
    </Section>
  );
}
