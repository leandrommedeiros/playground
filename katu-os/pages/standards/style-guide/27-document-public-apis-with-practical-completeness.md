---
title: "27. Document Public APIs with Practical Completeness"
permalink: /katu-os/standards/style-guide/27-document-public-apis-with-practical-completeness/
---

# 27. Document Public APIs with Practical Completeness

Public APIs define the contract between the Kernel Core and the application.

Their documentation shall provide all information necessary for developers to
understand, use and correctly integrate each service without requiring
inspection of its implementation.

API documentation should therefore describe the service from the perspective of
its observable behavior rather than its internal implementation.

A complete API description should normally include:

- purpose;
- behavioral summary;
- parameters;
- return value;
- execution context;
- constraints;
- side effects;
- related services;
- practical example, when appropriate.

The recommended organization is:

```text
     Purpose
        ↓
    Behavior
        ↓
    Parameters
        ↓
   Return Value
        ↓
Notes and Constraints
        ↓
  Related Services
        ↓
     Example
```

Not every service requires every section.

However, whenever a section provides information useful to application
developers, it should be included.

Documentation should clearly distinguish between:

- contractual behavior;

and

- implementation details.

For example:

**Preferred**

```text
Suspends the calling task for the specified number of Kernel Ticks.

During the delay interval, other eligible tasks may execute.
```

**Avoid**

```text
Moves the task into the delay list and decrements its counter every Kernel
Tick.
```

The first description defines the API contract.

The second exposes implementation details that are irrelevant to API users.

Whenever applicable, documentation should also identify important behavioral
characteristics, such as:

- deterministic execution;
- timeout behavior;
- blocking semantics;
- ISR restrictions;
- ownership rules;
- notification semantics.

Examples should demonstrate typical application usage while remaining
architecture-independent.

For example:

```c
OS_Delay(100);

OS_Notify(taskHandle);
```

rather than examples tied to a specific hardware platform.

Cross references between related services should be included whenever they
improve discoverability.

For example:

```text
See also:
    OS_DelayUntil()
    OS_GetTickCount()
```

Well-documented APIs reduce the learning curve, improve correct application
development and significantly decrease the need to consult implementation
details.

The objective of API documentation is to define the service contract completely
enough that application developers rarely need to inspect the Kernel Core
implementation.

---
