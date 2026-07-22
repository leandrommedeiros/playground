---
title: "6. Semaphores"
permalink: /katu-os/manuals/api-quick-reference/6-semaphores/
---

# 6. Semaphores

Semaphores provide deterministic synchronization between independent execution
contexts.

Unlike Task Notifications, Semaphores are independent kernel objects and may be
shared by multiple tasks.

KatuOS supports both Binary and Counting Semaphores.

## Summary

| Function | Description |
|----------|-------------|
| `OS_SemaphoreInit()` | Initializes a semaphore. |
| `OS_SemaphoreReset()` | Resets a semaphore. |
| `OS_SemaphoreWait()` | Waits until the semaphore becomes available. |
| `OS_SemaphoreSignal()` | Signals a semaphore from task context. |
| `OS_SemaphoreSignalFromISR()` | Signals a semaphore from interrupt context. |

<div style="page-break-after: always;"></div>

# OS_SemaphoreInit(...)

> Initializes a binary or counting semaphore.

**Context**

Application

**Prototype**

```c
void OS_SemaphoreInit(OS_Semaphore *sem,
                      uint8_t type,
                      uint16_t initial,
                      uint16_t max);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `sem` | Pointer to the semaphore object. |
| `type` | Semaphore type. |
| `initial` | Initial semaphore count. |
| `max` | Maximum semaphore count. |

**Enumeration**

| Value | Description |
|-------|-------------|
| `OS_SEM_BINARY` | Binary semaphore. |
| `OS_SEM_COUNTING` | Counting semaphore. |

**Returns**

None.

**Remarks**

- Initializes the semaphore object.
- The semaphore object is supplied by the application.
- Must be initialized before use.

**Example**

```c
OS_Semaphore semaphore;

OS_SemaphoreInit(&semaphore,
                 OS_SEM_BINARY,
                 0,
                 1);
```

**See Also**

- `OS_SemaphoreWait()`
- `OS_SemaphoreSignal()`

<div style="page-break-after: always;"></div>

# OS_SemaphoreReset(...)

> Restores a semaphore to a known state.

**Context**

Task

**Prototype**

```c
void OS_SemaphoreReset(OS_Semaphore *sem,
                       uint16_t value);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `sem` | Pointer to the semaphore object. |
| `value` | New semaphore counter value. |

**Returns**

None.

**Remarks**

- Clears the waiting list.
- Restores the semaphore counter.
- May be used to reinitialize synchronization.

**Example**

```c
OS_SemaphoreReset(&semaphore,
                  0);
```

**See Also**

- `OS_SemaphoreInit()`

<div style="page-break-after: always;"></div>

# OS_SemaphoreWait(...)

> Waits until the semaphore becomes available.

**Context**

Task

**Prototype**

```c
bool OS_SemaphoreWait(OS_Semaphore *sem,
                      uint32_t timeout);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `sem` | Pointer to the semaphore object. |
| `timeout` | Maximum waiting time expressed in Kernel Ticks. |

**Returns**

| Value | Description |
|-------|-------------|
| `true` | Semaphore acquired. |
| `false` | Timeout expired. |

**Remarks**

- Blocks the calling task while the semaphore is unavailable.
- Returns immediately if the semaphore is available.
- Timeout does not modify the semaphore state.
- Shall not be called from interrupt context.

**Example**

```c
if (OS_SemaphoreWait(&semaphore,
                     OS_WAIT_FOREVER))
{
    ProcessData();
}
```

**See Also**

- `OS_SemaphoreSignal()`
- `OS_SemaphoreSignalFromISR()`

<div style="page-break-after: always;"></div>

# OS_SemaphoreSignal(...)

> Signals a semaphore from task context.

**Context**

Task

**Prototype**

```c
void OS_SemaphoreSignal(OS_Semaphore *sem);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `sem` | Pointer to the semaphore object. |

**Returns**

None.

**Remarks**

- Releases one waiting task, if any.
- Otherwise increments the semaphore counter.
- Never exceeds the configured maximum count.

**Example**

```c
OS_SemaphoreSignal(&semaphore);
```

**See Also**

- `OS_SemaphoreWait()`
- `OS_SemaphoreSignalFromISR()`

<div style="page-break-after: always;"></div>

# OS_SemaphoreSignalFromISR(...)

> Signals a semaphore from interrupt context.

**Context**

ISR

**Prototype**

```c
void OS_SemaphoreSignalFromISR(OS_Semaphore *sem);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `sem` | Pointer to the semaphore object. |

**Returns**

None.

**Remarks**

- May be called from interrupt context.
- Preserves FIFO wake-up order.
- May trigger scheduling after ISR completion.

**Example**

```c
void ADC_IRQHandler(void)
{
    OS_SemaphoreSignalFromISR(&adcSemaphore);
}
```

**See Also**

- `OS_SemaphoreSignal()`
- `OS_SemaphoreWait()`

<div style="page-break-after: always;"></div>
