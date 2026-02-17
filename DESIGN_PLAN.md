# Design Plan & UI Specification: ILAKECH PROJECT

## 1. Design Plan

### Purpose & Audience
*   **Purpose:** To guide visitors through an emotional and rational journey, from spiritual connection to investor confidence, leading to a "Request Dossier" conversion.
*   **Audience:** High-net-worth investors, "Visionary Pioneers", seeking meaning, legacy, and stability.
*   **Conversion Goal:** "Solicitar Dossier" (Request Dossier).

### Emotional Arc
1.  **Awe (Hero):** Sensory immersion, atmospheric entry. "Something special is happening here."
2.  **Meaning (Manifesto):** Philosophical resonance. "I belong to this way of thinking."
3.  **Proof (Location & Plan):** Rational grounding. "This is real, strategic, and tangible."
4.  **Confidence (Team & Governance):** Trust in execution. "The right people are behind this."
5.  **Action (CTA):** Conscious decision. "I want to take the next step."

### Key Constraints
*   **Mobile-First:** Experience must be flawless on touch devices.
*   **Performance:** Fast load times, especially for heavy assets (images/animations).
*   **Accessibility:** Legible text, sufficient contrast, clear navigation.

### Design Levers
*   **Typography:** High-end serif for headings (evocative, classic) mixed with clean sans-serif for body (readable, modern).
*   **Spacing:** Generous, "breathing" whitespace to convey luxury and calm.
*   **Color:** Earth tones, deep jungle greens, limestone whites, obsidian blacks. One ceremonial accent color (e.g., deep amber or terracotta).
*   **Depth:** Parallax, layering (z-index), subtle shadows/reliefs to mimic stone carving.
*   **Motion:** Slow, deliberate, fluid. No "bouncy" or frantic animations.

### Anti-Patterns (To Avoid)
*   **Disneyland Maya:** No literal jaguar spots, corn icons, or "ancient" fonts.
*   **Generic Corp:** No stock photos of handshakes or blue/white standard palettes.
*   **Cluttered/Noisy:** Avoid competing elements. Silence is part of the design.
*   **Over-Animation:** Motion should not induce motion sickness or distract from reading.

---

## 2. UI Specification Summary

### Tokens

#### Typography System
*   **Headings (Display):** *Cinzel* or *Playfair Display* (Google Fonts). Elegant, authoritative.
    *   H1: 3.5rem - 4.5rem (Hero)
    *   H2: 2.5rem - 3rem (Section Titles)
    *   H3: 1.5rem - 2rem (Subtitles)
*   **Body:** *Inter* or *Lato* (Google Fonts). Clean, neutral, highly legible.
    *   Body: 1rem - 1.125rem (Reading text)
    *   Caption: 0.875rem (Metadata)
*   **Line-Height:** 1.5 - 1.6 for body text to slow down reading speed.

#### Color Palette
*   **Base (Backgrounds):** `Paper/Stucco` (#F5F0EB), `Deep Jungle` (#1A2e22), `Obsidian` (#111111).
*   **Surface (Cards/Overlays):** `Limestone` (#E8E4DD) with low opacity.
*   **Text:** `Charcoal` (#2C2C2C) for light backgrounds, `Mist` (#E0E0E0) for dark backgrounds.
*   **Accent:** `Ceremonial Amber` (#D4A373) or `Terroid` (#A85E48).
*   **CTA:** `Gold/Brass` (#C5A065) -> Hover: Lighten.

#### Spacing Rhythm
*   **Section Padding:** 6rem - 10rem (Desktop), 4rem - 6rem (Mobile).
*   **Grid:** 12-column max-width 1200px container for content.

### Motion Rules
*   **Scroll-Triggered:** Elements fade up and in (`y: 20px`, `opacity: 0` -> `1`).
*   **Parallax:** Subtle background movement (10-15% speed of scroll) for depth.
*   **Eases:** `power2.out` or `sine.out` for organic feel.

### Signature Moments
1.  **Moment A: Parchment Scroll (Section 4)**
    *   **Mechanism:** `Canvas` + ScrollTrigger.
    *   **Behavior:** As user scrolls through the "Master Plan" section, the parchment unrolls/draws itself (using the frame sequence).
    *   **Fallback:** If frames are missing or fail to load, display the final static image.
2.  **Moment B: The Maya Veil (Manifesto)**
    *   **Mechanism:** Fixed background attachment or Parallax layer behind text.
    *   **Behavior:** The `SIMBOLO MAYA.jpeg` sits behind the manifesto text. As user scrolls, it slowly fades or blurs, transitioning into the next section.
3.  **Moment C: The Arrival (Page Load)**
    *   **Mechanism:** Staggered fade and slide for Hero Text + Background scale.
    *   **Behavior:** Background image zooms out slowly (scale 1.1 -> 1.0). Text fades in line by line.

---

## 3. Implementation Checklist (QA)

### Functional
- [ ] Links work (CTA scrolls to form or opens modal).
- [ ] Forms validate inputs.
- [ ] Images load correctly (lazy loading for below-fold).

### Visual & Experience
- [ ] Fonts are legible on all backgrounds (contrast check).
- [ ] Mobile layout: No horizontal scrolling, touch targets >44px.
- [ ] Spacing is consistent.
- [ ] Animations are smooth (60fps), not laggy.

### Narrative
- [ ] Text matches `LANDING_STRUCTURE_AND_STORYTELLING.md` exactly.
- [ ] Section order is verified.
