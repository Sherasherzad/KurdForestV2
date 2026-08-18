export type MediaType = 'movie' | 'tv';
export type MediaSource = 'tmdb' | 'youtube' | 'manual' | 'server';
export type SupportedLanguageCode = 'ku' | 'ar' | 'en';

export interface StreamSource {
  url: string;
  quality: '360p' | '480p' | '720p' | '1080p' | '2160p' | '4K' | string;
  source: string;
}

export interface CatalogMediaItem {
  id: string;
  title: string;
  titleKu?: string;
  titleAr?: string;
  type: MediaType;
  source: MediaSource;
  overview: string;
  overviewKu?: string;
  overviewAr?: string;
  poster?: string | null;
  backdrop?: string | null;
  genres: string[];
  year?: number;
  rating?: number;
  languages: SupportedLanguageCode[];
  youtubeUrl?: string;
  streamUrls: StreamSource[];
  quality: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
}

export const DEFAULT_LANGUAGES: Array<{ code: SupportedLanguageCode; name: string; nativeName: string }> = [
  { code: 'ku', name: 'Kurdish', nativeName: 'کوردی' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

export const DEFAULT_CATEGORIES = ['Action', 'Drama', 'Comedy', 'Crime', 'Fantasy', 'Thriller', 'Animation', 'Documentary', 'Adventure', 'Family'];

export const mockCatalog: CatalogMediaItem[] = [
  normalizeMediaItem({
    id: 'catalog-1',
    title: 'The Silent Horizon',
    titleKu: 'بەرزاییی ڕووناکی',
    titleAr: 'الأفق الصامت',
    type: 'movie',
    source: 'manual',
    overview: 'A young courier chases a signal across the mountains.',
    overviewKu: 'کەسێک بە رووبەرەکەی هەڵدەبژێرێت و هەواڵەکە دەکات بە شوێنەوە.',
    overviewAr: 'سائق شاب يتتبع إشارة عبر الجبال.',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1400&q=80',
    genres: ['Action', 'Drama'],
    year: 2024,
    rating: 8.7,
    languages: ['ku', 'en'],
    quality: '4K',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    streamUrls: [
      { url: 'https://example.com/stream/silent-horizon-1080p.mp4', quality: '1080p', source: 'server-1' },
      { url: 'https://example.com/stream/silent-horizon-4k.mp4', quality: '4K', source: 'server-2' },
    ],
  }),
  normalizeMediaItem({
    id: 'catalog-2',
    title: 'Desert Echo',
    titleKu: 'گۆڕانی دەرەوە',
    titleAr: 'أصداء الصحراء',
    type: 'tv',
    source: 'youtube',
    overview: 'A war reporter uncovers an ancient story beneath the sand.',
    overviewKu: 'گوتاری جەنگەوەکان لە ژێر خۆڵەکی دڵدار دەدۆزێت.',
    overviewAr: 'مراسل حرب يكشف قصة قديمة تحت الرمال.',
    genres: ['Thriller', 'Adventure'],
    year: 2023,
    rating: 8.2,
    languages: ['ar', 'en'],
    quality: '1080p',
    youtubeUrl: 'https://youtu.be/ScMzIvxBSi4',
    streamUrls: [{ url: 'https://example.com/stream/desert-echo-1080p.mp4', quality: '1080p', source: 'youtube' }],
  }),
];

const QUALITY_RANK: Record<string, number> = {
  '360p': 1,
  '480p': 2,
  '720p': 3,
  '1080p': 4,
  '2160p': 5,
  '4K': 6,
};

export function getPreferredQuality(streams: StreamSource[] = []): string {
  if (!streams.length) return '1080p';

  const sorted = [...streams].sort((a, b) => {
    const rankA = QUALITY_RANK[a.quality] ?? 0;
    const rankB = QUALITY_RANK[b.quality] ?? 0;
    return rankB - rankA;
  });

  return sorted[0]?.quality || '1080p';
}

export function normalizeMediaItem(item: Partial<CatalogMediaItem> & { id: string; title: string; type: MediaType; source?: MediaSource; overview: string }): CatalogMediaItem {
  const streamUrls = (item.streamUrls ?? []).map((stream) => ({
    url: stream.url,
    quality: stream.quality,
    source: stream.source,
  }));

  const languages = Array.from(new Set((item.languages ?? ['en']).map((language) => language.toLowerCase() as SupportedLanguageCode))) as SupportedLanguageCode[];

  const quality = item.quality || getPreferredQuality(streamUrls);

  return {
    id: item.id,
    title: item.title,
    titleKu: item.titleKu || item.title,
    titleAr: item.titleAr || item.title,
    type: item.type,
    source: item.source || 'tmdb',
    overview: item.overview,
    overviewKu: item.overviewKu || item.overview,
    overviewAr: item.overviewAr || item.overview,
    poster: item.poster ?? null,
    backdrop: item.backdrop ?? null,
    genres: item.genres ?? [],
    year: item.year ?? new Date().getFullYear(),
    rating: item.rating ?? 0,
    languages: languages.length ? languages : ['en'],
    youtubeUrl: item.youtubeUrl,
    streamUrls,
    quality,
    category: item.category || item.genres?.[0] || 'Drama',
    tags: item.tags ?? [],
    createdAt: item.createdAt ?? new Date().toISOString(),
  };
}

export function sortMediaByPriority(items: CatalogMediaItem[], options: { language?: SupportedLanguageCode | string; limit?: number } = {}) {
  const preferredLanguage = (options.language || 'ku').toLowerCase();

  const sorted = [...items].sort((a, b) => {
    const aLanguageMatch = a.languages.includes(preferredLanguage as SupportedLanguageCode) ? 1 : 0;
    const bLanguageMatch = b.languages.includes(preferredLanguage as SupportedLanguageCode) ? 1 : 0;
    const aQuality = QUALITY_RANK[a.quality] ?? 0;
    const bQuality = QUALITY_RANK[b.quality] ?? 0;
    const aSourceScore = a.source === 'manual' ? 3 : a.source === 'youtube' ? 2 : a.source === 'tmdb' ? 1 : 0;
    const bSourceScore = b.source === 'manual' ? 3 : b.source === 'youtube' ? 2 : b.source === 'tmdb' ? 1 : 0;

    return (bLanguageMatch + bSourceScore + bQuality) - (aLanguageMatch + aSourceScore + aQuality);
  });

  return typeof options.limit === 'number' ? sorted.slice(0, options.limit) : sorted;
}

export function getMediaTitle(item: CatalogMediaItem, language: SupportedLanguageCode = 'ku') {
  if (language === 'ku' && item.titleKu) return item.titleKu;
  if (language === 'ar' && item.titleAr) return item.titleAr;
  return item.title;
}

export function getMediaOverview(item: CatalogMediaItem, language: SupportedLanguageCode = 'ku') {
  if (language === 'ku' && item.overviewKu) return item.overviewKu;
  if (language === 'ar' && item.overviewAr) return item.overviewAr;
  return item.overview;
}
