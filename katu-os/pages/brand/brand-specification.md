---
title: "KatuOS – Brand Specification"
permalink: /katu-os/brand/brand-specification/
---

# KatuOS – Brand Specification

This document defines the **official and immutable visual identity** of KatuOS.
Any visual asset, reproduction, or derivative work **must comply strictly**
with this specification.

This is a **normative document**.

## Rasterization Rule (Normative)

All PNG exports **must always** be generated directly from the SVG master files.

**Forbidden:**
- PNG → PNG rescaling
- PNG → PNG editing
- Reusing previously exported PNGs after SVG changes

**Mandatory pipeline:**
SVG master → PNG exports

This rule guarantees:
- no granulation
- correct anti-aliasing
- color fidelity
- deterministic visual output

The SVG master files are the **only valid sources** for raster exports.
---

## 1. Project Identity

- **Project name:** KatuOS
- **Category:** Deterministic Real-Time Operating System (RTOS)
- **Target domain:** Embedded systems and microcontrollers
- **Design philosophy:** Correct by Design

---

## 2. Official Tagline

- **Tagline:** `Correct by Design`

The tagline must always appear **exactly as written**, preserving:
- capitalization
- spacing
- wording

No alternative slogans or translations are allowed.

---

## 3. Master Logo (Single Source of Truth)

### 3.1 Definition

The following file is the **single source of truth** for the KatuOS visual identity:

- **File:** `KatuOS_logo_master.png`

This file defines:
- geometry
- proportions
- layout
- color palette
- graphical style

### 3.2 Normative Rule

> Any reproduction or generation of the KatuOS logo **must be visually equivalent**
> to the master logo.  
> **Redesign, reinterpretation or creative variation is explicitly forbidden.**

If a result is not visually equivalent, it is **invalid**.

---

## 4. Logo Composition (Structural Description)

The KatuOS logo is composed of the following **fixed elements**:

1. A jaguar (onça) head, profile view
2. A shield / badge background with **flat bottom**
3. The text `KatuOS`, centered
   - `OS` visually emphasized
4. A horizontal separator line
5. The tagline `Correct by Design` below the separator

### 4.1 Explicit Prohibitions

The following elements **must never be added**:

- triangular or pointed bottom extensions
- altered shield geometry
- additional decorative shapes
- alternative layouts

---

## 5. Color Palette (Normative)

The official color palette is defined as follows:

| Element            | Color Name        | HEX Value |
|--------------------|------------------|-----------|
| Primary Gold       | Gold             | #F2C200   |
| Dark Green         | Dark Green       | #0F2A1A   |
| Black              | Black            | #000000   |
| White              | White            | #FFFFFF   |
| Eye Highlight      | Bright Green     | #3AFF00   |

### 5.1 Color Rules

- Hue **must not change**
- Brightness variations are allowed only for highlights and glow
- No recoloring or palette reinterpretation is allowed

---

## 6. Graphic Style

The visual style of KatuOS is defined as:

- high contrast
- sharp contours
- subtle glow
- badge / shield aesthetic
- technical and precise appearance

The logo must **not** appear:
- cartoonish
- playful
- sketch-like
- hand-drawn

---

## 7. Allowed Operations

The following operations are explicitly allowed:

- resizing with preserved aspect ratio
- exporting PNG derivatives from the master
- usage on light or dark backgrounds
- minor anti-aliasing inherent to scaling

---

## 8. Forbidden Operations

The following operations are **strictly forbidden**:

- redesigning the logo
- altering geometry or proportions
- adding or removing elements
- changing typography
- modifying shield outline
- stylistic reinterpretation

---

## 9. AI-Assisted Generation Rules

When AI-based tools are used, the following rules are mandatory:

1. The master logo **must** be provided as reference
2. The task must be explicitly described as:
   - *faithful reproduction*
   - *not a redesign*
3. Any creative freedom must be disabled or minimized

> AI tools may be used for **reproduction**, never for **reinterpretation**.

---

## 10. Official Variants

The following variants are officially allowed:

- full logo (master)
- icon-only version (jaguar head)
- monochrome version
- favicon / small icon

Any new variant requires explicit approval.

---

## 11. Repository Placement

Recommended structure:

```
/brand/
├─ brand.md
├─ KatuOS_logo_master.png
├─ KatuOS_logo_icon.png
└─ exports/
```

---

## 12. Design Philosophy Alignment

The KatuOS visual identity follows the same principles as its kernel design:

- determinism
- clarity
- auditability
- absence of hidden heuristics

The brand is **Correct by Design**, just like the scheduler.

---

**End of KatuOS Brand Specification**

