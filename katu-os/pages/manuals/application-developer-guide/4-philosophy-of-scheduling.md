---
title: "4 Philosophy Of Scheduling"
permalink: /katu-os/manuals/application-developer-guide/4-philosophy-of-scheduling/
---

## 4. Philosophy of Scheduling

The KatuOS scheduler is intentionally simple, deterministic and fully analyzable.
Its design favors predictable behavior and architectural clarity over scheduling
complexity.

The scheduler defines how processor time is allocated among runnable tasks. Its
behavior is governed by a small set of deterministic rules that remain constant
regardless of system load or execution history.

These rules are:

- Each task owns one static priority (`priority_base`).
- Lower numeric values represent higher priorities.
- Priorities are never modified by the kernel.
- Equal-priority tasks are scheduled using deterministic round-robin.
- Scheduling decisions depend exclusively on the current execution state of the
  system. They do not rely on execution history, dynamic heuristics or adaptive
  scheduling policies.

This philosophy ensures that every scheduling decision can be explained by
inspecting only the current kernel state.

The scheduler intentionally avoids:

- dynamic priority adjustment;
- priority inheritance inside the scheduler;
- priority boosting;
- aging algorithms;
- time slicing.

The IdleTask is a mandatory kernel task whose sole responsibility is to
represent true processor idle time by placing the processor into a low-power
state whenever no application task is eligible for execution.

When enabled, kernel housekeeping is performed by the
**Kernel Maintenance Process**, which executes periodically through an internal
software timer.

This architectural separation assigns a single, well-defined responsibility to
each subsystem:

- Scheduler → selects the next runnable task.
- IdleTask → represents processor idle time.
- Kernel Maintenance Process → executes optional kernel housekeeping activities.

The resulting architecture preserves determinism while keeping each subsystem
focused on a single well-defined function.

---
