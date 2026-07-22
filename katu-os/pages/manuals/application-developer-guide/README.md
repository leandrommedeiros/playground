---
title: "Revision History"
permalink: /katu-os/manuals/application-developer-guide/
---

<div style="height:60px;"></div>

<p align="center">
  <img src="{{ '/assets/images/katuos/brand/exports/KatuOS_512_clean.png' | relative_url }}" alt="KatuOS Logo" width="280">
</p>

<h1 align="center">
KatuOS Application Developer Guide
<div style="height:10px;"></div>
</h1>

<p align="center">
<i>Revision E — July 2026</i>
</p>

<div style="page-break-after: always;"></div>

<hr>

# Revision History

| Revision | Description |
|----------|-------------|
| RevA | Initial release |
| RevB | Editorial consolidation |
| RevC | Architecture review and Kernel Services consolidation |
| RevD | Table of Contents |
| RevE | Renamed to **KatuOS Application Developer Guide** - Previous name was **Scheduling, Delays & Synchronization Manual - RevD** |

<hr>

<div style="page-break-after: always;"></div>


# Table of Contents

## Part I — Kernel Fundamentals

1. Introduction

2. Kernel Architecture and API Organization
   - 2.1 Kernel Lifecycle
   - 2.2 Task Management
   - 2.3 Kernel Time Services
   - 2.4 Synchronization Services
   - 2.5 Software Timers
   - 2.6 Scheduler
   - 2.7 CPU Port Layer

3. Tasks and Kernel Lifecycle
   - 3.1 Task Model
   - 3.2 Task Control Block (TCB)
   - 3.3 Kernel Initialization
   - 3.4 Task Creation
   - 3.5 Starting the Kernel
   - 3.6 Kernel Startup Sequence
   - 3.7 Task Lifecycle

4. Philosophy of Scheduling

5. Scheduler
   - 5.1 Task Eligibility
   - 5.2 Kernel Tick Processing
   - 5.3 Task Selection
   - 5.4 Context Switching
   - 5.5 Internal Scheduler Services
   - 5.6 Scheduler Guarantees

---

## Part II — Kernel Services

6. Kernel Time Management
   - 6.1 Kernel Time Model
   - 6.2 Relative Delay — `OS_Delay()`
   - 6.3 Kernel Tick Counter — `OS_GetTickCount()`
   - 6.4 Absolute Delay — `OS_DelayUntil()`
   - 6.5 Choosing Between `OS_Delay()` and `OS_DelayUntil()`
   - 6.6 Best Practices

7. Task Design Guidelines
   - 7.1 Event-Driven Design
   - 7.2 Delay-Based Execution
   - 7.3 Priority Assignment
   - 7.4 Designing Responsive Applications
   - 7.5 Summary

8. Synchronization Services
   - 8.1 Synchronization Model
   - 8.2 Task Notifications
   - 8.3 Semaphores
   - 8.4 Queues
   - 8.5 Choosing the Appropriate Synchronization Primitive
   - 8.6 Best Practices

9. Software Timers
   - 9.1 Deferred Execution Model
   - 9.2 Timer Architecture
   - 9.3 Public API
   - 9.4 Choosing Between Tasks and Software Timers
   - 9.5 Internal Kernel Integration
   - 9.6 Best Practices

10. Kernel Maintenance Process
    - 10.1 Maintenance Philosophy
    - 10.2 Maintenance Architecture
    - 10.3 Maintenance Services
    - 10.4 Public Integration
    - 10.5 Internal Kernel Integration
    - 10.6 Best Practices

11. Kernel Reliability and Runtime Integrity
    - 11.1 Reliability Philosophy
    - 11.2 Fail-Fast Model
    - 11.3 Runtime Sanity Checking
    - 11.4 Runtime Error Model
    - 11.5 Application Hooks
    - 11.6 Internal Kernel Integration
    - 11.7 Best Practices


<div style="page-break-after: always;"></div>

# Part I — Architecture Overview

The chapters in this part introduce the architectural foundations of the
KatuOS Kernel Core.

Rather than describing individual kernel services, they present the overall
organization of the operating system and the infrastructure upon which every
kernel subsystem is built.

The objective is to establish a clear understanding of the architectural model
before exploring its individual components.

Together, these chapters define the concepts that shape the Kernel Core and
provide the context required to understand the remaining sections of this
manual.

---
