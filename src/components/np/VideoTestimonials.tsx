"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { site } from "@/lib/site";
import { PlayTriangle } from "../icons";

/**
 * A single testimonial. The idle-state thumbnail is derived from the video ITSELF:
 * a muted <video> preloading only metadata, seeked to a frame via the `#t=` media
 * fragment — so each card shows a real, distinct still with no separate poster
 * asset (there's no ffmpeg to pre-render one). An explicit `poster` env value, if
 * set, wins. On click we swap to a full-controls, audible, autoplaying player.
 */
function VTest({ src, poster }: { src: string; poster: string }) {
  const [play, setPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const has = Boolean(src);
  // A tiny time offset lands past any black lead-in frame.
  const frameSrc = src ? `${src}#t=0.5` : "";

  if (play && has) {
    return (
      <div className="vtest">
        <video src={src} poster={poster || undefined} controls autoPlay playsInline />
      </div>
    );
  }

  return (
    <div className="vtest">
      {has ? (
        poster ? (
          <img className="vt-poster" src={poster} alt="" />
        ) : (
          <video
            ref={videoRef}
            className="vt-poster"
            src={frameSrc}
            preload="metadata"
            muted
            playsInline
            tabIndex={-1}
            aria-hidden
          />
        )
      ) : null}
      <span className="vt-badge">{has ? "Client testimonial" : "Testimonial coming"}</span>
      <button
        className="vt-play"
        onClick={() => has && setPlay(true)}
        aria-label={has ? "Play testimonial" : "Testimonial coming soon"}
      >
        <span className="vsl-disc">
          <PlayTriangle size={24} />
        </span>
      </button>
    </div>
  );
}

export function VideoTestimonials() {
  return (
    <div className="vtest-grid">
      {site.testimonialVideos.map((src, i) => (
        <VTest key={i} src={src} poster={site.testimonialPosters[i]} />
      ))}
    </div>
  );
}
