"use client";

import { useEffect } from "react";
import { trackGa4EventOnce } from "@/lib/ga4";

/**
 * ClientBehaviors — the SINGLE delegated client file for the landing page.
 * Every section is a server component emitting real HTML + `data-*` hooks; this
 * file (mounted once in layout) wires all interactivity via document-level event
 * delegation + shared observers. No section carries its own client JS.
 *
 * Handles: scroll-reveal, the Vimeo VSL, the two marquee carousels (testimonials +
 * before/after) with drag + tap-to-open, the video modal, the before/after
 * lightbox, the sticky CTA, and smooth-scroll anchors. FAQ is native <details>
 * (no JS). All fail-open: with JS off, content is complete and every CTA works.
 */
export function ClientBehaviors() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof DocumentEventMap>(
      t: EventTarget, ev: K | string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions | boolean
    ) => { t.addEventListener(ev, fn, opts); cleanups.push(() => t.removeEventListener(ev, fn, opts)); };

    /* ---- 1. Scroll reveal ---- */
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-sdp-reveal]"));
    if (reduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("vis"));
    } else {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
        }),
        { threshold: 0.12, rootMargin: "0px 0px -40px" }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    /* ---- 1b. Mechanism timeline spine ----
       Drives `--fill` (0→1) on each [data-timeline] from how far the viewport's
       reading line has travelled through the section, so the brass rail grows as
       the phase cards assemble. rAF-throttled; reduced motion pins it filled. */
    const timelines = Array.from(document.querySelectorAll<HTMLElement>("[data-timeline]"));
    if (timelines.length) {
      if (reduced) {
        timelines.forEach((el) => el.style.setProperty("--fill", "1"));
      } else {
        let tlRaf = 0;
        const syncTimelines = () => {
          tlRaf = 0;
          const line = window.innerHeight * 0.62; // rail leads the cards slightly
          timelines.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.height === 0) return;
            const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
            el.style.setProperty("--fill", p.toFixed(3));
          });
        };
        const onTlScroll = () => { if (!tlRaf) tlRaf = requestAnimationFrame(syncTimelines); };
        on(window, "scroll", onTlScroll, { passive: true });
        on(window, "resize", onTlScroll);
        syncTimelines();
        cleanups.push(() => { if (tlRaf) cancelAnimationFrame(tlRaf); });
      }
    }

    /* ---- 1c. Scroll progress bar ----
       Writes --scroll-progress (0→1) on the fixed hairline. rAF-throttled and
       driven by scaleX, so it never causes layout. */
    const scrollbar = document.querySelector<HTMLElement>("[data-scrollbar]");
    if (scrollbar) {
      let sbRaf = 0;
      const syncScrollbar = () => {
        sbRaf = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        scrollbar.style.setProperty("--scroll-progress", p.toFixed(4));
      };
      const onSbScroll = () => { if (!sbRaf) sbRaf = requestAnimationFrame(syncScrollbar); };
      on(window, "scroll", onSbScroll, { passive: true });
      on(window, "resize", onSbScroll);
      syncScrollbar();
      cleanups.push(() => { if (sbRaf) cancelAnimationFrame(sbRaf); });
    }

    /* ---- 1d. Credential lightbox (S07) ----
       The certificates are the proof; sending someone to Google Drive to read
       one loses them. The card image opens the asset in place instead, with
       prev/next across the set. Press cards keep a real outbound link, but on
       their TITLE only — that link is markup, not JS. */
    const credbox = document.querySelector<HTMLElement>("[data-credbox]");
    const credImg = credbox?.querySelector<HTMLImageElement>("[data-credbox-img]") ?? null;
    const credCap = credbox?.querySelector<HTMLElement>("[data-credbox-cap]") ?? null;
    // Original set only — the marquee clone would double every entry.
    const credCards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-carousel-set] [data-cred-idx]")
    ).reduce<Array<{ src: string; cap: string }>>((acc, el) => {
      const i = parseInt(el.getAttribute("data-cred-idx") || "-1", 10);
      if (i < 0 || acc[i]) return acc;
      const style = el.getAttribute("style") || "";
      const m = /url\("([^"]+)"\)/.exec(style);
      const cap = el.closest(".s07-cred-card")?.querySelector(".s07-cred-title")?.textContent || "";
      if (m) acc[i] = { src: m[1], cap: cap.trim() };
      return acc;
    }, []);
    let credIdx = 0;
    const showCred = (i: number) => {
      const n = credCards.length;
      if (!credImg || n === 0) return;
      const dir = i < credIdx ? -1 : 1;
      let j = ((i % n) + n) % n;
      // skip past any card whose asset hasn't been delivered yet
      for (let guard = 0; guard < n && !credCards[j]; guard++) {
        j = (((j + dir) % n) + n) % n;
      }
      const rec = credCards[j];
      if (!rec) return;
      credIdx = j;
      credImg.src = rec.src;
      credImg.alt = rec.cap;
      if (credCap) credCap.textContent = rec.cap;
    };
    const closeCredbox = () => {
      if (!credbox) return;
      credbox.classList.remove("on");
      credbox.hidden = true;
      credbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    if (credbox) {
      on(document, "click", (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-cred-idx]");
        if (!btn) return;
        const i = parseInt(btn.getAttribute("data-cred-idx") || "0", 10);
        if (!credCards[i]) return; // asset not delivered yet
        credIdx = i;
        showCred(i);
        credbox.hidden = false;
        credbox.classList.add("on");
        credbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
      on(credbox, "click", (e) => {
        const t = e.target as HTMLElement;
        if (t.closest("[data-credbox-close]") || t === credbox) { closeCredbox(); return; }
        const nav = t.closest<HTMLElement>("[data-credbox-nav]");
        if (nav) showCred(credIdx + parseInt(nav.getAttribute("data-credbox-nav") || "1", 10));
      });
    }

    /* ---- 4/5. Video modal + before/after lightbox openers (declared first; carousels call them) ---- */
    const vmodal = document.querySelector<HTMLElement>("[data-vmodal]");
    const vcontent = vmodal?.querySelector<HTMLElement>("[data-vmodal-content]") ?? null;
    const openVideoModal = (src: string) => {
      if (!vmodal || !vcontent) return;
      const isFile = /\.(mp4|mov|webm)(\?|#|$)/i.test(src);
      vcontent.innerHTML = isFile
        ? `<video src="${src}" controls autoplay playsinline style="width:100%;height:100%;object-fit:contain;background:#000"></video>`
        : `<iframe src="${src}${src.includes("?") ? "&" : "?"}autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe>`;
      vmodal.hidden = false; vmodal.classList.add("on"); vmodal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeVideoModal = () => {
      if (!vmodal || !vcontent) return;
      vcontent.innerHTML = ""; vmodal.classList.remove("on"); vmodal.hidden = true;
      vmodal.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
    };
    if (vmodal) on(vmodal, "click", (e) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-vmodal-close]") || t === vmodal) closeVideoModal();
    });

    const lbox = document.querySelector<HTMLElement>("[data-lbox]");
    const limg = lbox?.querySelector<HTMLImageElement>("[data-lbox-img]") ?? null;
    const lcounter = lbox?.querySelector<HTMLElement>("[data-lbox-counter]") ?? null;
    const baSrcs = Array.from(
      document.querySelectorAll<HTMLElement>('[data-carousel="bacar"] [data-carousel-set] [data-ba-idx]')
    ).slice(0).reduce<string[]>((acc, el) => {
      const i = parseInt(el.getAttribute("data-ba-idx") || "-1", 10);
      const src = el.getAttribute("data-ba-src") || "";
      if (i >= 0 && !acc[i]) acc[i] = src; // original set indices (clones share idx; first wins)
      return acc;
    }, []);
    let lidx = 0;
    const showL = (i: number) => {
      if (!limg || baSrcs.length === 0) return;
      const n = baSrcs.length; lidx = ((i % n) + n) % n;
      limg.setAttribute("src", baSrcs[lidx]);
      if (lcounter) lcounter.textContent = `${lidx + 1} / ${n}`;
    };
    const openLightbox = (i: number) => {
      if (!lbox) return;
      showL(i); lbox.hidden = false; lbox.classList.add("on");
      lbox.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    };
    const closeLightbox = () => {
      if (!lbox) return;
      lbox.classList.remove("on"); lbox.hidden = true;
      lbox.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
    };
    if (lbox) on(lbox, "click", (e) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-lbox-close]") || t === lbox) { closeLightbox(); return; }
      const nav = t.closest<HTMLElement>("[data-lbox-nav]");
      if (nav) showL(lidx + parseInt(nav.getAttribute("data-lbox-nav") || "1", 10));
    });

    /* ---- 4b. Testimonial tiles (S06) ----
       CLICKS on in-rail tiles are handled by the carousel's own capture handler
       below, which first has to decide whether the press was a drag; so this
       document-level opener skips them. KEYBOARD activation has no drag to
       disambiguate and the carousel handler never sees it, so Enter/Space is
       allowed through for rail tiles too — otherwise the rail would be
       mouse-only. */
    const openTileFrom = (el: HTMLElement | null | undefined, allowInRail = false) => {
      const tile = el?.closest<HTMLElement>("[data-tslide-src]");
      if (!tile) return false;
      if (!allowInRail && tile.closest("[data-carousel]")) return false;
      const src = tile.getAttribute("data-tslide-src");
      if (!src) return false;
      openVideoModal(src);
      return true;
    };
    on(document, "click", (e) => { openTileFrom(e.target as HTMLElement); });
    on(document, "keydown", (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key !== "Enter" && ke.key !== " ") return;
      if (openTileFrom(ke.target as HTMLElement, true)) ke.preventDefault();
    });

    /* ---- 2. Vimeo VSL (delegated) ---- */
    const playVideo = (host: HTMLElement) => {
      if (host.classList.contains("playing")) return;
      const id = host.getAttribute("data-vimeo-id");
      const mount = host.querySelector<HTMLElement>(".sdp-video-host");
      if (!id || !mount) return;
      const iframe = document.createElement("iframe");
      iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.setAttribute("allowfullscreen", "");
      iframe.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0";
      mount.innerHTML = ""; mount.appendChild(iframe);
      host.classList.add("playing");
      host.querySelectorAll<HTMLElement>(".sdp-video-thumb,.sdp-play").forEach((el) => (el.style.display = "none"));
      trackGa4EventOnce("video_play"); // GA4 hero-VSL play (once per browser) — restored post-rebuild
    };
    on(document, "click", (e) => {
      const host = (e.target as HTMLElement).closest<HTMLElement>(".sdp-video[data-vimeo-id]");
      if (host) playVideo(host);
    });
    on(document, "keydown", (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key !== "Enter" && ke.key !== " ") return;
      const host = (ke.target as HTMLElement).closest?.(".sdp-video[data-vimeo-id]") as HTMLElement | null;
      if (host) { ke.preventDefault(); playVideo(host); }
    });

    /* ---- 3. Carousels (auto-scroll marquee + drag + delegated tap) ---- */
    document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((car) => {
      const kind = car.getAttribute("data-carousel"); // "tcar" | "bacar"
      const track = car.querySelector<HTMLElement>("[data-carousel-track]");
      const origSet = car.querySelector<HTMLElement>("[data-carousel-set]");
      if (!track || !origSet) return;

      const clone = origSet.cloneNode(true) as HTMLElement;
      clone.removeAttribute("data-carousel-set");
      clone.setAttribute("aria-hidden", "true");
      // The clone is aria-hidden, so nothing inside it may stay tabbable —
      // a focusable node inside aria-hidden is an accessibility violation and
      // would trap keyboard users on duplicate tiles.
      clone.querySelectorAll<HTMLElement>("[tabindex]").forEach((n) => (n.tabIndex = -1));
      track.appendChild(clone);

      const gap = () => parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0") || 0;
      let setW = origSet.getBoundingClientRect().width + gap();
      const measure = () => { setW = origSet.getBoundingClientRect().width + gap(); };
      on(window, "resize", measure);

      const dir = kind === "tcar" ? -1 : 1;
      const speed = 0.45;
      let x = dir < 0 ? 0 : -setW;
      let paused = reduced;
      let dragging = false, startX = 0, startTx = 0, moved = 0;
      const wrap = () => { if (setW > 0) { while (x <= -setW) x += setW; while (x > 0) x -= setW; } };
      const apply = () => { track.style.transform = `translate3d(${x}px,0,0)`; };

      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (paused || dragging || document.hidden) return;
        x += speed * dir; wrap(); apply();
      };
      if (!reduced) { raf = requestAnimationFrame(tick); cleanups.push(() => cancelAnimationFrame(raf)); }

      let hovered = false;
      let holdUntil = 0;
      on(car, "mouseenter", () => { hovered = true; paused = true; });
      on(car, "mouseleave", () => { hovered = false; if (Date.now() >= holdUntil) paused = false; });

      /* Manual prev/next. Buttons live outside the rail (it's masked at the
         edges and is the drag surface), so they find it by data-carousel-target.
         One card per press, eased, then the drift holds ~1.4s before resuming. */
      const step = (d: number) => {
        const card = origSet.firstElementChild as HTMLElement | null;
        const by = (card ? card.getBoundingClientRect().width : car.clientWidth * 0.6) + gap();
        paused = true;
        holdUntil = Date.now() + 1400;
        track.style.transition = "transform .45s cubic-bezier(.4,0,.2,1)";
        x -= d * by;
        apply();
        window.setTimeout(() => {
          track.style.transition = "";
          wrap(); apply();                       // rewrap silently once the ease is done
          if (!hovered && Date.now() >= holdUntil) paused = false;
        }, 470);
        window.setTimeout(() => { if (!hovered) paused = false; }, 1400);
      };
      document
        .querySelectorAll<HTMLElement>(`[data-carousel-nav][data-carousel-target="${kind}"]`)
        .forEach((btn) => on(btn, "click", (e) => {
          e.preventDefault();
          step(parseInt(btn.getAttribute("data-carousel-nav") || "1", 10));
        }));

      const down = (cx: number) => { dragging = true; startX = cx; startTx = x; moved = 0; car.classList.add("dragging"); };
      const move = (cx: number) => { if (!dragging) return; const dx = cx - startX; moved = Math.max(moved, Math.abs(dx)); x = startTx + dx; wrap(); apply(); };
      const up = () => { if (!dragging) return; dragging = false; car.classList.remove("dragging"); };
      on(car, "mousedown", (e) => { (e as MouseEvent).preventDefault(); down((e as MouseEvent).clientX); });
      on(window, "mousemove", (e) => move((e as MouseEvent).clientX));
      on(window, "mouseup", up);
      on(car, "touchstart", (e) => down((e as TouchEvent).touches[0].clientX), { passive: true });
      on(window, "touchmove", (e) => { if (dragging) move((e as TouchEvent).touches[0].clientX); }, { passive: true });
      on(window, "touchend", up);

      const threshold = kind === "tcar" ? 10 : 6;
      on(car, "click", (e) => {
        if (moved > threshold) { e.stopPropagation(); e.preventDefault(); moved = 0; return; }
        if (kind === "tcar") {
          const tile = (e.target as HTMLElement).closest<HTMLElement>("[data-tslide-idx]");
          const src = tile?.getAttribute("data-tslide-src");
          if (src) openVideoModal(src);
        } else {
          const card = (e.target as HTMLElement).closest<HTMLElement>("[data-ba-idx]");
          if (card) openLightbox(parseInt(card.getAttribute("data-ba-idx") || "0", 10));
        }
      }, true);
    });

    /* ---- Modal / lightbox keyboard ---- */
    on(document, "keydown", (e) => {
      const ke = e as KeyboardEvent;
      if (vmodal && !vmodal.hidden && ke.key === "Escape") closeVideoModal();
      if (credbox && !credbox.hidden) {
        if (ke.key === "Escape") closeCredbox();
        else if (ke.key === "ArrowRight") showCred(credIdx + 1);
        else if (ke.key === "ArrowLeft") showCred(credIdx - 1);
      }
      if (lbox && !lbox.hidden) {
        if (ke.key === "Escape") closeLightbox();
        else if (ke.key === "ArrowRight") showL(lidx + 1);
        else if (ke.key === "ArrowLeft") showL(lidx - 1);
      }
    });

    /* ---- 6. Sticky CTA (show once hero leaves viewport) ---- */
    const sticky = document.querySelector<HTMLElement>("[data-sticky-cta]");
    const heroSentinel = document.querySelector(".sdp-hero");
    if (sticky && heroSentinel && "IntersectionObserver" in window) {
      const sio = new IntersectionObserver(
        ([e]) => sticky.classList.toggle("on", !e.isIntersecting),
        { threshold: 0 }
      );
      sio.observe(heroSentinel);
      cleanups.push(() => sio.disconnect());
    }

    /* ---- 7. Smooth-scroll in-page anchors ---- */
    on(document, "click", (e) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const tgt = document.querySelector(id);
      if (tgt) { e.preventDefault(); tgt.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
