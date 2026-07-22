---
title: "Revision History"
permalink: /katu-os/standards/editorial-principles/
---

<div style="height:60px;"></div>

<p align="center">
  <img src="{{ '/assets/images/katuos/brand/exports/KatuOS_512_clean.png' | relative_url }}" alt="KatuOS Logo" width="280">
</p>

<h1 align="center">
KatuOS Editorial Principles
<div style="height:10px;"></div>
</h1>

<p align="center">
<i>Revision A — July 2026</i>
</p>

<div style="page-break-after: always;"></div>

<hr>

# Revision History

| Revision | Description |
|----------|-------------|
| RevA | Initial release |

<hr>

<div style="page-break-after: always;"></div>

# Table of Contents

1. Architecture First

2. Hardware-Agnostic Kernel

3. CPU Port as the Hardware Boundary

4. Architecture Before Platform

5. Explain Intent, Not Mechanics

6. Timeless Documentation

7. Stable Terminology

8. Editorial Consistency

9. Professional Embedded Style

10. Documentation as Part of the Architecture

11. Final Principle
    
<div style="page-break-after: always;"></div>

> **Editorial Mission**
>
>The KatuOS documentation is intended to make the kernel easier to understand without increasing its implementation complexity.
>
>Every comment should reinforce the architectural principles that define the kernel itself: simplicity, determinism, consistency, predictability, and long-term maintainability.
>

---

# Purpose

This document defines the editorial principles adopted throughout the KatuOS project.

While the Documentation Style Guide specifies how documentation should be written, this document defines what the documentation should communicate and which architectural principles it must reinforce.

The objective is to ensure that every source file contributes to a consistent understanding of the kernel architecture, regardless of the module, author, or development stage.

Documentation is considered an integral part of the architecture and must evolve together with the implementation.

>**Every official KatuOS document shall follow a common visual structure, ensuring a consistent editorial identity throughout the project documentation.**

---

# 1. Architecture First

Documentation shall explain the architecture before describing the implementation.

Readers should understand the purpose of a module within the kernel before learning how it is implemented.

Whenever possible, comments should answer questions such as

- Why does this module exist
- What architectural role does it play
- What responsibilities does it have
- What assumptions does it make
- What guarantees does it provide

Implementation details should remain secondary.

---

# 2. Hardware-Agnostic Kernel

The KatuOS Kernel Core is completely independent of any specific hardware platform.

Kernel documentation shall never refer to

- microcontroller families;
- semiconductor vendors;
- SDKs;
- HALs;
- evaluation boards;
- device-specific peripherals.

Instead, kernel modules should describe their interaction only through the abstract CPU Port interface.

This separation reflects the architectural independence of the kernel itself.

---

# 3. CPU Port as the Hardware Boundary

The CPU Port is the only layer allowed to describe architecture-dependent implementation details.

Hardware-specific information belongs exclusively to this layer.

Examples include

- processor architecture;
- exception model;
- register conventions;
- stack layout;
- context switch implementation;
- assembly routines.

The Kernel Core should remain completely unaware of these details.

---

# 4. Architecture Before Platform

CPU Port documentation shall describe the implemented architecture before mentioning any validation platform.

The preferred information hierarchy is

``` text
     Architecture
          ↓
    Implementation
          ↓
  Validation Platform
```

**For example**

 This module implements the CPU Port interface required by the KatuOS kernel for the ARM Cortex-M0+ architecture.

followed by

 This implementation has been validated using the Texas Instruments MSPM0 family as the reference platform.

The validation platform is provided only as implementation context and shall never define the architectural identity of the module.

---

# 5. Explain Intent, Not Mechanics

Source code already explains how.

Documentation should explain why.

Comments should focus on

- architectural intent;
- design rationale;
- constraints;
- invariants;
- interactions between modules;
- expected behavior.

Avoid comments that merely repeat the implementation.

---

# 6. Timeless Documentation

Documentation should remain accurate throughout the lifetime of the project.

Avoid wording that depends on time, such as

- currently
- today
- now
- initially
- future versions
- at the moment

Prefer descriptions that remain valid even after future architectural evolution.

---

# 7. Stable Terminology

Each architectural concept shall use a single official name throughout the entire project.

Examples include

- Task
- Scheduler
- Kernel Tick
- Context Switch
- Ready State
- Blocked State
- Suspended State
- CPU Port
- Kernel Core
- Idle Task
- Software Timer
- Maintenance Process
- Stack Pattern
- Sanity Check
- CPU Load

Alternative terminology should only be introduced when technically required.

---

# 8. Editorial Consistency

Every source file should appear as though it were written by the same engineering team.

Documentation shall maintain a consistent

- vocabulary;
- structure;
- tone;
- level of detail;
- architectural perspective.

Consistency improves readability, maintainability, and long-term project quality.

---

# 9. Professional Embedded Style

Documentation should reflect the quality expected from mature embedded software projects.

The objective is not to imitate other kernels, but to achieve the same level of clarity, consistency, and technical precision found in projects such as

- CMSIS
- FreeRTOS
- ThreadX
- Zephyr

The preferred writing style is

- concise;
- technically accurate;
- objective;
- neutral;
- architecture-oriented.

---

# 10. Documentation as Part of the Architecture

Documentation is not an accessory to the implementation.

It is one of the architectural assets of the project.

Well-written documentation allows developers to understand the design principles before studying the implementation itself.

Every reviewed source file should reinforce the same qualities that define the KatuOS kernel

- simplicity;
- determinism;
- consistency;
- predictability;
- auditability;
- maintainability.

---

# Final Principle

A reader should be able to understand the philosophy of KatuOS before understanding its implementation.

The documentation should communicate not only how the kernel works, but also why it was designed that way.

Like the kernel itself, the documentation should remain simple enough to understand, precise enough to trust, and consistent enough to evolve.

> **Architecture is communicated as much by documentation as by code.**

---