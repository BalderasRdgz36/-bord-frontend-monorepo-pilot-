import { useState } from 'react';

import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import type { Translations } from '@/i18n';
import type { FormApiData } from '@/types/address-verification.types';

import { ErrorMessage } from '@/components/shared/FormPrimitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyDocument } from '@/services/address-verification.service';

interface Props {
  token: string;
  texts: Translations;
  onVerified: (form: FormApiData) => void;
}

/**
 * Candado del formulario: el empleado debe ingresar su documento para abrirlo.
 * La validación es server-side; solo si el documento coincide el backend
 * devuelve los datos y se desbloquea el formulario.
 */
export function DocumentGate({ token, texts, onVerified }: Props) {
  const [document, setDocument] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canSubmit = document.trim().length > 0 && !submitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setHasError(false);

    try {
      const result = await verifyDocument(token, document.trim());
      if (result.valid && result.form) {
        onVerified(result.form);
        return;
      }
      setHasError(true);
    } catch {
      toast.error(texts.eApiError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full rounded-[22px] border border-border/70 bg-surface p-8 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-primary/15 mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mt-4">{texts.gateTitle}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{texts.gateSubtitle}</p>

        <div className="mt-6 text-left">
          <label htmlFor="document" className="text-sm">
            {texts.gateDocLabel}
          </label>
          <Input
            id="document"
            value={document}
            onChange={(event) => {
              setDocument(event.target.value);
              if (hasError) setHasError(false);
            }}
            className="mt-2 h-11 rounded-xl bg-surface-strong border-border/70"
            autoFocus
          />
          <ErrorMessage message={hasError ? texts.gateError : undefined} />
        </div>

        <Button
          type="submit"
          aria-disabled={!canSubmit}
          className={[
            'mt-4 w-full rounded-full bg-primary text-primary-foreground px-6 transition-all',
            canSubmit ? 'hover:bg-primary/90' : 'opacity-50 cursor-not-allowed pointer-events-none',
          ].join(' ')}
        >
          {submitting ? `${texts.gateButton}…` : texts.gateButton}
        </Button>
      </form>
    </div>
  );
}
