---
title: "10. Inline Comments"
permalink: /katu-os/standards/style-guide/10-inline-comments/
---

# 10. Inline Comments

Inline comments should explain the intent of the code rather than describe the
statement being executed.

Source code already expresses **how** an operation is performed.

Comments should explain **why** that operation is necessary.

Comments that merely restate the source code provide little value and become
maintenance liabilities as the implementation evolves.

For example:

**Preferred**

```c
counter++;    // Advance to the next observation window.
```

**Avoid**

```c
counter++;    // Increment counter.
```

Likewise:

**Preferred**

```c
currentTask = nextTask;    // Commit the scheduling decision.
```

**Avoid**

```c
currentTask = nextTask;    // Copy nextTask to currentTask.
```

The first comment explains the engineering intent.

The second simply translates the C statement into English.

Inline comments are particularly valuable when the reason behind an operation
is not immediately obvious.

Typical examples include:

- preserving an architectural invariant;
- preventing a race condition;
- maintaining deterministic execution;
- satisfying a processor-specific requirement;
- implementing a design constraint.

For example:

```c
irqState = CPU_DisableInterrupts();

/* Preserve scheduler consistency while updating the ready list. */

UpdateReadyList();

CPU_RestoreInterrupts(irqState);
```

Such comments explain the architectural motivation for the critical section
rather than describing the individual function calls.

Inline comments should remain concise.

Whenever a longer explanation becomes necessary, the information should be
moved to the surrounding function documentation or to a dedicated architectural
comment.

Avoid using inline comments to narrate the execution of the algorithm.

Instead, use them to document engineering decisions that would otherwise remain
implicit.

A useful guideline is:

> **If the source code already explains the operation, the comment should
> explain the reason.**

This approach produces documentation that remains valuable even as the
implementation evolves.

---
