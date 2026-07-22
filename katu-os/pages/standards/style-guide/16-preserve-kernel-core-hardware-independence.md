---
title: "16. Preserve Kernel Core Hardware Independence"
permalink: /katu-os/standards/style-guide/16-preserve-kernel-core-hardware-independence/
---

# 16. Preserve Kernel Core Hardware Independence

Documentation describing portable Kernel Core modules shall remain completely
independent of any particular processor architecture.

Kernel Core documentation should describe architectural responsibilities rather
than processor-specific implementation details.

References to processor features, instruction sets or exception mechanisms
shall be confined to the CPU Port documentation.

Examples of processor-specific terminology that should not appear in portable
Kernel Core documentation include:

- ARM Cortex-M
- PendSV
- PSP
- MSP
- Thumb
- NVIC
- exception vectors

Instead, documentation should use architecture-independent terminology such as:

- Processor Architecture
- CPU Port
- Context Switching
- Kernel Tick
- Critical Section
- Processor State

For example:

**Preferred**

> The CPU Port performs the context switch requested by the scheduler.

**Avoid**

> PendSV performs the context switch.

Likewise:

**Preferred**

> The Kernel Tick advances the kernel time model.

**Avoid**

> SysTick advances the kernel time model.

Processor-specific implementation details belong exclusively to the CPU Port
layer.

Maintaining this separation reinforces one of the fundamental architectural
principles of KatuOS:

the Kernel Core defines behavior, while the CPU Port implements the mechanisms
required by a particular processor architecture.

By preserving hardware independence throughout the documentation, the same
Kernel Core documentation remains valid regardless of the processor family on
which the kernel executes.

---
