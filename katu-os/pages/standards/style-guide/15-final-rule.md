---
title: "15. Final Rule"
permalink: /katu-os/standards/style-guide/15-final-rule/
---

# 15. Final Rule

Whenever documentation must choose between:

- describing the implementation;

or

- explaining the architecture;

**always prefer explaining the architecture.**

The source code already documents **how** a subsystem is implemented.

Good documentation explains **why** that implementation exists.

Whenever practical, documentation should answer questions such as:

- Why was this design selected?
- Which architectural principle does it preserve?
- Which responsibility does this subsystem fulfill?
- How does it interact with the remainder of the kernel?
- Which engineering constraints influenced its design?

Answers to these questions remain valuable even when the implementation
changes.

Conversely, documentation that merely describes algorithms, data structures or
individual statements often becomes obsolete as the implementation evolves.

Documentation should therefore prioritize information that remains stable over
the lifetime of the project.

As a general guideline:

```text
Architecture
     ↓
Responsibilities
     ↓
Interactions
     ↓
Constraints
     ↓
Implementation
```

This progression reflects the preferred way of presenting technical
information throughout the KatuOS documentation.

The implementation may evolve.

The architecture should remain recognizable.

For this reason, documentation should be written with the expectation that
future developers will consult it not only to understand how the kernel works,
but also to understand the engineering decisions that shaped its design.

Whenever uncertainty exists regarding what should be documented, the following
question should guide the decision:

> **Will this information remain useful if the implementation changes?**

If the answer is **yes**, it most likely belongs in the documentation.

If the answer is **no**, it probably belongs in the source code instead.

This principle summarizes the editorial philosophy of KatuOS.

The documentation exists to preserve architectural knowledge.

The source code exists to implement that architecture.

Both evolve together, but each serves a different purpose.

---

# Part IV — Editorial Conventions

The conventions presented in this part complement the general principles
defined throughout this guide.

Whereas the previous chapters establish how KatuOS documentation should be
written and how the kernel architecture should be communicated, the following
conventions define editorial practices that ensure long-term consistency across
the entire documentation set.

These conventions were derived from the complete editorial review of the KatuOS
source code and technical manuals.

They have since become permanent documentation standards and shall be applied
uniformly to future source code, manuals and technical references.

Although each convention addresses a specific aspect of documentation, together
they reinforce a common objective:

to preserve a documentation style that reflects the architecture of the kernel
rather than the history of its implementation.

---
