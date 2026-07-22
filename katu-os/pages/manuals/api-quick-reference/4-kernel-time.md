---
title: "4. Kernel Time"
permalink: /katu-os/manuals/api-quick-reference/4-kernel-time/
---

# 4. Kernel Time

The Kernel Time API provides the common time base used throughout KatuOS.

All timing services operate on the Kernel Tick, allowing delays, timeouts,
periodic execution and runtime measurements to share a common time reference.

## Summary

| Function | Description |
|----------|-------------|
| `OS_Delay()` | Blocks the calling task for a relative time interval. |
| `OS_DelayUntil()` | Blocks the calling task until a periodic time reference is reached. |
| `OS_GetTickCount()` | Returns the current Kernel Tick count. |
| `OS_GetCpuLoad()` | Returns the latest CPU load measurement. |

<div style="page-break-after: always;"></div>

# OS_Delay(...)

> Blocks the calling task for a relative time interval.

**Context**

Task

**Prototype**

```c
void OS_Delay(uint32_t ticks);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `ticks` | Delay duration expressed in Kernel Ticks. |

**Returns**

None.

**Remarks**

- Blocks only the calling task.
- The task becomes runnable automatically when the delay expires.
- Relative delays accumulate execution jitter over successive iterations.
- Shall not be called from interrupt context.
- `DELAY_LOCK` is reserved for internal kernel use.

**Example**

```c
for (;;)
{
    ReadInputs();

    ProcessInputs();

    OS_Delay(10);
}
```

**See Also**

- `OS_DelayUntil()`
- `OS_GetTickCount()`

<div style="page-break-after: always;"></div>

# OS_DelayUntil(...)

> Blocks the calling task until the next scheduled execution period.

**Context**

Task

**Prototype**

```c
void OS_DelayUntil(uint32_t *previousWakeTime,
                   uint32_t timeIncrement);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `previousWakeTime` | Pointer to the previous wake-up time. |
| `timeIncrement` | Execution period expressed in Kernel Ticks. |

**Returns**

None.

**Remarks**

- Intended for deterministic periodic execution.
- Eliminates cumulative timing drift.
- If the scheduled wake-up time has already passed, the function returns immediately.
- `timeIncrement` shall be less than `0x80000000`.
- Shall not be called from interrupt context.

**Example**

```c
uint32_t lastWake = OS_GetTickCount();

for (;;)
{
    ControlLoop();

    OS_DelayUntil(&lastWake, 10);
}
```

**See Also**

- `OS_Delay()`
- `OS_GetTickCount()`

<div style="page-break-after: always;"></div>

# OS_GetTickCount(void)

> Returns the current Kernel Tick count.

**Context**

Task / ISR

**Prototype**

```c
uint32_t OS_GetTickCount(void);
```

**Parameters**

None.

**Returns**

Current Kernel Tick count.

**Remarks**

- Monotonically increasing 32-bit counter.
- Wraps naturally after reaching its maximum value.
- Used as the common time reference for all kernel timing services.
- Time comparisons shall use wrap-around-safe arithmetic.

**Example**

```c
uint32_t start = OS_GetTickCount();

/* Perform operation */

uint32_t elapsed = OS_GetTickCount() - start;
```

**See Also**

- `OS_Delay()`
- `OS_DelayUntil()`

<div style="page-break-after: always;"></div>

# OS_GetCpuLoad(void)

> Returns the most recent CPU load measurement.

**Context**

Task

**Prototype**

```c
uint8_t OS_GetCpuLoad(void);
```

**Parameters**

None.

**Returns**

Current CPU load expressed as a percentage (0–100).

**Remarks**

- Available only when CPU Load Monitoring is enabled.
- Returns the latest completed measurement window.
- Does not trigger a new measurement.
- Intended for monitoring and diagnostics.

**Example**

```c
uint8_t cpuLoad;

cpuLoad = OS_GetCpuLoad();

printf("CPU Load: %u%%\n", cpuLoad);
```

**See Also**

- `OS_GetTickCount()`

<div style="page-break-after: always;"></div>
