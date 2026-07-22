---
title: "9. Variable Comments"
permalink: /katu-os/standards/style-guide/9-variable-comments/
---

# 9. Variable Comments

Variable comments should explain the architectural purpose of a variable rather
than merely describing its type or repeating its name.

The objective is to help readers understand why the variable exists and what
role it plays within the implementation.

Good variable documentation answers questions such as:

- What information does this variable represent?
- Which subsystem owns it?
- How is it used by the kernel?
- Does it preserve an architectural invariant?
- Is there an important lifetime or synchronization constraint?

Comments should complement the source code rather than duplicate information
already evident from declarations.

For example:

**Preferred**

```c
/* Index of the task currently selected by the scheduler. */
uint8_t g_current_task;
```

**Avoid**

```c
/* Current task. */
uint8_t g_current_task;
```

The first comment explains the semantic meaning of the variable.

The second merely repeats the identifier without adding useful information.

Similarly:

**Preferred**

```c
/* Number of runnable tasks detected during the current scheduling cycle. */
uint8_t g_num_runnable_tasks;
```

**Avoid**

```c
/* Runnable task counter. */
uint8_t g_num_runnable_tasks;
```

Whenever practical, comments should also clarify relationships with other
kernel components.

For example:

```c
/* Updated by the Kernel Tick and consumed by the scheduler. */
uint32_t g_tick_count;
```

Such information is often more valuable than describing the stored value
itself.

Variable comments should remain stable even if the internal implementation
changes.

Comments that describe temporary implementation details, intermediate
algorithms or obvious assignments should be avoided.

The objective is to document the architectural meaning of a variable rather
than its immediate implementation.

---
