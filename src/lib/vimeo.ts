/**
 * Vimeo thumbnail resolution — server-side only.
 *
 * The testimonial clips are Vimeo embeds. A cross-origin iframe cannot be
 * sampled for a still, so the poster has to come from Vimeo itself: its oEmbed
 * endpoint returns a `thumbnail_url` on the i.vimeocdn.com CDN, and that CDN
 * honours an arbitrary size suffix on the path (`-d_200x150` → `-d_720x1280`).
 * Requesting a portrait size gives the real 9:16 frame rather than the
 * letterboxed 200x150 default.
 *
 * Why fetch rather than commit three JPEGs to /public: the clip URLs are env
 * vars (`NEXT_PUBLIC_TESTIMONIAL_VIDEO_n`). If the client swaps a video in
 * Vercel, the poster follows automatically instead of silently going stale.
 *
 * Cached for a day and wrapped in try/catch, so a Vimeo outage degrades to the
 * branded plate instead of failing the build.
 */

const OEMBED = "https://vimeo.com/api/oembed.json";
const REVALIDATE_SECONDS = 60 * 60 * 24;

/** Pull the numeric id out of a vimeo.com or player.vimeo.com URL. */
export function vimeoId(url: string): string | null {
  const m = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url || "");
  return m ? m[1] : null;
}

/** True for a direct media file, which can self-thumbnail via a `#t=` fragment. */
export function isMediaFile(src: string): boolean {
  return /\.(mp4|mov|webm)(\?|#|$)/i.test(src || "");
}

/**
 * Resolve one clip to a poster URL at the requested pixel size.
 * Returns null when the URL isn't a Vimeo link or Vimeo doesn't answer.
 */
export async function vimeoThumb(
  url: string,
  size = "720x1280"
): Promise<string | null> {
  const id = vimeoId(url);
  if (!id) return null;

  try {
    const res = await fetch(
      `${OEMBED}?url=${encodeURIComponent(`https://vimeo.com/${id}`)}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!res.ok) return null;

    const data: unknown = await res.json();
    const raw =
      typeof data === "object" && data !== null && "thumbnail_url" in data
        ? String((data as { thumbnail_url?: unknown }).thumbnail_url ?? "")
        : "";
    if (!raw) return null;

    // ".../<hash>-d_200x150?region=us" → ".../<hash>-d_720x1280?region=us"
    return raw.replace(/-d_\d+x\d+/, `-d_${size}`).replace(/-d_\d+(?=\?|$)/, `-d_${size}`);
  } catch {
    return null; // Vimeo unreachable — caller falls back to its own placeholder
  }
}

/** Resolve a whole list in parallel, preserving order and nulls. */
export async function vimeoThumbs(
  urls: readonly string[],
  size?: string
): Promise<Array<string | null>> {
  return Promise.all(urls.map((u) => vimeoThumb(u, size)));
}
