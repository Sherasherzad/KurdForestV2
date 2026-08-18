'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Search, ShieldCheck, FolderKanban } from 'lucide-react';
import LocaleSwitcher from '@/components/LocaleSwitcher';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'KurdForest';

  const handleBack = () => {
    if (pathname === '/') return;
    router.back();
  };

  const handleSearch = () => {
    router.push('/search');
  };

  const isHome = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-800/50 backdrop-blur-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between gap-2 h-16 sm:h-18">
          <button
            onClick={handleBack}
            className={`p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 button-press ${
              isHome ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isHome}
            data-testid="button-back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <div className="flex-1 text-center px-2">
            <h1 className="text-sm sm:text-base text-white font-semibold truncate" data-testid="text-header-title">
              {title || siteName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <Link href="/categories" className="hidden rounded-xl border border-white/10 bg-white/5 p-2 text-gray-200 sm:inline-flex" aria-label="Categories">
              <FolderKanban className="h-4 w-4" />
            </Link>
            <Link href="/admin" className="hidden rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-2 text-yellow-300 sm:inline-flex" aria-label="Admin">
              <ShieldCheck className="h-4 w-4" />
            </Link>
            <button
              onClick={handleSearch}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 button-press"
              data-testid="button-search"
              aria-label="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
