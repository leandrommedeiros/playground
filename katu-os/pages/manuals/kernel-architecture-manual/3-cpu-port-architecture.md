---
title: "3. CPU Port Architecture"
permalink: /katu-os/manuals/kernel-architecture-manual/3-cpu-port-architecture/
---

# 3. CPU Port Architecture

## 3.1 Introduction

The CPU Port forms the architectural boundary between the portable Kernel Core
and the underlying processor architecture.

Its purpose is to isolate every processor-dependent mechanism required by the
kernel while preserving a completely architecture-independent Kernel Core.

This separation allows the same kernel implementation to operate on multiple
processor families without requiring changes to scheduling, synchronization,
timing or other kernel services.

The CPU Port therefore represents an implementation of a well-defined
architectural interface rather than a collection of processor-specific
optimizations.

---

## 3.2 Architectural Role

The KatuOS kernel is divided into two major layers:

- Kernel Core
- CPU Port

The relationship between these layers is illustrated below.

```text
                  Application
                        │
                        ▼
                  Public API
                        │
                        ▼
                 Kernel Core
                        │
            CPU Port Interface
                        │
                        ▼
                  CPU Port Layer
                        │
                        ▼
             Processor Architecture
```

The Kernel Core defines the execution model of the operating system.

The CPU Port implements the processor-dependent mechanisms required to execute
that model on a specific architecture.

This separation ensures that architectural concepts remain independent from
their processor-specific implementation.

---

## 3.3 Responsibilities

The CPU Port is responsible exclusively for processor-dependent services.

Typical responsibilities include:

- context switching;
- interrupt control;
- critical sections;
- task stack initialization;
- first task startup;
- Kernel Tick generation;
- processor idle instruction;
- low-level scheduler support.

Conversely, the CPU Port is **not** responsible for:

- scheduling decisions;
- task management;
- synchronization services;
- software timers;
- memory management;
- runtime integrity policies.

These responsibilities belong exclusively to the Kernel Core.

---

## 3.4 Design Principles

The CPU Port architecture follows several fundamental principles.

### Processor Independence

The Kernel Core shall never contain processor-specific code.

Every processor dependency shall be encapsulated within the CPU Port.

---

### Stable Architectural Interface

The interface between the Kernel Core and the CPU Port should remain as stable
as possible.

Changes to one side of the interface should have minimal impact on the other.

---

### Minimal Implementation

The CPU Port should implement only the mechanisms required by the Kernel Core.

It should not introduce additional services, policies or abstractions.

---

### Deterministic Behavior

Every CPU Port implementation shall preserve the deterministic execution model
defined by the Kernel Core.

Processor-specific optimizations shall never modify kernel semantics.

---

## 3.5 CPU Port Services

Although implementations differ between processor architectures, every CPU Port
is expected to provide the same conceptual services.

### Context Switching

Preserves the execution context of the current task and restores the context of
the next task selected by the scheduler.

---

### Critical Sections

Provides mutually exclusive execution when the Kernel Core must manipulate
shared internal data.

The implementation mechanism depends on the processor architecture.

---

### Interrupt Management

Provides the mechanisms required to:

- enable interrupts;
- disable interrupts;
- preserve interrupt state when necessary.

---

### Kernel Tick

Supplies the periodic interrupt that advances the Kernel Time Model.

The source of the Kernel Tick depends entirely on the target architecture.

---

### First Task Startup

Transfers processor control from the initialization phase to normal
multitasking operation.

Unlike ordinary context switches, the first task startup establishes the
initial execution environment for the scheduler.

---

### Low-Power Interface

Implements the processor instruction used by the Idle Task to reduce power
consumption while waiting for interrupts.

The specific instruction depends on the processor architecture.

---

## 3.6 Interaction with the Kernel Core

The Kernel Core and the CPU Port cooperate through a clearly defined
architectural interface.

```text
               Kernel Core
                    │
            Select Next Task
                    │
                    ▼
             CPU Port Layer
                    │
           Save Current Context
                    │
            Restore New Context
                    │
                    ▼
             Resume Execution
```

The Kernel Core determines **which** task shall execute.

The CPU Port determines **how** execution is transferred to that task.

This separation allows scheduling algorithms to evolve independently from
processor-specific implementation details.

---

## 3.7 Context Switching Philosophy

Context switching is considered an implementation mechanism rather than a
scheduler function.

The scheduler decides whether a context switch is required.

The CPU Port performs the actual processor state transition.

This distinction simplifies both subsystems:

- the scheduler remains architecture-independent;
- the CPU Port remains policy-independent.

Neither subsystem depends on the internal implementation of the other.

---

## 3.8 Compile-Time Integration

Exactly one CPU Port shall be selected for each kernel build.

The selected CPU Port becomes part of the kernel during compilation and
provides every processor-dependent service required by the Kernel Core.

No runtime processor abstraction layer exists.

This compile-time binding eliminates unnecessary indirection while preserving
complete portability at the source-code level.

---

## 3.9 Design Notes

The CPU Port is intentionally kept as small as possible.

Most of the operating system resides within the portable Kernel Core.

Consequently:

- most kernel enhancements occur inside the Kernel Core;
- CPU Ports remain relatively stable;
- supporting a new architecture generally requires implementing only a limited
  number of processor-dependent mechanisms.

This organization minimizes maintenance effort while maximizing code reuse.

---

## 3.10 Best Practices

CPU Port implementations should:

- preserve the semantics defined by the Kernel Core;
- avoid introducing architecture-specific policies;
- keep assembly code as small as practical;
- document every processor assumption;
- isolate processor dependencies within the CPU Port layer;
- maintain compatibility with the architectural CPU Port interface.

Whenever possible, optimizations should improve implementation efficiency
without altering observable kernel behavior.

A correctly implemented CPU Port allows the portable Kernel Core to execute
unchanged on any supported processor architecture, fulfilling one of the
fundamental design goals of KatuOS.

---
