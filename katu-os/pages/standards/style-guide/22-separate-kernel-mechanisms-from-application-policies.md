---
title: "22. Separate Kernel Mechanisms from Application Policies"
permalink: /katu-os/standards/style-guide/22-separate-kernel-mechanisms-from-application-policies/
---

# 22. Separate Kernel Mechanisms from Application Policies

KatuOS documentation shall clearly distinguish between kernel mechanisms and
application policies.

The Kernel Core provides deterministic mechanisms that enable task management,
time management and synchronization.

How these mechanisms are applied within a particular application is an
application design decision and should not be prescribed by the kernel
documentation.

Documentation should therefore describe:

- what services the kernel provides;
- the guarantees offered by those services;
- the constraints under which they operate.

Documentation should avoid recommending application-specific scheduling models,
software architectures or execution strategies unless the document explicitly
addresses application design.

For example:

**Preferred**

```text
The Notification Service allows one task or interrupt service routine to
signal another task using a lightweight synchronization mechanism.
```

**Avoid**

```text
Notifications should always be used to implement event-driven state machines.
```

The first statement describes the capability provided by the kernel.

The second prescribes an application architecture that lies outside the scope
of the Kernel Core.

Likewise:

**Preferred**

```text
Software Timers execute callback functions according to their configured
periods.
```

**Avoid**

```text
Software Timers should be used to implement periodic sensor acquisition.
```

The first describes the kernel mechanism.

The second describes one possible application.

Kernel documentation should present mechanisms in a manner that allows them to
support a wide variety of application architectures.

Whenever examples are required, they should illustrate the use of a kernel
service without implying that the presented application structure is the
recommended or preferred solution.

Examples should therefore remain generic and architecture-independent.

Maintaining a clear separation between mechanisms and policies preserves the
flexibility of the Kernel Core while preventing documentation from becoming
application-specific.

This distinction also reinforces one of the fundamental architectural
principles of KatuOS:

The operating system provides deterministic mechanisms.

The application defines how those mechanisms are employed.

---
