---
title: "1. Introduction"
permalink: /katu-os/manuals/kernel-architecture-manual/1-introduction/
---

# 1. Introduction

The **KatuOS Kernel Architecture Manual** documents the internal architecture
that supports the Kernel Core.

Whereas the *Scheduling, Delays & Synchronization Manual* describes the
services provided to application developers, this manual focuses on the
infrastructure required to implement those services.

Its primary audience includes:

- kernel developers;
- kernel maintainers;
- CPU Port developers;
- contributors extending the Kernel Core.

Rather than documenting application programming interfaces, this manual
describes the architectural components that enable the kernel to operate
consistently across different processor architectures while preserving its
fundamental design principles.

The topics covered include:

- CPU Load Monitoring
- CPU Port Architecture
- Memory Architecture
- Configuration Model
- Build and Configuration Architecture
- Application Hooks
- Porting Guide
- Design Rationale
- Internal Kernel APIs

Before exploring each subsystem individually, it is useful to understand how
they fit together within the overall kernel architecture.

The following diagram presents the architectural organization of KatuOS and
illustrates the relationship between the portable Kernel Core, the CPU Port
layer and the underlying processor architecture.

```text
                    Application
                         │
                         ▼
                  Application Layer
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Kernel Core                      │
│                                                     │
│  • Scheduler                                        │
│  • Time Management                                  │
│  • Synchronization Services                         │
│  • Software Timers                                  │
│  • Runtime Integrity                                │
│  • CPU Load Monitoring                              │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
                 CPU Port Interface
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                     CPU Port                        │
│                                                     │
│  • Context Switching                                │
│  • Critical Sections                                │
│  • Tick Source                                      │
│  • Stack Management                                 │
│  • Low-Power Support                                │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
                Processor Architecture
```

The **Application Layer** interacts with the kernel through the KatuOS programming model exposed by the Public Kernel API.

These services are implemented entirely by the **Kernel Core**, which contains
every architecture-independent subsystem responsible for task scheduling,
kernel time management, synchronization, software timers and runtime
integrity.

The **CPU Port Interface** defines the architectural boundary between the
portable Kernel Core and the processor-dependent implementation.

Below this boundary, the **CPU Port** provides the mechanisms required to
execute the Kernel Core on a particular processor architecture, including
context switching, interrupt management, stack initialization and low-power
operation.

This strict separation allows the same Kernel Core to execute on multiple
processor architectures without modification, while preserving identical
kernel semantics across every supported platform.

Throughout this manual, the term **Kernel Infrastructure** refers to the
collection of internal subsystems that support the Kernel Core but are not
themselves considered application services.

These subsystems provide processor abstraction, memory organization,
configuration management, runtime diagnostics and other foundational
mechanisms required by the operating system.

As with every KatuOS technical document, the architecture is presented before
the implementation.

Each chapter first explains the engineering rationale behind a subsystem,
followed by its responsibilities, interactions with other kernel components
and, where appropriate, its internal implementation.

Unless explicitly stated otherwise, all concepts presented in this manual are
architecture-independent.

Processor-specific implementation details belong exclusively to the
corresponding CPU Port documentation.

This manual forms part of the official KatuOS technical documentation and
should be read together with the *Scheduling, Delays & Synchronization
Manual*, which defines the application programming model built upon the
infrastructure described here.

---
