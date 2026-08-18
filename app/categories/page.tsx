import { DEFAULT_CATEGORIES, mockCatalog, sortMediaByPriority } from '@/lib/catalog';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-yellow-400">Browse</p>
          <h1 className="mt-3 text-3xl font-bold">Categories</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {DEFAULT_CATEGORIES.map((category) => {
            const items = sortMediaByPriority(
              mockCatalog.filter((media) => media.genres.includes(category)),
              { language: 'ku', limit: 3 }
            );

            return (
              <div key={category} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-yellow-400">{category}</h2>
                  <span className="rounded-full bg-yellow-400/10 px-2 py-1 text-xs text-yellow-300">{items.length}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  {items.length === 0 ? (
                    <p>New titles coming soon.</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                        {item.titleKu || item.title}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
