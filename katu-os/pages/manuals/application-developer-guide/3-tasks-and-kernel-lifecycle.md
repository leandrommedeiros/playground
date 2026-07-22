---
title: "3 Tasks And Kernel Lifecycle"
permalink: /katu-os/manuals/application-developer-guide/3-tasks-and-kernel-lifecycle/
---

## 3. Tasks and Kernel Lifecycle

This chapter introduces the task model adopted by KatuOS and describes how the
kernel is initialized before application execution begins.

---

### 3.1 Task Model

A task is the fundamental unit of execution managed by the KatuOS scheduler.

Each task executes independently and owns:

- an entry function;
- an independent stack;
- a static priority;
- a Task Control Block (TCB).

The scheduler allocates processor time among runnable tasks according to the
scheduling policy described in the following chapters.

---

### 3.2 Task Control Block (TCB)

Every task managed by KatuOS is represented internally by a **Task Control Block
(TCB)**.

The TCB stores all information required by the kernel to manage task execution,
including scheduling information, execution context, timing information and
synchronization state.

The Task Control Block is an internal kernel data structure.

Applications shall neither access nor modify the TCB directly. All interaction
with task state shall occur exclusively through the public KatuOS API.

Although the scheduler relies on information stored in the TCB, only part of
that information is relevant when determining task eligibility and scheduling
decisions.

---
### 3.3 Kernel Initialization

Kernel initialization begins with:

```c
OS_Init();
```

#### Purpose

Initializes the KatuOS kernel and prepares the internal infrastructure required
before application execution begins.

#### Prototype

```c
void OS_Init(void);
```

#### Parameters

None.

#### Return Value

None.

#### Behavior

`OS_Init()` performs all kernel initialization activities required before
multitasking starts.

Typical initialization activities include:

* initialization of internal kernel data structures;
* scheduler initialization;
* creation of the Idle Task;
* initialization of optional kernel services;
* creation of internal kernel resources.

This function prepares the kernel but does **not** start task scheduling.

Application tasks should be created only after kernel initialization has
completed.

#### Example

```c
int main(void)
{
    OS_Init();

    OS_CreateTask(Task1, 1, 5, 128);
    OS_CreateTask(Task2, 2, 10, 128);

    OS_Start();
}
```

---

### 3.4 Task Creation

Application tasks are created using:

```c
OS_CreateTask();
```

#### Purpose

Creates a new application task and registers it with the kernel.

#### Prototype

```c
void OS_CreateTask(void (*entry)(void),
                   uint8_t id,
                   uint8_t prio_base,
                   uint32_t stack_words);
```

#### Parameters

| Parameter     | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `entry`       | Task entry function.                                           |
| `id`          | Unique task identifier.                                        |
| `prio_base`   | Fixed task priority. Lower values represent higher priorities. |
| `stack_words` | Stack size expressed in 32-bit words.                          |

#### Return Value

None.

#### Behavior

Task creation:

* allocates the task stack;
* initializes the Task Control Block (TCB);
* prepares the initial processor context;
* stores the task scheduling parameters.

Creating a task does not immediately begin its execution.

The task becomes eligible for scheduling only after `OS_Start()` transfers
control to the scheduler.

#### Example

```c
OS_CreateTask(TaskControl,
              1,
              5,
              128);
```

---

### 3.5 Starting the Kernel

Application execution begins with:

```c
OS_Start();
```

#### Purpose

Starts multitasking execution and transfers processor control to the scheduler.

#### Prototype

```c
void OS_Start(void);
```

#### Parameters

None.

#### Return Value

This function does not return under normal operating conditions.

#### Behavior

`OS_Start()` concludes the initialization phase and begins scheduler-controlled
execution.

From this point onward:

* the scheduler selects the first runnable task;
* multitasking begins;
* processor execution becomes entirely scheduler-controlled.

`OS_Start()` shall be called only after the kernel has been initialized and all
initial application tasks have been created.

#### Example

```c
OS_Init();

OS_CreateTask(Task1, 1, 5, 128);
OS_CreateTask(Task2, 2, 10, 128);

OS_Start();
```

---

### 3.6 Kernel Startup Sequence

The normal application startup sequence is illustrated below.

```text
              Application
                    │
                    ▼
               OS_Init()
                    │
                    ▼
             OS_CreateTask()
                    │
                    ▼
               OS_Start()
                    │
                    ▼
             Kernel Scheduler
                    │
                    ▼
        Highest-Priority Runnable Task

```

This sequence represents the normal initialization flow of a KatuOS
application.

After `OS_Start()` transfers control to the scheduler, processor execution
becomes entirely scheduler-controlled.

---

### 3.7 Task Lifecycle

During execution, a task progresses through a well-defined lifecycle.

```text
          Not Created
               │
               ▼
            Created
               │
               ▼
           Runnable
               │
               ▼
            Running
          ┌────┴────┐
          ▼         ▼
     Delayed    Waiting for
                Synchronization
          │         │
          └────┬────┘
               ▼
           Runnable
```

Transitions between these states occur exclusively through services provided by
the KatuOS API.

The scheduler evaluates the current state of each task to determine its
eligibility for execution, as described in the next chapter.

---
