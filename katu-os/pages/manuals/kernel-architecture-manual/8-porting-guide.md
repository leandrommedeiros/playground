---
title: "8. Porting Guide"
permalink: /katu-os/manuals/kernel-architecture-manual/8-porting-guide/
---

# 8. Porting Guide

## 8.1 Introduction

One of the fundamental design goals of KatuOS is to maintain a completely
portable Kernel Core.

All processor-dependent functionality is confined to the CPU Port layer,
allowing the same Kernel Core to execute on different processor architectures
without modification.

This chapter describes the architectural requirements for developing a new CPU
Port and explains the responsibilities of the CPU Port layer within the overall
kernel architecture.

Rather than providing processor-specific implementation details, this chapter
defines the architectural contract that every CPU Port shall satisfy.

---

## 8.2 Portability Philosophy

Portability in KatuOS is achieved through strict separation between policy and
mechanism.

The Kernel Core defines:

- scheduling;
- synchronization;
- timing;
- runtime integrity;
- kernel services.

The CPU Port implements only the processor-dependent mechanisms required to
execute those services.

As a consequence, porting KatuOS does not involve adapting kernel algorithms.

Instead, it consists of implementing the architectural interface expected by
the Kernel Core.

---

## 8.3 Architectural Layers

The overall organization is illustrated below.

```text
              Application
                    │
                    ▼
               Public API
                    │
                    ▼
              Kernel Core
                    │
        CPU Port Interface
                    │
                    ▼
              CPU Port Layer
                    │
                    ▼
       Processor Architecture
```

The CPU Port is the only layer aware of processor-specific details.

Every other kernel component remains architecture-independent.

---

## 8.4 Port Responsibilities

Every CPU Port shall provide mechanisms for:

- task context switching;
- task stack initialization;
- first task startup;
- interrupt management;
- critical sections;
- Kernel Tick support;
- processor idle operation.

These mechanisms collectively form the architectural interface required by the
Kernel Core.

No additional kernel policies should be implemented within the CPU Port.

---

## 8.5 Port Development Process

Developing a new CPU Port typically follows the sequence below.

### Step 1

Study the processor architecture.

Particular attention should be given to:

- stack model;
- interrupt model;
- calling convention;
- register organization;
- privilege model.

---

### Step 2

Implement the processor abstraction layer.

Typical implementation files include:

- CPU Port source;
- CPU Port header;
- architecture-specific assembly routines.

---

### Step 3

Initialize the execution environment.

This includes:

- stack initialization;
- interrupt priorities;
- scheduler entry;
- Kernel Tick source.

---

### Step 4

Validate the context switch mechanism.

Correct context preservation is the primary requirement for every CPU Port.

---

### Step 5

Validate kernel services.

Once context switching has been verified, the remaining kernel services should
operate without architectural modifications.

---

## 8.6 Validation Strategy

Validation should proceed incrementally.

Recommended order:

```text
    Stack Initialization
            │
            ▼
     First Task Startup
            │
            ▼
     Context Switching
            │
            ▼
       Kernel Tick
            │
            ▼
        Scheduling
            │
            ▼
      Synchronization
            │
            ▼
      Software Timers
            │
            ▼
     Runtime Integrity
```

Each stage builds upon the previous one.

This incremental approach simplifies debugging while isolating processor-
dependent issues.

---

## 8.7 Common Porting Challenges

Typical implementation issues include:

- incorrect stack initialization;
- incomplete register preservation;
- interrupt priority configuration;
- incorrect critical section implementation;
- Kernel Tick inaccuracies;
- startup sequence errors.

These problems are generally processor-dependent rather than kernel-dependent.

The Kernel Core should not be modified to compensate for CPU Port
implementation errors.

---

## 8.8 Architectural Independence

The CPU Port shall adapt the processor architecture to the Kernel Core.

The Kernel Core shall never be adapted to accommodate a processor.

This principle preserves portability and ensures that every supported
architecture implements the same execution model.

Whenever processor limitations require architectural compromises, those
compromises shall remain entirely within the CPU Port.

---

## 8.9 Design Notes

The KatuOS CPU Port interface intentionally remains small.

Only a limited number of processor-dependent mechanisms are required to support
the entire Kernel Core.

This organization provides several advantages:

- reduced implementation effort;
- straightforward verification;
- simplified maintenance;
- maximum source-code reuse;
- consistent kernel behavior across architectures.

Supporting additional processor families therefore requires relatively little
processor-specific code.

---

## 8.10 Best Practices

When developing a new CPU Port:

- preserve the architectural interface;
- avoid modifying the Kernel Core;
- isolate assembly code;
- document processor assumptions;
- validate incrementally;
- maintain deterministic execution.

CPU Ports should be viewed as implementations of a common architectural
contract rather than independent kernel variants.

Following these principles allows new processor architectures to be supported
without affecting the portability, consistency and long-term maintainability of
the KatuOS Kernel Core.

---
