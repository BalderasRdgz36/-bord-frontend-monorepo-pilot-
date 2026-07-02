interface Props {
  pills: readonly string[];
  activeStep: number;
}

/** Indicador de progreso por pasos (pills) del formulario. */
export function FormStepper({ pills, activeStep }: Props) {
  return (
    <ol className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none">
      {pills.map((label, index) => {
        const active = index === activeStep;
        const done = index < activeStep;
        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className={[
              'shrink-0 rounded-full px-4 py-2 text-xs md:text-sm font-medium transition-colors border',
              active
                ? 'bg-primary text-primary-foreground border-transparent'
                : done
                  ? 'bg-surface-strong text-foreground border-border'
                  : 'bg-transparent text-muted-foreground border-border/60',
            ].join(' ')}
          >
            <span className="mr-1.5 opacity-70">{index + 1}.</span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}
