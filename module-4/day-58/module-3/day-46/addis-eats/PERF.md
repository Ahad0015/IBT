# Performance: Addis Eats

Setup: production build (`npm run build` + `npm run start`), Chrome Incognito,
Lighthouse Navigation mode, Mobile (simulated throttling), Performance only.

## `/` (home), final

| Run | Score |
|---|---|
| 1 | 96 |
| 2 | 95 |
| 3 | 94 |
| **Median** | **95** |

LCP: 92  CLS: 92  TBT: 87

Baseline: not recorded before making changes, so no before and after
comparison is claimed for the score. The changes made are listed below.

## What each change does

- **next/image + sizes:** images are resized to their displayed width and served as webp/avif, so fewer bytes load. Real width and height reserve space, which prevents layout shift (CLS).
- **preload on the hero:** the one largest above-the-fold image starts downloading immediately, which helps LCP.
- **next/font:** the font is self-hosted with a size-matched fallback, so swapping fonts no longer shifts the text.
- **next/script lazyOnload:** analytics loads after the page is idle, so it does not add main-thread work (TBT).

## Environment setup

`.env.example` lists every variable with dummy values and is committed.
`.env.local` is gitignored.