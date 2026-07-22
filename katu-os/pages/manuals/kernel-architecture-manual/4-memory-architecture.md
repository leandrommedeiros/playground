---
title: "4. Memory Architecture"
permalink: /katu-os/manuals/kernel-architecture-manual/4-memory-architecture/
---

# 4. Memory Architecture

## 4.1 Introduction

Memory architecture is one of the defining characteristics of an embedded
real-time operating system.

Unlike general-purpose operating systems, which often rely on sophisticated
memory management techniques, KatuOS adopts a deliberately simple and
deterministic memory model designed for resource-constrained embedded systems.

Every memory allocation performed by the kernel has a well-defined purpose,
predictable lifetime and bounded execution cost.

The memory architecture therefore prioritizes determinism, simplicity and
auditability over flexibility.

---

## 4.2 Design Philosophy

The KatuOS memory model follows the same principles that govern the rest of the
kernel.

Its primary objectives are:

- deterministic memory usage;
- bounded allocation time;
- predictable object lifetime;
- minimal fragmentation;
- straightforward ownership rules.

The kernel intentionally avoids memory management techniques that introduce
unbounded execution time or unpredictable allocation behavior.

Instead, every kernel object follows a clearly defined ownership model that
remains valid throughout its lifetime.

---

## 4.3 Memory Organization

From the kernel perspective, memory is organized into several independent
regions, each serving a specific architectural purpose.

```text
                Kernel Memory

        ┌──────────────────────────┐
        │ Global Kernel Objects    │
        ├──────────────────────────┤
        │ Task Control Blocks      │
        ├──────────────────────────┤
        │ Task Stacks              │
        ├──────────────────────────┤
        │ Software Timer Pool      │
        ├──────────────────────────┤
        │ Semaphore Structures     │
        ├──────────────────────────┤
        │ Queue Structures         │
        └──────────────────────────┘
```

Each region is managed independently according to the requirements of the
corresponding subsystem.

This separation simplifies ownership rules while reducing coupling between
kernel components.

---

## 4.4 Memory Ownership

Every memory object within KatuOS has a single owner.

Ownership never changes during the object's lifetime.

Typical ownership relationships include:

| Object | Owner |
|---------|-------|
| Task Control Block | Kernel |
| Task Stack | Kernel |
| Timer Descriptor | Kernel |
| Queue Control Block | Kernel |
| Semaphore Object | Application |
| Queue Storage Buffer | Application |

This model eliminates ambiguity regarding allocation, initialization and
destruction responsibilities.

---

## 4.5 Task Memory Model

Each task owns two independent memory objects:

- a Task Control Block (TCB);
- an execution stack.

The Task Control Block stores scheduling information, synchronization state,
timing information and processor context.

The execution stack stores the processor state and automatic variables required
during task execution.

Neither object is shared with other tasks.

This organization greatly simplifies context switching while improving system
reliability.

---

## 4.6 Task Control Blocks

The Task Control Block represents the central management structure of every
task.

Although its internal layout is implementation-specific, it generally contains
information such as:

- processor context;
- scheduling state;
- timing information;
- notification state;
- stack information;
- task metadata.

Applications never access Task Control Blocks directly.

All interaction occurs exclusively through the public kernel API.

---

## 4.7 Stack Architecture

Every task executes using its own private stack.

This design provides complete execution isolation between tasks while allowing
the CPU Port to preserve processor context independently for each task.

The stack is also used to store:

- processor registers;
- function call frames;
- local variables;
- interrupt context when applicable.

The Kernel Core treats the stack as an opaque processor resource.

Its exact organization depends on the CPU Port implementation.

---

## 4.8 Dynamic Allocation Strategy

KatuOS intentionally minimizes the use of dynamic memory allocation.

Dynamic allocation occurs only during object creation.

Typical examples include:

- task creation;
- queue creation;
- optional kernel objects.

Once created, kernel objects remain allocated until explicitly destroyed.

Normal kernel operation does not require continuous allocation and release of
memory.

This strategy minimizes fragmentation while preserving deterministic runtime
behavior.

---

## 4.9 Stack Pattern Support

When enabled, KatuOS initializes every task stack using a predefined diagnostic
pattern.

This mechanism supports:

- stack usage estimation;
- overflow diagnostics;
- runtime telemetry.

Stack Pattern is purely diagnostic.

It has no influence on scheduling, synchronization or task execution.

The feature may be completely removed at compile time when not required.

---

## 4.10 Interaction with Other Subsystems

The memory architecture provides the storage infrastructure required by the
entire Kernel Core.

Its services support:

- Scheduler
- Kernel Time Management
- Software Timers
- Synchronization Services
- Runtime Integrity
- CPU Port

Despite serving every subsystem, the memory architecture remains largely
independent of their internal behavior.

This modular organization simplifies future kernel evolution.

---

## 4.11 Compile-Time Configuration

Several aspects of the memory architecture are configurable at build time.

Typical configuration parameters include:

- maximum number of tasks;
- maximum number of software timers;
- optional diagnostic services;
- stack pattern support.

Compile-time configuration allows applications to tailor memory usage according
to their requirements while preserving deterministic behavior.

---

## 4.12 Design Notes

The KatuOS memory architecture intentionally favors predictability over
generality.

Instead of implementing a universal memory manager, the kernel provides
specialized allocation strategies for different classes of kernel objects.

This approach reduces implementation complexity while producing a memory model
that is easier to understand, verify and maintain.

The result is a kernel whose memory behavior remains fully analyzable even in
resource-constrained embedded systems.

---

## 4.13 Best Practices

Kernel developers should preserve the following principles when extending the
memory architecture:

- every object shall have a clearly defined owner;
- object lifetime shall remain predictable;
- allocation shall occur outside time-critical execution paths whenever
  practical;
- compile-time configuration shall remain the preferred mechanism for tailoring
  memory usage;
- architecture-dependent memory assumptions shall remain confined to the CPU
  Port layer.

Following these principles preserves the deterministic memory model that forms
one of the architectural foundations of KatuOS.

---
