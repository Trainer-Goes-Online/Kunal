/**
 * Gap — the honesty chip. Renders a VISIBLE placeholder for any fact that has not
 * been confirmed, keyed to a numbered question in parallel-build/MASTER-HANDOFF.md §6.
 * Never let an unconfirmed number/name/rating/testimonial render as a plausible guess —
 * wrap it in <Gap q={N}>what's needed</Gap> instead. Self-styled (no globals edit).
 *
 * Server component. Import: `import { Gap } from "@/components/shared/Gap";`
 */
export function Gap({ q, children }: { q: number; children?: React.ReactNode }) {
  return (
    <span
      className="sdp-gap"
      data-gap={q}
      role="note"
      aria-label={`Needs input, question ${q}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        borderRadius: "999px",
        border: "1px dashed var(--brand, #C9A24B)",
        background: "rgba(var(--brand-rgb, 201,162,75), .08)",
        color: "var(--brand-deep, #8A6D2B)",
        fontFamily: "var(--fb, system-ui), sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden>⚑</span>
      {children ? <span style={{ whiteSpace: "normal" }}>NEEDS: {children}</span> : "NEEDS INPUT"}
      <span style={{ opacity: 0.7 }}>(Q{q})</span>
    </span>
  );
}
