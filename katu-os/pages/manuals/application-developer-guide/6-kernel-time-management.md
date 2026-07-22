---
title: "6 Kernel Time Management"
permalink: /katu-os/manuals/application-developer-guide/6-kernel-time-management/
---

## 6. Kernel Time Management

This chapter defines the KatuOS time model and the kernel services built upon it.

All time-related services provided by KatuOS share a common time base, allowing
delays, timeouts, periodic execution and software timers to operate consistently
throughout the kernel.

---

### 6.1 Kernel Time Model

KatuOS measures time using a periodic **Kernel Tick**.

The Kernel Tick represents the fundamental time reference of the operating system.

The Kernel Tick provides the common time reference used by all kernel timing
services, including:

- task delays;
- timeout management;
- software timers;
- periodic task execution;
- CPU Load monitoring.

Each Kernel Tick advances the internal kernel time by one tick, forming a
monotonically increasing time base shared by the entire system.

All time intervals managed by the kernel are expressed in ticks.

The actual hardware mechanism responsible for generating the Kernel Tick is
architecture-dependent and is implemented by the corresponding CPU Port.

---

### 6.2 Relative Delay — `OS_Delay()`

`OS_Delay()` suspends execution of the calling task for a relative time interval.

#### Purpose

Suspend the calling task for a specified number of Kernel Ticks.

#### Prototype

```c
void OS_Delay(uint32_t ms);
```

#### Parameters

| Parameter | Description                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------- |
| `ms`      | Delay duration expressed in Kernel Ticks (or milliseconds when the Kernel Tick period is 1 ms). |

#### Return Value

None.

#### Behavior

When a task calls `OS_Delay()`, the kernel:

* removes the calling task from the runnable state;
* loads its delay counter with the requested interval;
* allows the scheduler to execute another eligible task.

During Kernel Tick processing, the delay counter is decremented until it
reaches zero.

At that point, the task automatically becomes eligible for execution again.

`OS_Delay()` always specifies a delay relative to the instant at which it is
called. Consequently, variations in task execution time accumulate over
successive iterations.

#### Constraints

* `DELAY_LOCK` is reserved for internal kernel use and shall not be passed to
  `OS_Delay()`.
* This function shall not be called from interrupt context.

#### Typical Applications

* execution pacing;
* retry or back-off strategies;
* non-critical waiting periods.

#### Example

```c
void Task_Sensor(void)
{
    for (;;)
    {
        ReadSensor();
        ProcessData();

        OS_Delay(10);
    }
}
```

---

### 6.3 Kernel Tick Counter — `OS_GetTickCount()`

The current Kernel Time reference can be obtained through:

#### Purpose

Return the current Kernel Tick count.

#### Prototype

```c
uint32_t OS_GetTickCount(void);
```

#### Parameters

None.

#### Return Value

Returns the current Kernel Tick count as a 32-bit unsigned value.

#### Behavior

The Kernel Tick counter:

* increases monotonically;
* is incremented exclusively by the Kernel Tick handler;
* wraps naturally after reaching its maximum value;
* provides the common time reference used by all kernel timing services.

The returned value may be used for elapsed-time measurement, timeout
calculations and periodic scheduling.

#### Notes

* Time comparisons shall use wrap-around-safe arithmetic.
* CPU-specific atomicity guarantees are described in the corresponding CPU Port
  documentation.

#### Typical Applications

* elapsed time measurement;
* timeout calculations;
* periodic scheduling;
* execution profiling.

#### Example

```c
uint32_t start = OS_GetTickCount();

/* Perform operation */

uint32_t elapsed = OS_GetTickCount() - start;
```

---

### 6.4 Absolute Delay — `OS_DelayUntil()`

For deterministic periodic execution, KatuOS provides:

#### Purpose

Suspend the calling task until a fixed periodic time reference is reached.

#### Prototype

```c
void OS_DelayUntil(uint32_t *previousWakeTime,
                   uint32_t timeIncrement);
```

#### Parameters

| Parameter          | Description                                         |
| ------------------ | --------------------------------------------------- |
| `previousWakeTime` | Pointer to the previous scheduled wake-up instant.  |
| `timeIncrement`    | Desired execution period expressed in Kernel Ticks. |

#### Return Value

None.

#### Behavior

Unlike `OS_Delay()`, which specifies a relative delay,
`OS_DelayUntil()` schedules execution relative to a fixed periodic reference.

The next wake-up instant is calculated as:

```text
previousWakeTime + timeIncrement
```

After every successful call, `previousWakeTime` is advanced by exactly
`timeIncrement`.

This approach preserves a constant execution period without accumulating timing
drift.

If the calculated wake-up time already lies in the past, the function returns
immediately without blocking.

Time comparisons are performed using wrap-around-safe arithmetic, allowing
correct operation across 32-bit tick counter overflow.

#### Constraints

* `timeIncrement` shall be strictly less than `0x80000000`.
* This function shall not be called from interrupt context.

#### Typical Applications

* periodic control loops;
* sampling tasks;
* deterministic cyclic execution;
* periodic communication.

#### Example

```c
void PeriodicTask(void)
{
    uint32_t lastWake = OS_GetTickCount();

    for (;;)
    {
        DoWork();

        OS_DelayUntil(&lastWake, 10);
    }
}
```

---

### 6.5 Choosing Between `OS_Delay()` and `OS_DelayUntil()`

| Requirement | Recommended API |
|-------------|-----------------|
| Relative delay | `OS_Delay()` |
| Deterministic periodic execution | `OS_DelayUntil()` |
| Precise control loops | `OS_DelayUntil()` |
| Simple execution pacing | `OS_Delay()` |
| Event-driven execution | Synchronization primitives |

`OS_DelayUntil()` should be preferred whenever maintaining a fixed execution
period is more important than delaying for a fixed interval after completing the
current iteration.

---

### 6.6 Best Practices

The following recommendations help preserve deterministic scheduling behavior.

#### Prefer Event-Driven Designs

Whenever possible, tasks should block waiting for synchronization events rather
than waking periodically to poll system state.

Synchronization primitives such as Task Notifications, Semaphores and Queues
allow tasks to remain blocked until useful work is actually available.

#### Use Relative Delays for Pacing

`OS_Delay()` is well suited for:

- periodic pacing;
- retry delays;
- non-critical waiting periods.

#### Use Absolute Delays for Deterministic Periodicity

Applications requiring stable execution periods should prefer
`OS_DelayUntil()`.

Because the wake-up time is computed from a fixed reference, execution drift is
eliminated.

#### Avoid Using `OS_Delay(1)` as a Yield Mechanism

Using `OS_Delay(1)` merely to relinquish the processor is discouraged.

When executed repeatedly by high-priority tasks, this pattern may:

- increase scheduler activity;
- reduce processor availability for lower-priority tasks;
- introduce unnecessary timing variability.

Whenever practical, replace periodic polling with an event-driven design using
the synchronization primitives provided by KatuOS.

---
