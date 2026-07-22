---
title: "7. Function Documentation"
permalink: /katu-os/standards/style-guide/7-function-documentation/
---

# 7. Function Documentation

Every public function shall be documented using Doxygen.

Function documentation serves two complementary purposes.

First, it defines the programming interface presented to application
developers.

Second, it explains the architectural purpose of the service within the Kernel
Core.

Good function documentation should allow readers to understand both **how to
use** the API and **why the service exists**, without requiring immediate
inspection of its implementation.

Every public function should answer the following questions:

- What does the function do?
- Why would an application use it?
- Under which conditions should it be called?
- What constraints or assumptions apply?

The recommended documentation order is:

```c
/**
 * @brief
 *   Brief description.
 *
 * Detailed description.
 *
 * @param
 * @return
 * @note
 * @warning
 * @pre
 * @post
 */
```

Not every tag is required.

Only include tags that provide meaningful information for the documented
function.

The **@brief** section should summarize the architectural purpose of the
service rather than merely repeating the function name.

For example:

**Preferred**

```c
/**
 * @brief Suspends the calling task for a specified number of Kernel Ticks.
 */
```

**Avoid**

```c
/**
 * @brief Delay function.
 */
```

The detailed description should explain:

- the purpose of the service;
- how it fits into the kernel model;
- important behavioral characteristics;
- constraints that may affect its use.

Whenever applicable, public API documentation should also include:

- function prototype;
- parameter description;
- return value;
- behavioral notes;
- usage constraints;
- practical example.

For example:

```c
/**
 * @brief Suspends the calling task for a specified number of Kernel Ticks.
 *
 * Delays the execution of the calling task for the specified duration.
 * During this period, the scheduler selects another eligible task for
 * execution.
 *
 * @param ticks Number of Kernel Ticks to delay.
 *
 * @note A delay of zero does not yield the processor.
 */
```

Documentation should describe observable behavior rather than implementation
details.

For example:

**Preferred**

> Delays the calling task for the specified number of Kernel Ticks.

**Avoid**

> Inserts the task into the delay list and updates the internal timer
> structures.

Implementation details belong in the source code.

Function documentation should remain stable even if the internal implementation
changes.

The objective is to document the service contract presented by the API rather
than the mechanism used to implement it.

---
