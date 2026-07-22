---
title: "8. Structure Documentation"
permalink: /katu-os/standards/style-guide/8-structure-documentation/
---

# 8. Structure Documentation

Kernel data structures are fundamental architectural components and should be
documented accordingly.

Documentation should explain the architectural role of a structure before
describing its individual members.

Readers should first understand **why** the structure exists and **what
responsibility** it fulfills within the kernel.

The description of individual fields is secondary.

A structure description should normally answer the following questions:

- What does this structure represent?
- Which kernel subsystem owns it?
- What architectural responsibility does it fulfill?
- How is it used by the kernel?
- Are there important constraints regarding its layout or lifetime?

Whenever applicable, documentation should also explain relationships with
other kernel components.

For example, a Task Control Block may interact with:

- the Scheduler;
- the CPU Port;
- Kernel Time Management;
- Notification Services;
- Runtime Integrity.

Understanding these relationships is generally more valuable than describing
individual fields.

For example:

**Preferred**

```text
Task Control Block

Represents one task managed by the Kernel Core.

Stores the execution state required by the scheduler, CPU Port and kernel
services.

Its layout forms part of the architectural interface shared between the
portable Kernel Core and the CPU Port.
```

**Avoid**

```text
Task Control Block

Contains:
- Stack Pointer
- Priority
- Delay Counter
- Notification Value
- State
...
```

The second description merely enumerates implementation details that can
already be observed directly in the source code.

After presenting the architectural purpose of the structure, documentation may
describe individual members whenever they contribute to understanding the
design.

However, field-by-field descriptions should not become the primary focus.

Documentation should emphasize:

- architectural responsibility;
- ownership;
- lifetime;
- interaction with other kernel subsystems;
- invariants maintained by the structure.

The objective is to explain the role played by the structure within the
architecture rather than documenting its physical memory layout.

---
