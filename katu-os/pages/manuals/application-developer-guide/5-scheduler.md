---
title: "Part II — Kernel Infrastructure"
permalink: /katu-os/manuals/application-developer-guide/5-scheduler/
---

## 5. Scheduler

This section defines the normative behavior of the KatuOS scheduler.

The scheduler is responsible for selecting the next task to execute based solely on the current execution state of the system. It operates on the task model introduced in Chapter 3 by evaluating the execution state maintained within each Task Control Block. Its behavior is deterministic, fully analyzable and independent of any particular processor architecture.

---

### 5.1 Task Eligibility

The scheduler determines task eligibility using the following attributes
maintained within the Task Control Block:

- `enabled`
- `running`
- `delay`

The following rules apply:

- A task is eligible for execution when `enabled == 1` and `running == 1`.
- A task delayed by time has `running == 0` and `delay > 0`.
- A task waiting indefinitely has `running == 0` and `delay == DELAY_LOCK`.

The IdleTask remains permanently enabled and is selected only when no
application task is eligible for execution.

Its sole responsibility is to represent processor idle time.

Tasks blocked by synchronization primitives follow the same execution model:
they remain non-runnable (`running == 0`) until the corresponding
synchronization condition is satisfied or a timeout expires.

---

### 5.2 Kernel Tick Processing

At each kernel tick, the kernel updates its internal timing state before
evaluating task eligibility.

When software timers are enabled, timer processing is performed before task
selection. One timer may optionally be reserved for the Kernel Maintenance
Process, depending on the compile-time configuration.

Each kernel tick performs the following sequence:

1. Update software timers (when enabled).
2. Decrement the delay counter of every enabled task whose delay is active.
3. When a delay reaches zero, mark the corresponding task as runnable.
4. Count the number of runnable application tasks.
5. Invoke `OS_Scheduler()` with the current scheduling information.
6. If a different task is selected, request a context switch.

This sequence ensures that every scheduling decision is based on the current
execution state of the system.

---

### 5.3 Task Selection

`OS_Scheduler()` selects the next task according to the following rules:

1. If no application task is runnable, the IdleTask is selected.
2. If exactly one application task is runnable, it is selected immediately.
3. If multiple runnable tasks have different priorities:
   - the task with the lowest numeric priority value is selected.
4. If multiple runnable tasks share the highest priority:
   - the scheduler performs a circular search beginning at
     `ongoing_task + 1` and selects the first eligible task found,
     implementing deterministic round-robin within that priority level.

This scheduling policy guarantees that:

- higher-priority tasks are always selected before lower-priority tasks;
- equal-priority tasks execute in deterministic round-robin order;
- scheduling decisions depend exclusively on the current kernel state.

---

### 5.4 Context Switching

When the scheduler selects a different task, the kernel requests a context
switch through the CPU Port layer.

The CPU Port implementation is responsible for:

- preserving the execution context of the currently running task;
- storing the processor state in its corresponding Task Control Block;
- restoring the execution context of the selected task;
- resuming execution from the point where that task was previously suspended.

The mechanism used to perform the context switch is architecture-dependent and
is described in the corresponding CPU Port documentation.

---

### 5.5 Internal Scheduler Services

The scheduler relies on a small set of internal kernel services to implement the
execution model described in this chapter.

These services are part of the internal kernel infrastructure and are **not**
intended to be called directly by application code.

| Internal Service           | Responsibility                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `OS_Scheduler()`           | Evaluates task eligibility and selects the next task to execute.                                             |
| `OS_TickHandler()`         | Updates the Kernel Time Model, delay counters and tick-driven kernel services before invoking the scheduler. |
| CPU Port Context Switching | Preserves the execution context of the current task and restores the context of the selected task.           |

Together, these internal services implement the deterministic scheduling model
defined by KatuOS while preserving the separation of responsibilities between
the Kernel Core and the CPU Port layer.

Applications interact with the scheduler indirectly through the public KatuOS
API. Scheduling decisions and context switching remain entirely under kernel
control.

---

### 5.6 Scheduler Guarantees

The KatuOS scheduler guarantees that:

- only one task executes at any instant;
- the highest-priority eligible task is always selected;
- equal-priority tasks execute in deterministic round-robin order;
- blocked tasks are never selected for execution;
- scheduling decisions depend exclusively on the current kernel state.

These guarantees define the execution model of KatuOS and form the foundation
upon which all timing and synchronization services are built.

---

# Part II — Kernel Infrastructure

The chapters in this part describe the internal infrastructure that supports
the KatuOS Kernel Core.

These architectural components provide the processor abstraction, memory
organization, compile-time composition and configuration mechanisms that enable
the kernel to operate consistently across multiple processor architectures.

Although largely transparent to application developers, these subsystems form
the engineering foundation upon which the scheduling, synchronization and time
management services are built.

Understanding this infrastructure is essential for maintaining, extending and
porting the Kernel Core while preserving its architectural principles.

---
