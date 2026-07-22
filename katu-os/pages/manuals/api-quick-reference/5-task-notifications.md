---
title: "5. Task Notifications"
permalink: /katu-os/manuals/api-quick-reference/5-task-notifications/
---

# 5. Task Notifications

Task Notifications provide the lightest-weight synchronization mechanism
available in KatuOS.

Each task owns an internal notification object, allowing one-to-one signaling
without requiring additional kernel objects.

## Summary

### Basic Notification API

| Function | Description |
|----------|-------------|
| `OS_Notify()` | Sends a notification to a task. |
| `OS_NotifyFromISR()` | Sends a notification from interrupt context. |
| `OS_WaitNotify()` | Waits for a notification. |

### Extended Notification API

| Function | Description |
|----------|-------------|
| `OS_NotifyEx()` | Sends a notification using a configurable update policy. |
| `OS_NotifyExFromISR()` | Interrupt-safe version of `OS_NotifyEx()`. |
| `OS_WaitNotifyEx()` | Waits for an extended notification. |

<div style="page-break-after: always;"></div>

# OS_Notify(...)

> Sends a notification to a task.

**Context**

Task

**Prototype**

```c
void OS_Notify(uint8_t id,
               uint32_t value);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Destination task identifier. |
| `value` | Application-defined notification value. |

**Returns**

None.

**Remarks**

- Sends a notification to a single task.
- Stores the supplied notification value.
- If the destination task is waiting, it becomes runnable.
- Uses the default overwrite policy.

**Example**

```c
OS_Notify(TASK_CONTROL,
          EVENT_READY);
```

**See Also**

- `OS_NotifyFromISR()`
- `OS_WaitNotify()`
- `OS_NotifyEx()`

<div style="page-break-after: always;"></div>

# OS_NotifyFromISR(...)

> Sends a notification from interrupt context.

**Context**

ISR

**Prototype**

```c
void OS_NotifyFromISR(uint8_t id,
                      uint32_t value);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Destination task identifier. |
| `value` | Application-defined notification value. |

**Returns**

None.

**Remarks**

- May be called only from interrupt context.
- Preserves the same behavior as `OS_Notify()`.
- May trigger scheduling after ISR completion.

**Example**

```c
void USART_IRQHandler(void)
{
    OS_NotifyFromISR(TASK_SERIAL,
                     RX_EVENT);
}
```

**See Also**

- `OS_Notify()`
- `OS_WaitNotify()`

<div style="page-break-after: always;"></div>

# OS_WaitNotify(...)

> Waits until a notification is received or a timeout expires.

**Context**

Task

**Prototype**

```c
uint8_t OS_WaitNotify(uint32_t timeout,
                      uint32_t *value);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `timeout` | Maximum waiting time expressed in Kernel Ticks. |
| `value` | Optional pointer receiving the notification value. |

**Returns**

| Value | Description |
|-------|-------------|
| `1` | Notification received. |
| `0` | Timeout expired. |

**Remarks**

- Blocks the calling task.
- Returns immediately if a notification is already pending.
- Timeout does not consume pending notifications.
- Compatibility wrapper around `OS_WaitNotifyEx()`.

**Example**

```c
uint32_t event;

if (OS_WaitNotify(OS_WAIT_FOREVER,
                  &event))
{
    ProcessEvent(event);
}
```

**See Also**

- `OS_Notify()`
- `OS_NotifyEx()`
- `OS_WaitNotifyEx()`

<div style="page-break-after: always;"></div>

# OS_NotifyEx(...)

> Sends a notification using a configurable update policy.

**Context**

Task

**Prototype**

```c
void OS_NotifyEx(uint8_t id,
                 uint32_t value,
                 OS_NotifyAction action);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Destination task identifier. |
| `value` | Application-defined notification value. |
| `action` | Notification update policy. |

**Enumeration**

| Value | Description |
|-------|-------------|
| `eNoAction` | Deliver a notification without modifying the current value. |
| `eSetBits` | Set one or more bits in the notification value. |
| `eIncrement` | Increment the current notification value. |
| `eSetValueWithOverwrite` | Replace the current notification value. |
| `eSetValueWithoutOverwrite` | Replace the current value only if no notification is pending. |

**Returns**

None.

**Remarks**

- Provides the complete Task Notification model.
- Supports bit-based event signaling.
- Supports multiple notification update policies.
- Intended for advanced synchronization.

**Example**

```c
OS_NotifyEx(TASK_CONTROL,
            EVENT_RX,
            eSetBits);
```

**See Also**

- `OS_Notify()`
- `OS_NotifyExFromISR()`
- `OS_WaitNotifyEx()`

<div style="page-break-after: always;"></div>

# OS_NotifyExFromISR(...)

> Interrupt-safe version of `OS_NotifyEx()`.

**Context**

ISR

**Prototype**

```c
void OS_NotifyExFromISR(uint8_t id,
                        uint32_t value,
                        OS_NotifyAction action);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Destination task identifier. |
| `value` | Application-defined notification value. |
| `action` | Notification update policy. |

**Enumeration**

| Value | Description |
|-------|-------------|
| `eNoAction` | Deliver a notification without modifying the current value. |
| `eSetBits` | Set one or more bits in the notification value. |
| `eIncrement` | Increment the current notification value. |
| `eSetValueWithOverwrite` | Replace the current notification value. |
| `eSetValueWithoutOverwrite` | Replace the current value only if no notification is pending. |

**Returns**

None.

**Remarks**

- May be called from interrupt context.
- Preserves the selected notification update policy.
- May trigger scheduling after ISR completion.

**Example**

```c
OS_NotifyExFromISR(TASK_CONTROL,
                   EVENT_RX,
                   eSetBits);
```

**See Also**

- `OS_NotifyEx()`
- `OS_WaitNotifyEx()`

<div style="page-break-after: always;"></div>

# OS_WaitNotifyEx(...)

> Waits for an extended notification.

**Context**

Task

**Prototype**

```c
uint8_t OS_WaitNotifyEx(uint32_t bitsToClearOnEntry,
                        uint32_t bitsToClearOnExit,
                        uint32_t timeout,
                        uint32_t *value);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `bitsToClearOnEntry` | Bit mask applied before testing for a pending notification. |
| `bitsToClearOnExit` | Bit mask applied after the notification is consumed. |
| `timeout` | Maximum waiting time expressed in Kernel Ticks. |
| `value` | Optional pointer receiving the notification value. |

**Returns**

| Value | Description |
|-------|-------------|
| `1` | Notification received. |
| `0` | Timeout expired. |

**Remarks**

- Supports bit-based event flags.
- Supports configurable notification semantics.
- Timeout does not consume pending notifications.
- Provides the complete Task Notification interface.

**Example**

```c
uint32_t flags;

if (OS_WaitNotifyEx(EVENT_RX,
                    0,
                    100,
                    &flags))
{
    ProcessFlags(flags);
}
```

**See Also**

- `OS_WaitNotify()`
- `OS_NotifyEx()`

<div style="page-break-after: always;"></div>
