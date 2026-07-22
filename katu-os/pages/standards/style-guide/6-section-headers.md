---
title: "6. Section Headers"
permalink: /katu-os/standards/style-guide/6-section-headers/
---

# 6. Section Headers

Large source files should be organized into clearly identified sections.

Section headers improve readability, simplify navigation and reinforce the
architectural organization of the module.

Rather than grouping code arbitrarily, each section should represent a distinct
architectural responsibility.

Typical examples include:

- Configuration
- Public Types
- Internal Types
- Public Constants
- Private Constants
- Global Variables
- Private Variables
- Public API
- Internal Functions
- Helper Functions
- CPU Port Interface
- Debug Support

The recommended section header format is:

```c
/*==================================================================================================
* Public API
*=================================================================================================*/
```

This format provides a clear visual separation while maintaining a consistent
appearance throughout the source tree.

Section names should remain concise and descriptive.

Whenever practical, the same section names should be used across all kernel
modules performing similar architectural roles.

For example, modules exposing public services should consistently organize
their implementation using sections such as:

```text
Configuration
      ↓
Public Types
      ↓
Internal Types
      ↓
Global Variables
      ↓
Public API
      ↓
Internal Functions
```

This organization allows developers to locate information quickly, regardless
of the module being examined.

Sections should reflect logical responsibilities rather than the chronological
history of implementation.

Avoid creating sections for isolated functions or temporary implementation
details.

Likewise, avoid unnecessary fragmentation.

A module should contain only the sections required by its architectural
responsibilities.

Consistency across the source tree is more valuable than rigid adherence to a
fixed section layout.

The objective is to make every KatuOS source file immediately familiar to the
reader, reducing the effort required to understand and maintain the code.

---
