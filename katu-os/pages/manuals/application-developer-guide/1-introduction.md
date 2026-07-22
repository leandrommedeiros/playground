---
title: "1 Introduction"
permalink: /katu-os/manuals/application-developer-guide/1-introduction/
---

## 1. Introduction

**KatuOS (formerly SimpleRTOS)** is a compact, deterministic real-time operating
system designed for **resource-constrained embedded systems**.

The kernel is implemented in portable ANSI C and is intended to support multiple
processor architectures through a well-defined CPU Port layer, allowing the same
kernel architecture to be reused across different hardware platforms while
preserving consistent behavior.

KatuOS is built around a small set of fundamental engineering principles:

- deterministic behavior
- minimal memory footprint
- fixed-priority scheduling
- straightforward portability
- fully analyzable execution

These principles reflect the broader engineering philosophy of KatuOS:

> **System resources are intended to serve the application—not the operating system.**

Rather than maximizing the number of kernel features, KatuOS focuses on providing
the RTOS services commonly required by embedded applications in a carefully
right-sized form, preserving determinism while maximizing the resources
available to the application.

Core kernel characteristics include:

- Fixed-priority scheduling with deterministic round-robin among equal priorities
- Cooperative blocking through `OS_Delay()`, Task Notifications, Semaphores and Queues
- Context switching through the CPU Port layer using independent task stacks
- Optional software timers executed in task context
- Optional Kernel Maintenance Process
- Optional CPU Load monitoring
- Optional Stack Pattern verification

When enabled, the **Kernel Maintenance Process** periodically executes internal
kernel services through an internal software timer.

This design preserves the IdleTask's single responsibility of representing
processor idle time while ensuring deterministic execution of kernel
maintenance activities.

This document forms part of the **official KatuOS technical documentation** and
defines the normative behavior expected from both the kernel and applications
built upon it.

Unless explicitly stated otherwise, the concepts presented in this manual are
architecture-independent. Processor-specific implementation details are
described separately in the corresponding CPU Port documentation.

---
