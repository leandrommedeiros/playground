---
title: "6. Build and Configuration Architecture"
permalink: /katu-os/manuals/kernel-architecture-manual/6-build-and-configuration-architecture/
---

# 6. Build and Configuration Architecture

## 6.1 Introduction

The KatuOS source tree is organized to reflect the architecture of the kernel
itself.

Rather than grouping files according to programming language or implementation
details, the project is structured around architectural responsibilities.

This organization simplifies navigation, reinforces subsystem boundaries and
supports the long-term maintainability of the Kernel Core.

The build process follows the same philosophy.

Each kernel image is assembled at compile time from a set of architectural
components selected according to the application requirements.

---

## 6.2 Design Philosophy

The organization of the KatuOS source code follows several fundamental
principles:

- clear separation of architectural responsibilities;
- compile-time composition;
- minimal coupling between subsystems;
- processor independence;
- scalability through modular organization.

The directory structure is therefore considered part of the kernel
architecture rather than merely a file organization strategy.

---

## 6.3 Architectural Organization

At the highest level, KatuOS is divided into two major architectural domains:

```text
                        KatuOS
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
       Kernel Core                   CPU Port
            │                           │
            ▼                           ▼
 Portable kernel Services       Architecture Support
```

The Kernel Core contains all processor-independent services.

The CPU Port provides the processor-dependent mechanisms required to execute
those services.

This separation ensures that the Kernel Core remains independent from any
particular processor architecture.

---

## 6.4 Source Tree Organization

Each directory has a well-defined architectural responsibility.

Typical organization includes:

```text
KatuOS
│
├── inc/
│     Public kernel interfaces
│
├── src/
│     Portable Kernel Core
│
├── ports/
│     CPU Port implementations
│
├── docs/
│     Technical documentation
│
├── examples/
│     Reference applications
│
└── tools/
      Development support utilities
```

Actual directory names may vary according to the development environment,
but their architectural responsibilities remain unchanged.

The organization should always emphasize subsystem boundaries rather than
implementation convenience.

---

## 6.5 Public and Internal Interfaces

KatuOS distinguishes between public interfaces and internal implementation.

Public headers define the programming interface available to applications.

Internal modules communicate through interfaces intended exclusively for the
Kernel Core.

Applications should depend only on documented public interfaces.

Internal implementation details remain private to the kernel.

This separation allows the implementation to evolve while preserving API
stability.

---

## 6.6 Module Independence

Each kernel subsystem is designed to perform a single architectural
responsibility.

Examples include:

- task management;
- scheduling;
- synchronization;
- software timers;
- runtime integrity;
- CPU Load monitoring.

Modules interact through clearly defined interfaces rather than through shared
implementation details.

This organization reduces coupling and simplifies future maintenance.

---

## 6.7 Build Process

The KatuOS build process consists of assembling the required architectural
components into a single kernel image.

Conceptually, the build sequence is:

```text
        Kernel Configuration
                 │
                 ▼
  Select Architectural Components
                 │
                 ▼
          Select CPU Port
                 │
                 ▼
      Compile Kernel Core Modules
                 │
                 ▼
        Link Final Kernel Image
```

Every build represents a specific composition of the same Kernel Core
architecture.

Processor-specific modules are integrated only through the selected CPU Port.

---

## 6.8 Compile-Time Composition

Compile-time composition is a fundamental architectural characteristic of
KatuOS.

The final kernel image contains only:

- selected kernel services;
- the chosen CPU Port;
- enabled diagnostic facilities;
- required infrastructure components.

Subsystems that are not selected simply do not become part of the generated
kernel.

This approach minimizes code size while preserving deterministic execution.

---

## 6.9 Dependency Rules

Dependencies between modules should always respect the architectural layering.

The preferred dependency flow is:

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
   CPU Port
```

Reverse dependencies should be avoided.

In particular:

- applications shall not depend on internal kernel modules;
- the Kernel Core shall not depend on processor-specific code;
- CPU Ports shall not implement kernel policies.

Maintaining these dependency rules preserves the portability of the Kernel
Core.

---

## 6.10 Design Notes

The organization of the KatuOS source tree is intentionally conservative.

Directories, modules and interfaces are structured to reflect architectural
relationships rather than implementation convenience.

As the kernel evolves, new functionality should normally appear as additional
architectural modules instead of increasing the complexity of existing ones.

This philosophy allows the source tree to scale while preserving its overall
clarity.

---

## 6.11 Best Practices

When extending the KatuOS source tree:

- preserve existing architectural boundaries;
- introduce new modules only when justified by architectural
  responsibilities;
- avoid processor-specific code within the Kernel Core;
- expose only stable public interfaces;
- keep internal dependencies explicit and minimal;
- maintain the compile-time composition model.

Following these principles ensures that the source tree continues to reflect
the architecture of the kernel itself rather than the history of its
implementation.

---
