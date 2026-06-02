"use client";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative h-20 w-20" aria-hidden="true">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M32 4 L60 16 L60 38 C60 52 32 60 32 60 C32 60 4 52 4 38 L4 16 Z"
              fill="none"
              stroke="#1C3557"
              strokeWidth="2"
              strokeDasharray="200"
              strokeDashoffset="200"
              className="animate-saddle-dash motion-reduce:animate-none"
            />
            <path
              d="M18 36 C18 29 24 25 32 25 C40 25 46 29 46 36 L44 36 C42 31 38 28 32 28 C26 28 22 31 20 36 Z"
              fill="#C4A862"
              opacity="0.9"
            />
            <path
              d="M20 36 L20 41 C20 43 21 44 22 44 L26 44 C26 44 28 41 32 41 C36 41 38 44 38 44 L42 44 C43 44 44 43 44 41 L44 36 Z"
              fill="#C4A862"
            />
          </svg>
          <svg
            className="absolute inset-0 h-full w-full motion-safe:animate-[spin_1.4s_linear_infinite] motion-reduce:hidden"
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#C4A862"
              strokeWidth="2"
              strokeDasharray="44 132"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <p className="font-serif text-lg font-semibold uppercase tracking-[0.22em] text-primary-500 sm:text-xl">
            Saddles Market
          </p>
          <p className="mt-1 text-sm tracking-wide text-gray-500">
            Preparing your experience...
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes saddle-dash {
          0% {
            stroke-dashoffset: 200;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -200;
          }
        }

        .animate-saddle-dash {
          animation: saddle-dash 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
