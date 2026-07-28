/**
 * S09b — THE FOUR ERASED COSTS (Effort · Time · Risk · Money).
 *
 * Deliberately NOT the plain 2×2 card grid it replaces. Each cost is a *gauge
 * tile*: a brass ring that scribes a full circle on reveal, a line glyph that
 * draws itself inside it, a ghost numeral sitting behind the tile, and a brass
 * wipe that sweeps across the face as the content lands — the visual argument
 * being that each cost is being struck through, not listed.
 *
 * The grid is offset rather than flat: the second column drops 34px on desktop,
 * so the four tiles read as a considered set instead of a spreadsheet. Alternate
 * tiles scribe their ring in the opposite direction, which keeps the reveal from
 * feeling mechanical.
 *
 * Server component. Every effect is CSS keyed to the `.vis` class the shared
 * observer adds via `data-sdp-reveal`; nothing here needs client JS, and
 * prefers-reduced-motion collapses it to a static, fully legible grid.
 */
import { fourCosts } from "@/lib/content";
import { Glyph } from "./icons";

export function FourCosts() {
  return (
    <div className="s09-costs">
      <div
        className="s09-costs-head"
        data-sdp-reveal
        style={{ "--d": ".04s" } as React.CSSProperties}
      >
        <span className="s09-costs-rule" aria-hidden />
        <h3>What this actually costs you</h3>
        <span className="s09-costs-rule" aria-hidden />
      </div>

      <ul className="s09-cost-grid">
        {fourCosts.map((c, idx) => (
          <li
            key={c.k}
            className="s09-cost"
            data-sdp-reveal
            style={{ "--d": `${(0.08 + idx * 0.1).toFixed(2)}s` } as React.CSSProperties}
          >
            <span className="s09-cost-ghost" aria-hidden>
              {String(idx + 1).padStart(2, "0")}
            </span>

            <span className={`s09-cost-gauge${idx % 2 ? " is-ccw" : ""}`} aria-hidden>
              <svg className="s09-cost-arc" viewBox="0 0 64 64">
                <circle className="s09-cost-arc-track" cx="32" cy="32" r="29" />
                <circle className="s09-cost-arc-run" cx="32" cy="32" r="29" pathLength={1} />
              </svg>
              <span className="s09-cost-ico">
                <Glyph name={c.icon} size={24} draw />
              </span>
            </span>

            <span className="s09-cost-k">{c.k}</span>
            <p className="s09-cost-v">{c.v}</p>

            <span className="s09-cost-wipe" aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  );
}
