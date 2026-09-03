'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

/**
 * Shows the extra images a poster/admin attached to a job (office photos,
 * team shots, banners, etc). Renders a hero + thumbnail strip, and taps
 * open a simple full-screen viewer — kept dependency-free rather than
 * pulling in a carousel library for what's usually 2-6 images.
 */
export function JobGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!images.length) return null;

  const hero = images[0];
  const rest = images.slice(1);

  if (!hero) return null;

  return (
    <section className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm sm:p-8">
      <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
        <ImageIcon size={13} /> Photos
      </h2>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="group relative col-span-1 row-span-2 aspect-[16/10] overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800 sm:col-span-3 sm:aspect-auto"
        >
          <Image
            src={hero}
            alt={`${title} — photo 1`}
            fill
            className="object-cover transition group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 66vw"
          />
        </button>

        {rest.slice(0, 4).map((src, i) => {
          const isLastVisible = i === 3 && rest.length > 4;
          return (
            <button
              key={src + i}
              type="button"
              onClick={() => setOpenIndex(i + 1)}
              className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800 sm:aspect-auto"
            >
              <Image
                src={src}
                alt={`${title} — photo ${i + 2}`}
                fill
                className="object-cover transition group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 50vw, 17vw"
              />
              {isLastVisible && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink-950/60 text-lg font-bold text-white">
                  +{rest.length - 4}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={images}
          index={openIndex}
          title={title}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  );
}

function Lightbox({
  images,
  index,
  title,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const go = (delta: number) => onNavigate((index + delta + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 dark:bg-ink-900 p-2 text-white hover:bg-white/20 dark:hover:bg-ink-900"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 rounded-full bg-white/10 dark:bg-ink-900 p-2 text-white hover:bg-white/20 dark:hover:bg-ink-900 sm:left-6"
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-3 rounded-full bg-white/10 dark:bg-ink-900 p-2 text-white hover:bg-white/20 dark:hover:bg-ink-900 sm:right-6"
            aria-label="Next photo"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div
        className="relative h-[70vh] w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index] ?? ''}
          alt={`${title} — photo ${index + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>

      <p className="absolute bottom-4 text-sm font-medium text-white/70">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
