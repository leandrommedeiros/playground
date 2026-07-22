---
title: "4. English Standard"
permalink: /katu-os/standards/style-guide/4-english-standard/
---

# 4. English Standard

All official KatuOS documentation shall be written in **American English**.

A single language shall be used consistently throughout each document.

Mixing English with another language, whether in descriptive text, comments,
examples or diagrams, should be avoided.

Technical terminology shall remain consistent across all documentation.

Whenever a standard engineering term exists, it should be preferred over local
translations or alternative expressions.

For example:

**Preferred**

```text
Task
Scheduler
Stack
Context Switch
Kernel Tick
Ready State
Blocked State
CPU Load
Software Timer
Critical Section
```

**Avoid**

```text
Task
Escalonador
Pilha
Troca de Contexto
Tick do Kernel
Estado Pronto
Estado Bloqueado
Uso da CPU
Timer de Software
Seção Crítica
```

Likewise, different English terms shall not be used interchangeably to describe
the same architectural concept.

For example:

**Preferred**

```text
CPU Load
```

**Avoid**

```text
CPU Usage
Processor Usage
Processor Load
CPU Utilization
```

unless a distinction between those terms is technically required.

The terminology adopted throughout the documentation shall remain stable over
time.

Consistency improves readability, simplifies maintenance and reinforces the
architectural identity of the project.

---
# Part II — Source Code Documentation

The chapters in this part define the standards governing the documentation of
KatuOS source code.

They establish how modules, functions, data structures, variables and comments
shall be documented in order to communicate both implementation intent and
architectural responsibilities.

The objective is to ensure that the source code itself remains an effective
technical reference, preserving the engineering knowledge required for future
maintenance, verification and architectural evolution.

Source code documentation should therefore complement the implementation by
explaining the reasoning behind the design rather than repeating what the code
already expresses.

---
