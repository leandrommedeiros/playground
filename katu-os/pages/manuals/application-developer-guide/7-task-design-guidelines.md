---
title: "7 Task Design Guidelines"
permalink: /katu-os/manuals/application-developer-guide/7-task-design-guidelines/
---

## 7. Task Design Guidelines

This chapter provides recommendations for designing applications that make
effective use of the KatuOS scheduling and timing model.

Rather than describing isolated programming techniques, these guidelines explain
how application tasks should interact with the scheduler, the kernel time model
and the synchronization services to achieve predictable and deterministic
behavior.

---

### 7.1 Event-Driven Design

KatuOS is designed to encourage **event-driven execution**.

Whenever possible, tasks should remain blocked until useful work becomes
available instead of waking periodically to poll system state.

Synchronization primitives such as Task Notifications, Semaphores and Queues
allow tasks to sleep until an event occurs, minimizing unnecessary processor
activity while improving system responsiveness.

An event-driven design generally provides:

- lower processor utilization;
- lower power consumption;
- fewer unnecessary context switches;
- improved responsiveness;
- better scalability as the application grows.

Polling should only be used when required by the application.

---

### 7.2 Delay-Based Execution

When periodic execution is required, KatuOS provides two complementary delay
mechanisms.

`OS_Delay()` is appropriate for:

- execution pacing;
- retry or back-off strategies;
- non-critical waiting periods.

`OS_DelayUntil()` should be preferred whenever maintaining a fixed execution
period is required.

The appropriate use of each delay mechanism is described in
**Chapter 6 – Kernel Time Management**.

---

### 7.3 Priority Assignment

Task priorities should reflect the timing requirements of the application.

Lower numeric values represent higher priorities and should be reserved for
activities requiring the shortest response times.

When assigning priorities:

- prioritize tasks according to application requirements rather than execution frequency;
- reserve the highest priorities for genuinely time-critical activities;
- avoid assigning unnecessarily high priorities to periodic background tasks.

A well-balanced priority assignment improves responsiveness while preserving
predictable scheduling behavior.

---

### 7.4 Designing Responsive Applications

Responsive applications cooperate with the scheduler rather than competing for
processor time.

Tasks should spend most of their lifetime in one of two states:

- executing useful work;
- blocked waiting for time or synchronization events.

Busy loops and continuous polling should be avoided whenever practical.

Likewise, `OS_Delay(1)` should not be used as a general-purpose yield mechanism.

Repeatedly waking high-priority tasks at every Kernel Tick increases scheduler
activity and reduces processor availability for lower-priority tasks.

Whenever practical, periodic polling should be replaced by an event-driven
design using the synchronization primitives provided by KatuOS.

When the Kernel Maintenance Process is enabled, it executes independently from
application tasks and requires no special consideration during application
design.


---

### 7.5 Summary

Applications that naturally cooperate with the KatuOS execution model typically
exhibit:

- deterministic scheduling behavior;
- efficient processor utilization;
- predictable timing;
- improved scalability;
- simpler application logic.

In general:

- use synchronization primitives whenever work depends on external events;
- use `OS_Delay()` for simple relative delays;
- use `OS_DelayUntil()` for deterministic periodic execution;
- assign priorities according to application timing requirements rather than CPU usage.

Following these guidelines allows applications to fully benefit from the
deterministic scheduling model provided by KatuOS.

---
