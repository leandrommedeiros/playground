---
title: "KatuOS – Presentation"
permalink: /katu-os/project/
---

<p align="center">
  <img src="{{ '/assets/images/katuos/brand/exports/KatuOS_512_clean.png' | relative_url }}" alt="KatuOS Logo" width="256">
</p>

<!-- Official KatuOS logo. See /brand/brand.md for usage rules. -->

# KatuOS – Presentation


*(formerly SimpleRTOS)*

**Version:** 2026 – Premium Markdown Edition



> "Although the project is now named **KatuOS**, the public API and internal file names remain unchanged for compatibility."

KatuOS is the continuation of the project originally known as **SimpleRTOS**.
The kernel architecture, API and design philosophy have evolved while preserving
backward compatibility and the original minimalist principles.

---

## Four Pillars of KatuOS

These principles guide every architectural and design decision throughout the project.

- **Why** → System resources are intended to serve the application—not the operating system.
- **Mission** → Provide a deterministic RTOS for resource-constrained embedded systems.
- **Platform** → Support any processor architecture without changing the project's mission.
- **Positioning** → Occupy a different design space.

---

## Why KatuOS Exists

> **Because small microcontrollers deserve an RTOS designed specifically for them.**

KatuOS is a purpose-built RTOS for resource-constrained microcontrollers and embedded systems, where configuration simplicity, low memory footprint and predictable behavior matter more than feature breadth.

> **In KatuOS, system resources are intended to serve the application—not the operating system.**

It exists to provide deterministic RTOS behavior without the configuration complexity and memory cost typically associated with larger general-purpose RTOSes.

KatuOS therefore focuses on providing familiar RTOS services in a lean, bounded and purpose-built form.

> **KatuOS occupies a different design space.**

Different design space means a different engineering philosophy—not fewer features.

> **Features are intentionally bounded—not omitted.**
>
> **Every kernel service should justify the resources it consumes.**

KatuOS occupies a different design space by right-sizing kernel services for resource-constrained embedded systems. It provides familiar RTOS services in a lean, bounded and purpose-built form for resource-constrained embedded systems.

> **This principle guides every architectural decision in KatuOS. New features are expected to justify their cost in complexity, RAM and Flash, ensuring that the operating system remains an enabler for the application rather than a consumer of its limited resources.**
>
> **KatuOS is not about doing less. It is about doing things differently, guided by a clear engineering principle: providing the RTOS services developers expect, carefully implemented and right-sized so that the primary beneficiary is the application—not the kernel itself.**
>
> **KatuOS is a purpose-built RTOS that maximizes the resources available to the application by providing familiar RTOS services in a carefully right-sized form.**

---
## Origins of KatuOS

KatuOS was not created as another general-purpose RTOS.

It was born from a real embedded application rather than from a research project or an academic exercise.

The original firmware ran on a Cortex-M microcontroller and used FreeRTOS successfully, but configuring and maintaining a general-purpose RTOS on such a constrained device proved unnecessarily complex. The kernel overhead also limited the application's future growth by consuming valuable RAM and Flash resources.

Instead of adapting the application to fit the RTOS, the RTOS itself was redesigned to better fit the application.

The design goals became clear:

- preserve deterministic behavior;
- dramatically simplify kernel configuration;
- minimize memory footprint;
- provide the services commonly required by small embedded controllers.

The first stable version of KatuOS was able to replace FreeRTOS in the original application **without requiring architectural changes to the firmware**.

The migration preserved the application's behavior while reducing memory usage by approximately **30% in RAM** and **19% in Flash**.

More importantly, the recovered memory was returned to the application rather than consumed by the operating system. Those additional resources enabled new features and capabilities that would have been impractical within the original memory constraints, allowing the firmware to continue evolving without changing hardware.

---

## Documentation

This README introduces the KatuOS project, its engineering philosophy and architectural principles.

Detailed technical documentation is available under the `/docs` directory and includes:

- Scheduling, Delays & Synchronization Manual
- Kernel Architecture
- CPU Port documentation
- Porting Guide
- API Reference
- Editorial Principles
- Editorial Decisions
- CONTRIBUTING

Together these documents define both the technical behavior of the kernel and the engineering philosophy that guides its evolution.

---

## Project Naming History

This project was originally named **SimpleRTOS**.

The current name, **KatuOS**, reflects the evolved identity of the project while
preserving its original technical foundations.

### Origin of the Name “Katu”

The name **Katu** comes from **Tupi-Guarani**, where it conveys meanings such as:

- *good*
- *correct*
- *true*
- *genuine*

**Tupi-Guarani** is the language of the native indigenous peoples of Brazil and South America, with a strong connection to nature, viewing the world in an integrated way.

The name was chosen to reflect the core philosophy of the project while also alluding to its Brazilian origins:

> **Correctness, clarity and determinism by design.**

---

## Conclusion

KatuOS was created to solve a specific engineering problem: bringing deterministic multitasking to resource-constrained embedded systems without sacrificing the resources that belong to the application.

Its architecture is guided by simplicity, predictability and careful engineering rather than feature accumulation. Every component of the kernel is expected to justify its existence, its complexity and its memory footprint.

As the project evolves, new processor architectures, services and capabilities may be supported, while remaining faithful to the engineering principles that inspired its creation.

> **In KatuOS, system resources are intended to serve the application—not the operating system.**
>
> That principle continues to guide every architectural decision and defines what KatuOS is—today and in the future.
>
> **The implementation may evolve, but the engineering philosophy remains constant.**

---
_End of KatuOS README.md._
