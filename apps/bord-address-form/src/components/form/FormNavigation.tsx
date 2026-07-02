import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { Translations } from '@/i18n';

import { Button } from '@/components/ui/button';

interface Props {
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  texts: Translations;
}

/** Controles de navegación inferiores: atrás, siguiente y enviar. */
export function FormNavigation({
  isFirstStep,
  isLastStep,
  canProceed,
  submitting,
  onBack,
  onNext,
  onSubmit,
  texts,
}: Props) {
  const primaryEnabled = isLastStep ? canProceed && !submitting : canProceed;
  const primaryClasses = [
    'rounded-full bg-primary text-primary-foreground px-6 transition-all',
    primaryEnabled ? 'hover:bg-primary/90' : 'opacity-50 cursor-not-allowed pointer-events-none',
  ].join(' ');

  return (
    <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/60">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep}
        className="rounded-full border-border/70 bg-transparent text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> {texts.back}
      </Button>
      {isLastStep ? (
        <Button
          onClick={primaryEnabled ? onSubmit : undefined}
          aria-disabled={!primaryEnabled}
          className={primaryClasses}
        >
          {submitting ? texts.submitting : texts.submit}
        </Button>
      ) : (
        <Button
          onClick={primaryEnabled ? onNext : undefined}
          aria-disabled={!primaryEnabled}
          className={primaryClasses}
        >
          {texts.next} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
