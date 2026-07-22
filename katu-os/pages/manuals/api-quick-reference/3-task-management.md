---
title: "3. Task Management"
permalink: /katu-os/manuals/api-quick-reference/3-task-management/
---

# 3. Task Management

The Task Management API provides the services required to create, control and
manage application tasks.

Every task managed by KatuOS executes independently and owns:

- an entry function;
- an independent stack;
- a static priority;
- a Task Control Block (TCB).

## Summary

| Function | Description |
|----------|-------------|
| `OS_CreateTask()` | Creates a new application task. |
| `OS_DeleteTask()` | Deletes an existing task. |
| `OS_TaskSuspend()` | Suspends a task. |
| `OS_TaskResume()` | Resumes a suspended task. |

<div style="page-break-after: always;"></div>

# OS_CreateTask(...)

> Creates a new application task.

**Context**

Application

**Prototype**

```c
void OS_CreateTask(void (*entry)(void),
                   uint8_t id,
                   uint8_t priority,
                   uint32_t stack_words);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `entry` | Task entry function. |
| `id` | Unique task identifier. |
| `priority` | Static task priority. Lower values represent higher priorities. |
| `stack_words` | Stack size expressed in 32-bit words. |

**Returns**

None.

**Remarks**

- Creates a new task.
- Allocates the task stack.
- Initializes the Task Control Block (TCB).
- Prepares the initial processor context.
- The task becomes eligible for execution only after `OS_Start()` is called.
- Task identifiers shall be unique.

**Example**

```c
OS_CreateTask(TaskControl,
              1,
              5,
              128);
```

**See Also**

- `OS_Init()`
- `OS_Start()`
- `OS_DeleteTask()`

<div style="page-break-after: always;"></div>

# OS_DeleteTask(...)

> Deletes an existing application task.

**Context**

Task

**Prototype**

```c
void OS_DeleteTask(uint8_t id);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Identifier of the task to be deleted. |

**Returns**

None.

**Remarks**

- Removes the task from scheduler control.
- Releases all resources associated with the task.
- A deleted task cannot be resumed.
- The Idle Task cannot be deleted.

**Example**

```c
OS_DeleteTask(TASK_LOGGER);
```

**See Also**

- `OS_CreateTask()`

<div style="page-break-after: always;"></div>

# OS_TaskSuspend(...)

> Suspends a task.

**Context**

Task

**Prototype**

```c
void OS_TaskSuspend(uint8_t id);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Identifier of the task to suspend. |

**Returns**

None.

**Remarks**

- Removes the task from scheduler consideration.
- Suspended tasks remain suspended until resumed.
- Suspension is independent of delays and synchronization objects.

**Example**

```c
OS_TaskSuspend(TASK_DISPLAY);
```

**See Also**

- `OS_TaskResume()`

<div style="page-break-after: always;"></div>

# OS_TaskResume(...)

> Resumes a previously suspended task.

**Context**

Task

**Prototype**

```c
void OS_TaskResume(uint8_t id);
```

**Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Identifier of the task to resume. |

**Returns**

None.

**Remarks**

- Restores a previously suspended task.
- The task becomes eligible for scheduling according to its current state.
- Resuming a task does not immediately force a context switch.

**Example**

```c
OS_TaskResume(TASK_DISPLAY);
```

**See Also**

- `OS_TaskSuspend()`

<div style="page-break-after: always;"></div>
