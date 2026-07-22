---
title: "3. Writing Style"
permalink: /katu-os/standards/style-guide/3-writing-style/
---

# 3. Writing Style

KatuOS documentation shall be written in a professional technical style
appropriate for an embedded real-time operating system.

The objective is to communicate technical information with maximum clarity and
minimum ambiguity.

Documentation should resemble the style commonly found in mature embedded
software projects such as:

- CMSIS
- FreeRTOS
- ThreadX
- Zephyr

The preferred writing style is:

- concise;
- technically accurate;
- objective;
- consistent;
- architecture-oriented.

Documentation shall avoid unnecessary complexity.

Whenever a simpler sentence conveys the same technical meaning, the simpler
form should be preferred.

The writing style should emphasize engineering precision rather than literary
expression.

Authors should prefer active voice whenever practical.

For example:

**Preferred**

> The scheduler selects the highest-priority ready task.

**Less Preferred**

> The highest-priority ready task is selected by the scheduler.

Similarly, documentation should avoid conversational language.

For example:

**Preferred**

> The CPU Port provides the processor-dependent implementation.

**Avoid**

> Basically, the CPU Port takes care of everything related to the processor.

Technical documentation should avoid unnecessary adjectives and subjective
language.

For example:

**Preferred**

> The scheduler executes in deterministic time.

**Avoid**

> The scheduler is extremely efficient and remarkably fast.

Consistency of terminology is equally important.

The same architectural concept shall always be described using the same term
throughout the documentation.

Documentation should explain engineering concepts rather than attempt to
promote or market the project.

The objective is to inform the reader, allowing the architecture to
demonstrate its own quality through clarity and technical consistency.

---
