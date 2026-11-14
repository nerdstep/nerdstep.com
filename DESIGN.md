---
name: nerdstep
description: Justin Williams's work as a lit hive, a charcoal honeycomb where only the projects glow.
colors:
  hive-charcoal: "oklch(0.13 0.004 270)"
  raised-graphite: "oklch(0.175 0.005 270)"
  hive-glass: "oklch(0.18 0.005 270 / 0.64)"
  muted-graphite: "oklch(0.245 0.006 270)"
  off-white: "oklch(0.965 0.003 270)"
  muted-ink: "oklch(0.72 0.008 270)"
  hairline: "oklch(1 0 0 / 9%)"
  ember-red: "hsl(355 70% 55%)"
  signal-blue: "hsl(210 70% 55%)"
  sprout-green: "hsl(130 70% 55%)"
  open-violet: "hsl(270 70% 55%)"
  tagline-sky: "oklch(0.746 0.16 232.661)"
  live-green: "oklch(0.696 0.17 162.48)"
typography:
  title:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.025em"
  name:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.375rem"
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  meta:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "0.01em"
rounded:
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  hex-gap: "10px"
  panel: "20px"
  stack: "16px"
  hex-width: "210px"
components:
  button-primary:
    backgroundColor: "{colors.off-white}"
    textColor: "{colors.hive-charcoal}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.off-white}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
  button-icon-social:
    backgroundColor: "{colors.hive-charcoal}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.full}"
    size: "36px"
  chip-stack:
    backgroundColor: "{colors.muted-graphite}"
    textColor: "{colors.off-white}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  hex-cell:
    backgroundColor: "{colors.hive-glass}"
    textColor: "{colors.off-white}"
    width: "{spacing.hex-width}"
  drawer:
    backgroundColor: "{colors.raised-graphite}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.xl}"
    width: "640px"
---

# Design System: nerdstep

## Overview

**Creative North Star: "The Lit Hive"**

nerdstep.com is a dark charcoal lattice where only the work gives off light. The home page is a honeycomb of translucent glass cells set into a background grid drawn on the very same lattice, so the featured cells read as the lit chambers of one hive rather than cards placed on a page. Each project owns a hue, and that hue is the only color in the room. It glows softly behind its cell, tints the glass from beneath, and lights the cell's rim when touched. Everything else (surfaces, text, structure) is neutral charcoal with a faint cool cast, so the projects are unmistakably the subject.

The system is precise and tactile. Geometry is exact: cells share one lattice pitch, gaps run as even channels, and the background grid's edges run down the middle of every gap. Interaction is physical and small, a rim that lights, a plus that rotates, a cell that cascades in beside its neighbor. Personality comes from motion and detail (particles running along the lattice channels, a cascade that starts beside the logo and circles the profile), never from ornament. Density is low; the honeycomb is a single composed object, and depth opens in a side drawer rather than a new page.

The palette was deliberately moved off the slate-blue template default so the neutrals carry no hue of their own. Surfaces are flat and tonal; translucency and glow replace shadows.

**Key Characteristics:**

- One lattice for everything: honeycomb cells and background grid share size, pitch, and alignment.
- Color comes only from the projects; neutrals are hue-free charcoal.
- Glass cells over a living background (drifting project glows, particles in the channels).
- Precise geometry, small tactile responses, and motion that follows the hive's own structure.
- One type family (Manrope) with a small named role scale.

## Colors

Near-black charcoal neutrals with a whisper of cool, and four saturated project hues that carry all of the color.

### Primary

- **Ember Red** (`hsl(355 70% 55%)`): Mostly Recipes. Its cell glow, rim, icon tile, and drawer accent bar.
- **Signal Blue** (`hsl(210 70% 55%)`): Mostly Page, in the same roles.
- **Sprout Green** (`hsl(130 70% 55%)`): Mostly Garden, in the same roles.
- **Open Violet** (`hsl(270 70% 55%)`): the open-source cell, its list drawer, and every open-source project inside it.

Cells without a project (logo, intro, connect, location, tagline) take generated hues stepped by the golden angle from a 210° seed (40°, 178°, 315°, 93°, 230°). Those hues appear only in a cell's small kind label and its hover rim.

Every hue is used at two lightnesses. The 55% value is the glow, rim, and accent bar. Small text on charcoal uses a lightened `hsl(<hue> 70% 68%)` (the kind labels), which keeps each label at WCAG AA.

### Secondary

- **Tagline Sky** (`oklch(0.746 0.16 232.661)`): the single emphasized word "mostly" in the tagline. Nowhere else.
- **Live Green** (`oklch(0.696 0.17 162.48)`): the small status dot beside "Live". Amber marks work in progress.

### Neutral

- **Hive Charcoal** (`oklch(0.13 0.004 270)`, `#070709`): the page, the theme color, and the icon tiles.
- **Raised Graphite** (`oklch(0.175 0.005 270)`, `#101013`): drawers and cards, one tonal step above the page.
- **Hive Glass** (`oklch(0.18 0.005 270)` at 64% on wide screens, 84% below `lg`): the cell fill. It's translucent so the project glows show through.
- **Muted Graphite** (`oklch(0.245 0.006 270)`): chip and hover fills.
- **Off-White** (`oklch(0.965 0.003 270)`): primary text. Never pure white, which halates on dark screens.
- **Muted Ink** (`oklch(0.72 0.008 270)`): secondary text and definition terms (7.6:1 on Raised Graphite).
- **Hairline** (white at 9%): borders, dividers, and the background lattice strokes.

### Named Rules

**The Light Comes From the Work Rule.** Neutrals carry no hue (chroma ≤ 0.008). The only saturated color on screen belongs to a project or a cell's own label. A new color must be a project's.

**The Two Lightnesses Rule.** A hue is the 55% value as light (glow, rim, bar) and the 68% value as text. Never set small text in the 55% value.

## Typography

**Body Font:** Manrope Variable (with a metric-matched Arial fallback, then the system sans)

**Character:** One geometric, slightly quirky grotesque for everything. It's technical without dressing up as sci-fi. Roles separate by size, weight, tracking, and color, never by a second family. Manrope's word spaces are tight, so running prose opens them up.

### Hierarchy

- **Title** (600, 24px, 32px line height, -0.025em): drawer and page titles. A 1.5× step above body.
- **Name** (600, 16px, -0.025em): an item's name where it heads its own content, such as open-source list rows. Honeycomb cell names use the same face at 14px, rising to 16px from `sm`.
- **Body** (400, 16px, 1.7 line height, word spacing +0.06em): drawer prose. Held to a 32rem measure (about 60 to 70 characters a line), off-white at 85%, with 16px between paragraphs and `text-wrap: pretty`.
- **Meta** (400, 14px): secondary copy beside a name or title, such as one-liners, the role, and drawer descriptions. Muted Ink.
- **Label** (500, 12px, +0.01em): kind labels (lowercase, in the cell's hue), definition terms, status, and stack chips. Color and case tell labels apart, not size.

The intro name is the one deliberate exception: 700 weight, 16px rising to 18px.

### Named Rules

**The One Family Rule.** Manrope carries every role. Add a second family only for a role Manrope cannot perform, never for "a slightly different sans".

**The No Faux Italic Rule.** Manrope ships no italic. Emphasize with weight or color, never with a synthesized slant.

**The Heading Outranks Its Body Rule.** A name or title is never smaller or lighter than the text it heads.

## Layout

The home page is a single composed honeycomb, centered in the viewport.

- **Lattice.** The cells are flat-top hexagons 210px wide (height 0.866 × width) with 10px gaps. Columns interlock at three-quarters of the width plus the gap, which keeps every gap between neighbors exactly 10px. The background grid is the same lattice: each grid cell spans a honeycomb cell plus half the gap on every side, so grid edges run down the middle of each gap and every honeycomb cell sits in exactly one grid cell. Grid cells under honeycomb cells are left unshaded, so the gaps read as even channels.
- **Formations.** At `lg` (1024px) and up, the cells form a five-column flower around the intro cell. Below `lg` they become a two-column zigzag stack. Crossing the breakpoint morphs cell positions over 600ms.
- **Scale.** On wide, tall screens the whole honeycomb and its content grow in steps: 1.1× at 1600px wide and 880px tall, 1.2× at 1880 × 940, and 1.5× at 2400 × 1200. Steps ease over 450ms. Smaller or shorter screens stay at 1×.
- **Depth opens beside the hive.** Details open in a 640px drawer from the right on screens 640px and wider. Below that, a bottom sheet with a swipe handle opens to nearly full height. The drawer has 20px padding and a 16px rhythm between blocks.

## Elevation & Depth

The system has no drop shadows. Depth comes from four sources:

- **Tonal layering:** Hive Charcoal, then Raised Graphite.
- **Translucency:** glass cells let the project glows show through.
- **Light:** a soft radial glow of each project's hue sits behind its cell and drifts slowly (36s).
- **Bevels on the glass:** a 1px light line along the top edge and a 1px dark line along the bottom, plus a faint specular highlight near the top left.

The drawer backdrop dims and lightly blurs the hive behind it.

### Named Rules

**The Glow Not Shadow Rule.** Lift is expressed with light (a hue glow, an accent rim) or a tonal step, never with an offset shadow.

**The No Blur On Cells Rule.** Cells never use a backdrop blur. Their clip path makes them a backdrop root, so a blur sees only the cell's own rim. It changed nothing visually and made Chrome flicker on hover.

## Shapes

- **The hexagon is the signature form.** It's a flat-top polygon with points at 25% and 75% of the width, clipped with `clip-path`. Hit testing follows the clip, so only the hexagon itself responds to the pointer.
- **Rectangles get gently rounded corners.** Buttons and screenshots use 10px. Drawers use 14px on the edge facing the page.
- **Pills and circles** are for small things only: stack chips, status pills, social buttons, and the avatar.
- **Icons are drawn,** from Tabler at a consistent stroke. App icons are rounded-square tiles (the manifesto mark is its own hexagon).

## Components

### Hex Cell (signature)

Glass chambers of the hive, quiet until touched.

- **Shape:** a flat-top hexagon at 210px, scaled by the hex-scale steps.
- **Fill:** Hive Glass over a 2px rim of Hairline, with top and bottom bevels and a specular highlight.
- **Content:** centered. It scales with the hex, so text and icons grow with the cell.
- **Hover / focus:** only on interactive cells. The rim lights in the cell's hue, and a radial glow of that hue rises from the bottom edge. Both fade in over 200ms on opacity only, and they fade together, so nothing overshoots. Keyboard focus looks the same.
- **Plus affordance:** a small plus beside a project name rotates 90° on hover, and stays attached to the name's last line when it wraps.
- **Entrance:** cells cascade in one at a time, 90ms apart, scaling from 0.8 over 350ms along a path of neighboring cells. The logo is painted immediately.

### Drawer

Where depth opens, beside the hive rather than over it.

- **Container:** Raised Graphite, a Hairline border on the edge facing the page, and 14px corners on that edge.
- **Header:** pinned at the top while the body scrolls. It holds the project's app icon, a lowercase kind label in the project's hue with the status beside it, the Title, and a short 2px accent bar in the hue.
- **Body:** a screenshot (10px corners, Hairline border), then Body prose, then a role and stack list, then actions.
- **Scrollbar:** thin, in Muted Ink at 35%, with its space reserved so expanding a project doesn't shift the layout.
- **Motion:** slides in over 450ms on `cubic-bezier(0.22, 1, 0.36, 1)`. The bottom sheet can be swiped down to dismiss.

### Open-Source Accordion

- **Rows:** app icon, Name, status, and a Meta one-liner. Rows are separated by Hairline dividers.
- **Opening:** one row open at a time. The plus rotates 45° into an ×, and the panel's height animates over 200ms. The open panel holds the same body as a project drawer.

### Buttons

- **Primary:** Off-White fill with Hive Charcoal text, 10px corners, padding 8px by 14px, and an arrow icon for external links. It lifts 1px on hover. Focus shows a 2px ring in the project's hue, offset from the surface.
- **Secondary:** transparent with a Hairline border. Hover fills it with Muted Graphite.
- **Social:** a 36px circular icon button with a Hairline border. Hover adds a 2px ring with an offset.

### Chips

- **Stack chip:** a Muted Graphite fill at 40% with a Hairline border, Label type, and a pill shape. Chips are static tags, not filters.

### Background Lattice

The hive itself: grid cells with faint random shading and Hairline strokes. Seven small colored particles travel along the grid edges with fading trails. They stay within the visible area, turn back at its edges, and run visibly through the 10px channels between cells.

## Do's and Don'ts

### Do

- **Do** give every new project its own hue at `hsl(<hue> 70% 55%)` for light and `68%` for small text, and keep every other color neutral.
- **Do** align anything set on the background to the shared lattice (210px cells, 10px gaps). A new cell occupies exactly one lattice cell.
- **Do** express interaction with light and small physical motion (rim, glow, rotation, 1px lift), fading over about 200ms on opacity.
- **Do** use the five type roles (Title, Name, Body, Meta, Label) instead of new arbitrary sizes.
- **Do** keep prose at about 60 to 70 characters a line, with opened word spacing and pretty wrapping.
- **Do** honor `prefers-reduced-motion`: there are no particles, cascade, or drift, and changes happen instantly.

### Don't

- **Don't** reintroduce slate or any tinted neutral. Neutrals stay at chroma 0.008 or below.
- **Don't** use drop shadows, or backdrop blur on cells.
- **Don't** set small text in a hue's 55% value, or synthesize an italic.
- **Don't** add a second type family without a role Manrope cannot perform.
- **Don't** add background effects that compete with the cells. Hover waves and click ripples were tried and removed as gimmicky.
- **Don't** use pure black or pure white. The darkest value is Hive Charcoal and the lightest is Off-White.
