---
title: "8 Synchronization Services"
permalink: /katu-os/manuals/application-developer-guide/8-synchronization-services/
---

## 8. Synchronization Services

This chapter defines the synchronization model provided by KatuOS and describes
the services available for coordinating task execution and exchanging
application data.

Rather than presenting synchronization APIs as isolated mechanisms, this chapter
explains how Task Notifications, Semaphores and Queues interact with the
scheduler and the Kernel Time Model to support deterministic, event-driven
application design.

---

### 8.1 Synchronization Model

The KatuOS scheduler determines **which task executes next** according to the
current execution state of the system.

Synchronization services complement the scheduler by determining **when a
blocked task becomes eligible for execution again**.

Instead of repeatedly polling shared resources or external events, tasks are
expected to block until the required synchronization condition is satisfied or
a timeout expires.

This event-driven execution model minimizes processor utilization, improves
responsiveness and preserves deterministic scheduling behavior.

KatuOS provides three complementary synchronization mechanisms:

- Task Notifications
- Semaphores
- Queues

Although each mechanism addresses different application requirements, they all
share the same execution model.

When a task waits for synchronization, it becomes temporarily ineligible for
execution and is removed from scheduler consideration.

The task becomes eligible again when one of the following conditions occurs:

- the expected synchronization event is signaled;
- the required resource becomes available;
- application data becomes available;
- the specified timeout expires.

This execution model is fully integrated with the scheduler described in
Chapter 5 and the Kernel Time Model described in Chapter 6.

Consequently, synchronization services do not alter the scheduling policy.
Instead, they influence task eligibility by controlling when blocked tasks
return to the runnable state.

The relationship between these kernel subsystems is illustrated below.

```text
                    Kernel Tick
                         │
                         ▼
              Kernel Time Management
                         │
                         ▼
               Synchronization Services
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
Task Notifications   Semaphores        Queues
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                Runnable Task State
                         │
                         ▼
                      Scheduler
                         │
                         ▼
                 Context Switching
```

Although all three synchronization mechanisms may unblock tasks, each one is
designed for a different purpose.

Task Notifications provide lightweight one-to-one task signaling.

Semaphores coordinate execution between independent tasks or protect shared
resources.

Queues synchronize execution while simultaneously transferring application
data.

Choosing the most appropriate synchronization primitive improves application
clarity while preserving the deterministic behavior expected from KatuOS.

Whenever practical, applications should prefer synchronization primitives over
periodic polling.

Blocking until useful work becomes available reduces processor utilization,
improves power efficiency and naturally complements the deterministic execution
model provided by the scheduler.

---

### 8.2 Task Notifications

#### Notification Model

Task Notifications provide the lightest-weight synchronization mechanism
available in KatuOS.

Unlike Semaphores and Queues, Task Notifications do not require independent
kernel objects. Instead, each task owns its own notification state, which is
maintained as part of its Task Control Block (TCB).

A notification may be used to:

- wake a blocked task;
- deliver a 32-bit application-defined value;
- signal one or more application-defined events;
- synchronize interrupt and task execution.

Because notifications are integrated into the task itself, they typically
provide the lowest-overhead synchronization mechanism available in the kernel.

When a task waits for a notification, it becomes temporarily non-runnable and
is removed from scheduler consideration.

The task becomes eligible for execution again when:

- a notification is received; or
- the specified timeout expires.

Task Notifications support both task-context and interrupt-context signaling,
making them particularly suitable for ISR-to-task communication.

---

#### Basic Notification API

The basic notification interface provides a simple one-to-one signaling
mechanism compatible with the execution model adopted by KatuOS.

These functions are suitable for most applications requiring lightweight task
synchronization.

##### `OS_Notify()`

Sends a notification to a task.

```c
void OS_Notify(uint8_t id,
               uint32_t value);
```

**Parameters**

- `id` — Destination task identifier.
- `value` — Application-defined notification value.

**Return Value**

None.

**Behavior**

Stores the supplied value in the destination task notification object using the
default overwrite policy.

If the destination task is waiting for a notification, it immediately becomes
eligible for scheduling.

---

##### `OS_NotifyFromISR()`

Sends a notification from interrupt context.

```c
void OS_NotifyFromISR(uint8_t id,
                      uint32_t value);
```

**Parameters**

- `id` — Destination task identifier.
- `value` — Application-defined notification value.

**Return Value**

None.

**Behavior**

Performs the same operation as `OS_Notify()`, but is intended for use from
interrupt service routines.

---

##### `OS_WaitNotify()`

Blocks the calling task until a notification is received or a timeout expires.

```c
uint8_t OS_WaitNotify(uint32_t timeout_ms,
                      uint32_t *out_value);
```

**Parameters**

- `timeout_ms` — Maximum waiting time expressed in Kernel Ticks.
- `out_value` — Optional pointer that receives the notification value.

**Return Value**

Returns:

- `1` if a notification is received.
- `0` if the timeout expires.

**Behavior**

This function is a compatibility wrapper around `OS_WaitNotifyEx()` using the
default notification behavior.

---

#### Extended Notification API

The extended notification interface provides additional control over the
notification value and supports multiple notification update policies.

These services are intended for applications requiring bit-based signaling,
event flags or more sophisticated notification semantics.

##### Notification Actions

The behavior of the extended notification services is controlled through the
`OS_NotifyAction` enumeration.

Supported actions are:

| Action | Description |
|---------|-------------|
| `eNoAction` | Deliver a notification without modifying the notification value. |
| `eSetBits` | Set one or more bits in the notification value. |
| `eIncrement` | Increment the current notification value. |
| `eSetValueWithOverwrite` | Replace the current notification value. |
| `eSetValueWithoutOverwrite` | Replace the value only when no notification is pending. |

---

##### `OS_NotifyEx()`

Sends an extended notification.

```c
void OS_NotifyEx(uint8_t id,
                 uint32_t value,
                 OS_NotifyAction action);
```

**Parameters**

- `id` — Destination task identifier.
- `value` — Application-defined value.
- `action` — Notification update policy.

---

##### `OS_NotifyExFromISR()`

Interrupt-safe version of `OS_NotifyEx()`.

```c
void OS_NotifyExFromISR(uint8_t id,
                        uint32_t value,
                        OS_NotifyAction action);
```

This function preserves the same notification semantics while allowing
notifications to originate from interrupt context.

---

##### `OS_WaitNotifyEx()`

Waits for an extended notification.

```c
uint8_t OS_WaitNotifyEx(uint32_t bitsToClearOnEntry,
                        uint32_t bitsToClearOnExit,
                        uint32_t timeout_ms,
                        uint32_t *out_value);
```

**Parameters**

- `bitsToClearOnEntry` — Bit mask applied before testing for a pending
  notification.
- `bitsToClearOnExit` — Bit mask applied after the notification is consumed.
- `timeout_ms` — Maximum waiting time expressed in Kernel Ticks.
- `out_value` — Optional pointer that receives the notification value.

**Return Value**

Returns:

- `1` if a notification is received.
- `0` if the timeout expires.

**Behavior**

This function provides the complete Task Notification model implemented by
KatuOS, including configurable notification actions and bit manipulation.

---

#### Example

```c
void ProducerTask(void)
{
    OS_Notify(TASK_CONTROL, EVENT_READY);
}

void ControlTask(void)
{
    uint32_t event;

    for (;;)
    {
        if (OS_WaitNotify(OS_WAIT_FOREVER, &event))
        {
            ProcessEvent(event);
        }
    }
}
```

Task Notifications are generally the preferred synchronization mechanism
whenever a single task must be awakened efficiently without transferring larger
amounts of application data.

---

#### Choosing Between Basic and Extended Notifications

KatuOS provides two complementary Task Notification interfaces.

The basic interface offers a compact and straightforward API suitable for most
applications requiring simple one-to-one task signaling.

The extended interface provides additional flexibility by allowing the
notification value to be manipulated according to different update policies and
by supporting bit-mask operations when waiting for notifications.

The following guidelines help selecting the appropriate interface.

| Requirement | Recommended API |
|-------------|-----------------|
| Simple task-to-task signaling | Basic Notification API |
| ISR-to-task signaling | Basic Notification API |
| Transfer a single 32-bit value | Basic Notification API |
| Bit-based event flags | Extended Notification API |
| Multiple notification update policies | Extended Notification API |
| Full control over notification behavior | Extended Notification API |

For applications that only require simple event signaling, the basic interface
is generally recommended because it provides a smaller and more straightforward
programming model.

Applications requiring event flags, bit manipulation or customized notification
semantics should use the extended notification interface.

---

### 8.3 Semaphores

#### Semaphore Model

Semaphores provide deterministic synchronization between independent execution
contexts.

Unlike Task Notifications, which are associated with individual tasks,
Semaphores are independent kernel objects that may be shared by multiple tasks.

KatuOS supports two semaphore types:

- Binary Semaphores
- Counting Semaphores

A semaphore maintains an internal counter representing the availability of a
shared resource or synchronization event.

When a task attempts to acquire an unavailable semaphore, it becomes blocked
until one of the following conditions occurs:

- another execution context signals the semaphore; or
- the specified timeout expires.

Each semaphore owns its own FIFO waiting list.

Tasks waiting on a semaphore are resumed in the same order in which they became
blocked, ensuring deterministic and predictable synchronization behavior.

To preserve bounded memory usage, waiting tasks are represented by nodes
allocated from a fixed-size kernel pool whose size is defined at compile time.

This design guarantees deterministic memory consumption while avoiding dynamic
allocation during normal kernel operation.

Semaphores are typically used to:

- protect shared resources;
- synchronize producer and consumer tasks;
- signal completion of asynchronous operations;
- coordinate execution between independent tasks.

Unlike Queues, Semaphores synchronize execution but do not transfer application
data.

---

#### Public API

The semaphore service provides the following public functions:

| Function | Description |
|----------|-------------|
| `OS_SemaphoreInit()` | Initializes a binary or counting semaphore. |
| `OS_SemaphoreReset()` | Resets the semaphore counter and clears its waiting list. |
| `OS_SemaphoreWait()` | Waits until the semaphore becomes available or the timeout expires. |
| `OS_SemaphoreSignal()` | Releases the semaphore from task context. |
| `OS_SemaphoreSignalFromISR()` | Releases the semaphore from interrupt context. |

---

##### `OS_SemaphoreInit()`

Initializes a semaphore object.

```c
void OS_SemaphoreInit(OS_Semaphore *sem,
                      uint8_t type,
                      uint16_t initial,
                      uint16_t max);
```

**Parameters**

- `sem` — Pointer to the semaphore object.
- `type` — Semaphore type (`OS_SEM_BINARY` or `OS_SEM_COUNTING`).
- `initial` — Initial semaphore count.
- `max` — Maximum semaphore count.

**Return Value**

None.

**Behavior**

Initializes the semaphore and prepares it for use.

The semaphore object is supplied by the application.

---

##### `OS_SemaphoreReset()`

Restores a semaphore to a known state.

```c
void OS_SemaphoreReset(OS_Semaphore *sem,
                       uint16_t value);
```

**Parameters**

- `sem` — Pointer to the semaphore object.
- `value` — New semaphore counter value.

**Return Value**

None.

**Behavior**

Resets the semaphore counter and clears the internal waiting list.

---

##### `OS_SemaphoreWait()`

Attempts to acquire a semaphore.

```c
bool OS_SemaphoreWait(OS_Semaphore *sem,
                      uint32_t timeout);
```

**Parameters**

- `sem` — Pointer to the semaphore object.
- `timeout` — Maximum waiting time expressed in Kernel Ticks.

**Return Value**

Returns:

- `true` if the semaphore is acquired.
- `false` if the timeout expires.

**Behavior**

If the semaphore is immediately available, execution continues without blocking.

Otherwise, the calling task is placed in the semaphore waiting list until the
semaphore becomes available or the timeout expires.

---

##### `OS_SemaphoreSignal()`

Signals a semaphore from task context.

```c
void OS_SemaphoreSignal(OS_Semaphore *sem);
```

**Parameters**

- `sem` — Pointer to the semaphore object.

**Return Value**

None.

**Behavior**

If one or more tasks are waiting, the oldest waiting task becomes eligible for
execution.

Otherwise, the semaphore counter is incremented, up to its configured maximum.

---

##### `OS_SemaphoreSignalFromISR()`

Signals a semaphore from interrupt context.

```c
void OS_SemaphoreSignalFromISR(OS_Semaphore *sem);
```

**Parameters**

- `sem` — Pointer to the semaphore object.

**Return Value**

None.

**Behavior**

Provides the interrupt-safe equivalent of `OS_SemaphoreSignal()` while
preserving the same FIFO wake-up policy.

---

#### Example

```c
OS_Semaphore dataReady;

void ProducerTask(void)
{
    for (;;)
    {
        ProduceData();

        OS_SemaphoreSignal(&dataReady);

        OS_Delay(100);
    }
}

void ConsumerTask(void)
{
    for (;;)
    {
        if (OS_SemaphoreWait(&dataReady, OS_WAIT_FOREVER))
        {
            ProcessData();
        }
    }
}
```

---

#### Choosing Between Binary and Counting Semaphores

KatuOS supports both Binary and Counting Semaphores.

The following guidelines help selecting the appropriate semaphore type.

| Requirement | Recommended Type |
|-------------|------------------|
| Single synchronization event | Binary Semaphore |
| Mutual exclusion | Binary Semaphore |
| Limited resource pool | Counting Semaphore |
| Multiple identical resources | Counting Semaphore |

Binary Semaphores are generally preferred whenever only two synchronization
states are required.

Counting Semaphores should be used whenever multiple instances of the same
resource may be available simultaneously.

> **Semaphores are intended to coordinate execution and resource ownership.**

Whenever application data must also be transferred between execution contexts,
Queues generally provide a more appropriate synchronization mechanism.

---

### 8.4 Queues

#### Queue Model

Queues provide deterministic communication between execution contexts while
simultaneously transferring application data.

Unlike Task Notifications and Semaphores, which synchronize execution without
transferring arbitrary data, Queues combine both capabilities into a single
kernel service.

Each queue stores application-defined objects inside a caller-provided buffer.

This design keeps memory ownership under application control while allowing the
kernel to manage only the queue state and synchronization logic.

A Queue maintains its contents in First-In, First-Out (FIFO) order.

When an item is inserted:

- the new element is copied into the queue;
- the oldest stored element is removed first when the queue reaches its
  configured capacity.

Rather than rejecting new data when full, KatuOS adopts a deterministic
overwrite policy.

The oldest queue element is discarded automatically to accommodate the newly
received item.

This behavior guarantees deterministic producer execution by preventing queue
saturation from blocking or failing enqueue operations.

Queues are therefore particularly suitable for:

- producer/consumer communication;
- buffered event delivery;
- sensor data acquisition;
- message passing between tasks;
- communication between interrupt handlers and tasks.

---

#### Public API

The Queue service provides the following public functions.

| Function | Description |
|----------|-------------|
| `OS_QueueCreate()` | Creates a queue object. |
| `OS_QueueReset()` | Resets a queue to the empty state. |
| `OS_QueueDelete()` | Deletes a queue object. |
| `OS_QueueSend()` | Inserts an item into the queue. |
| `OS_QueueSendFromISR()` | Inserts an item from interrupt context. |
| `OS_QueueReceive()` | Retrieves the oldest queue item. |
| `OS_QueueCount()` | Returns the current number of stored items. |
| `OS_QueueIsFull()` | Indicates whether the queue is full. |
| `OS_QueueIsEmpty()` | Indicates whether the queue is empty. |
| `OS_QueueOverwrites()` | Returns the overwrite counter. |

---

##### `OS_QueueCreate()`

Creates a Queue object.

```c
OS_Queue *OS_QueueCreate(uint16_t length,
                         uint16_t item_size,
                         void *buffer);
```

**Parameters**

- `length` — Maximum number of queue elements.
- `item_size` — Size of each queue element, in bytes.
- `buffer` — Application-provided storage area.

**Return Value**

Returns a pointer to the created Queue object, or `NULL` if creation fails.

**Behavior**

The queue object is initialized over the supplied storage area.

The application remains responsible for the lifetime of the buffer.

---

##### `OS_QueueReset()`

Resets a Queue.

```c
void OS_QueueReset(OS_Queue *q);
```

**Behavior**

Removes all stored elements and restores the Queue to its empty state without
modifying the application storage buffer.

---

##### `OS_QueueDelete()`

Deletes a Queue object.

```c
void OS_QueueDelete(OS_Queue *q);
```

**Behavior**

Releases the Queue object according to the configured memory model.

The application storage buffer is never released by this function.

---

##### `OS_QueueSend()`

Stores one element into the Queue.

```c
void OS_QueueSend(OS_Queue *q,
                  const void *item);
```

**Parameters**

- `q` — Queue object.
- `item` — Element to be copied into the Queue.

**Return Value**

None.

**Behavior**

If the Queue is full, the oldest element is automatically discarded before the
new element is inserted.

---

##### `OS_QueueSendFromISR()`

Interrupt-safe version of `OS_QueueSend()`.

```c
void OS_QueueSendFromISR(OS_Queue *q,
                         const void *item);
```

**Behavior**

Provides the same deterministic overwrite semantics while allowing Queue
updates from interrupt context.

---

##### `OS_QueueReceive()`

Retrieves the oldest Queue element.

```c
bool OS_QueueReceive(OS_Queue *q,
                     void *item);
```

**Parameters**

- `q` — Queue object.
- `item` — Destination buffer.

**Return Value**

Returns:

- `true` if an element is successfully retrieved.
- `false` if the Queue is empty.

---

#### Queue Status Functions

The Queue service also provides lightweight inspection functions.

| Function | Description |
|----------|-------------|
| `OS_QueueCount()` | Number of stored elements. |
| `OS_QueueIsFull()` | Indicates whether the Queue has reached its capacity. |
| `OS_QueueIsEmpty()` | Indicates whether the Queue currently contains no elements. |
| `OS_QueueOverwrites()` | Reports how many elements have been discarded by the overwrite policy. |

These functions provide diagnostic information without modifying the Queue
contents.

---

#### Example

```c
typedef struct
{
    uint16_t temperature;
    uint16_t humidity;
} SensorData;

SensorData queueBuffer[16];

OS_Queue *sensorQueue;

void ProducerTask(void)
{
    SensorData sample;

    for (;;)
    {
        ReadSensor(&sample);

        OS_QueueSend(sensorQueue, &sample);

        OS_Delay(100);
    }
}

void ConsumerTask(void)
{
    SensorData sample;

    for (;;)
    {
        if (OS_QueueReceive(sensorQueue, &sample))
        {
            ProcessSample(&sample);
        }
    }
}
```

---

#### Choosing Between Queues and Other Synchronization Services

Queues should be selected whenever synchronization and application data transfer
must occur simultaneously.

The following guidelines help selecting the appropriate synchronization
mechanism.

| Requirement | Recommended Service |
|-------------|---------------------|
| Wake a single task | Task Notification |
| Synchronize access to a shared resource | Semaphore |
| Transfer structured application data | Queue |
| Buffered producer/consumer communication | Queue |
| ISR-to-task data transfer | Queue |

Queues complement rather than replace the other synchronization primitives.

Task Notifications and Semaphores synchronize execution.

Queues synchronize execution while simultaneously transporting application data.

---

## 8.5 Choosing the Appropriate Synchronization Primitive

KatuOS provides three complementary synchronization mechanisms, each designed
to address a specific class of application requirements.

Although all three mechanisms may unblock waiting tasks, they differ in the
type of information exchanged and the synchronization semantics they provide.

Selecting the most appropriate primitive simplifies application design while
preserving deterministic kernel behavior.

The following guidelines summarize the recommended use of each synchronization
service.

| Requirement | Recommended Primitive |
|-------------|-----------------------|
| Wake a specific task | Task Notification |
| ISR-to-task signaling | Task Notification |
| Transfer a single 32-bit value | Task Notification |
| Event flags or bit-based signaling | Extended Task Notification |
| Synchronize access to a shared resource | Semaphore |
| Synchronize independent execution contexts | Semaphore |
| Control access to a limited resource pool | Counting Semaphore |
| Transfer application data | Queue |
| Buffered producer/consumer communication | Queue |
| Preserve FIFO ordering of messages | Queue |

As a general guideline:

- choose **Task Notifications** whenever a lightweight one-to-one signaling
  mechanism is sufficient;
- choose **Semaphores** whenever execution must be coordinated or shared
  resources must be protected;
- choose **Queues** whenever synchronization and application data transfer must
  occur simultaneously.

Applications should select the synchronization primitive according to the
required communication model rather than implementation convenience.

Using the synchronization mechanism that most naturally represents the
application behavior generally produces simpler, more maintainable and more
deterministic software.

---

## 8.6 Best Practices

The following recommendations help preserve deterministic synchronization
behavior throughout the application.

### Prefer Event-Driven Execution

Tasks should remain blocked until useful work becomes available.

Whenever practical, avoid periodically polling shared resources or application
state.

---

### Prefer the Simplest Synchronization Primitive

Select the synchronization mechanism that most naturally matches the
communication requirement.

Avoid introducing more complex synchronization objects when a simpler mechanism
provides equivalent functionality.

---

### Use Task Notifications for Lightweight Signaling

Task Notifications provide the lowest-overhead synchronization mechanism
available in KatuOS.

They should be preferred whenever communication is limited to a single task and
does not require buffering or shared synchronization objects.

---

### Use Semaphores for Resource Coordination

Semaphores are intended to coordinate execution or protect shared resources.

They should not be used as substitutes for data transfer mechanisms.

---

### Use Queues for Data Exchange

Whenever synchronization requires transferring structured application data,
Queues provide the appropriate abstraction.

Avoid implementing custom shared-memory communication protocols when Queue
semantics naturally express the required behavior.

---

### Consider Timeout Behavior

Infinite blocking should be reserved for situations in which the corresponding
event is guaranteed to occur.

Whenever practical, specify timeout values that allow the application to detect
unexpected conditions and recover gracefully.

---

### Keep Synchronization Simple

Application behavior should remain easy to understand by minimizing unnecessary
dependencies between tasks.

Simple synchronization models generally lead to better scalability, easier
maintenance and more predictable execution.

---

The synchronization services provided by KatuOS complement the Scheduler and
the Kernel Time Model, forming a unified event-driven execution model.

By selecting the synchronization primitive that best represents each
communication requirement, applications naturally preserve the deterministic
behavior that characterizes the KatuOS architecture.

---
