---
title: "25. Maintain a Common Editorial Identity Across CPU Ports"
permalink: /katu-os/standards/style-guide/25-maintain-a-common-editorial-identity-across-cpu-ports/
---

# 25. Maintain a Common Editorial Identity Across CPU Ports

All CPU Port documentation shall follow the same editorial structure and
writing style adopted throughout the KatuOS documentation.

Although each CPU Port implements processor-specific mechanisms, the manner in
which those mechanisms are presented shall remain consistent across every
supported architecture.

This consistency allows readers to recognize the same architectural concepts
regardless of the underlying processor family.

Every CPU Port document should describe its implementation using the same
logical progression:

```text
Purpose
        ↓
Architectural Responsibilities
        ↓
Required Processor Features
        ↓
Port Implementation
        ↓
Platform-Specific Notes
```

Processor-specific implementation details should always be introduced only
after the architectural responsibilities of the CPU Port have been established.

For example:

**Preferred**

```text
The CPU Port implements the architecture-defined interfaces required by the
Kernel Core.

For Cortex-M processors, context switching is implemented using the PendSV
exception.
```

**Avoid**

```text
PendSV performs task switching.
```

The first description explains the architectural responsibility before
introducing the processor-specific mechanism.

The second immediately exposes an implementation detail without first
establishing its purpose.

Likewise, terminology shall remain consistent across all CPU Port
documentation.

Architectural concepts such as:

- Kernel Tick
- Context Switching
- Critical Section
- Idle Task
- Runtime Integrity

shall retain exactly the same meaning in every CPU Port.

Only the implementation mechanisms should differ.

Each CPU Port document should therefore answer the following questions:

- Which architectural interfaces does this port implement?
- Which processor resources are required?
- Which implementation mechanisms are used?
- Which processor-specific limitations exist, if any?

The CPU Port documentation should never redefine architectural concepts that
are already established elsewhere.

Instead, it should explain how those concepts are realized on the target
processor architecture.

Maintaining a common editorial identity across all CPU Ports reinforces the
separation between the portable Kernel Core and the processor-dependent CPU
Port layer.

As new processor architectures are supported, every CPU Port should feel like
another implementation of the same architecture rather than the documentation
of a different operating system.

---
