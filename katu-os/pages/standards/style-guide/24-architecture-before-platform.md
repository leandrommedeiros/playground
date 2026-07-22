---
title: "24. Architecture Before Platform"
permalink: /katu-os/standards/style-guide/24-architecture-before-platform/
---

# 24. Architecture Before Platform

Documentation shall present the architecture of the kernel independently from
any particular hardware platform.

The architecture defines the responsibilities, interfaces and behavior of the
Kernel Core.

Processor architectures merely provide the implementation mechanisms required
to execute that architecture.

Documentation should therefore introduce architectural concepts before
describing how they are realized on a specific processor family.

The preferred presentation order is:

```text
Architecture
        ↓
Architectural Interfaces
        ↓
CPU Port Responsibilities
        ↓
Processor-Specific Implementation
```

For example:

**Preferred**

```text
The CPU Port implements the architecture-defined context switching interface.

For Cortex-M processors, this interface is implemented using the PendSV
exception.
```

**Avoid**

```text
PendSV is used by the scheduler to perform task switching.
```

The first description establishes the architecture before introducing the
processor-specific implementation.

The second presents a hardware mechanism without first explaining the
architectural model that requires it.

Likewise:

**Preferred**

```text
The Kernel Tick provides the system time base required by the scheduler and
kernel services.

Each CPU Port determines how this periodic event is generated.
```

**Avoid**

```text
SysTick generates the operating system tick.
```

The architectural concept is the **Kernel Tick**.

SysTick is merely one possible implementation.

This convention applies throughout the documentation.

Architectural concepts shall remain valid regardless of whether the kernel is
executed on:

- ARM Cortex-M;
- RISC-V;
- MSPM0;
- STM32;
- any future supported processor architecture.

Only CPU Port documentation should discuss processor-specific implementation
details.

All other documentation shall remain architecture-oriented.

Presenting architecture before platform reinforces the portability of the
Kernel Core while ensuring that technical documents remain valid as new CPU
Ports are introduced.

The architecture is permanent.

Platforms are implementations.

---
