---
title: "Revision History"
permalink: /katu-os/manuals/api-quick-reference/
---

<p align="center">
  <img src="{{ '/assets/images/katuos/brand/exports/KatuOS_512_clean.png' | relative_url }}" alt="KatuOS Logo" width="280">
</p>

<h1 align="center">
KatuOS API Quick Reference
<div style="height:10px;"></div>
</h1>

<p align="center">
<i>Revision A — July 2026</i>
</p>

<div style="page-break-after: always;"></div>

---

# Revision History

| Revision | Description |
|----------|-------------|
| RevA | Initial release |

---

<div style="page-break-after: always;"></div>

# Table of Contents

## 1. Introduction

## 2. Kernel Lifecycle

- OS_Init()
- OS_Start()

## 3. Task Management

- OS_CreateTask()
- OS_DeleteTask()
- OS_TaskSuspend()
- OS_TaskResume()

## 4. Kernel Time

- OS_Delay()
- OS_DelayUntil()
- OS_GetTickCount()
- OS_GetCpuLoad()

## 5. Task Notifications

- OS_Notify()
- OS_NotifyFromISR()
- OS_WaitNotify()
- OS_NotifyEx()
- OS_NotifyExFromISR()
- OS_WaitNotifyEx()

## 6. Semaphores

- OS_SemaphoreInit()
- OS_SemaphoreReset()
- OS_SemaphoreWait()
- OS_SemaphoreSignal()
- OS_SemaphoreSignalFromISR()

## 7. Queues

- OS_QueueCreate()
- OS_QueueDelete()
- OS_QueueReset()
- OS_QueueSend()
- OS_QueueSendFromISR()
- OS_QueueReceive()
- OS_QueueCount()
- OS_QueueIsFull()
- OS_QueueIsEmpty()
- OS_QueueOverwrites()

## 8. Software Timers

- OS_TimerCreate()
- OS_TimerStart()
- OS_TimerStop()
- OS_TimerChangePeriod()
- OS_TimerIsActive()

## 9. Diagnostics

- OS_GetCpuLoad()

## 10. Application Hooks

- CreateTaskErrorHook()
- AppStackOverflowHook()
- SanityCheckErrorHook()

## Appendix A — Configuration Macros

## Appendix B — Common Constants

## Appendix C — Alphabetical API Index

<div style="page-break-after: always;"></div>
