---
title: "11. Architectural Comments"
permalink: /katu-os/standards/style-guide/11-architectural-comments/
---

# 11. Architectural Comments

Architectural comments document the engineering rationale behind significant
kernel mechanisms.

Unlike inline comments, which explain the intent of individual operations,
architectural comments describe the purpose, responsibilities and design
constraints of an entire subsystem or algorithm.

Their objective is to help readers understand the architectural decisions that
shape the implementation.

Architectural comments are appropriate whenever a mechanism cannot be fully
understood by reading the source code alone.

Typical examples include:

- Scheduler
- Context Switching
- CPU Load Monitor
- Kernel Tick Processing
- Runtime Integrity
- DelayUntil
- Maintenance Process
- Stack Pattern
- Notification Services

Architectural comments should answer questions such as:

- What problem does this mechanism solve?
- Why was this approach selected?
- Which architectural principles does it preserve?
- Which kernel invariants depend upon it?
- How does it interact with other kernel subsystems?

Whenever practical, the explanation should present concepts before
implementation details.

The recommended organization is:

```text
Purpose
    ↓
Architectural Model
    ↓
Responsibilities
    ↓
Interaction with Other Subsystems
    ↓
Implementation Notes
```

Implementation details should appear only after the architectural concepts have
been established.

For example:

**Preferred**

```text
The scheduler guarantees deterministic task selection by always choosing the
highest-priority runnable task. Tasks with identical priority execute according
to a deterministic Round-Robin policy.

The implementation scans the ready task list to locate the next eligible task.
```

**Avoid**

```text
The scheduler iterates through the task table looking for the first runnable
task with the highest priority.
```

The first description explains the architectural contract before describing the
implementation.

The second focuses exclusively on the current algorithm.

Architectural comments should also document important assumptions and
constraints whenever they influence the design.

Examples include:

- processor assumptions delegated to the CPU Port;
- compile-time configuration dependencies;
- ownership rules;
- synchronization requirements;
- invariants that must always remain true.

Such information is often more valuable than describing the implementation
itself.

Whenever a subsystem evolves internally without changing its architectural
responsibilities, its architectural comments should require little or no
modification.

The objective is to produce documentation that remains stable throughout the
evolution of the kernel while continuing to explain the engineering decisions
behind its architecture.

---
