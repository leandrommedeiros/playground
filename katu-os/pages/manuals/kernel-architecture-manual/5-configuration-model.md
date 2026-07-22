---
title: "5. Configuration Model"
permalink: /katu-os/manuals/kernel-architecture-manual/5-configuration-model/
---

# 5. Configuration Model

## 5.1 Introduction

The KatuOS Configuration Model defines how kernel functionality is selected,
customized and integrated into a particular application.

Rather than relying on runtime configuration, KatuOS adopts a compile-time
configuration strategy that allows each application to include only the
services it requires.

This approach minimizes memory usage, eliminates unnecessary runtime overhead
and preserves the deterministic behavior expected from a real-time operating
system.

The Configuration Model is therefore an integral part of the kernel
architecture rather than merely a collection of preprocessor definitions.

---

## 5.2 Design Philosophy

The Configuration Model follows the same architectural principles as the rest
of the KatuOS kernel:

- simplicity;
- determinism;
- compile-time specialization;
- minimal memory footprint;
- zero-cost optional features.

Every optional subsystem can be completely removed from the final application
image when not required.

Consequently, unused kernel services consume neither program memory nor runtime
resources.

This philosophy allows KatuOS to scale naturally from extremely small
microcontrollers to larger embedded platforms while preserving the same kernel
architecture.

---

## 5.3 Architectural Model

Configuration parameters influence how the Kernel Core is built rather than how
it behaves at runtime.

The relationship between the configuration model and the rest of the kernel is
illustrated below.

```text
              Application
                    │
                    ▼
        Kernel Configuration File
                    │
                    ▼
          Compile-Time Selection
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Kernel Core   CPU Port   Optional Services
                    │
                    ▼
             Final Kernel Image
```

Every kernel build represents a specific configuration of the same
architecture.

The configuration process determines which optional services become part of the
Kernel Core before compilation is completed.

---

## 5.4 Configuration Categories

Configuration options are organized according to their architectural purpose.

Typical categories include:

### Kernel Limits

Define the maximum number of kernel-managed objects.

Examples include:

- maximum number of tasks;
- maximum number of software timers;
- queue capacities;
- semaphore resources.

---

### Optional Services

Enable or disable optional kernel functionality.

Examples include:

- CPU Load Monitor;
- Software Timers;
- Stack Pattern;
- Kernel Maintenance Process.

---

### Runtime Diagnostics

Control optional diagnostic facilities.

Typical examples include:

- runtime integrity verification;
- stack usage monitoring;
- application hooks.

---

### CPU Port Configuration

Processor-specific configuration parameters are defined exclusively within the
CPU Port layer.

The Kernel Core remains independent from processor-specific configuration.

---

## 5.5 Compile-Time Specialization

Compile-time specialization is one of the fundamental design principles of
KatuOS.

Optional services are selected before compilation.

Subsystems that are not enabled are completely excluded from the generated
kernel image.

As a consequence:

- no runtime feature detection is required;
- no additional conditional execution paths are introduced;
- memory usage remains predictable;
- execution time remains unaffected by disabled services.

---

## 5.6 Zero-Cost Optional Features

Every optional feature follows the zero-cost principle.

When disabled:

- no code is generated;
- no memory is allocated;
- no periodic processing occurs;
- no runtime overhead remains.

This principle applies uniformly throughout the Kernel Core.

The objective is to ensure that applications pay only for the functionality
they actually use.

---

## 5.7 Interaction with Kernel Subsystems

The Configuration Model influences nearly every kernel subsystem.

Examples include:

| Subsystem | Typical Configuration |
|-----------|-----------------------|
| Scheduler | Maximum number of tasks |
| Software Timers | Maximum timer pool size |
| CPU Load Monitor | Enable/Disable |
| Maintenance Process | Enable/Disable |
| Runtime Integrity | Enable/Disable |
| Stack Pattern | Enable/Disable |

Although configuration parameters affect subsystem availability, they do not
change the architectural responsibilities of those subsystems.

The kernel architecture remains constant regardless of the selected
configuration.

---

## 5.8 Interaction with the CPU Port

The Configuration Model intentionally separates architecture-independent
configuration from processor-specific configuration.

Kernel options describe the behavior of the Kernel Core.

Processor options describe the implementation details required by a particular
CPU Port.

This separation reinforces the architectural independence of the Kernel Core
and prevents hardware-specific assumptions from leaking into portable kernel
code.

---

## 5.9 Configuration Guidelines

Configuration options should satisfy the following principles:

- describe architectural capabilities rather than implementation details;
- remain independent from specific processor families;
- avoid hidden dependencies whenever practical;
- preserve deterministic behavior;
- remain stable across kernel versions whenever possible.

Configuration parameters should express **what** is being selected rather than
**how** the corresponding subsystem is implemented.

---

## 5.10 Design Notes

The KatuOS Configuration Model intentionally avoids runtime configuration of
kernel infrastructure.

Compile-time specialization provides several important advantages:

- simpler implementation;
- smaller executable images;
- deterministic execution paths;
- easier verification;
- reduced maintenance complexity.

Because every application produces a kernel image specifically tailored to its
requirements, unnecessary infrastructure never becomes part of the final
system.

---

## 5.11 Best Practices

Kernel developers introducing new configuration options should follow the
existing architectural model.

New options should:

- control complete architectural features rather than isolated implementation
  details;
- remain independent from processor architecture;
- avoid unnecessary coupling between subsystems;
- preserve the zero-cost philosophy for disabled features;
- maintain backward compatibility whenever practical.

Configuration files should remain concise, descriptive and focused on
architectural choices rather than implementation tuning.

Following these principles keeps the Configuration Model simple, scalable and
consistent with the overall design philosophy of KatuOS.

---
