---
title: "2. CPU Load Monitoring"
permalink: /katu-os/manuals/kernel-architecture-manual/2-cpu-load-monitoring/
---

# 2. CPU Load Monitoring

## 2.1 Introduction

CPU Load Monitoring provides an estimate of processor utilization during normal
kernel operation.

Rather than measuring the execution time of individual tasks, KatuOS evaluates
overall processor activity by observing the execution of the Idle Task over a
fixed observation window.

This approach provides a deterministic, architecture-independent metric with
minimal runtime overhead, making it particularly suitable for
resource-constrained embedded systems.

The CPU Load Monitor is an optional kernel subsystem and is completely removed
from the build when disabled.

---

## 2.2 Design Philosophy

The CPU Load Monitor was designed according to the same principles that govern
the rest of the KatuOS kernel:

- deterministic execution;
- bounded execution time;
- minimal memory footprint;
- architecture independence;
- zero-cost abstraction when disabled.

Unlike operating systems that maintain per-task execution statistics, KatuOS
does not attempt to measure processor usage at the task level.

Instead, processor utilization is inferred from the amount of time during which
the Idle Task is allowed to execute.

This definition naturally reflects the amount of processor time remaining
available to the application while avoiding the complexity and runtime overhead
associated with task-level accounting.

The objective of the subsystem is therefore not performance profiling, but
rather providing a simple and deterministic indication of system utilization.

---

## 2.3 Architectural Model

The CPU Load Monitor operates as an independent infrastructure component built
upon three existing kernel mechanisms:

- the Kernel Tick;
- the Idle Task;
- a fixed observation window.

Its operation is illustrated below.

```text
                 Kernel Tick
                      │
                      ▼
          Update Observation Counters
                      │
                      ▼
             Idle Task Executes?
               │             │
             Yes             No
               │             │
               ▼             ▼
           Increment    Idle Counter
               │
               ▼
 Observation Window Complete?
               │
         No ───┴─── Yes
                     │
                     ▼
         Compute CPU Load Sample
                     │
                     ▼
         Store Latest Measurement
```

The Kernel Tick provides the common time reference used throughout the kernel.

Whenever the Idle Task is executing during a Kernel Tick interval, the monitor
increments its internal idle counter.

At the end of each observation window, the subsystem calculates the processor
utilization from the accumulated idle time and stores the resulting value for
later retrieval.

No additional interrupts, timers or background tasks are required.

---

## 2.4 Observation Window

Rather than continuously updating the reported CPU Load, KatuOS evaluates
processor utilization over a fixed observation window.

The window size is defined at compile time:

```c
#define OS_CPU_LOAD_WINDOW_TICKS    N
```

During each window the subsystem records:

- total elapsed Kernel Ticks;
- Kernel Ticks spent executing the Idle Task.

At the end of the window:

- the CPU Load value is calculated;
- the result is stored;
- both counters are cleared;
- a new observation window begins.

Using a fixed observation window produces a stable utilization estimate while
keeping runtime cost constant and predictable.

The selected window length represents a trade-off between response time and
measurement stability.

Smaller windows react more quickly to changes in processor utilization, whereas
larger windows provide smoother long-term averages.

---

## 2.5 Measurement Algorithm

CPU Load is derived from the percentage of time during which the processor was
not executing the Idle Task.

Conceptually:

```text
CPU Load = 100 − Idle Time
```

Since both values are measured over the same observation window, no additional
timing reference is required.

The implementation intentionally relies only on integer arithmetic.

No floating-point operations are performed, allowing the subsystem to remain
efficient even on processors without hardware floating-point support.

The resulting value is expressed as an integer percentage in the range:

```text
0 ... 100
```

where:

| Value | Meaning |
|------:|---------|
| 0 | Processor almost completely idle |
| 1–99 | Partial processor utilization |
| 100 | Idle Task did not execute during the observation window |

---

## 2.6 Interaction with the Idle Task

The CPU Load Monitor depends on the architectural role of the Idle Task.

Because the Idle Task executes only when no application task is eligible for
execution, its execution time naturally represents unused processor capacity.

For this reason, the correctness of the CPU Load Monitor depends on preserving
the semantic purity of the Idle Task.

The Idle Task should therefore remain responsible only for:

- representing processor idle time;
- optionally placing the processor into a low-power state.

Kernel maintenance services intentionally execute outside the Idle Task through
the Kernel Maintenance Process.

This architectural separation prevents maintenance activities from influencing
CPU Load measurements and allows processor utilization to legitimately reach
100%.

---

## 2.7 Public Integration

When enabled, the subsystem exposes a single public service:

```c
uint8_t OS_GetCpuLoad(void);
```

This function returns the most recent CPU Load sample computed by the monitor.

The reported value always corresponds to the last completed observation window.

No calculations are performed when the function is called.

Consequently, retrieving the current CPU Load introduces negligible execution
overhead.

---

## 2.8 Internal Kernel Integration

The CPU Load Monitor operates transparently as part of the kernel
infrastructure.

Its execution is distributed across two kernel execution paths.

### Kernel Tick

The Kernel Tick:

- advances the observation window;
- updates the timing counters;
- determines when a new measurement must be produced.

### Idle Task

The Idle Task:

- represents available processor time;
- supplies the idle-time information required by the monitor.

Neither subsystem depends directly on the other.

Instead, both cooperate through the common Kernel Tick time base, preserving
the modular architecture of the Kernel Core.

Applications never interact with these internal mechanisms directly.

---

## 2.9 Compile-Time Configuration

CPU Load Monitoring is entirely optional.

When disabled:

- no counters are allocated;
- no additional Kernel Tick processing occurs;
- no public API is generated.

The subsystem is enabled through the kernel configuration model.

This design preserves the KatuOS principle that optional services shall incur
no runtime or memory cost when not selected.

---

## 2.10 Design Notes

The CPU Load Monitor intentionally avoids:

- per-task execution accounting;
- execution-time profiling;
- high-resolution timers;
- dynamic sampling techniques;
- processor-specific performance counters.

Instead, the subsystem provides a deterministic estimate of processor
utilization using only mechanisms already required by the kernel.

This design minimizes implementation complexity while producing information
that is sufficiently accurate for telemetry, diagnostics and system monitoring.

---

## 2.11 Best Practices

Applications should interpret CPU Load as an indicator of overall processor
availability rather than as a profiling tool.

High reported CPU utilization should normally be investigated through
application design rather than by modifying the monitoring subsystem.

To obtain meaningful measurements:

- preserve the architectural role of the Idle Task;
- avoid executing application code from the Idle Task;
- enable the Kernel Maintenance Process instead of adding maintenance
  activities to the Idle Task;
- select an observation window appropriate for the expected system dynamics.

When used according to these principles, the CPU Load Monitor provides a simple,
deterministic and architecture-independent measure of processor utilization
without compromising the design goals of KatuOS.

---
