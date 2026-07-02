import { CheckCircle2, ExternalLink } from 'lucide-react';

import type { Translations } from '@/i18n';
import type { Form } from '@/types/form.types';

import { Row } from '@/components/shared/FormPrimitives';

interface SuccessScreenProps {
  form: Form;
  address: string;
  mapsUrl: string;
  whatsappDigits: string;
  texts: Translations;
}

export function SuccessScreen({
  form,
  address,
  mapsUrl,
  whatsappDigits,
  texts,
}: SuccessScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="max-w-lg w-full rounded-[22px] border border-border/70 bg-surface p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mt-4">
          {texts.successHi}, {form.firstName}!
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">{texts.successBody}</p>
        <div className="text-left mt-6 space-y-1.5 text-sm bg-surface-strong rounded-xl p-4 border border-border/70">
          <Row label={texts.sucEmail} value={form.workEmail} />
          <Row
            label={texts.sumWhatsapp}
            value={
              form.noWhatsapp ? texts.noHasWhatsapp : whatsappDigits ? `+${whatsappDigits}` : '—'
            }
          />
          {form.documentTypeSelected && (
            <Row label={form.documentTypeSelected} value={form.documentNumber} />
          )}
          <Row label={texts.sumAddress} value={address} />
          {mapsUrl && (
            <a
              className="text-primary inline-flex items-center gap-1 text-xs break-all hover:text-primary/80 transition-colors"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {texts.seeMaps} <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <a
            href="https://bord.co"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            bord.co
          </a>
          <a
            href="https://instagram.com/bord.co"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com/company/bord-co"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
