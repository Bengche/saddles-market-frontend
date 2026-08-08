import Spinner from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-cream-100"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Spinner size="lg" className="text-primary-500" />
      <p className="font-serif text-sm font-semibold uppercase tracking-[0.25em] text-primary-400">
        Saddles Market
      </p>
    </div>
  );
}
