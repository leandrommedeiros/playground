---
title: "19. Keep Examples Platform Independent"
permalink: /katu-os/standards/style-guide/19-keep-examples-platform-independent/
---

# 19. Keep Examples Platform Independent

Examples included in KatuOS documentation shall illustrate the architectural
concepts of the kernel rather than the characteristics of a particular hardware
platform.

The primary purpose of an example is to demonstrate how a kernel service is
intended to be used.

Examples should therefore remain valid regardless of the selected CPU Port,
processor family or development environment.

Whenever practical, examples should use only:

- public KatuOS APIs;
- generic application code;
- architecture-independent concepts.

Examples should avoid dependencies on:

- hardware abstraction layers (HALs);
- vendor SDKs;
- evaluation boards;
- processor registers;
- peripheral drivers;
- compiler-specific extensions.

For example:

**Preferred**

```c
OS_CreateTask(TaskA, stackA, sizeof(stackA), PRIORITY_NORMAL);

OS_Start();
```

**Avoid**

```c
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);

OS_CreateTask(TaskA, stackA, sizeof(stackA), PRIORITY_NORMAL);
```

The first example focuses exclusively on the kernel service being presented.

The second introduces an unrelated hardware dependency that distracts from the
architectural concept.

Likewise, examples should avoid naming specific processors unless the document
explicitly describes a CPU Port.

**Preferred**

```text
The application creates two tasks that communicate through a queue.
```

**Avoid**

```text
The STM32G0 creates two tasks that communicate through a queue.
```

The processor architecture is irrelevant to the communication model and should
therefore not appear in the example.

Whenever interaction with external hardware is required, examples should employ
generic application functions.

For example:

```c
ReadSensor();

ProcessData();

SendResults();
```

instead of platform-specific functions such as:

```c
HAL_ADC_Start();

DL_GPIO_togglePins();

LL_USART_TransmitData8();
```

Examples should illustrate architectural concepts rather than implementation
environments.

Their purpose is to teach the programming model of KatuOS, not the APIs of a
particular hardware platform.

By remaining platform independent, examples become reusable across every CPU
Port supported by the kernel while reinforcing the portability that defines the
architecture of KatuOS.

---
