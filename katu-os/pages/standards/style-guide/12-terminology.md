---
title: "12. Terminology"
permalink: /katu-os/standards/style-guide/12-terminology/
---

# 12. Terminology

Consistent terminology is essential for maintaining a clear and coherent
technical documentation.

The same architectural concept shall always be described using the same term
throughout the KatuOS project.

Terminology shall remain stable across:

- source code comments;
- public APIs;
- technical manuals;
- architecture documents;
- developer guides;
- examples.

Using different names for the same concept unnecessarily increases cognitive
load and may incorrectly suggest that multiple concepts exist.

For this reason, a single preferred term shall be adopted for every
architectural concept.

Examples include:

| Preferred Term | Avoid |
|----------------|-------|
| Task | Thread, Process |
| Scheduler | Dispatcher |
| Kernel Tick | System Tick, Tick Interrupt |
| Context Switch | Task Switch |
| CPU Load | CPU Usage, CPU Utilization |
| Ready State | Runnable State* |
| Blocked State | Waiting State* |
| Software Timer | Virtual Timer |
| Idle Task | Background Task |
| Critical Section | Protected Region |

\* Unless a technical distinction is intentionally required.

Terminology should also remain consistent across different abstraction levels.

For example, if a document introduces the term **Kernel Tick**, subsequent
sections should continue using the same term rather than alternating with
expressions such as *system tick* or *timer interrupt*.

Likewise, implementation details should not replace architectural terminology.

For example:

**Preferred**

> The scheduler performs a context switch.

**Avoid**

> PendSV performs a context switch.

The first statement describes the architectural behavior.

The second exposes a processor-specific implementation that applies only to a
particular CPU Port.

Whenever a new subsystem or service is introduced, its terminology should be
reviewed to ensure consistency with the existing documentation.

If a new concept genuinely requires a new term, that term should be adopted
consistently throughout the project.

Terminological consistency improves readability, simplifies maintenance and
reinforces the architectural identity of KatuOS.

---

# Part III — Architectural Documentation

The chapters in this part define how the architecture of the KatuOS kernel
shall be presented throughout the project's technical documentation.

Whereas the previous chapters establish writing conventions for source code and
technical documentation, this part defines the principles that govern the
description of architectural concepts.

The objective is to ensure that every technical document explains the design of
the kernel in a consistent, architecture-oriented manner, independent of the
implementation details of any particular version or processor architecture.

---
