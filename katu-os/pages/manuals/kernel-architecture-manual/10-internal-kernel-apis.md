---
title: "10. Internal Kernel APIs"
permalink: /katu-os/manuals/kernel-architecture-manual/10-internal-kernel-apis/
---

# 10. Internal Kernel APIs

## 10.1 Introduction

The KatuOS Kernel Core is composed of multiple architectural subsystems that
cooperate through a small set of internal interfaces.

These interfaces, collectively referred to as the **Internal Kernel APIs**,
provide the mechanisms required for communication between kernel modules while
remaining completely hidden from application software.

Unlike the public Kernel API, which defines the programming model available to
applications, the Internal Kernel APIs exist solely to support the
implementation of the Kernel Core.

Their primary objective is to preserve modularity while minimizing coupling
between kernel subsystems.

---

## 10.2 Architectural Role

The Internal Kernel APIs form the communication layer between the major
architectural components of the Kernel Core.

```text
                Application
                     │
                     ▼
              Public Kernel API
                     │
                     ▼
        ┌───────────────────────────┐
        │       Kernel Core         │
        │                           │
        │  Internal Kernel APIs     │
        │ (Module Communication)    │
        └───────────────────────────┘
                     │
                     ▼
             CPU Port Interface
                     │
                     ▼
                  CPU Port
                     │
                     ▼
           Processor Architecture
```

Rather than accessing one another directly, kernel subsystems exchange
information through well-defined interfaces whenever practical.

This organization improves maintainability while preserving architectural
independence.

---

## 10.3 Design Philosophy

The Internal Kernel APIs follow the same principles that govern the remainder
of the kernel:

- clearly defined responsibilities;
- minimal coupling;
- deterministic execution;
- architecture independence;
- stable subsystem interfaces.

Every internal interface exists to support a specific architectural
responsibility.

Interfaces should never expose implementation details unnecessarily.

---

## 10.4 Internal versus Public APIs

KatuOS distinguishes between two categories of programming interfaces.

### Public APIs

Public APIs define the services available to application developers.

They constitute the official programming interface of the operating system and
are documented in the Programming Manual and API Reference.

---

### Internal Kernel APIs

Internal Kernel APIs exist exclusively to support communication between kernel
subsystems.

Applications shall never invoke these interfaces directly.

Likewise, CPU Ports should interact only with the architectural interfaces
explicitly defined for processor abstraction.

This separation preserves both API stability and kernel maintainability.

---

## 10.5 Architectural Responsibilities

Internal APIs typically support interactions involving:

- scheduler services;
- kernel time management;
- runtime integrity;
- software timer management;
- CPU Load monitoring;
- CPU Port integration;
- internal object management.

Each interface belongs to a specific subsystem and reflects a well-defined
architectural responsibility.

---

## 10.6 Interface Stability

Internal APIs are considered implementation interfaces.

Although they are generally more stable than private implementation details,
they may evolve as the Kernel Core architecture evolves.

For this reason:

- applications shall never depend on internal interfaces;
- CPU Ports shall use only documented port interfaces;
- internal APIs should remain as small as practical.

Maintaining a limited internal interface simplifies future architectural
evolution.

---

## 10.7 Dependency Rules

Dependencies involving Internal Kernel APIs should always respect the
architectural hierarchy.

```text
Application
      │
      ▼
Public API
      │
      ▼
Kernel Core
      │
      ▼
Internal Kernel APIs
      │
      ▼
CPU Port Interface
      │
      ▼
CPU Port
```

Reverse dependencies should never occur.

The Internal Kernel APIs support cooperation between kernel modules but do not
replace the architectural layering of the system.

---

## 10.8 Compile-Time Integration

Like every other infrastructure component of KatuOS, the Internal Kernel APIs
participate in the compile-time composition of the kernel.

Interfaces associated with disabled subsystems are excluded together with the
corresponding implementation.

Consequently:

- unnecessary interfaces are never generated;
- coupling remains minimal;
- optional services incur no runtime overhead.

This behavior is consistent with the overall Configuration Model described
earlier in this manual.

---

## 10.9 Design Notes

The Internal Kernel APIs are intentionally conservative.

Rather than creating a large internal framework, KatuOS defines only those
interfaces required to preserve subsystem independence.

Whenever direct interaction between modules can be eliminated through better
architectural organization, that approach is generally preferred.

The objective is to maintain a Kernel Core whose internal communication remains
simple, explicit and easy to understand.

---

## 10.10 Best Practices

Kernel developers introducing new internal interfaces should observe the
following principles.

- Create an interface only when it represents a genuine architectural
  responsibility.
- Keep interfaces small and cohesive.
- Avoid exposing internal implementation details.
- Preserve subsystem independence.
- Respect the architectural layering of the Kernel Core.
- Prefer explicit responsibilities over generic utility interfaces.

Internal APIs should exist to strengthen the architecture of the kernel rather
than to simplify isolated implementation decisions.

---

## 10.11 Architectural Summary

The Internal Kernel APIs provide the communication infrastructure that enables
the Kernel Core to remain modular while preserving deterministic behavior and
architectural clarity.

Together with the CPU Port Interface and the Public Kernel API, they form the
three interface layers of KatuOS:

```text
          Public Kernel API
                  │
                  ▼
          Internal Kernel APIs
                  │
                  ▼
          CPU Port Interface
```

Each layer serves a distinct architectural purpose:

- the Public Kernel API defines the programming model presented to
  applications;

- the Internal Kernel APIs coordinate the implementation of the Kernel Core;

- the CPU Port Interface isolates every processor-dependent mechanism from the
  portable kernel.

This layered organization allows KatuOS to evolve while preserving its
fundamental design principles of simplicity, determinism, modularity and
long-term maintainability.

---
