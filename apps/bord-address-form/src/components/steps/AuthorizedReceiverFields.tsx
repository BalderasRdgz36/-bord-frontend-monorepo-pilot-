import type { Translations } from '@/i18n';
import type { Form, FormErrors } from '@/types/form.types';
import type { PhoneRule } from '@/types/reference-data.types';

import { Grid, Field } from '@/components/shared/FormPrimitives';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EMPTY_OPTION_VALUE, isDocumentRequired } from '@/constants/form.constants';

interface Props {
  form: Form;
  updateField: <FieldKey extends keyof Form>(key: FieldKey, value: Form[FieldKey]) => void;
  phoneCountries: PhoneRule[];
  errors: FormErrors;
  texts: Translations;
}

/** Datos de la persona autorizada a recibir el paquete. */
export function AuthorizedReceiverFields({
  form,
  updateField,
  phoneCountries,
  errors,
  texts,
}: Props) {
  return (
    <div className="ml-7 rounded-xl border border-border/70 bg-surface-strong p-4">
      <Grid>
        <Field
          label={texts.receiverName}
          required
          error={errors.authorizedReceiverFirstName}
          texts={texts}
        >
          <Input
            value={form.authorizedReceiverFirstName}
            onChange={(event) => updateField('authorizedReceiverFirstName', event.target.value)}
          />
        </Field>
        <Field
          label={texts.receiverLast}
          required
          error={errors.authorizedReceiverLastName}
          texts={texts}
        >
          <Input
            value={form.authorizedReceiverLastName}
            onChange={(event) => updateField('authorizedReceiverLastName', event.target.value)}
          />
        </Field>
        <Field
          label={texts.receiverDoc}
          required={isDocumentRequired(form.residenceCountry)}
          optional={!isDocumentRequired(form.residenceCountry)}
          error={errors.authorizedReceiverDocumentRaw}
          full
          texts={texts}
        >
          <Input
            value={form.authorizedReceiverDocumentRaw}
            onChange={(event) => updateField('authorizedReceiverDocumentRaw', event.target.value)}
          />
        </Field>
        <Field
          label={texts.receiverPhoneCountry}
          required
          error={errors.authorizedReceiverPhoneCountry}
          texts={texts}
        >
          <Select
            value={form.authorizedReceiverPhoneCountry}
            onValueChange={(value) => updateField('authorizedReceiverPhoneCountry', value)}
          >
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
          label={texts.receiverPhoneNumber}
          required
          error={errors.authorizedReceiverPhoneNumber}
          texts={texts}
        >
          <Input
            value={form.authorizedReceiverPhoneNumber}
            onChange={(event) => updateField('authorizedReceiverPhoneNumber', event.target.value)}
            placeholder={texts.phoneNumberPh}
          />
        </Field>
      </Grid>
    </div>
  );
}
