# ILAKECH — Mobile Design Contract v1.0
> **Created:** 2026-02-16
> **Status:** ACTIVE — All mobile work MUST comply with this contract.
> **Scope:** `@media (max-width: 767px)` ONLY.

---

## 1. PURPOSE

This contract defines the **single source of truth** for mobile design decisions.
No section may introduce custom font sizes, spacing, or animations outside this spec.
All mobile adjustments live exclusively inside `responsive.css` within the `≤767px` media query.

**Rules:**
- Do NOT modify desktop styles.
- Do NOT modify `tokens.css`.
- Do NOT create new CSS files for mobile.
- Do NOT replicate desktop animations on mobile.

---

## 2. TYPOGRAPHY — Mobile Unified Scale

### Font Families (Inherited from Desktop — No Change)
| Role     | Family              |
|----------|---------------------|
| Display  | `'Cinzel', serif`   |
| Body     | `'Inter', sans-serif` |

### Font Sizes (Mobile Tokens)
| Token                | Value                                  | Usage                                                    |
|----------------------|----------------------------------------|----------------------------------------------------------|
| `--mobile-text-h1`   | `clamp(1.9rem, 6.2vw, 2.6rem)`         | Hero H1 ONLY                                             |
| `--mobile-text-h2`   | `clamp(1.7rem, 5.5vw, 2.2rem)`         | All standard section headings (Manifesto, Location, Master Plan, etc.) |
| `--mobile-text-body` | `clamp(0.9rem, 2.6vw, 1rem)`           | All body/paragraph text                                  |
| `--mobile-text-small`| `clamp(0.85rem, 2.2vw, 0.95rem)`       | Captions, minor labels                                   |

### Rules
- **ALL section titles** (`#manifesto h2`, `#location h2`, `.plan-content h2`, `#progress h2`, `#participation h2`, `#team h2`, `#dossier h2`) MUST use `--mobile-text-h2`.
- **Only `#hero h1`** may use `--mobile-text-h1`.
- **No section may introduce new font sizes.** If a size is needed, it must be added here first.
- Eyebrow text (`h3` used as subtitle/label) uses `--mobile-text-small`.

### Line Height
| Context   | Value  |
|-----------|--------|
| Headings  | `1.25` |
| Body text | `1.65` |

### Letter Spacing
| Context          | Value      |
|------------------|------------|
| H1               | `0.02em`   |
| H2               | `0.03em`   |
| Eyebrow (H3)     | `0.25em`   |
| Body             | `normal`   |

### Text Width Constraint
All paragraph text: `max-width: 38ch` (centered within container).

---

## 3. COLOR SYSTEM — Inherited (No Change)

Mobile uses the **exact same color tokens** as desktop.

| Token                      | Value                         |
|----------------------------|-------------------------------|
| `--color-base-obsidian`    | `#080808`                     |
| `--color-base-jungle`      | `#0D1F16`                     |
| `--color-base-paper`       | `#F5F0EB`                     |
| `--color-cta-gold`         | `#C5A065`                     |
| `--color-accent-amber`     | `#D4A373`                     |
| `--color-text-mist`        | `#E0E0E0`                     |
| `--color-text-muted`       | `#888888`                     |

No mobile-specific colors. No opacity changes to base palette.

---

## 4. SPACING SYSTEM — Mobile

### Container
| Property             | Value                              |
|----------------------|------------------------------------|
| Horizontal padding   | `clamp(18px, 5vw, 24px)`          |
| Max-width            | `100%` (full width within padding) |

### Section Padding
| Property             | Value                              |
|----------------------|------------------------------------|
| Vertical padding     | `clamp(60px, 12vw, 90px)`         |

### Internal Gaps
| Between                    | Value     |
|----------------------------|-----------|
| Title → paragraph          | `1.2rem`  |
| Paragraph → paragraph      | `1rem`    |
| Paragraph → image/element  | `1.5rem`  |
| Section title → first content | `1.5rem` |

### Border Radius (Inherited)
| Token          | Value |
|----------------|-------|
| `--radius-sm`  | `2px` |
| `--radius-md`  | `4px` |
| `--radius-lg`  | `8px` |

---

## 5. LAYOUT RULES

1. **All content** is centered within the mobile container.
2. **No horizontal overflow** — every element must be `max-width: 100%`.
3. **Images** must be `width: 100%; height: auto; object-fit: cover/contain`.
4. **No parallax effects** on mobile.
5. **No fixed-height sections** unless strictly necessary (Hero uses `min-height: 100dvh`).
6. **No complex grids** — all layouts collapse to single-column vertical stacking.
7. **Grids** (`grid-template-columns`) become `1fr` on mobile.
8. **Order** may be adjusted with CSS `order` property for visual hierarchy.

---

## 6. ANIMATION CONTRACT — Mobile

### Philosophy
> Minimal. Elegant. Subtle. Performant.

### Disabled on Mobile (≤767px)
| Animation Type              | Status     |
|-----------------------------|------------|
| Parallax (yPercent scroll)  | ❌ DISABLED |
| Scroll-scrub timelines      | ❌ DISABLED |
| Map 3D tilt / unroll        | ❌ DISABLED |
| Card rotateY (3D flip)      | ❌ DISABLED |
| SVG line drawing (timeline) | ❌ DISABLED |
| Ambient light orbs          | ❌ DISABLED |
| Complex stagger sequences   | ❌ DISABLED |

### Mobile Animation — Single Pattern
Every visible element uses **one unified reveal**:

```
opacity: 0 → 1
translateY: 20px → 0
duration: 0.6s
ease: power2.out
```

### Rules
- Trigger: Element enters viewport (`start: "top 88%"`).
- **Scroll behavior:** `toggleActions: "play none none reverse"`:
  - ⬇️ Scroll down (element enters) → **Play** (fade-in reveal).
  - ⬇️ Continues down (element leaves top) → **None** (stays visible).
  - ⬆️ Scroll up (element re-enters from top) → **None** (already visible, no re-animation).
  - ⬆️ Scroll far up (element leaves bottom) → **Reverse** (fades out smoothly, ready to re-reveal).
- **FORBIDDEN:** `"play reverse play reverse"` and `"play none none reset"` — cause flickering or abrupt snaps.
- Applied uniformly to **section containers**, not individual elements.
- No excessive stagger — max `0.15s` between items if stagger is used.
- No `scale`, no `rotateX/Y`, no `filter: blur()` on mobile.

---

## 7. IMPLEMENTATION LOCATION

All mobile rules live in **one place only:**

```
assets/css/responsive.css → @media (max-width: 767px) { ... }
```

Animation guards live in:
```
assets/js/animations.js → ScrollTrigger.matchMedia({ "(max-width: 767px)": ... })
```

### Files this contract protects (DO NOT MODIFY for mobile):
- `tokens.css` — Global design tokens (shared)
- `main.css` — Desktop component styles
- `ambient-light.css` — Desktop atmosphere effects

---

## 8. ENFORCEMENT CHECKLIST

Before any mobile work, verify:

- [ ] Font size uses a `--mobile-text-*` token
- [ ] Section title uses `--mobile-text-h2` (not a custom value)
- [ ] **Visual Hierarchy Check:** H2 must be clearly larger than Body at 375px. (If not, update global token, NOT section).
- [ ] Body text uses `--mobile-text-body`
- [ ] Horizontal padding is `clamp(18px, 5vw, 24px)`
- [ ] Section vertical padding is `clamp(60px, 12vw, 90px)`
- [ ] No horizontal overflow (test at 375px)
- [ ] No desktop animation running on mobile
- [ ] All changes are inside `@media (max-width: 767px)`
- [ ] No modifications to `tokens.css` or `main.css`
- [ ] **Range Test:** Validated at 360 / 375 / 390 / 414 / 430px — hierarchy, margins, and layout are coherent across all sizes.

---

## 9. MOBILE RANGE CONSISTENCY (≤767px)

> **Goal:** The mobile design must look COHERENT across small and large phones (360–430 CSS px), without hierarchy changes or layout breaks.

### Rules

1. **No raw `vw` without limits.**
   All mobile values (titles, body, padding, gaps) MUST use `clamp(min, ideal, max)` to prevent inflation on large phones.

2. **Design range and testing targets:**
   | Device Class   | Width  | Example               |
   |----------------|--------|-----------------------|
   | Small Android  | 360px  | Galaxy S series       |
   | Standard       | 375px  | iPhone 12/13/14       |
   | Mid-large      | 390px  | iPhone 14 Pro         |
   | Large Android  | 414px  | Pixel 7               |
   | Max            | 430px  | iPhone Pro Max        |
   
   All must maintain: **same hierarchy + same perceived margins**.

3. **Container padding — fluid but bounded:**
   `padding-inline: clamp(18px, 5vw, 24px)` — avoids "too wide" at 430px and "too cramped" at 360px.

4. **Unified mobile typography (no sub-breakpoints):**
   - All sizes from `--mobile-text-*` tokens with `clamp()`.
   - **FORBIDDEN:** `@media (min-width: 430px) { font-size: bigger }` inside mobile range.
   - Variation between 360px and 430px must be subtle and controlled by clamp bounds.

5. **Images and modules:**
   - Always `max-width: 100%` — no fixed `px` widths.
   - If a module shouldn't grow on large phones, cap with `rem` or `ch` (e.g., `max-width: 38ch` for text).

### Implementation
- All rules apply ONLY inside `@media (max-width: 767px)` in `responsive.css`.
- **A section is NOT done until validated at 360 / 375 / 390 / 414 / 430px in DevTools.**

---

## 10. SECTION REFINEMENT QUEUE (Future Phases)

After this contract is active, sections will be refined **one by one** in this order:

1. ~~Hero~~ ✅
2. ~~Manifesto~~ ✅
3. Location (Map + Pillars)
4. Carousel
5. Master Plan
6. Timeline (Progress)
7. Participation (Cards)
8. Team
9. CTA (Dossier)
10. Footer
11. Header (already done — validate only)

Each section refinement must comply with this contract.
No exceptions.
