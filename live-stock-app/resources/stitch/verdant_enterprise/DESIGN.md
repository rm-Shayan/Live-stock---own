# Design System Specification: Livestock Enterprise Framework

## 1. Overview & Creative North Star
**Creative North Star: "The Verdant Archive"**

This design system transcends the typical "industrial dashboard." It is a high-end editorial experience designed for the Saylani Livestock Tracking & Processing System. We move away from the rigid, boxy constraints of traditional enterprise software toward a "Verdant Archive"—an aesthetic that feels as organized as a ledger but as organic as the livestock it tracks.

The system utilizes **Intentional Asymmetry** and **Tonal Depth** to build trust. We reject the "template" look by favoring white space over lines and elevation through color rather than shadows. The goal is to create a digital environment that feels premium, authoritative, and profoundly calm.

---

## 2. Colors & Surface Architecture

The palette is rooted in the "Saylani Green," but expanded into a sophisticated range of tonal containers to define hierarchy without visual clutter.

### The "No-Line" Rule
**Borders are a failure of hierarchy.** Within this system, 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through:
1.  **Background Shifts:** A `surface-container-low` card sitting on a `background` base.
2.  **Tonal Transitions:** Using `surface-bright` for interaction zones against `surface-dim` for navigation.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, similar to stacked sheets of high-grade vellum.
*   **Base Layer (`surface` / `#f8f9ff`):** The canvas.
*   **Secondary Layer (`surface-container-low` / `#eff4ff`):** Used for large content groupings.
*   **Primary Interaction Layer (`surface-container-lowest` / `#ffffff`):** Reserved for the most important data cards and input forms to make them "pop" against the subtle off-white backgrounds.

### The Glass & Gradient Rule
To instill a sense of modern "soul," use the following:
*   **Main CTAs:** Apply a linear gradient from `primary` (#0c6328) to `primary-container` (#2e7d3e) at a 135-degree angle.
*   **Floating Navigation:** Use `surface-container-lowest` with 80% opacity and a `20px` backdrop-blur to create a "frosted glass" effect for headers or floating action buttons.

---

## 3. Typography: The Editorial Voice

We utilize a dual-font strategy to balance character with readability.

*   **Display & Headlines (Manrope):** Chosen for its geometric authority. Used for high-level statistics and page titles. High-contrast sizing (e.g., `display-lg` at 3.5rem) creates an editorial, premium feel.
*   **Body & Titles (Inter/DM Sans):** The workhorse. For livestock data and tracking logs, use `tabular-nums` to ensure numerical data aligns vertically, facilitating rapid scanning of weights, dates, and IDs.
*   **The Hierarchy of Trust:** Large, bold headlines convey confidence, while generous letter-spacing in `label-sm` (all-caps) provides a technical, precision-grade look for metadata.

---

## 4. Elevation & Depth

We achieve dimension through **Tonal Layering** rather than traditional structural lines.

*   **The Layering Principle:** Depth is "stacked." Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#eff4ff) section. This creates a soft, natural lift that feels integrated into the environment.
*   **Ambient Shadows:** If a "floating" element is required (e.g., a dropdown or modal), use an ultra-diffused shadow: `box-shadow: 0 12px 40px rgba(11, 28, 48, 0.06);`. The shadow is tinted with the `on-surface` color, mimicking natural ambient light.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use `outline-variant` (#bfc9bb) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), 12px radius, white text. No border.
*   **Secondary:** `surface-container-high` background with `on-primary-fixed-variant` text.
*   **Tertiary:** Ghost style. No background, `primary` text, shifts to `surface-container-low` on hover.

### Stat Cards (The Tracking Core)
*   **Structure:** No borders. `12px` rounded corners.
*   **Visual Soul:** Use a large, 20% opacity icon in the background, color-coded to the metric (e.g., a green cow icon for "Healthy").
*   **Data:** Use `title-lg` with `tabular-nums` for the primary metric.

### Badges (Status Indicators)
Badges must not be "loud." Use high-tonal, low-saturation backgrounds:
*   **Success:** `primary-fixed` background / `on-primary-fixed-variant` text.
*   **Danger:** `error-container` background / `on-error-container` text.
*   **Info:** `secondary-fixed` background / `on-secondary-fixed-variant` text.

### Input Fields
*   **Style:** `surface-container-low` background with a `2px` bottom-bar in `outline-variant` that transforms to `primary` on focus.
*   **Radius:** 12px on top corners to maintain the system's rounded language.

### Cards & Lists
*   **The Divider Ban:** Strictly forbid `<hr>` tags or divider lines. Use `16px` or `24px` of vertical white space to separate list items. Use a subtle hover state (`surface-container-highest`) to define the row's boundaries during interaction.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use `tabular-nums` for all animal weights, IDs, and financial figures.
*   **Do** use asymmetrical padding (e.g., more padding at the top of a section than the bottom) to create an editorial flow.
*   **Do** rely on the contrast between `surface-container-lowest` and `surface-container-low` to define data areas.

### Don’t
*   **Don’t** use pure black (#000000) for text. Always use `on-surface` (#0b1c30) for a softer, premium feel.
*   **Don’t** use standard 1px borders. If you feel the need for a line, try a background color shift first.
*   **Don’t** use high-saturation red for errors. Use the specified `error` and `error-container` tokens to maintain the professional "Trust-Building" aesthetic.