---
title: "18. Describe Services Before Their Implementation"
permalink: /katu-os/standards/style-guide/18-describe-services-before-their-implementation/
---

# 18. Describe Services Before Their Implementation

Documentation shall introduce kernel services before describing the internal
mechanisms used to implement them.

Readers should first understand the architectural responsibility of a service
before being exposed to its supporting data structures, algorithms or internal
execution model.

The preferred presentation order is:

```text
Service
    ↓
Architectural Model
    ↓
Responsibilities
    ↓
Public Interface
    ↓
Internal Mechanisms
```

This organization reflects the distinction between the external behavior of a
kernel subsystem and its internal implementation.

For example, when documenting the Queue Service, the documentation should first
describe:

- the communication model;
- ownership rules;
- behavioral guarantees;
- interaction with tasks.

Only afterwards should it introduce implementation details such as:

- circular buffers;
- queue control blocks;
- internal indices;
- synchronization mechanisms.

Similarly, when documenting Software Timers, the documentation should first
present:

- the timer service;
- execution model;
- application interaction.

The internal timer management structures should appear only after these
concepts have been established.

For example:

**Preferred**

```text
Software Timer Service
       ↓
Timer execution model
      ↓
Public APIs
      ↓
Internal timer management
```

**Avoid**

```text
Timer descriptors
       ↓
Internal timer lists
       ↓
Software Timer Service
```

The first organization explains the service from the perspective of the
application and the kernel architecture.

The second begins with implementation details that have little meaning before
the service itself has been introduced.

The same principle applies throughout the Kernel Core.

Documentation should always present the architectural identity of a subsystem
before describing the mechanisms that support it.

This approach improves readability, reinforces subsystem boundaries and makes
the documentation significantly more resilient to future implementation
changes.

Implementation mechanisms may evolve over time.

The architectural purpose of a service should remain stable.

---
