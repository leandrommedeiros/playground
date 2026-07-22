---
title: "7. Queues"
permalink: /katu-os/manuals/api-quick-reference/7-queues/
---

# 7. Queues

Queues provide deterministic communication between execution contexts while
simultaneously transferring application data.

Each queue stores application-defined objects in FIFO order using an
application-supplied buffer.

When the queue becomes full, the oldest element is automatically overwritten,
ensuring deterministic producer behavior.

## Summary

| Function | Description |
|----------|-------------|
| `OS_QueueCreate()` | Creates a queue object. |
| `OS_QueueReset()` | Resets a queue to the empty state. |
| `OS_QueueDelete()` | Deletes a queue object. |
| `OS_QueueSend()` | Inserts an item into the queue. |
| `OS_QueueSendFromISR()` | Inserts an item from interrupt context. |
| `OS_QueueReceive()` | Retrieves the oldest queue item. |
| `OS_QueueCount()` | Returns the number of stored items. |
| `OS_QueueIsFull()` | Indicates whether the queue is full. |
| `OS_QueueIsEmpty()` | Indicates whether the queue is empty. |
| `OS_QueueOverwrites()` | Returns the overwrite counter. |

<div style="page-break-after: always;"></div>

# OS_QueueCreate(...)

> Creates a queue object.

**Context**

Application

**Prototype**

```c
OS_Queue *OS_QueueCreate(uint16_t length,
                         uint16_t item_size,
                         void *buffer);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `length` | Maximum number of queue elements. |
| `item_size` | Size of each element in bytes. |
| `buffer` | Application-supplied storage buffer. |

**Returns**

| Value | Description |
|-------|-------------|
| Queue pointer | Queue successfully created. |
| `NULL` | Queue creation failed. |

**Remarks**

- The application owns the storage buffer.
- Queue contents are copied into the supplied buffer.
- Must be called before any queue operation.

**Example**

```c
SensorData queueStorage[16];

OS_Queue *sensorQueue;

sensorQueue = OS_QueueCreate(16,
                             sizeof(SensorData),
                             queueStorage);
```

**See Also**

- `OS_QueueDelete()`
- `OS_QueueReset()`

<div style="page-break-after: always;"></div>

# OS_QueueReset(...)

> Removes all items from a queue.

**Context**

Task

**Prototype**

```c
void OS_QueueReset(OS_Queue *queue);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |

**Returns**

None.

**Remarks**

- Removes all queued items.
- Preserves the application buffer.
- Resets internal queue indices.

**Example**

```c
OS_QueueReset(sensorQueue);
```

**See Also**

- `OS_QueueCreate()`

<div style="page-break-after: always;"></div>

# OS_QueueDelete(...)

> Deletes a queue object.

**Context**

Task

**Prototype**

```c
void OS_QueueDelete(OS_Queue *queue);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |

**Returns**

None.

**Remarks**

- Releases the queue object.
- Does not release the application buffer.
- The queue shall not be used after deletion.

**Example**

```c
OS_QueueDelete(sensorQueue);
```

**See Also**

- `OS_QueueCreate()`

<div style="page-break-after: always;"></div>

# OS_QueueSend(...)

> Inserts an item into a queue.

**Context**

Task

**Prototype**

```c
void OS_QueueSend(OS_Queue *queue,
                  const void *item);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |
| `item` | Pointer to the element to enqueue. |

**Returns**

None.

**Remarks**

- Copies the supplied element into the queue.
- Never blocks.
- If the queue is full, the oldest element is automatically overwritten.
- Preserves FIFO ordering for stored elements.

**Example**

```c
SensorData sample;

ReadSensor(&sample);

OS_QueueSend(sensorQueue,
             &sample);
```

**See Also**

- `OS_QueueReceive()`
- `OS_QueueSendFromISR()`

<div style="page-break-after: always;"></div>

# OS_QueueSendFromISR(...)

> Inserts an item into a queue from interrupt context.

**Context**

ISR

**Prototype**

```c
void OS_QueueSendFromISR(OS_Queue *queue,
                         const void *item);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |
| `item` | Pointer to the element to enqueue. |

**Returns**

None.

**Remarks**

- May be called from interrupt context.
- Preserves the overwrite policy.
- May trigger scheduling after ISR completion.

**Example**

```c
void ADC_IRQHandler(void)
{
    SensorData sample;

    ReadADC(&sample);

    OS_QueueSendFromISR(sensorQueue,
                        &sample);
}
```

**See Also**

- `OS_QueueSend()`
- `OS_QueueReceive()`

<div style="page-break-after: always;"></div>

# OS_QueueReceive(...)

> Retrieves the oldest item from a queue.

**Context**

Task

**Prototype**

```c
bool OS_QueueReceive(OS_Queue *queue,
                     void *item);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |
| `item` | Destination buffer. |

**Returns**

| Value | Description |
|-------|-------------|
| `true` | Item successfully received. |
| `false` | Queue is empty. |

**Remarks**

- Retrieves the oldest stored element.
- Preserves FIFO ordering.
- Does not block.
- Removes the retrieved element from the queue.

**Example**

```c
SensorData sample;

if (OS_QueueReceive(sensorQueue,
                    &sample))
{
    ProcessSample(&sample);
}
```

**See Also**

- `OS_QueueSend()`

<div style="page-break-after: always;"></div>

# OS_QueueCount(...)

> Returns the current number of stored queue elements.

**Context**

Task / ISR

**Prototype**

```c
uint16_t OS_QueueCount(OS_Queue *queue);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |

**Returns**

Current number of stored elements.

**Remarks**

- Does not modify the queue.
- Intended for diagnostics and status monitoring.

**Example**

```c
uint16_t pending;

pending = OS_QueueCount(sensorQueue);
```

**See Also**

- `OS_QueueIsEmpty()`
- `OS_QueueIsFull()`

<div style="page-break-after: always;"></div>

# OS_QueueIsFull(...)

> Indicates whether the queue has reached its capacity.

**Context**

Task / ISR

**Prototype**

```c
bool OS_QueueIsFull(OS_Queue *queue);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |

**Returns**

`true` if the queue is full; otherwise `false`.

**Remarks**

- Does not modify the queue.

**Example**

```c
if (OS_QueueIsFull(sensorQueue))
{
    LogWarning();
}
```

**See Also**

- `OS_QueueCount()`
- `OS_QueueIsEmpty()`

<div style="page-break-after: always;"></div>

# OS_QueueIsEmpty(...)

> Indicates whether the queue contains no elements.

**Context**

Task / ISR

**Prototype**

```c
bool OS_QueueIsEmpty(OS_Queue *queue);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |

**Returns**

`true` if the queue is empty; otherwise `false`.

**Remarks**

- Does not modify the queue.

**Example**

```c
if (OS_QueueIsEmpty(sensorQueue))
{
    WaitForData();
}
```

**See Also**

- `OS_QueueCount()`
- `OS_QueueIsFull()`

<div style="page-break-after: always;"></div>

# OS_QueueOverwrites(...)

> Returns the number of queue overwrites.

**Context**

Task / ISR

**Prototype**

```c
uint32_t OS_QueueOverwrites(OS_Queue *queue);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `queue` | Queue object. |

**Returns**

Number of elements discarded by the overwrite policy.

**Remarks**

- Intended for diagnostics.
- Does not modify the queue.
- Counter increases whenever the oldest element is discarded.

**Example**

```c
printf("Overwrites: %lu\n",
       OS_QueueOverwrites(sensorQueue));
```

**See Also**

- `OS_QueueSend()`

<div style="page-break-after: always;"></div>
