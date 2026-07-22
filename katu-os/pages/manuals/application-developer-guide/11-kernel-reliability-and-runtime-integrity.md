---
title: "11 Kernel Reliability And Runtime Integrity"
permalink: /katu-os/manuals/application-developer-guide/11-kernel-reliability-and-runtime-integrity/
---

## 11. Kernel Reliability and Runtime Integrity

This chapter describes the architectural mechanisms that allow KatuOS to detect
fatal runtime inconsistencies and prevent corrupted kernel state from
propagating through the system.

Unlike the Kernel Maintenance Process described in the previous chapter, which
provides periodic diagnostic and telemetry services, the Runtime Integrity
subsystem protects the kernel during critical execution paths.

Whenever the kernel detects an unrecoverable violation of its internal
consistency, normal execution is immediately interrupted and control is
transferred to a deterministic fail-fast diagnostic path.

This chapter explains the runtime integrity philosophy adopted by KatuOS, the
Sanity Check subsystem, the runtime error model and the application integration
mechanisms used to report fatal kernel conditions.

---

### 11.1 Reliability Philosophy

KatuOS adopts a **fail-fast** approach to kernel reliability.

The fundamental principle is that the kernel shall never continue executing
after detecting a runtime condition that compromises its internal consistency.

Rather than attempting to recover from corrupted kernel state, KatuOS stops
normal execution immediately and transfers control to a deterministic
diagnostic path.

This philosophy is based on two observations:

* a corrupted kernel state cannot be considered trustworthy;
* attempting to continue execution after detecting a fatal inconsistency may
  propagate the failure and make diagnosis significantly more difficult.

For this reason, runtime integrity verification is performed at carefully
defined execution boundaries where the kernel can validate its assumptions
before allowing execution to continue.

When a fatal inconsistency is detected:

* scheduler execution is stopped;
* normal kernel execution does not resume;
* the corresponding application diagnostic hook is invoked;
* the application determines the appropriate system response.

This architectural separation clearly defines the responsibilities of each
layer:

* **Kernel Core** — Detect fatal runtime inconsistencies.
* **Runtime Integrity Subsystem** — Validate kernel assumptions at critical
  execution points.
* **Application** — Decide how the detected condition is handled.

This model preserves deterministic kernel behavior while allowing every
application to implement a diagnostic policy appropriate for its operational
requirements.

---

### 11.2 Fail-Fast Model

The Runtime Integrity subsystem follows a deterministic **Fail-Fast** execution
model.

Rather than attempting to recover from fatal kernel inconsistencies, KatuOS
immediately transfers execution to a controlled diagnostic path whenever an
unrecoverable condition is detected.

This approach prevents corrupted kernel state from propagating through the
scheduler and simplifies failure analysis.

The Fail-Fast execution model is illustrated below.

```text
            Runtime Integrity Check
                     │
                     ▼
          Kernel State Consistent?
               │             │
             Yes             No
               │             │
               ▼             ▼
    Resume Task Execution    OS_SanityPanic()
                                     │
                                     ▼
                             SanityCheckErrorHook()
                                     │
                                     ▼
                             Application Diagnostic Policy
```

Unlike periodic maintenance services, runtime integrity verification is
performed synchronously at well-defined kernel execution boundaries.

This guarantees that kernel assumptions are validated immediately before task
execution resumes.

Whenever a fatal inconsistency is detected:

* normal scheduler execution stops immediately;
* no further task scheduling occurs;
* the Runtime Integrity subsystem invokes the fail-fast diagnostic path;
* the application is notified through the corresponding diagnostic hook.

The kernel intentionally does **not** attempt automatic recovery.

Recovering from an unknown or corrupted kernel state could produce
unpredictable behavior and compromise the deterministic execution model of the
operating system.

Instead, KatuOS delegates the final recovery policy to the application.

Typical application responses include:

* recording diagnostic information;
* activating a fault indicator;
* triggering a watchdog reset;
* placing the system into a safe state;
* halting execution for debugger inspection.

This separation preserves a clear architectural boundary between **error
detection**, which belongs to the Kernel Core, and **error handling**, which
remains under application control.

--

### 11.3 Runtime Sanity Checking

The Runtime Sanity Check subsystem provides deterministic verification of the
kernel state immediately before task execution resumes.

Rather than continuously inspecting every kernel object, KatuOS performs
integrity validation only at carefully selected execution boundaries.

This approach preserves bounded execution time while ensuring that the most
critical kernel assumptions remain valid before control is transferred to the
next scheduled task.

The Runtime Sanity Check model is illustrated below.

```text
               Scheduler
                    │
                    ▼
      Select Next Runnable Task
                    │
                    ▼
        Runtime Sanity Check
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      Valid State        Invalid State
          │                   │
          ▼                   ▼
   Resume Task         OS_SanityPanic()
```

The Runtime Sanity Check subsystem validates only the task selected for
execution.

By limiting verification to the current scheduling decision, KatuOS guarantees
that runtime integrity checking remains deterministic and suitable for the
kernel dispatch path.

Typical runtime integrity verification includes:

* stack pointer validity;
* stack pointer alignment;
* Task Control Block consistency;
* task identifier validation;
* task priority validation;
* scheduler state invariants.

The specific validation rules are internal to the Kernel Core and may evolve
without affecting the public application programming interface.

Whenever a fatal inconsistency is detected, the Runtime Sanity Check subsystem
immediately transfers control to the fail-fast diagnostic path described in the
previous section.

Normal scheduler execution does not resume after a fatal integrity violation.

The application is subsequently notified through the appropriate diagnostic
hook, allowing it to implement the recovery policy appropriate for the target
system.

The Runtime Sanity Check subsystem therefore provides deterministic runtime
protection while preserving the bounded execution characteristics required by
the KatuOS scheduler.

---

### 11.4 Runtime Error Model

The Runtime Integrity subsystem detects only those conditions that prevent the
Kernel Core from safely continuing execution.

These conditions represent violations of fundamental kernel invariants rather
than ordinary application errors.

Application logic errors remain the responsibility of the application itself
and are outside the scope of the Runtime Integrity subsystem.

Typical fatal runtime conditions include:

* task stack pointer outside its valid stack region;
* misaligned task stack pointer;
* inconsistent Task Control Block state;
* invalid task identifier;
* invalid task priority;
* violation of Idle Task invariants.

Each detected condition is associated with a specific runtime error code that
uniquely identifies the violated kernel assumption.

This allows the application to distinguish different failure causes while
keeping the Runtime Integrity subsystem independent from application-specific
diagnostic policies.

The relationship between runtime validation and error reporting is illustrated
below.

```text
        Runtime Validation
                │
                ▼
     Kernel Invariant Violated?
          │               │
       No │               │ Yes
          ▼               ▼
 Continue Execution       Runtime Error Code
                                 │
                                 ▼
                          OS_SanityPanic()
                                  │
                                  ▼
                          SanityCheckErrorHook()
```

Each runtime error represents a **kernel integrity violation**.

Unlike recoverable operational conditions such as communication timeouts or
resource exhaustion, runtime integrity violations indicate that the internal
state of the Kernel Core can no longer be considered trustworthy.

For this reason, runtime error codes are treated as fatal conditions and always
activate the Fail-Fast execution model described in the previous sections.

The Runtime Error Model intentionally separates three distinct responsibilities:

* **Detection** — Validate kernel invariants.
* **Classification** — Associate the detected violation with a specific runtime
  error code.
* **Response** — Delegate the final diagnostic or recovery policy to the
  application.

This separation preserves the architecture-independent nature of the Kernel
Core while allowing applications to implement fault-handling strategies
appropriate for their operational requirements.

The complete list of runtime integrity error codes is defined by the Kernel
Core and forms part of the internal reliability infrastructure rather than the
public application programming interface.

---

### 11.5 Application Hooks

The Runtime Integrity subsystem reports fatal kernel conditions through the
KatuOS **Application Hook** mechanism.

Application Hooks define the architectural boundary between the Kernel Core and
application-specific diagnostic policy.

The Kernel Core is responsible for detecting unrecoverable runtime
inconsistencies.

The application is responsible for determining how those conditions are handled.

The Runtime Integrity subsystem therefore reports fatal kernel conditions
without imposing a predefined recovery strategy.

The following hook is associated with runtime integrity verification.

| Hook                     | Purpose                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `SanityCheckErrorHook()` | Reports a fatal runtime integrity violation detected by the Runtime Sanity Check subsystem. |

The hook receives:

* the runtime error code describing the detected integrity violation;
* the identifier of the task associated with the failure, when applicable.

This information allows the application to record diagnostic information or
transition the system to an appropriate safe state.

Default weak implementations are provided by the kernel.

Applications may override the default implementation simply by defining a
function with the same prototype.

---

#### Execution Context

`SanityCheckErrorHook()` is invoked only after the Runtime Integrity subsystem
has determined that normal kernel execution cannot safely continue.

At this point:

* scheduler execution has already stopped;
* interrupts remain disabled;
* the kernel has entered the Fail-Fast diagnostic path;
* normal task execution will not resume.

Consequently, hook implementations shall remain short and deterministic.

Unless explicitly documented otherwise, KatuOS services shall **not** be called
from within the hook.

Typical application actions include:

* recording minimal diagnostic information;
* activating a fault indicator;
* triggering a watchdog reset;
* placing external hardware into a safe state;
* halting execution for debugger inspection.

The Runtime Integrity subsystem intentionally separates **kernel error
detection** from **application recovery policy**, allowing each application to
implement the response most appropriate for its operational environment.

---

### 11.6 Internal Kernel Integration

In addition to the application integration described in the previous section,
the Runtime Integrity subsystem relies on a small set of internal kernel
services that implement deterministic runtime validation and the fail-fast
diagnostic path.

These services are part of the internal Kernel Core infrastructure and are not
intended for direct use by application software.

---

#### `OS_SanityCheckTick()`

Performs runtime integrity verification for the task selected by the Scheduler.

This function validates the kernel assumptions required before the selected task
is allowed to resume execution.

Unlike general-purpose diagnostic scans, the Runtime Integrity subsystem
validates only the task involved in the current scheduling decision.

This design preserves bounded execution time while protecting the most critical
execution boundary within the Kernel Core.

Applications shall not call this function directly.

---

#### `OS_SanityPanic()`

Activates the fail-fast diagnostic path after a fatal runtime integrity
violation has been detected.

This function:

* stops normal scheduler execution;
* invokes the application diagnostic hook;
* transfers the system to a safe non-returning state.

`OS_SanityPanic()` never returns.

Applications shall not call this function directly.

---

#### Runtime Error Codes

Fatal runtime conditions are classified using the internal
`OS_SanityErrorCode` enumeration.

Each error code identifies a specific kernel invariant that has been violated,
allowing the Runtime Integrity subsystem to report precise diagnostic
information while remaining independent from application-specific recovery
policies.

The Runtime Error Codes form the internal contract between the Runtime
Integrity subsystem and the Application Hook mechanism.

They are intended exclusively for communication between internal Kernel Core
services and the application diagnostic interface.

Although the application receives these values through
`SanityCheckErrorHook()`, their definition belongs to the internal reliability
infrastructure rather than the public KatuOS programming interface.

Future versions of the Runtime Integrity subsystem may extend the set of
runtime error codes without affecting the overall architecture of the kernel.

---

#### Internal Design Principles

The Runtime Integrity subsystem follows the same architectural principles
adopted throughout the KatuOS Kernel Core:

* deterministic execution;
* bounded validation time;
* architecture-independent behavior;
* fail-fast error handling;
* clear separation between kernel error detection and application recovery
  policy.

Applications interact with the Runtime Integrity subsystem exclusively through
the Application Hook mechanism.

All runtime validation, error classification and fail-fast processing remain
internal responsibilities of the Kernel Core.

---

### 11.7 Best Practices

The following recommendations help preserve the diagnostic value and
deterministic behavior of the KatuOS Runtime Integrity subsystem.

#### Keep Runtime Validation Enabled During Development

Runtime Sanity Checks provide valuable protection during application
development, integration and system validation.

Keeping the subsystem enabled helps detect invalid kernel state close to the
point where the inconsistency first becomes observable, simplifying diagnosis
and reducing the risk of secondary failures.

---

#### Treat Runtime Integrity Violations as Fatal

A Runtime Integrity violation indicates that one or more fundamental Kernel
Core assumptions can no longer be considered valid.

Applications shall not attempt to resume normal task execution after
`SanityCheckErrorHook()` is invoked.

Appropriate responses include:

* recording minimal diagnostic information;
* placing the system into a safe state;
* triggering a controlled reset;
* halting execution for debugger inspection.

---

#### Keep Diagnostic Hooks Minimal

Application Hook implementations should remain short, deterministic and
independent from normal kernel services.

At the time `SanityCheckErrorHook()` executes:

* scheduler activity has stopped;
* interrupts remain disabled;
* normal kernel execution cannot safely continue.

Hook implementations should therefore avoid:

* blocking operations;
* dynamic memory allocation;
* complex diagnostic protocols;
* calls to KatuOS services;
* dependencies on task scheduling or interrupt-driven peripherals.

---

#### Preserve Error Information Before Reset

When the application recovery policy includes a watchdog or software reset,
diagnostic information should be preserved before the reset occurs whenever
practical.

Useful information may include:

* runtime error code;
* associated task identifier;
* reset cause;
* application state marker;
* persistent diagnostic counter.

The storage mechanism must remain safe for use from the fail-fast execution
context.

---

#### Avoid Broad Runtime Scanning

Future Runtime Integrity checks should remain focused on kernel state involved
in the current critical execution boundary.

General scans of unrelated tasks or kernel objects should not be added to the
scheduler dispatch path unless their execution time remains demonstrably
bounded and their diagnostic value justifies the additional cost.

This principle preserves the KatuOS strategy of validating exactly the state
required for safe execution without consuming application resources
unnecessarily.

---

#### Preserve Deterministic Validation

Any future integrity rule added to the subsystem should:

* have bounded execution time;
* avoid dynamic memory allocation;
* avoid blocking operations;
* remain independent from application behavior;
* validate a clearly defined kernel invariant;
* transfer control to the fail-fast path when the invariant is violated.

---

#### Separate Reliability Mechanisms from Application Policy

The Kernel Core should remain responsible only for:

* detecting kernel integrity violations;
* classifying the detected failure;
* stopping unsafe execution;
* invoking the appropriate diagnostic interface.

The application should remain responsible for:

* logging;
* signaling;
* safe-state control;
* reset policy;
* external fault reporting.

This separation preserves the portability of the Kernel Core while allowing
each application to implement a reliability policy appropriate for its
operational environment.


> **The Runtime Integrity subsystem strengthens KatuOS reliability by validating
critical kernel assumptions at deterministic execution boundaries.**
>
> **By detecting fatal inconsistencies before task execution resumes and
immediately activating the Fail-Fast diagnostic path, KatuOS prevents corrupted
kernel state from propagating while preserving the bounded and analyzable
execution model of the operating system.***

---
