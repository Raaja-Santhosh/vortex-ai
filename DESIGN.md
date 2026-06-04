---
name: Vortex OS Brutalist Premium
colors:
  surface: '#000000'
  surface-dim: '#0C0C0C'
  surface-bright: '#1A1A1A'
  surface-container-lowest: '#050505'
  surface-container-low: '#0A0A0A'
  surface-container: '#121212'
  surface-container-high: '#1E1E1E'
  surface-container-highest: '#2A2A2A'
  on-surface: '#FFFFFF'
  on-surface-variant: '#A3A3A3'
  inverse-surface: '#FFFFFF'
  inverse-on-surface: '#000000'
  outline: '#333333'
  outline-variant: '#1A1A1A'
  primary: '#FFFFFF'
  on-primary: '#000000'
  primary-container: '#FFFFFF'
  on-primary-container: '#000000'
  secondary: '#E5E5E5'
  on-secondary: '#000000'
  error: '#FF453A'
  on-error: '#FFFFFF'
  error-container: '#3A0A0A'
  on-error-container: '#FFB4AB'
  background: '#000000'
  on-background: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Geist Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  mono-label:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  mono-code:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 0.25rem
  DEFAULT: 0px
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1440px
  gutter: 24px
---

# Design Strategy: Premium Brutalist Monochome

This UI mimics the ultra-high-end aesthetic of developers' favorite tools: Vercel, Linear, and Midday.ai.
We are abandoning the "15-year-old SaaS" look and embracing **Professional Precision**.

## 1. Color Architecture
Strictly Black and White. The background is pure `#000000` or `#0C0C0C`. Text is `#FFFFFF`.
Use varying shades of very dark gray (e.g., `#121212`, `#1A1A1A`) to define hierarchy instead of lines or shadows.

## 2. The "No Shadow" Rule
Professional brutalism does not use soft drop shadows. We separate elements using:
- **1px hairline borders:** Use `outline-variant` (#1A1A1A) for extremely subtle grid lines.
- **Micro-textures:** Dithered backgrounds or subtle noise overlays can add premium depth.
- **Expansive Negative Space:** Use massive padding (e.g., `32px` or `48px`) to make content breathe.

## 3. Typography: Editorial Scale
Use a modern sans-serif (like Geist Sans or Inter) mixed with monospace (Geist Mono) for data.
- **Numbers & Metrics:** Use `display-lg` with tight letter spacing (`-0.04em`) to look sharp and authoritative.
- **Labels:** Use `mono-label` uppercase with wide tracking (`0.05em`) for secondary metadata (like "MRR" or "STATUS").

## 4. Components
- **Cards:** Flat `#121212` backgrounds with sharp corners (0px) or very slight rounding (8px max). A 1px `#333333` border.
- **Buttons:** Pure White background with Black text. Hover states invert to Black background with White text and a White border.
- **Charts:** Use a 1px solid white line. No gradients underneath. Just raw, pure data visualization.
- **Sidebar:** Minimalist, no background color, just text links that turn white when active, staying `#A3A3A3` when inactive.

This design should feel like a high-end Swiss watch: precise, monochromatic, unyielding, and incredibly fast.
