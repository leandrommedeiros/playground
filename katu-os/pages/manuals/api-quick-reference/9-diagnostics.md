---
title: "9. Diagnostics"
permalink: /katu-os/manuals/api-quick-reference/9-diagnostics/
---

# 9. Diagnostics

The Diagnostics API provides runtime information about the operating system.

These services are intended for monitoring, debugging and system analysis
without modifying kernel behavior.

## Summary

| Function | Description |
|----------|-------------|
| `OS_GetCpuLoad()` | Returns the latest CPU load measurement. |

<div style="page-break-after: always;"></div>

# OS_GetCpuLoad(void)

> Returns the most recent CPU load measurement.

**Context**

Task

**Prototype**

```c
uint8_t OS_GetCpuLoad(void);
```

**Parameters**

None.

**Returns**

Current CPU load expressed as a percentage (0–100).

**Remarks**

- Available only when CPU Load Monitoring is enabled.
- Returns the latest completed measurement window.
- Does not initiate a new measurement.
- Intended for diagnostics and performance monitoring.
- A value of `0` indicates an idle processor.
- A value of `100` indicates a fully utilized processor.

**Example**

```c
uint8_t cpuLoad;

cpuLoad = OS_GetCpuLoad();

printf("CPU Load: %u%%\n", cpuLoad);
```

**See Also**

- `OS_GetTickCount()`

<div style="page-break-after: always;"></div>
