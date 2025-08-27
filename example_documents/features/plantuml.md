# PlantUML Diagrams

PlantUML is a component that allows you to quickly write various UML diagrams using simple textual descriptions.

## Sequence Diagram

```plantuml
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml
```

## Class Diagram

```puml
@startuml
class Car {
  +String brand
  +String model
  +int year
  +start()
  +stop()
}

class Engine {
  +int horsepower
  +String type
  +start()
  +stop()
}

Car *-- Engine : has
@enduml
```

## Activity Diagram

```plantuml
@startuml
start
:Read configuration;
if (Configuration valid?) then (yes)
  :Process data;
  :Generate output;
else (no)
  :Show error message;
endif
stop
@enduml
```

## State Diagram

```plantuml
@startuml
[*] --> Idle
Idle --> Running : start
Running --> Idle : stop
Running --> Error : failure
Error --> Idle : reset
Error --> [*] : shutdown
@enduml
```

## Use Case Diagram

```plantuml
@startuml
left to right direction
actor User
actor Admin

rectangle System {
  User --> (Login)
  User --> (View Dashboard)
  User --> (Edit Profile)
  Admin --> (Manage Users)
  Admin --> (System Configuration)
}
@enduml
```

## Component Diagram

```plantuml
@startuml
package "Web Application" {
  [Frontend] - HTTP
  [Backend API]
  [Database]
}

package "External Services" {
  [Authentication Service]
  [File Storage]
}

[Frontend] ..> [Backend API] : REST API
[Backend API] ..> [Database] : SQL
[Backend API] ..> [Authentication Service] : OAuth
[Backend API] ..> [File Storage] : Upload/Download
@enduml
```

## Deployment Diagram

```plantuml
@startuml
node "Web Server" {
  artifact "Application.war" as app
}

node "Database Server" {
  database "PostgreSQL" as db
}

node "Load Balancer" {
  component "Nginx" as lb
}

lb --> app : HTTP
app --> db : JDBC
@enduml
```
