import type { Translations } from '@/i18n';

import { Label } from '@/components/ui/label';

// ---------- ErrorMessage ----------
export function ErrorMessage({ message }: { message?: string }) {
  return (
    <p
      className={`text-xs mt-1.5 min-h-[1rem] leading-none ${message ? 'text-destructive' : 'invisible'}`}
    >
      {message ?? '​'}
    </p>
  );
}

// ---------- Section ----------
export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ---------- Grid ----------
export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">{children}</div>;
}

// ---------- Field ----------
export function Field({
  label,
  required,
  optional,
  error,
  help,
  full,
  children,
  texts,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  help?: string;
  full?: boolean;
  children: React.ReactNode;
  texts: Translations;
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <Label className="flex items-center gap-1.5 text-sm">
        <span>{label}</span>
        {required && <span className="text-destructive">*</span>}
        {optional && (
          <span className="text-xs text-muted-foreground font-normal">{texts.optional}</span>
        )}
      </Label>
      <div className="mt-2 [&_input]:h-11 [&_input]:rounded-xl [&_input]:bg-surface-strong [&_input]:border-border/70 [&_textarea]:rounded-xl [&_textarea]:bg-surface-strong [&_textarea]:border-border/70 [&_button[role=combobox]]:h-11 [&_button[role=combobox]]:rounded-xl [&_button[role=combobox]]:bg-surface-strong [&_button[role=combobox]]:border-border/70">
        {children}
      </div>
      {help && !error && <p className="text-xs text-muted-foreground mt-1.5">{help}</p>}
      <ErrorMessage message={error} />
    </div>
  );
}

// ---------- Row ----------
export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right break-words max-w-[60%]">{value || '—'}</span>
    </div>
  );
}

// ---------- Summary ----------
export function Summary({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-strong p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      <div className="space-y-1.5 text-sm">{children}</div>
    </div>
  );
}
