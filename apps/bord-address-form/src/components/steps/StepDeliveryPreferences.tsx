import type { Translations } from '@/i18n';
import type { Form, FormErrors } from '@/types/form.types';
import type { PhoneRule } from '@/types/reference-data.types';

import { Section } from '@/components/shared/FormPrimitives';
import { AuthorizedReceiverFields } from '@/components/steps/AuthorizedReceiverFields';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DeliveryTimePreference } from '@/constants/form.constants';

interface Props {
  form: Form;
  updateField: <FieldKey extends keyof Form>(key: FieldKey, value: Form[FieldKey]) => void;
  phoneCountries: PhoneRule[];
  errors: FormErrors;
  texts: Translations;
}

export function StepDeliveryPreferences({
  form,
  updateField,
  phoneCountries,
  errors,
  texts,
}: Props) {
  const timeOptions: { value: DeliveryTimePreference; label: string }[] = [
    { value: DeliveryTimePreference.AM, label: texts.am },
    { value: DeliveryTimePreference.PM, label: texts.pm },
    { value: DeliveryTimePreference.NONE, label: texts.noPref },
  ];

  return (
    <Section title={texts.step2Title} subtitle={texts.step2Sub}>
      <div className="space-y-6">
        <div>
          <Label className="text-sm">{texts.timeSlot}</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {timeOptions.map(({ value, label }) => {
              const active = form.deliveryTimePreference === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField('deliveryTimePreference', value)}
                  className={[
                    'rounded-full px-5 py-2 text-sm font-medium transition-all border cursor-pointer select-none active:scale-[0.97]',
                    active
                      ? 'bg-primary text-primary-foreground border-transparent hover:bg-primary/90'
                      : 'bg-surface-strong text-foreground border-border/70 hover:border-border hover:bg-border/20',
                  ].join(' ')}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">{texts.timeHelp}</p>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={form.thirdPartyDeliveryAuthorized}
              onCheckedChange={(isChecked) =>
                updateField('thirdPartyDeliveryAuthorized', isChecked === true)
              }
            />
            <span className="text-sm">{texts.thirdParty}</span>
          </label>

          {form.thirdPartyDeliveryAuthorized && (
            <AuthorizedReceiverFields
              form={form}
              updateField={updateField}
              phoneCountries={phoneCountries}
              errors={errors}
              texts={texts}
            />
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={form.leaveAtReceptionAuthorized}
              onCheckedChange={(isChecked) =>
                updateField('leaveAtReceptionAuthorized', isChecked === true)
              }
            />
            <span className="text-sm">{texts.reception}</span>
          </label>
        </div>
      </div>
    </Section>
  );
}
