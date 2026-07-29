// One-time WebP -> PNG fallback for the rare browser that cannot decode WebP.
// Modern browsers never trigger this; the original PNG sits beside every .webp,
// so no image can break. The guard flag stops any chance of an error loop.
export function onImgError(e) {
  const el = e.currentTarget;
  if (el.dataset.fb) return;
  el.dataset.fb = '1';
  el.src = el.src.replace(/\.webp(\?.*)?$/, '.png$1');
}
