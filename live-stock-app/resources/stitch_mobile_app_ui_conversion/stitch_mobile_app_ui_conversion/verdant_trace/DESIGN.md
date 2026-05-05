# Design System Philosophy: The Digital Pastoral

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Digital Pastoral."** In the context of livestock management and welfare, our goal is to bridge the gap between high-utility enterprise software and the organic, grounded nature of the field. 

We move beyond the "industrial" look of traditional management tools by embracing a **High-End Editorial** aesthetic. This means rejecting rigid, grid-locked boxes in favor of intentional asymmetry, generous whitespace, and tonal depth. The interface should feel as intentional and premium as a high-end architectural journal—conveying authority through clarity and empathy through soft, organic forms.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is rooted in the natural world: Forest Greens for authority, Soft Whites for breathability, and Mint accents for vitality.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or containment. Traditional lines create visual "noise" that clutters the user’s cognitive load. 
- **Definition through Shift:** Boundaries must be defined solely through background color shifts. For example, a card (`surface_container_lowest`) sits on a page background (`surface`) without a stroke.
- **Tonal Transitions:** Use the `surface_container` tiers to distinguish functional areas.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, similar to stacked sheets of heavy-stock vellum:
- **Base Layer:** `background` (#f6faf7) – The foundational canvas.
- **Sectional Layer:** `surface_container_low` (#f1f5f2) – Used for grouping related content blocks.
- **Action Layer:** `surface_container_lowest` (#ffffff) – Reserved for primary cards and input areas to provide maximum "pop."

### Signature Textures
To escape a flat, "out-of-the-box" feel:
- **Gradients:** Use subtle linear gradients on primary CTAs, transitioning from `primary` (#00612c) to `primary_container` (#007d3a). This adds a "weighted" feel that flat colors lack.
- **Glassmorphism:** For floating elements like Bottom Sheets or Navigation Bars, use `surface` with 80% opacity and a `20px` backdrop-blur.

---

## 3. Typography: Editorial Authority
We use a dual-typeface system to balance character with legibility.

- **Display & Headlines (Manrope):** Use Manrope for all `display` and `headline` tokens. Its geometric yet warm curves suggest modernity and community. Use `display-lg` with tight letter-spacing (-0.02em) for high-impact stats or welcome screens to create a "magazine" feel.
- **Body & Labels (Inter):** Use Inter for all `body`, `title`, and `label` tokens. Inter is a workhorse that ensures data density remains legible even in high-glare outdoor environments.

**Intentional Asymmetry:** Don't feel forced to center-align everything. Aligning `headline-sm` to the left while keeping supporting `body-md` text slightly inset creates a sophisticated, editorial rhythm.

---

## 4. Elevation & Depth: Tonal Layering
Depth is achieved through "Tonal Stacking" rather than structural shadows.

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The subtle 2% difference in luminosity creates a soft, natural lift.
- **Ambient Shadows:** Shadows should be used only for elements that physically "float" (e.g., Modals, FABs). Use a `32px` blur with 4% opacity, using the `on_surface` color as the shadow base. This mimics natural light rather than a digital drop-shadow.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use `outline_variant` (#becabc) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Soft & Intentional

### Buttons
- **Primary:** Rounded `full` (pill-shaped). Background: `primary` to `primary_container` gradient. Text: `on_primary` in `label-md`.
- **Secondary:** `surface_variant` background with `on_surface_variant` text. No border.
- **Tertiary:** Text-only using `primary` color, reserved for low-priority actions like "Cancel."

### Input Fields
Following the login screen's lead:
- Use `surface_container_low` for the field background. 
- **Shape:** `md` (0.375rem) or `lg` (0.5rem) for a friendly, approachable feel.
- **Icons:** Use `outline` (#6f7a6e) for trailing/leading icons to maintain a soft contrast.

### Cards & Lists
- **The Divider Ban:** Strictly forbid 1px horizontal dividers. 
- **Separation:** Separate list items using `12px` of vertical whitespace or by alternating very subtle background tints between `surface` and `surface_container_low`.
- **Nesting:** Place health status chips (`secondary_container`) within the card to create a clear informational hierarchy.

### Livestock Welfare Chips
- Use `secondary_container` (#d0e9d4) for "Healthy/Active" states.
- Use `error_container` (#ffdad6) for "Alert/Critical" states.
- Shape should always be `full` (pill) to contrast against the softer `lg` corners of cards.

---

## 6. Do's and Don'ts

### Do
- **DO** use generous padding (min 24px) around containers to let the "Digital Pastoral" aesthetic breathe.
- **DO** use `surface_bright` to highlight active navigation states.
- **DO** leverage the `xl` (0.75rem) corner radius for high-level containers to emphasize the "Community" and "Welfare" personality.

### Don't
- **DON'T** use pure black (#000000) for text. Always use `on_background` or `on_surface` to keep the palette organic and soft.
- **DON'T** use 100% opaque, high-contrast borders. They break the editorial flow.
- **DON'T** overcrowd the screen. If a management dashboard feels "busy," increase the whitespace and use typography scale—not lines—to group the data.