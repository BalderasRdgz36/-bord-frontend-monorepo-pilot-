import { Skeleton } from '@/components/ui/skeleton';

/**
 * Placeholder de carga del formulario. Reproduce la estructura real (pills,
 * tarjeta y campos) para evitar saltos de layout cuando llega la data.
 */
export function FormSkeleton() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <header className="border-b border-border/60">
        <div className="max-w-[880px] mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </header>

      <main className="max-w-[880px] mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex gap-2 overflow-hidden pb-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-32 shrink-0 rounded-full" />
          ))}
        </div>

        <div className="mt-4 rounded-[22px] border border-border/70 bg-surface p-5 md:p-8">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/60">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
