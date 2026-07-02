import type { Translations } from '@/i18n';
import type { Form, FormErrors } from '@/types/form.types';
import type { CountryRule } from '@/types/reference-data.types';

import { Section, Grid, Field } from '@/components/shared/FormPrimitives';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  form: Form;
  updateField: <FieldKey extends keyof Form>(key: FieldKey, value: Form[FieldKey]) => void;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  rule: CountryRule;
  citiesData: { id: number; name: string }[] | undefined;
  isFetchingCities: boolean;
  errors: FormErrors;
  texts: Translations;
}

export function StepAddress({
  form,
  updateField,
  setForm,
  rule,
  citiesData,
  isFetchingCities,
  errors,
  texts,
}: Props) {
  return (
    <Section title={texts.step1Title} subtitle={texts.step1Sub}>
      <Grid>
        <Field label={texts.countryLabel} texts={texts}>
          <Input value={form.residenceCountry} readOnly className="bg-muted/40" />
        </Field>

        <Field label={texts.cityLabel} required error={errors.city} texts={texts}>
          {isFetchingCities ? (
            <Skeleton className="h-11 w-full rounded-xl" />
          ) : citiesData?.length ? (
            <Select
              value={form.city}
              onValueChange={(cityName) => {
                const city = citiesData.find((item) => item.name === cityName);
                setForm((previous) => ({ ...previous, city: cityName, cityId: city?.id ?? null }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={texts.cityLabel} />
              </SelectTrigger>
              <SelectContent>
                {citiesData.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={form.city}
              onChange={(event) => updateField('city', event.target.value)}
            />
          )}
        </Field>
        <Field label={rule.neighborhood_label} required error={errors.neighborhood} texts={texts}>
          <Input
            value={form.neighborhood}
            onChange={(event) => updateField('neighborhood', event.target.value)}
          />
        </Field>

        <Field label={texts.postalCodeLabel} optional error={errors.postalCode} texts={texts}>
          <Input
            value={form.postalCode}
            onChange={(event) => updateField('postalCode', event.target.value)}
          />
        </Field>
        <Field label={rule.street_label} required error={errors.street} texts={texts}>
          <Input
            value={form.street}
            onChange={(event) => updateField('street', event.target.value)}
          />
        </Field>

        <Field label={rule.number_label} required error={errors.streetNumber} texts={texts}>
          <Input
            value={form.streetNumber}
            onChange={(event) => updateField('streetNumber', event.target.value)}
          />
        </Field>
        <Field label={rule.apartment_label} optional texts={texts}>
          <Input
            value={form.apartment}
            onChange={(event) => updateField('apartment', event.target.value)}
          />
        </Field>

        <Field label={texts.indicationsLabel} optional full texts={texts}>
          <Textarea
            rows={2}
            value={form.indications}
            onChange={(event) => updateField('indications', event.target.value)}
          />
        </Field>
      </Grid>
    </Section>
  );
}
