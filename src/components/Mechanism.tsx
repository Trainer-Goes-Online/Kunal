// /**
//  * S08 — MECHANISM, rebuilt as a scroll-assembled TIMELINE.
//  *
//  * Replaces the flat 2×2 pillar grid with a centre-spine timeline: a brass rail
//  * that fills as the section scrolls, four nodes (icon ring + phase number) sitting
//  * on it, and alternating cards that "lego" into place — each card slots in from
//  * its own side with a slight 3D tilt, the connector stub draws out to meet the
//  * spine, the icon scribes itself, then the text settles. All of it is CSS keyed to
//  * the `.vis` class the shared reveal observer already adds; the only new JS is the
//  * spine fill, wired in ClientBehaviors via `data-timeline`.
//  *
//  * Copy: `src/lib/content.ts` `phases` — unchanged phase text, but re-framed
//  * against the funnel md's 12-week programme (weeks 1-12 = the programme, weeks
//  * 13-26 = the continuation the md's FAQ describes). Stage grouping comes from
//  * `phases[].stage`, so the framing lives in data, not markup.
//  *
//  * Server component. Reduced-motion: the observer marks everything visible at once
//  * and the CSS drops every transform, leaving a plain readable list.
//  */
// import { phases } from "@/lib/content";
// import { Glyph } from "./icons";

// export function Mechanism() {
//   return (
//     <section id="mechanism" className="sdp-section sdp-light-alt s08-mech">
//       <div className="sdp-wrap">
//         <div className="sdp-center-wrap">
//           <div className="sdp-eyebrow center" data-sdp-reveal>
//             The Mechanism
//           </div>
//         </div>

//         <h2 className="sdp-h2" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
//           One System. Four Phases.
//           <br className="brk-mobile" />{" "}
//           You Feel Each One <em>End</em>.
//         </h2>

//         <p
//           className="s08-mech-sub-body"
//           data-sdp-reveal
//           style={{ "--d": ".10s" } as React.CSSProperties}
//         >
//           Through The High-Performer Protocol, a plan built around the life that made you
//           successful, not a gym-rat&rsquo;s week.
//         </p>

//         {/* The rail + nodes. `data-timeline` is the hook ClientBehaviors uses to
//             drive --fill (0→1) from the section's scroll progress. */}
//         <ol className="s08-tl" data-timeline>
//           <span className="s08-tl-rail" aria-hidden>
//             <span className="s08-tl-rail-fill" />
//           </span>

//           {phases.map((p, idx) => {
//             const stageChanged = idx === 0 || phases[idx - 1].stage !== p.stage;
//             return (
//               <li
//                 key={p.n}
//                 className={`s08-tl-item${idx % 2 ? " is-right" : " is-left"}`}
//                 data-sdp-reveal
//                 style={{ "--d": `${(idx * 0.09).toFixed(2)}s` } as React.CSSProperties}
//               >
//                 {stageChanged && (
//                   <p className="s08-tl-stage" aria-hidden={false}>
//                     {p.stage}
//                   </p>
//                 )}

//                 <span className="s08-tl-node" aria-hidden>
//                   <span className="s08-tl-node-ring" />
//                   <span className="s08-tl-node-ico">
//                     <Glyph name={p.icon} size={22} draw />
//                   </span>
//                 </span>

//                 <span className="s08-tl-stub" aria-hidden />

//                 <article className="s08-tl-card">
//                   <header className="s08-tl-card-head">
//                     <span className="s08-tl-num">{p.n}</span>
//                     <span className="s08-tl-label">{p.label}</span>
//                   </header>
//                   <h3 className="s08-tl-title">{p.title}</h3>
//                   <p className="s08-tl-desc">{p.body}</p>
//                 </article>
//               </li>
//             );
//           })}
//         </ol>

//         <p
//           className="s08-lengths-note"
//           data-sdp-reveal
//           style={{ "--d": ".26s" } as React.CSSProperties}
//         >
//           Your programme is the <strong>first 12 weeks</strong>: phases one and two, and
//           the window the <strong>100% Results Guarantee</strong> covers. If you choose to
//           continue, phases three and four carry the result into recomposition and make it
//           permanent.
//         </p>

//         <p
//           className="s08-mech-closing"
//           data-sdp-reveal
//           style={{ "--d": ".30s" } as React.CSSProperties}
//         >
//           This isn&rsquo;t about willpower. It&rsquo;s about structure that fits the life that
//           made you successful.
//         </p>
//       </div>
//     </section>
//   );
// }
