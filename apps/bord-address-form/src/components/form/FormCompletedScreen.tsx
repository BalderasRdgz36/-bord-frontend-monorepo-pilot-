import { CheckCircle2 } from 'lucide-react';

import type { Translations } from '@/i18n';

interface Props {
  texts: Translations;
}

/** Pantalla terminal: el formulario ya fue completado y no se puede volver a llenar. */
export function FormCompletedScreen({ texts }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="max-w-lg w-full rounded-[22px] border border-border/70 bg-surface p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mt-4">{texts.completedTitle}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{texts.completedBody}</p>
      </div>
    </div>
  );
}
