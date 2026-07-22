---
title: "20. Document Services Before Internal Infrastructure"
permalink: /katu-os/standards/style-guide/20-document-services-before-internal-infrastructure/
---

# 20. Document Services Before Internal Infrastructure

Kernel services shall be documented independently from the internal
infrastructure used to implement them.

The documentation should first establish the architectural identity of the
service before introducing the mechanisms that support its implementation.

Readers are interested first in the service provided by the kernel.

The internal infrastructure exists solely to make that service possible.

The preferred presentation order is:

```text
Service
    ↓
Architectural Responsibilities
    ↓
Behavior
    ↓
Public Interface
    ↓
Internal Infrastructure
```

For example, the Software Timer subsystem should be presented as an
architecture-independent kernel service.

Only after explaining:

- the timer execution model;
- interaction with application tasks;
- scheduling semantics;
- behavioral guarantees;

should the documentation introduce implementation mechanisms such as:

- timer descriptors;
- internal timer lists;
- maintenance task integration;
- scheduling algorithms.

For example:

**Preferred**

```text
Software Timer Service
      ↓
Execution Model
      ↓
Public API
      ↓
Internal Timer Management
```

**Avoid**

```text
Internal Timer Structures
        ↓
Maintenance Process
        ↓
Software Timer Service
```

Likewise, Queue Services should first explain:

- FIFO communication;
- ownership model;
- overwrite policy;
- synchronization behavior.

The circular buffer implementation should appear only after these concepts have
been established.

This principle applies equally to every Kernel Core subsystem.

Internal infrastructure should never define the architectural identity of a
module.

Instead, infrastructure should appear as the implementation that supports an
already established architectural concept.

Documentation organized in this manner naturally separates:

- what the subsystem provides;

from

- how the subsystem is implemented.

This distinction improves readability, simplifies future maintenance and
allows the implementation to evolve without requiring substantial changes to
the documentation.

Whenever implementation mechanisms change but the architectural service
remains unchanged, the conceptual documentation should remain largely
unaffected.

This stability is one of the primary objectives of architecture-oriented
documentation.

---
