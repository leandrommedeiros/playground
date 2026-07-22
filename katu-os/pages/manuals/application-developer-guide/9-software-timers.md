---
title: "9 Software Timers"
permalink: /katu-os/manuals/application-developer-guide/9-software-timers/
---

## 9. Software Timers

This chapter describes the Software Timer service provided by KatuOS and its
role within the kernel execution model.

Rather than requiring dedicated application tasks for every timed activity,
Software Timers provide a deterministic mechanism for scheduling callback
functions to execute after a specified delay or at periodic intervals.

This chapter explains the Software Timer architecture, callback execution
model, public API and recommended application design practices.

---

### 9.1 Deferred Execution Model

Software Timers provide a mechanism for executing application-defined callback
functions at predetermined times without requiring dedicated application tasks.

Unlike task delays, which suspend the execution of the calling task, Software
Timers schedule future callback execution while allowing application tasks to
continue executing normally.

Software Timers therefore implement a **deferred execution model** that
complements the Scheduler, the Kernel Time Model and the Synchronization
Services.

Each Software Timer is defined by:

- a callback function;
- a timer period;
- an operating mode;
- an execution state.

Software Timers support two operating modes:

- **One-Shot**, in which the callback is executed only once after the specified
  timeout.
- **Periodic**, in which the callback is automatically rescheduled after every
  expiration.

Software Timers are built upon the Kernel Tick described in Chapter 6.

At every Kernel Tick, the timer service updates the internal counters of all
active timers. Whenever a timer expires, its callback is marked for execution.

Unlike hardware timer interrupt handlers, callback functions are **not**
executed during Kernel Tick processing.

Instead, expired callbacks are executed by an internal **Timer Service Task**,
allowing application code to perform deferred work without extending interrupt
latency.

This architectural separation provides several important advantages:

- deterministic interrupt latency;
- execution of callbacks in task context;
- compatibility with kernel services intended for task execution;
- fixed and predictable memory usage.

The Software Timer service therefore extends the Kernel Time Model by providing
deterministic deferred execution while preserving the architecture-independent
execution model adopted throughout KatuOS.

---

### 9.2 Timer Architecture

The KatuOS Software Timer service is implemented as a dedicated kernel
subsystem that separates **timer expiration** from **callback execution**.

This separation preserves deterministic interrupt latency while allowing timer
callbacks to execute in normal task context.

Rather than executing callbacks directly during Kernel Tick processing, the
Software Timer service operates across two complementary execution domains:

- the **Time Domain**, responsible for tracking timer expiration;
- the **Execution Domain**, responsible for executing expired timer callbacks.

Their relationship is illustrated below.

```text
                     Time Domain
┌─────────────────────────────────────────────────────┐
                     Kernel Tick
                          │
                          ▼
              OS_TimersTickUpdate()
                          │
                          ▼
             Update Active Timer Counters
                          │
                          ▼
                 Timer Expired ?
              No ─────────┴──────── Yes
                          │
                          ▼
             Queue Callback for Execution
└─────────────────────────────────────────────────────┘

                  Execution Domain
┌─────────────────────────────────────────────────────┐
                 Timer Service Task
                          │
                          ▼
               Execute Timer Callback
└─────────────────────────────────────────────────────┘
```

The Kernel Tick is responsible solely for maintaining the timing state of
active Software Timers.

At each Kernel Tick, the Software Timer Service updates the remaining time
associated with every active timer.

Whenever a timer expires, its callback is queued for deferred execution.

The callback itself is **never executed** during Kernel Tick processing.

Instead, callback execution is delegated to the internal Timer Service Task.

This architectural separation keeps interrupt processing short and predictable,
regardless of the complexity of individual callback functions.

---

#### Timer Service Task

The Timer Service Task is an internal kernel task created during Software Timer
service initialization.

Its sole responsibility is to execute callbacks associated with expired
Software Timers.

The Timer Service Task is scheduled according to the same deterministic rules
that apply to every other task managed by KatuOS.

Consequently:

- callbacks execute entirely in task context;
- callbacks may safely use kernel services intended for task execution;
- interrupt latency remains independent of callback execution time.

The Timer Service Task is fully managed by the kernel and is not intended to be
controlled directly by application code.

---

#### Deterministic Memory Usage

Software Timers are allocated from a fixed pool of timer descriptors managed by
the Software Timer Service.

Each timer descriptor stores all information required to manage an individual
Software Timer, including:

- timer period;
- remaining time;
- callback function;
- operating mode;
- execution state.

The maximum number of Software Timers is fixed at compile time.

Consequently, no dynamic memory allocation occurs during normal timer
operation, guaranteeing predictable memory consumption and deterministic
runtime behavior.

---

#### Relationship with the Kernel Time Model

The Software Timer Service extends the Kernel Time Model described in
Chapter 6.

All timer periods are expressed using the common Kernel Tick time base.

Consequently, Software Timers remain fully synchronized with task delays,
timeouts and all other kernel timing services.

Because every timing service shares the same time reference, applications can
combine delays, synchronization timeouts and Software Timers without requiring
additional time conversion or synchronization mechanisms.

---

### 9.3 Public API

The Software Timer service provides a compact public API for creating,
configuring and controlling software timers.

Applications interact exclusively with timer identifiers returned by the timer
service. All timer descriptors and execution state remain under kernel control,
preserving encapsulation and deterministic behavior.

The Software Timer service provides the following public functions.

| Function | Description |
|----------|-------------|
| `OS_TimerCreate()` | Creates a new Software Timer. |
| `OS_TimerStart()` | Starts or restarts a Software Timer. |
| `OS_TimerStop()` | Stops a Software Timer. |
| `OS_TimerChangePeriod()` | Changes the timer period. |
| `OS_TimerIsActive()` | Reports whether a Software Timer is currently active. |

---

#### `OS_TimerCreate()`

Creates a new Software Timer.

```c
int OS_TimerCreate(void (*cb)(void),
                   uint32_t period_ms,
                   uint8_t autoreload);
```

**Parameters**

- `cb` — Callback function executed when the timer expires.
- `period_ms` — Timer period expressed in Kernel Ticks.
- `autoreload` — Nonzero for periodic timers; zero for one-shot timers.

**Return Value**

Returns:

- Timer identifier on success.
- A negative value if no timer descriptor is available.

**Behavior**

Allocates a timer descriptor from the internal fixed timer pool and associates
it with the specified callback function.

The timer is created in the **stopped** state.

Timer execution begins only after `OS_TimerStart()` is called.

**Example**

```c
int ledTimer;

ledTimer = OS_TimerCreate(LedBlinkCallback,
                          500,
                          1);
```

---

#### `OS_TimerStart()`

Starts or restarts a Software Timer.

```c
void OS_TimerStart(int id);
```

**Parameters**

- `id` — Timer identifier returned by `OS_TimerCreate()`.

**Return Value**

None.

**Behavior**

Activates the selected timer and reloads its expiration counter from the
configured timer period.

Calling this function for an already active timer restarts its timing interval.

**Example**

```c
OS_TimerStart(ledTimer);
```

---

#### `OS_TimerStop()`

Stops a Software Timer.

```c
void OS_TimerStop(int id);
```

**Parameters**

- `id` — Timer identifier returned by `OS_TimerCreate()`.

**Return Value**

None.

**Behavior**

Stops timer operation while preserving its configured callback, period and
operating mode.

The timer may later be restarted without being recreated.

**Example**

```c
OS_TimerStop(ledTimer);
```

---

#### `OS_TimerChangePeriod()`

Changes the period of a Software Timer.

```c
void OS_TimerChangePeriod(int id,
                          uint32_t new_period_ms);
```

**Parameters**

- `id` — Timer identifier returned by `OS_TimerCreate()`.
- `new_period_ms` — New timer period expressed in Kernel Ticks.

**Return Value**

None.

**Behavior**

Updates the configured timer period.

If the timer is currently active, its expiration interval is immediately
restarted using the new period.

**Example**

```c
OS_TimerChangePeriod(ledTimer,
                     1000);
```

---

#### `OS_TimerIsActive()`

Determines whether a Software Timer is active.

```c
uint8_t OS_TimerIsActive(int id);
```

**Parameters**

- `id` — Timer identifier returned by `OS_TimerCreate()`.

**Return Value**

Returns:

- Nonzero if the timer is active.
- Zero otherwise.

**Behavior**

Reports the current execution state of the specified Software Timer without
modifying it.

**Example**

```c
if (OS_TimerIsActive(ledTimer))
{
    UpdateStatusLED();
}
```

---

### 9.4 Choosing Between Tasks and Software Timers

Software Timers and application tasks provide complementary execution models.

Although both mechanisms can perform application work, they are intended for
different purposes.

Software Timers schedule the execution of relatively small callback functions
after a specified delay or at periodic intervals.

Application tasks, on the other hand, provide an independent execution context
capable of performing continuous or computationally intensive processing.

The following guidelines help selecting the appropriate mechanism.

| Requirement | Recommended Mechanism |
|-------------|-----------------------|
| Execute a callback after a delay | Software Timer |
| Execute a callback periodically | Software Timer |
| Perform lightweight deferred processing | Software Timer |
| Execute long-running application logic | Task |
| Maintain an independent execution context | Task |
| Block waiting for events | Task |
| Perform continuous processing | Task |
| Implement a deterministic control loop | Task + `OS_DelayUntil()` |

As a general guideline:

- choose **Software Timers** for deferred callback execution;
- choose **Tasks** whenever an independent execution context is required.

Software Timers complement application tasks rather than replacing them.

Applications should avoid implementing long-running processing inside timer
callbacks.

Whenever substantial processing is required, the callback should notify or
signal an application task, allowing the scheduler to manage execution
according to the application's priority structure.

This approach preserves callback responsiveness while maintaining the
deterministic execution model provided by KatuOS.

---
### 9.5 Internal Kernel Integration

In addition to the public API presented in the previous sections, the Software
Timer service relies on internal kernel services responsible for integrating
the subsystem with the overall kernel execution model.

These functions are intended exclusively for use by the kernel and are not part
of the application programming interface.

---

#### `OS_TimersInit()`

Initializes the Software Timer service during kernel startup.

This function prepares the internal timer descriptors and creates the Timer
Service Task when Software Timers are enabled.

Applications shall not call this function directly.

---

#### `OS_TimersTickUpdate()`

Updates the Software Timer service during Kernel Tick processing.

At each Kernel Tick, this function:

- updates the remaining time of active timers;
- detects timer expirations;
- queues expired callbacks for execution by the Timer Service Task.

Callback functions are **not** executed by this function.

Its sole responsibility is maintaining the timing state of the Software Timer
subsystem.

Applications shall not call this function directly.

> **These internal services are automatically invoked by the kernel as part of the
normal initialization and Kernel Tick processing sequence.**
>
> **Application software interacts with the Software Timer subsystem exclusively
through the public timer API described in this chapter.**

---

### 9.6 Best Practices

The following recommendations help applications obtain the best performance
from the KatuOS Software Timer service while preserving deterministic system
behavior.

#### Keep Callback Functions Short

Timer callbacks should execute only the work necessary to respond to timer
expiration.

Callbacks execute sequentially within the Timer Service Task.

Consequently, lengthy callback execution delays subsequent timer callbacks and
reduces overall timer responsiveness.

Whenever substantial processing is required, the callback should notify an
application task and return as quickly as possible.

---

#### Avoid Blocking Operations

Timer callbacks should not perform operations that may block for extended
periods.

Blocking the Timer Service Task delays the execution of other expired timers and
reduces the responsiveness of the entire Software Timer subsystem.

Whenever blocking behavior is required, delegate the operation to an
application task.

---

#### Prefer Tasks for Continuous Processing

Software Timers are intended for deferred execution.

Applications requiring continuous execution, complex algorithms or long-running
processing should use dedicated application tasks instead.

---

#### Use Periodic Timers Only When Appropriate

Periodic Software Timers are well suited for lightweight activities such as:

- periodic status updates;
- watchdog servicing;
- communication timeouts;
- deferred housekeeping functions.

Applications requiring deterministic control loops should generally use
dedicated tasks together with `OS_DelayUntil()`.

---

#### Minimize the Number of Active Timers

Although the Software Timer service is deterministic, each active timer must be
evaluated during Kernel Tick processing.

Applications should therefore create only the timers required by their
functional design.

Unused timers should be stopped whenever possible.

---

#### Keep Callback Logic Independent

Whenever practical, timer callbacks should perform a single well-defined
operation.

Avoid implementing complex state machines or application workflows directly
inside callback functions.

Simple callbacks improve readability, facilitate testing and reduce execution
latency.

---

#### Prefer Event-Driven Design

Software Timers should complement an event-driven application architecture
rather than replace it.

Whenever timer expiration requires substantial application processing, the
recommended approach is:

1. Timer expires.
2. Callback executes quickly.
3. Callback notifies or signals an application task.
4. The application task performs the required processing.

This approach preserves deterministic callback latency while allowing the
scheduler to manage application execution according to task priorities.

> **The Software Timer service extends the Kernel Time Model by providing deterministic deferred execution without introducing additional execution contexts.**

When used according to these guidelines, Software Timers provide an efficient
and predictable mechanism for scheduling future application activities while
preserving the architectural principles of KatuOS.

---
