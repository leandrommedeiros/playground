---
title: "23. Document Architectural Invariants"
permalink: /katu-os/standards/style-guide/23-document-architectural-invariants/
---

# 23. Document Architectural Invariants

Architectural invariants are properties that shall always remain true during
kernel operation.

They define the assumptions upon which the correctness, determinism and
reliability of the Kernel Core depend.

Documentation should explicitly identify these invariants whenever they are
fundamental to the design of a subsystem.

Rather than describing only the implementation that preserves an invariant,
documentation should first explain the invariant itself.

For example:

**Preferred**

```text
Only one task may occupy the Running State at any given time.

The scheduler preserves this invariant whenever task selection occurs.
```

**Avoid**

```text
The scheduler updates the current task before performing a context switch.
```

The first description defines the architectural property.

The second merely describes one implementation step.

Likewise:

**Preferred**

```text
The Ready List contains only tasks that are eligible for execution.
```

**Avoid**

```text
The Ready List is updated whenever a task changes state.
```

Again, the first statement defines the architectural rule, while the second
describes one possible implementation.

Architectural invariants should be documented whenever they describe:

- ownership rules;
- execution guarantees;
- synchronization constraints;
- scheduling properties;
- resource consistency;
- state transitions;
- lifetime guarantees.

Documentation should clearly distinguish between:

- **architectural invariants**, which define the expected behavior of the
  kernel;

and

- **implementation mechanisms**, which exist solely to preserve those
  invariants.

For example, Runtime Integrity should be documented as protecting specific
architectural properties rather than merely executing a collection of runtime
checks.

Similarly, synchronization mechanisms should be described in terms of the
consistency they preserve rather than the algorithms they employ.

Well-documented invariants greatly simplify:

- maintenance;
- verification;
- debugging;
- porting;
- future architectural evolution.

Unlike implementation details, architectural invariants rarely change over the
lifetime of the kernel.

For this reason, they represent some of the most valuable information that the
documentation can preserve.

---
