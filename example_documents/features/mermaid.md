---
title: Mermaid Diagram Samples
description: Comprehensive examples of Mermaid diagrams and visualizations
category: Example
tags:
  - mermaid
  - diagrams
  - flowchart
  - visualization
feature: mermaid
---

This document demonstrates various types of diagrams that can be created using Mermaid syntax within Markdown.

## 1. Flowchart

```mermaid
graph TD
    A[Start] --> B{Is it hot?}
    B -- Yes --> C[Drink water]
    B -- No --> D[Go outside]
    C --> E[End]
    D --> E
```

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Alice->>Bob: Long time no see, next week?
    Bob->>Alice: Sure!
```

## 3. Class Diagram

```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
```

## 4. State Diagram

```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> Moving: EvMove
    Moving --> Still: EvStop
    Moving --> Crash: EvCrash
    Crash --> [*]
```

## 5. Gantt Chart

```mermaid
gantt
    dateFormat  YYYY-MM-DD
    title Adding GANTT diagram to mermaid
    section A section
    Task A           :a1, 2014-01-01, 30d
    Task B           :after a1  , 20d
    section Another
    Task C           :2014-01-12  , 12d
    Task D           :after a1  , 12d
```

## 6. Pie Chart

```mermaid
pie title Key Lime Pie
    "Slice A" : 42
    "Slice B" : 28
    "Slice C" : 15
    "Slice D" : 15
```

## 7. Git Graph

```mermaid
gitGraph
    commit
    commit
    branch develop
    commit
    commit
    commit
    checkout main
    commit
    commit
    merge develop
```

## 8. User Journey

```mermaid
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me
```
