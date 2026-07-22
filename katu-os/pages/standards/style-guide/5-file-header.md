---
title: "5. File Header"
permalink: /katu-os/standards/style-guide/5-file-header/
---

# 5. File Header

Every public source file shall begin with a descriptive module header.

The file header establishes the architectural context of the module before the
reader encounters its implementation.

Rather than serving as a simple file description, the header should explain the
purpose of the module and its role within the overall kernel architecture.

A well-designed header allows readers to understand why the module exists
without first studying its implementation.

Every module header should answer the following questions:

- What is this module?
- Why does it exist?
- What architectural responsibility does it fulfill?
- How does it interact with the remainder of the kernel?
- What are its principal design goals?

Implementation details should be omitted whenever they do not contribute to the
architectural understanding of the module.

Historical information, processor-specific implementation details and temporary
development notes should not appear in module headers unless they are essential
to understanding the current implementation.

Module headers should remain concise while providing sufficient architectural
context for future maintenance.

The recommended structure is:

```c
/*==================================================================================================
*
*  KatuOS
*  Module Name
*
*--------------------------------------------------------------------------------------------------
*
*  Short module description.
*
*  Architectural overview describing the purpose of the module and its role
*  within the Kernel Core.
*
*  Design goals:
*
*      • Goal 1
*      • Goal 2
*      • Goal 3
*
*=================================================================================================*/
```

The architectural overview should emphasize responsibilities rather than
implementation.

For example:

**Preferred**

> Implements the architecture-independent task scheduler responsible for
> selecting the next runnable task according to the KatuOS scheduling model.

**Avoid**

> Implements the scheduler using arrays, linked lists and priority scanning.

The first description communicates the architectural purpose of the module.

The second merely describes implementation details that are already evident
from the source code.

---
