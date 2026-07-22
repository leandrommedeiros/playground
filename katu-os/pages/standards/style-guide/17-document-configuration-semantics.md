---
title: "17. Document Configuration Semantics"
permalink: /katu-os/standards/style-guide/17-document-configuration-semantics/
---

# 17. Document Configuration Semantics

Configuration modules shall document the architectural meaning of each
configuration parameter rather than its implementation details.

Configuration options define how the kernel is composed at compile time.

Their documentation should therefore explain the architectural capability being
enabled, disabled or customized.

For every configuration parameter, documentation should answer questions such
as:

- What feature does this option control?
- Which kernel subsystem does it affect?
- How does it influence kernel behavior?
- What architectural capability is being configured?

Configuration documentation should emphasize the visible behavior of the kernel
rather than the internal implementation required to support the option.

For example:

**Preferred**

```c
/*
 * Enables the CPU Load Monitor.
 *
 * When enabled, the kernel periodically measures processor utilization using
 * the Idle Task execution model.
 */
#define ENABLE_CPU_LOAD_MONITOR    1
```

**Avoid**

```c
/*
 * Enables the CPU load counters.
 */
#define ENABLE_CPU_LOAD_MONITOR    1
```

The first description explains the architectural purpose of the option.

The second merely describes one aspect of its implementation.

Likewise, configuration documentation should avoid references to:

- processor limitations;
- compiler-specific behavior;
- optimization techniques;
- implementation shortcuts.

Unless a configuration option is intentionally processor-specific, its
documentation shall remain architecture-independent.

Configuration parameters should describe **what** the application is selecting,
not **how** the kernel internally implements that selection.

Documentation should also identify relationships between configuration options
whenever such relationships affect the resulting kernel architecture.

For example:

```text
This option requires Software Timers to be enabled.
```

or

```text
When disabled, the corresponding subsystem is completely removed from the
kernel image.
```

Such information is considerably more valuable than describing preprocessor
logic or conditional compilation directives.

Well-documented configuration parameters allow developers to understand the
architectural consequences of each option without inspecting the corresponding
implementation.

Configuration documentation should therefore be regarded as an extension of the
kernel architecture rather than merely a description of compile-time macros.

---
