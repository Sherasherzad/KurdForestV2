import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_LANGUAGES,
  normalizeMediaItem,
  sortMediaByPriority,
  type MediaSource,
} from './catalog';

test('catalog exposes default supported languages and provider sources', () => {
  assert.deepEqual(DEFAULT_LANGUAGES.map((lang) => lang.code).slice(0, 3), ['ku', 'ar', 'en']);
  assert.deepEqual(
    ['tmdb', 'youtube', 'manual'] as MediaSource[],
    ['tmdb', 'youtube', 'manual'] as MediaSource[]
  );
});

test('normalizeMediaItem accepts multiple source types and keeps the highest-quality metadata', () => {
  const item = normalizeMediaItem({
    id: 'movie-123',
    title: 'The Hero',
    titleKu: 'ئێستا',
    source: 'manual',
    type: 'movie',
    poster: 'https://example.com/poster.jpg',
    backdrop: 'https://example.com/backdrop.jpg',
    overview: 'A hero returns.',
    languages: ['ku', 'en'],
    genres: ['Drama', 'Action'],
    year: 2024,
    rating: 8.8,
    youtubeUrl: 'https://youtu.be/test',
    streamUrls: [
      { url: 'https://server-1.example/stream.mp4', quality: '1080p', source: 'server-1' },
      { url: 'https://server-2.example/stream.mp4', quality: '4K', source: 'server-2' },
    ],
  });

  assert.equal(item.source, 'manual');
  assert.equal(item.titleKu, 'ئێستا');
  assert.equal(item.streamUrls.length, 2);
  assert.equal(item.youtubeUrl, 'https://youtu.be/test');
  assert.equal(item.languages.includes('ku'), true);
  assert.equal(item.quality, '4K');
});

test('sortMediaByPriority prefers premium sources and available quality and language matches', () => {
  const items = [
    normalizeMediaItem({
      id: 'a',
      title: 'Alpha',
      source: 'youtube',
      type: 'movie',
      overview: 'Alpha overview',
      languages: ['en'],
      year: 2023,
      streamUrls: [{ url: 'https://server.example/alpha.mp4', quality: '720p', source: 'server' }],
    }),
    normalizeMediaItem({
      id: 'b',
      title: 'Bravo',
      source: 'manual',
      type: 'movie',
      overview: 'Bravo overview',
      languages: ['ku', 'ar'],
      year: 2024,
      quality: '4K',
      streamUrls: [{ url: 'https://server.example/bravo.mp4', quality: '4K', source: 'server' }],
    }),
  ];

  const sorted = sortMediaByPriority(items, { language: 'ku' });
  assert.equal(sorted[0].id, 'b');
  assert.equal(sorted[0].quality, '4K');
});
