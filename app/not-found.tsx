import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Decorative */}
        <div className="mb-8 flex justify-center">
          <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto">
            {/* Ground line */}
            <line x1="20" y1="140" x2="180" y2="140" stroke="#E5DDD0" strokeWidth="2" strokeLinecap="round" />
            {/* Saddle stand */}
            <rect x="90" y="110" width="20" height="30" rx="4" fill="#E5DDD0" />
            {/* Saddle body */}
            <path d="M60 90 C60 72 80 62 100 62 C120 62 140 72 140 90 L135 90 C133 76 118 70 100 70 C82 70 67 76 65 90 Z" fill="#C4A862" />
            <path d="M65 90 L65 100 C65 104 67 106 70 106 L82 106 C82 106 86 101 100 101 C114 101 118 106 118 106 L130 106 C133 106 135 104 135 100 L135 90 Z" fill="#C4A862" />
            <circle cx="73" cy="90" r="5" fill="#1C3557" opacity="0.7" />
            <circle cx="127" cy="90" r="5" fill="#1C3557" opacity="0.7" />
            {/* 404 text */}
            <text x="100" y="40" textAnchor="middle" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="#1C3557">404</text>
          </svg>
        </div>

        <h1 className="font-serif text-4xl font-bold text-primary-500 mb-4">
          This saddle has wandered off
        </h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary gap-2">
            <Home size={18} />
            Back to Home
          </Link>
          <Link href="/products" className="btn-secondary gap-2">
            <ArrowLeft size={18} />
            Browse Saddles
          </Link>
        </div>
      </div>
    </div>
  );
}
