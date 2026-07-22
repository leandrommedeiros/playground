---
title: "2 Kernel Architecture And Api Organization"
permalink: /katu-os/manuals/application-developer-guide/2-kernel-architecture-and-api-organization/
---

## 2. Kernel Architecture and API Organization

This chapter provides an architectural overview of KatuOS and introduces the
major functional components that together form the kernel.

Although KatuOS exposes a unified public API, its services are organized into
functional groups, each responsible for a specific aspect of kernel behavior.
Understanding this organization helps application developers select the most
appropriate service for each purpose while providing a clearer view of the
kernel architecture.

The relationship between these functional groups is illustrated below.

```text
                    Application
                          │
                          ▼
                  Public KatuOS API
                          │
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
 Kernel Lifecycle   Task Management   Kernel Time Services
      │                   │                   │
      ├─────────────┐     │     ┌─────────────┤
      ▼             ▼     ▼     ▼             ▼
  Scheduler        Synchronization     Software Timers
      │
      ▼
  CPU Port Layer
      │
      ▼
Processor Architecture
```

The principal functional groups are:

---

### Kernel Lifecycle

Responsible for initializing and starting the operating system.

This group establishes the execution environment before multitasking begins.

#### Public API

| Function     | Description                                                           |
| ------------ | --------------------------------------------------------------------- |
| `OS_Init()`  | Initializes the kernel infrastructure and internal services.          |
| `OS_Start()` | Starts multitasking execution and transfers control to the scheduler. |

---

### Task Management

Responsible for creating and managing application tasks.

#### Public API

| Function           | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `OS_CreateTask()`  | Creates a user task and prepares it for scheduling.           |
| `OS_DeleteTask()`  | Deletes a user task and releases its stack memory.            |
| `OS_TaskSuspend()` | Suspends a task and removes it from scheduling consideration. |
| `OS_TaskResume()`  | Resumes a previously suspended task.                          |

---

### Kernel Time Services

Provide the common time model used throughout the kernel.

#### Public API

| Function            | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| `OS_Delay()`        | Blocks the calling task for a relative time interval.                        |
| `OS_DelayUntil()`   | Blocks the calling task until a fixed periodic time reference is reached.    |
| `OS_GetTickCount()` | Returns the current Kernel Tick count.                                       |
| `OS_GetCpuLoad()`   | Returns the most recent CPU load sample when CPU load monitoring is enabled. |

---

### Synchronization Services

Allow tasks to exchange information and coordinate execution.

| Service            | Purpose                                                                        |
| ------------------ | ------------------------------------------------------------------------------ |
| Task Notifications | Provide lightweight one-to-one task signaling and 32-bit event/value delivery. |
| Semaphores         | Coordinate execution and access to shared resources.                           |
| Queues             | Transfer application data while preserving deterministic FIFO communication.   |

---

### Software Timers

Provide deferred execution of application callbacks based on the Kernel Time
Model.

Software Timers complement, rather than replace, task delays and synchronization
services.

#### Public API

| Function                 | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| `OS_TimerCreate()`       | Creates a Software Timer.                             |
| `OS_TimerStart()`        | Starts or restarts a Software Timer.                  |
| `OS_TimerStop()`         | Stops a Software Timer.                               |
| `OS_TimerChangePeriod()` | Changes the configured timer period.                  |
| `OS_TimerIsActive()`     | Reports whether a Software Timer is currently active. |


---

### Scheduler

Responsible for selecting the next task eligible for execution according to the
scheduling policy defined by KatuOS.

---

### CPU Port Layer

Implements the processor-dependent mechanisms required by the kernel while
preserving a common architecture-independent behavior.

Typical responsibilities include:

- Kernel Tick generation
- Context Switching
- Critical Sections
- Interrupt Management
- Low-Power State
- First Task Startup
- Stack Management

The implementation of these mechanisms depends on the target processor
architecture and is documented separately in the corresponding CPU Port
documentation.

Together, these functional groups provide a modular architecture in which each
subsystem has a well-defined responsibility while cooperating to provide the
execution model defined by KatuOS.

---
