# media-originals

Master source files kept for archival. These are the full quality originals the
site's optimized assets were made from.

They live here, outside `public/`, on purpose: Vite copies everything in `public/`
into the production build, so keeping the heavy masters here keeps them versioned
without shipping roughly 145 MB of unused video to visitors. The site serves the
compressed `-opt.mp4` variants in `public/assets/video/` instead.

If you ever need to re-encode, work from these files and write the new variant back
into `public/assets/video/`. Do not point the site at these masters directly.

## video

Original clips. `ritual-scene.mp4` and `brew.mp4` are no longer used by any section
(retired in an earlier redesign); the rest have optimized twins the site plays.
