"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { site } from "@/lib/site";
import { PlayTriangle } from "./icons";
import { trackGa4EventOnce } from "@/lib/ga4";

const isEmbed = (url: string) => /vimeo\.com|youtube\.com|youtu\.be/.test(url);

function withAutoplay(url: string) {
  const sep = url.includes("?") ? "&" : "?";
  if (/vimeo\.com/.test(url)) return `${url}${sep}autoplay=1&title=0&byline=0&portrait=0`;
  if (/youtube|youtu\.be/.test(url)) return `${url}${sep}autoplay=1&rel=0`;
  return url;
}

/**
 * Hero VSL focal frame. Poster + brass play disc; on play it swaps to the video
 * (Vimeo/YouTube iframe or native <video>) and fires the GA4 `video_play` event
 * (hero-only, once per browser). C12: decorative overlays yield to the player.
 */
export function VSLFrame() {
  const [playing, setPlaying] = useState(false);
  const url = site.vslVideoUrl;
  const hasVideo = Boolean(url);

  function play() {
    if (!hasVideo) return;
    trackGa4EventOnce("video_play");
    setPlaying(true);
  }

  if (playing && hasVideo) {
    return (
      <div className="vsl vsl--playing">
        {isEmbed(url) ? (
          <iframe
            src={withAutoplay(url)}
            title="Kraft With Kunal — the film"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <video src={url} poster={site.vslPoster || undefined} controls autoPlay playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        )}
      </div>
    );
  }

  return (
    <div className="vsl">
      {site.vslPoster && <img className="vsl-poster" src={site.vslPoster} alt="" />}
      <span className="vsl-badge">{hasVideo ? "Watch — 5 min" : "Film coming soon"}</span>
      <button className="vsl-play" onClick={play} aria-label={hasVideo ? "Play the film" : "Film coming soon"}>
        <span className="vsl-disc">
          <PlayTriangle size={28} />
        </span>
      </button>
    </div>
  );
}
