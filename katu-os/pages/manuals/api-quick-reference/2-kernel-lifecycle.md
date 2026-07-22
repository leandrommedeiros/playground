---
title: "2. Kernel Lifecycle"
permalink: /katu-os/manuals/api-quick-reference/2-kernel-lifecycle/
---

# 2. Kernel Lifecycle

The Kernel Lifecycle API initializes the operating system and starts
multitasking execution.

The normal application startup sequence is illustrated below.

```text
Application
      │
      ▼
 OS_Init()
      │
      ▼
Create Tasks
      │
      ▼
 OS_Start()
      │
      ▼
Scheduler
```

## Summary

| Function | Description |
|----------|-------------|
| `OS_Init()` | Initializes the kernel infrastructure. |
| `OS_Start()` | Starts multitasking execution. |

<div style="page-break-after: always;"></div>

# OS_Init(void)

> Initializes the KatuOS kernel and prepares all internal kernel services.

**Prototype**

```c
void OS_Init(void);
```

**Parameters**

None.

**Returns**

None.

**Remarks**

- Must be called exactly once.
- Must be the first KatuOS function called by the application.
- Initializes all enabled kernel subsystems.
- Does not start multitasking.
- Does not execute application tasks.

**Example**

```c
int main(void)
{
    HardwareInit();

    OS_Init();

    OS_CreateTask(TaskControl, 1, 5, 128);
    OS_CreateTask(TaskComm,    2, 8, 128);

    OS_Start();
}
```

**See Also**

- `OS_Start()`
- `OS_CreateTask()`

<div style="page-break-after: always;"></div>

# OS_Start(void)

> Starts multitasking execution and transfers processor control to the scheduler.

**Prototype**

```c
void OS_Start(void);
```

**Parameters**

None.

**Returns**

This function does not return under normal operating conditions.

**Remarks**

- Starts the scheduler.
- Transfers execution to the highest-priority runnable task.
- Shall be called only after `OS_Init()`.
- Shall be called only after the required application tasks have been created.
- Must not be called more than once.

**Example**

```c
OS_Init();

OS_CreateTask(TaskControl, 1, 5, 128);
OS_CreateTask(TaskComm,    2, 8, 128);

OS_Start();
```

**See Also**

- `OS_Init()`
- `OS_CreateTask()`

<div style="page-break-after: always;"></div>
