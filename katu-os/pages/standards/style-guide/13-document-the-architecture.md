---
title: "13. Document the Architecture"
permalink: /katu-os/standards/style-guide/13-document-the-architecture/
---

# 13. Document the Architecture

KatuOS documentation shall describe the architecture of the system before
describing its implementation.

Readers should first understand the engineering concepts that define a
subsystem before being introduced to the mechanisms that implement those
concepts.

Documentation should therefore progress from architectural responsibilities to
implementation details.

The preferred presentation order is:

```text
Purpose
    ↓
Architectural Model
    ↓
Responsibilities
    ↓
Interactions
    ↓
Implementation
    ↓
Examples
```

This organization reflects the way engineers naturally reason about complex
systems.

Architecture defines **what** the subsystem is expected to accomplish.

Implementation explains **how** those objectives are achieved.

Documentation should preserve this distinction.

For example:

**Preferred**

```text
The scheduler is responsible for selecting the highest-priority runnable task
according to the deterministic scheduling model adopted by KatuOS.

The scheduler performs this selection by scanning the ready task table.
```

**Avoid**

```text
The scheduler scans the task table looking for the first runnable task.
```

The first description establishes the architectural contract before introducing
the implementation.

The second describes only the current algorithm.

Whenever possible, documentation should explain:

- architectural responsibilities;
- subsystem boundaries;
- design rationale;
- interactions with other kernel components;
- preserved invariants.

Implementation details should reinforce the architectural explanation rather
than replace it.

Likewise, documentation should avoid emphasizing processor-specific
implementation details unless the document explicitly describes the CPU Port.

The architecture of the Kernel Core shall remain processor-independent.

By consistently documenting architecture before implementation, the
documentation becomes easier to understand, easier to maintain and more
resilient to future implementation changes.

---
