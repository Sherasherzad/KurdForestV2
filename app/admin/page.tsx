'use client';

import { useEffect, useState } from 'react';
import { normalizeMediaItem, type CatalogMediaItem, DEFAULT_CATEGORIES, DEFAULT_LANGUAGES } from '@/lib/catalog';
import { Trash2, Plus, ShieldCheck } from 'lucide-react';

const initialForm = {
  title: '',
  titleKu: '',
  titleAr: '',
  overview: '',
  overviewKu: '',
  overviewAr: '',
  type: 'movie',
  source: 'manual',
  category: 'Action',
  quality: '1080p',
  year: '2025',
  rating: '8.5',
  youtubeUrl: '',
  language: 'ku',
};

export default function AdminPage() {
  const [items, setItems] = useState<CatalogMediaItem[]>([]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kurdforest-admin-catalog');
      if (raw) {
        const parsed = JSON.parse(raw) as CatalogMediaItem[];
        setItems(parsed.map((item) => normalizeMediaItem(item)));
      }
    } catch {
      setItems([]);
    }
  }, []);

  const saveItems = (nextItems: CatalogMediaItem[]) => {
    setItems(nextItems);
    localStorage.setItem('kurdforest-admin-catalog', JSON.stringify(nextItems));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newItem = normalizeMediaItem({
      id: crypto.randomUUID(),
      title: form.title || 'Untitled',
      titleKu: form.titleKu || form.title || 'Untitled',
      titleAr: form.titleAr || form.title || 'Untitled',
      type: form.type as 'movie' | 'tv',
      source: 'manual',
      overview: form.overview || 'No description provided yet.',
      overviewKu: form.overviewKu || form.overview || 'No description provided yet.',
      overviewAr: form.overviewAr || form.overview || 'No description provided yet.',
      genres: [form.category],
      year: Number(form.year) || new Date().getFullYear(),
      rating: Number(form.rating) || 0,
      languages: [form.language as 'ku' | 'ar' | 'en'],
      quality: form.quality,
      category: form.category,
      youtubeUrl: form.youtubeUrl || undefined,
      streamUrls: form.youtubeUrl
        ? [{ url: form.youtubeUrl, quality: form.quality, source: 'youtube' }]
        : [{ url: 'https://example.com/stream/' + crypto.randomUUID(), quality: form.quality, source: 'server' }],
    });

    saveItems([newItem, ...items]);
    setForm(initialForm);
  };

  const handleDelete = (itemId: string) => {
    saveItems(items.filter((item) => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-yellow-400" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-400">Admin</p>
            <h1 className="text-3xl font-bold">Media management</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-2 text-yellow-400">
              <Plus className="h-4 w-4" />
              <h2 className="text-xl font-semibold">Add new film or show</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-300">
                <span>Title</span>
                <input className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Category</span>
                <select className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                  {DEFAULT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-gray-300">
                <span>Kurdish title</span>
                <input className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.titleKu} onChange={(event) => setForm({ ...form, titleKu: event.target.value })} />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Arabic title</span>
                <input className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.titleAr} onChange={(event) => setForm({ ...form, titleAr: event.target.value })} />
              </label>

              <label className="space-y-2 text-sm text-gray-300">
                <span>Type</span>
                <select className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Primary language</span>
                <select className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })}>
                  {DEFAULT_LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>{language.name}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-gray-300">
                <span>Year</span>
                <input type="number" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Quality</span>
                <select className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.quality} onChange={(event) => setForm({ ...form, quality: event.target.value })}>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="2160p">2160p</option>
                  <option value="4K">4K</option>
                </select>
              </label>

              <label className="space-y-2 text-sm text-gray-300 md:col-span-2">
                <span>YouTube link</span>
                <input className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.youtubeUrl} onChange={(event) => setForm({ ...form, youtubeUrl: event.target.value })} placeholder="https://youtu.be/..." />
              </label>

              <label className="space-y-2 text-sm text-gray-300 md:col-span-2">
                <span>Overview</span>
                <textarea className="min-h-[110px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.overview} onChange={(event) => setForm({ ...form, overview: event.target.value })} />
              </label>
              <label className="space-y-2 text-sm text-gray-300 md:col-span-2">
                <span>Kurdish overview</span>
                <textarea className="min-h-[110px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.overviewKu} onChange={(event) => setForm({ ...form, overviewKu: event.target.value })} />
              </label>
              <label className="space-y-2 text-sm text-gray-300 md:col-span-2">
                <span>Arabic overview</span>
                <textarea className="min-h-[110px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2" value={form.overviewAr} onChange={(event) => setForm({ ...form, overviewAr: event.target.value })} />
              </label>
            </div>

            <button type="submit" className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black hover:bg-yellow-300">
              Save to catalog
            </button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-yellow-400">Live catalog</h2>
            <div className="space-y-3">
              {items.length === 0 && <p className="text-sm text-gray-400">No items yet. Add your first manual film or series.</p>}
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.type} • {item.source} • {item.quality}</p>
                  </div>
                  <button type="button" onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-500/50 p-2 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
