## Marquee readability pass — "I'm built for your chaos"

Tighten the terracotta marquee band so it reads cleanly from a 400px phone up to desktop, without dominating the page.

### What changes

**File: `src/routes/index.tsx`** — the marquee `<section>` only.

1. **Type size — scale down on mobile, hold ground on desktop**
   - Current: `text-3xl md:text-5xl` (too large on a 402px viewport — letters crowd the band edges).
   - New: `text-2xl sm:text-3xl md:text-5xl lg:text-6xl` so it grows with the screen instead of jumping.

2. **Vertical breathing room**
   - Current: `py-6 md:py-8`.
   - New: `py-5 md:py-10` — tighter on mobile, more generous on desktop so the italic descenders don't kiss the rules.

3. **Spacing between repeats**
   - Current: `gap-12` everywhere + a separator `✦`.
   - New: responsive `gap-8 md:gap-16`, and shrink the star to `text-lg md:text-2xl` so it reads as punctuation, not a second headline.

4. **Contrast + weight**
   - Add `font-medium` (Fraunces italic at light weight on terracotta is the readability culprit at small sizes).
   - Add `tracking-[-0.01em]` to tighten the italic so it feels like a headline band, not stretched copy.
   - Bump the terracotta foreground to a slightly warmer off-white via inline style, and add a subtle `text-shadow: 0 1px 0 rgba(0,0,0,0.06)` for edge definition against the terracotta — keeps it editorial, not heavy.

5. **Animation speed tied to size**
   - Current: 38s linear (feels slow on mobile because each repeat is huge relative to the viewport).
   - New: 28s — keeps the band feeling alive without becoming distracting.

6. **Reduced-motion safety**
   - Add a `@media (prefers-reduced-motion: reduce)` rule in `src/styles.css` that pauses `.marquee-track`. Required for accessibility and avoids a jittery band for anyone with motion sensitivity.

### Technical notes

- All changes are className + small inline-style tweaks on the existing marquee section + one CSS media query in `src/styles.css` under the existing `@layer utilities` block.
- No new dependencies, no structural changes, no impact on other sections.
- Repeat count stays at 6 — sufficient to fill 2× viewport at the new sizes so the loop stays seamless.

### Out of scope

- Hero, pillars, quick options, testimonial, footer — untouched.
- Color token changes — terracotta stays as defined.
