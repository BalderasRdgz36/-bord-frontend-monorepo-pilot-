import type { Lang, Translations } from '@/i18n';

import { LANGS } from '@/i18n';

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  texts: Translations;
}

/** Encabezado del formulario: marca y selector de idioma. */
export function FormHeader({ lang, setLang, texts }: Props) {
  return (
    <header className="border-b border-border/60">
      <div className="max-w-[880px] mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4">
        <div className="font-semibold tracking-tight text-lg">Bord</div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-xs text-muted-foreground">{texts.headerSub}</div>
          <div
            className="flex items-center gap-1 rounded-full border border-border/60 bg-surface-strong p-1"
            role="group"
            aria-label={texts.headerSub}
          >
            {LANGS.map((language) => {
              const active = language.code === lang;
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => setLang(language.code)}
                  className={[
                    'px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-border/20',
                  ].join(' ')}
                  aria-pressed={active}
                >
                  {language.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
