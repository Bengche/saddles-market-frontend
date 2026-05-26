"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100">
      <div className="flex flex-col items-center gap-6">
        {/* Animated saddle/brand mark */}
        <div className="relative w-20 h-20">
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
              className="animate-[dash_2s_ease-in-out_infinite]"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{ animation: "dashAnim 2s ease-in-out infinite" }}
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
          {/* Spinning ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            viewBox="0 0 64 64"
            fill="none"
            style={{ animationDuration: "1.5s" }}
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

        <div className="text-center">
          <p
            className="font-serif text-lg font-semibold tracking-widest text-primary-500 uppercase"
            style={{ letterSpacing: "0.3em" }}
          >
            Saddles Market
          </p>
          <p className="mt-1 text-sm text-gray-400 tracking-wide">Loading...</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dashAnim {
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
      `}</style>
    </div>
  );
}
